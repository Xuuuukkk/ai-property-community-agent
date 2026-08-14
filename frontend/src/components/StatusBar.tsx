export default function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="status-icons">
        <span className="signal" />
        <span className="wifi">◔</span>
        <span className="battery" />
      </span>
    </div>
  )
}
