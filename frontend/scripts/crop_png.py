"""Crop the bottom N rows off a PNG using only the standard library.

Used to strip the WorkBuddy AI watermark from generated cover images.
Handles 8-bit RGB/RGBA non-interlaced PNGs.
"""
import struct
import sys
import zlib
from pathlib import Path


def read_png(path: Path) -> tuple[int, int, int, bytes]:
    data = path.read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    pos = 8
    width = height = bitdepth = colortype = 0
    idat = b""
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        if ctype == b"IHDR":
            width, height, bitdepth, colortype = struct.unpack(">IIBB", body[:10])
        elif ctype == b"IDAT":
            idat += body
        pos += 12 + length
    assert bitdepth == 8
    assert colortype in (2, 6)
    channels = 3 if colortype == 2 else 4
    raw = zlib.decompress(idat)
    stride = width * channels
    pixels = bytearray()
    prev = bytearray(stride)
    for y in range(height):
        f = raw[y * (stride + 1)]
        line = bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for x in range(stride):
            a = line[x - channels] if x >= channels else 0
            b = prev[x]
            c = prev[x - channels] if x >= channels else 0
            if f == 1:
                line[x] = (line[x] + a) & 0xFF
            elif f == 2:
                line[x] = (line[x] + b) & 0xFF
            elif f == 3:
                line[x] = (line[x] + (a + b) // 2) & 0xFF
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 0xFF
        pixels.extend(line)
        prev = line
    return width, height, channels, bytes(pixels)


def write_png(path: Path, width: int, height: int, channels: int, pixels: bytes) -> None:
    def chunk(ctype: bytes, body: bytes) -> bytes:
        return (struct.pack(">I", len(body)) + ctype + body
                + struct.pack(">I", zlib.crc32(ctype + body) & 0xFFFFFFFF))
    raw = bytearray()
    stride = width * channels
    for y in range(height):
        raw.append(0)
        raw.extend(pixels[y * stride:(y + 1) * stride])
    ihdr = struct.pack(">IIBBBBB", width, height, 8, channels_to_colortype(channels), 0, 0, 0)
    out = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 6)) + chunk(b"IEND", b"")
    path.write_bytes(out)


def channels_to_colortype(channels: int) -> int:
    return 2 if channels == 3 else 6


def main() -> None:
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    crop_bottom = int(sys.argv[3])  # rows to strip from the bottom
    width, height, channels, pixels = read_png(src)
    new_height = height - crop_bottom
    if new_height <= 0:
        raise SystemExit("crop_bottom too large")
    new_pixels = pixels[: new_height * width * channels]
    write_png(dst, width, new_height, channels, new_pixels)
    print(f"{src.name}  {width}x{height} -> {width}x{new_height}  ({crop_bottom} rows cropped)")


if __name__ == "__main__":
    main()
