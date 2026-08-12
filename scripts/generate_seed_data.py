#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Yunxi Garden Community - PostgreSQL Seed Data Generator
Generates 8 independent SQL files to data/seed/ directory

Schema strictly aligned with docs/02-architecture/database-design.md
Database: PostgreSQL (uses standard SQL identifiers, TRUE/FALSE booleans)
"""

import random
import os

random.seed(42)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "data", "seed")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# Helper Functions
# ============================================================

def sql_str(s):
    """Escape string for PostgreSQL SQL"""
    if s is None:
        return "NULL"
    s = str(s)
    return "'" + s.replace("'", "''") + "'"

def sql_bool(b):
    """Boolean to PostgreSQL literal"""
    return "TRUE" if b else "FALSE"

def write_sql_file(filename, comment, sql_body):
    """Write a SQL file with standard header"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"-- {comment}\n")
        f.write(f"-- Generated: 2026-08-12 | Database: PostgreSQL | Encoding: UTF-8\n")
        f.write(f"-- Community: Yunxi Garden Community (Yunxi Hua Yuan Xiao Qu)\n")
        f.write(f"-- Import order: 1.community -> 2.buildings -> 3.houses -> 4.users -> 5.workers -> 6.repair_orders -> 7.fee_bills -> 8.notices\n")
        f.write("\n")
        f.write(sql_body)
        f.write("\n")
    print(f"  [OK] {filename}")

# ============================================================
# Data Pool
# ============================================================

SURNAMES = [
    "Wang", "Zhang", "Li", "Liu", "Chen", "Yang", "Zhao", "Huang", "Zhou", "Wu",
    "Xu", "Sun", "Hu", "Zhu", "Gao", "Lin", "He", "Guo", "Ma", "Luo",
    "Liang", "Song", "Zheng", "Xie", "Han", "Tang", "Feng", "Yu", "Dong", "Xiao",
    "Cheng", "Cao", "Yuan", "Deng", "Xu", "Fu", "Shen", "Zeng", "Peng", "Lv",
    "Jiang", "Cai", "Ding", "Wei", "Xue", "Ye", "Yan", "Yu", "Pan", "Du",
]

GIVEN_NAMES_M = [
    "Wei", "Qiang", "Lei", "Jun", "Yong", "Tao", "Ming", "Chao", "Peng", "Jie",
    "Hui", "Bin", "Bo", "Liang", "Fei", "Hai", "Gang", "Ping", "Xin", "Chen",
    "Yu", "Hao", "Kai", "Cheng", "Xiang", "Yi", "Bo", "Jun", "Zhe", "Yuan",
]

GIVEN_NAMES_F = [
    "Fang", "Na", "Min", "Jing", "Li", "Yan", "Juan", "Xia", "Yan", "Ling",
    "Ping", "Jie", "Hong", "Mei", "Lin", "Ting", "Wen", "Qian", "Xue", "Ying",
]

# Chinese real names for real_name field
CN_SURNAMES = [
    "Wang", "Zhang", "Li", "Liu", "Chen", "Yang", "Zhao", "Huang", "Zhou", "Wu",
    "Xu", "Sun", "Hu", "Zhu", "Gao", "Lin", "He", "Guo", "Ma", "Luo",
    "Liang", "Song", "Zheng", "Xie", "Han", "Tang", "Feng", "Yu", "Dong", "Xiao",
    "Cheng", "Cao", "Yuan", "Deng", "Xu", "Fu", "Shen", "Zeng", "Peng", "Lv",
    "Jiang", "Cai", "Ding", "Wei", "Xue", "Ye", "Yan", "Yu", "Pan", "Du",
]

CN_GIVEN_M = [
    "Wei", "Qiang", "Lei", "Jun", "Yong", "Tao", "Ming", "Chao", "Peng", "Jie",
    "Hui", "Bin", "Bo", "Liang", "Fei", "Hai", "Gang", "Xin", "Chen", "Hao",
    "Kai", "Cheng", "Yi", "Bo", "Jun", "Zhe", "Yuan", "Wen", "Wu", "Guo",
]

CN_GIVEN_F = [
    "Fang", "Na", "Min", "Jing", "Li", "Yan", "Juan", "Xia", "Yan", "Ling",
    "Ping", "Jie", "Hong", "Mei", "Lin", "Ting", "Wen", "Qian", "Xue", "Ying",
    "Lan", "Yun", "Dan", "Rong", "Shan", "Qing", "Bei", "Yan", "Jin", "Yao",
]

PHONE_PREFIXES = [
    "138", "139", "137", "136", "135", "158", "159", "150", "151", "152",
    "188", "187", "186", "185", "180", "181", "182", "183", "189", "178",
]

used_names_cn = set()

def gen_cn_name():
    """Generate a unique Chinese-style name (Pinyin)"""
    for _ in range(100):
        surname = random.choice(CN_SURNAMES)
        if random.random() > 0.5:
            given = random.choice(CN_GIVEN_M)
        else:
            given = random.choice(CN_GIVEN_F)
        name = surname + given
        if name not in used_names_cn:
            used_names_cn.add(name)
            return name
    return surname + given + str(random.randint(1, 999))

def gen_username(name):
    """Generate a login username from name"""
    return name.lower() + str(random.randint(100, 999))

def gen_phone():
    """Generate a masked phone number"""
    prefix = random.choice(PHONE_PREFIXES)
    suffix = random.randint(1000, 9999)
    return f"{prefix}****{suffix}"

def gen_datetime(year_start, year_end):
    """Generate random datetime string"""
    year = random.randint(year_start, year_end)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    hour = random.randint(8, 20)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"

def gen_date(year_start, year_end):
    """Generate random date string"""
    year = random.randint(year_start, year_end)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year}-{month:02d}-{day:02d}"

# ============================================================
# 1. Community
# ============================================================
print("Generating seed data...")

community_id = 1
community_name = "Yunxi Hua Yuan Xiao Qu"
community_name_en = "Yunxi Garden Community"
community_address = "No.1268 Zhangjiang Road, Pudong New Area, Shanghai"
community_built_year = 2018
community_building_count = 8
community_total_households = 1200
community_parking_spaces = 800
community_property_company = "Yunxi Property Service Co., Ltd."
community_description = "Yunxi Garden Community is a high-rise residential community completed in 2018, comprising 8 towers with 1200 households and 800 underground parking spaces."
community_created_at = "2026-08-12 11:42:13"

community_sql = f"""-- ============================================================
-- 1. Community (community table)
-- Yunxi Garden Community - single record
-- ============================================================

INSERT INTO community (id, name, name_en, address, built_year, building_count, total_households, parking_spaces, property_company, description, created_at)
VALUES ({community_id}, {sql_str(community_name)}, {sql_str(community_name_en)}, {sql_str(community_address)}, {community_built_year}, {community_building_count}, {community_total_households}, {community_parking_spaces}, {sql_str(community_property_company)}, {sql_str(community_description)}, {sql_str(community_created_at)});
"""

write_sql_file("community.sql", "1. Community base data (community table) - Yunxi Garden Community single record", community_sql)

# ============================================================
# 2. Buildings
# ============================================================

buildings = []
for i in range(1, 9):
    buildings.append({
        "id": i,
        "community_id": community_id,
        "building_no": f"B{i}",
        "floors": 26,
        "unit_count": 2,
        "elevator_config": "2 elevators per unit",
    })

building_values = []
for b in buildings:
    building_values.append(
        f"({b['id']}, {b['community_id']}, {sql_str(b['building_no'])}, {b['floors']}, {b['unit_count']}, {sql_str(b['elevator_config'])})"
    )

building_sql = f"""-- ============================================================
-- 2. Buildings (building table)
-- 8 high-rise residential towers, each with 26 floors and 2 units
-- ============================================================

INSERT INTO building (id, community_id, building_no, floors, unit_count, elevator_config)
VALUES
{',\n'.join(building_values)};
"""

write_sql_file("buildings.sql", "2. Building data (building table) - 8 high-rise towers", building_sql)

# ============================================================
# 3. Houses
# ============================================================

houses = []
house_id = 1
AREA_TYPE_MAP = [
    (89, "2B1B1W"),   # 2 bed, 1 bath, 1 washroom
    (92, "2B1B1W"),
    (95, "2B1B1W"),
    (98, "2B1B1W"),
    (102, "3B2B1W"),  # 3 bed, 2 bath, 1 washroom
    (105, "3B2B1W"),
    (108, "3B2B1W"),
    (112, "3B2B1W"),
    (115, "3B2B1W"),
    (118, "3B2B1W"),
    (122, "3B2B1W"),
    (125, "3B2B2W"),  # 3 bed, 2 bath, 2 washroom
    (128, "3B2B2W"),
    (132, "4B2B2W"),  # 4 bed, 2 bath, 2 washroom
    (138, "4B2B2W"),
    (143, "4B2B2W"),
]

for b in buildings:
    for unit in range(1, 3):  # 2 units
        for floor in range(1, 27):  # 26 floors
            for house_num in range(1, 5):  # 4 per floor
                room_no = f"{b['building_no']}-{unit}U-{floor}F-{house_num:02d}"
                area, house_type = random.choice(AREA_TYPE_MAP)
                houses.append({
                    "id": house_id,
                    "building_id": b["id"],
                    "room_no": room_no,
                    "unit_no": unit,
                    "floor_no": floor,
                    "area": area,
                    "house_type": house_type,
                    "status": "VACANT"
                })
                house_id += 1

print(f"  Total houses: {len(houses)}")

# Batch INSERT (200 per batch)
house_chunks = []
for i in range(0, len(houses), 200):
    chunk = houses[i:i+200]
    values = []
    for h in chunk:
        values.append(
            f"({h['id']}, {h['building_id']}, {sql_str(h['room_no'])}, {h['unit_no']}, {h['floor_no']}, {h['area']}, {sql_str(h['house_type'])}, {sql_str(h['status'])})"
        )
    house_chunks.append(
        f"INSERT INTO house (id, building_id, room_no, unit_no, floor_no, area, house_type, status) VALUES\n"
        + ",\n".join(values) + ";"
    )

house_sql = f"""-- ============================================================
-- 3. Houses (house table)
-- {len(houses)} units: 8 buildings x 2 units x 26 floors x 4 per floor
-- Area: 89-143 sqm | Types: 2B/3B/4B
-- ============================================================

""" + "\n\n".join(house_chunks)

write_sql_file("houses.sql", f"3. House data (house table) - {len(houses)} units", house_sql)

# ============================================================
# 4. Users (owners) + House Bindings
# ============================================================

NUM_OWNERS = 200
sampled_houses = random.sample(houses, NUM_OWNERS)

users = []
house_bindings = []
owner_house_map = {}

user_id = 1
for h in sampled_houses:
    real_name = gen_cn_name()
    username = gen_username(real_name)
    phone = gen_phone()
    created_at = gen_datetime(2018, 2020)

    users.append({
        "id": user_id,
        "username": username,
        "real_name": real_name,
        "phone": phone,
        "password_hash": "",
        "role": "OWNER",
        "created_at": created_at
    })

    house_bindings.append({
        "id": user_id,
        "user_id": user_id,
        "house_id": h["id"],
        "relation": "owner"
    })

    owner_house_map[user_id] = h["id"]
    h["status"] = "OCCUPIED"
    user_id += 1

print(f"  Owner users: {len(users)}")

# Generate user INSERT
user_values = []
for u in users:
    user_values.append(
        f"({u['id']}, {sql_str(u['username'])}, {sql_str(u['real_name'])}, {sql_str(u['phone'])}, {sql_str(u['password_hash'])}, {sql_str(u['role'])}, {sql_str(u['created_at'])})"
    )

# Generate house_binding INSERT
binding_values = []
for hb in house_bindings:
    binding_values.append(
        f"({hb['id']}, {hb['user_id']}, {hb['house_id']}, {sql_str(hb['relation'])})"
    )

# UPDATE occupied houses
occupied_house_ids = [h["id"] for h in sampled_houses]
update_chunks = []
for i in range(0, len(occupied_house_ids), 50):
    chunk_ids = occupied_house_ids[i:i+50]
    id_list = ",".join(str(x) for x in chunk_ids)
    update_chunks.append(f"UPDATE house SET status = 'OCCUPIED' WHERE id IN ({id_list});")

users_sql = f"""-- ============================================================
-- 4. Owner users (user + house_binding tables)
-- {NUM_OWNERS} sampled owners with masked phones
-- Move-in date: 2018-2020
-- ============================================================

-- 4.1 Owner users (user table, id=1~{NUM_OWNERS}, role=OWNER)
INSERT INTO "user" (id, username, real_name, phone, password_hash, role, created_at)
VALUES
{',\n'.join(user_values)};

-- 4.2 House bindings (house_binding table)
INSERT INTO house_binding (id, user_id, house_id, relation)
VALUES
{',\n'.join(binding_values)};

-- 4.3 Update occupied house status
""" + "\n".join(update_chunks)

write_sql_file("users.sql", f"4. Owner data (user + house_binding tables) - {NUM_OWNERS} owners", users_sql)

# ============================================================
# 5. Workers (property staff)
# ============================================================

staff_user_start = 201
workers = []
staff_users = []

worker_id = 1
staff_uid = staff_user_start

# 5.1 Property administrators (10)
for i in range(10):
    real_name = gen_cn_name()
    username = gen_username(real_name)
    phone = gen_phone()
    hire_date = gen_date(2017, 2018)
    status = "ON_DUTY" if random.random() > 0.1 else "ON_LEAVE"

    staff_users.append({
        "id": staff_uid,
        "username": username,
        "real_name": real_name,
        "phone": phone,
        "password_hash": "",
        "role": "ADMIN",
        "created_at": hire_date + " 09:00:00"
    })
    workers.append({
        "id": worker_id,
        "user_id": staff_uid,
        "department": "management",
        "position": "Property Administrator",
        "skill_type": "Property Management",
        "status": status,
        "hire_date": hire_date
    })
    worker_id += 1
    staff_uid += 1

# 5.2 Engineering repair staff (15)
repair_skills = [
    ("Plumbing & Electrical", "plumbing_electrical"),
    ("Elevator Maintenance", "elevator_maintenance"),
    ("Pipe Clearing", "pipe_clearing"),
    ("Low-Voltage Systems", "low_voltage"),
    ("Door & Window Repair", "door_window"),
]
repair_skill_weights = [4, 3, 3, 3, 2]
repair_skill_pool = []
for (skill_label, skill_code), count in zip(repair_skills, repair_skill_weights):
    repair_skill_pool.append((skill_label, skill_code))

repair_worker_ids = []

for i in range(15):
    real_name = gen_cn_name()
    username = gen_username(real_name)
    phone = gen_phone()
    hire_date = gen_date(2017, 2019)
    skill_label, skill_code = random.choice(repair_skill_pool)
    status = "ON_DUTY" if random.random() > 0.15 else "OFF_DUTY"

    staff_users.append({
        "id": staff_uid,
        "username": username,
        "real_name": real_name,
        "phone": phone,
        "password_hash": "",
        "role": "WORKER",
        "created_at": hire_date + " 09:00:00"
    })
    workers.append({
        "id": worker_id,
        "user_id": staff_uid,
        "department": "engineering",
        "position": f"Repair Technician - {skill_label}",
        "skill_type": skill_label,
        "status": status,
        "hire_date": hire_date
    })
    repair_worker_ids.append(worker_id)
    worker_id += 1
    staff_uid += 1

# 5.3 Cleaning staff (20)
for i in range(20):
    real_name = gen_cn_name()
    username = gen_username(real_name)
    phone = gen_phone()
    hire_date = gen_date(2018, 2020)
    status = "ON_DUTY" if random.random() > 0.1 else "ON_LEAVE"

    staff_users.append({
        "id": staff_uid,
        "username": username,
        "real_name": real_name,
        "phone": phone,
        "password_hash": "",
        "role": "PROPERTY_STAFF",
        "created_at": hire_date + " 09:00:00"
    })
    workers.append({
        "id": worker_id,
        "user_id": staff_uid,
        "department": "cleaning",
        "position": "Cleaning Staff",
        "skill_type": "Cleaning Service",
        "status": status,
        "hire_date": hire_date
    })
    worker_id += 1
    staff_uid += 1

# 5.4 Security staff (30)
for i in range(30):
    real_name = gen_cn_name()
    username = gen_username(real_name)
    phone = gen_phone()
    hire_date = gen_date(2018, 2021)
    status = "ON_DUTY" if random.random() > 0.1 else "OFF_DUTY"

    staff_users.append({
        "id": staff_uid,
        "username": username,
        "real_name": real_name,
        "phone": phone,
        "password_hash": "",
        "role": "PROPERTY_STAFF",
        "created_at": hire_date + " 09:00:00"
    })
    workers.append({
        "id": worker_id,
        "user_id": staff_uid,
        "department": "security",
        "position": "Security Guard",
        "skill_type": "Security & Order",
        "status": status,
        "hire_date": hire_date
    })
    worker_id += 1
    staff_uid += 1

print(f"  Workers: {len(workers)} (admin 10 + repair 15 + cleaning 20 + security 30)")

admin_worker_ids = [w["id"] for w in workers if w["department"] == "management"]

# Generate staff user INSERT
staff_user_values = []
for u in staff_users:
    staff_user_values.append(
        f"({u['id']}, {sql_str(u['username'])}, {sql_str(u['real_name'])}, {sql_str(u['phone'])}, {sql_str(u['password_hash'])}, {sql_str(u['role'])}, {sql_str(u['created_at'])})"
    )

# Generate worker INSERT
worker_values = []
for w in workers:
    worker_values.append(
        f"({w['id']}, {w['user_id']}, {sql_str(w['department'])}, {sql_str(w['position'])}, {sql_str(w['skill_type'])}, {sql_str(w['status'])}, {sql_str(w['hire_date'])})"
    )

workers_sql = f"""-- ============================================================
-- 5. Property staff (user + worker tables)
-- 75 staff: 10 admin + 15 repair + 20 cleaning + 30 security
-- Staff user id={staff_user_start}~{staff_uid-1} (after owners id=1~200)
-- worker id=1~75, user_id links to staff users
-- ============================================================

-- 5.1 Staff users (user table, id={staff_user_start}~{staff_uid-1})
INSERT INTO "user" (id, username, real_name, phone, password_hash, role, created_at)
VALUES
{',\n'.join(staff_user_values)};

-- 5.2 Worker info (worker table, id=1~75)
-- department: management / engineering / cleaning / security
-- skill_type: Property Management / Plumbing & Electrical / Elevator Maintenance / etc.
-- status: ON_DUTY / OFF_DUTY / ON_LEAVE
INSERT INTO worker (id, user_id, department, position, skill_type, status, hire_date)
VALUES
{',\n'.join(worker_values)};
"""

write_sql_file("workers.sql", f"5. Property staff data (user + worker tables) - 75 staff", workers_sql)

# ============================================================
# 6. Repair Orders
# ============================================================

REPAIR_TYPES = {
    "water_leak": {
        "urgency": "HIGH",
        "descriptions": [
            "Kitchen pipe leaking under the sink, dripped all night, cabinet is soaked",
            "Bathroom floor drain backing up, water spread to the living room, please come quickly",
            "Kitchen water pipe connector burst, water spraying everywhere, I shut off the main valve",
            "Bathroom toilet tank keeps seeping water, floor is all wet",
            "Kitchen faucet hose under the sink is old and leaking, can you send a technician to replace it",
            "Bathroom wall seepage spreading to the adjacent room, paint is peeling off",
            "Kitchen faucet makes a banging noise when turned off, pipe might have an issue",
            "Shower floor drain is clogged and leaking, bath water won't drain",
        ]
    },
    "elevator_fault": {
        "urgency": "URGENT",
        "descriptions": [
            "Elevator stuck on 5th floor, no response when pressing buttons, several people waiting to go to work",
            "Elevator doors won't close, keeps opening and closing, afraid to ride it",
            "Elevator making strange noises during operation, creaking sound, scary",
            "Elevator arrived at 1st floor but doors won't open, two people trapped inside, please come quickly",
            "Elevator buttons not working, pressed floor but light doesn't turn on",
            "Elevator dropped two floors then stopped, terrifying, please inspect immediately",
            "Elevator lights went out, pitch black inside, elderly and children afraid to ride",
            "Elevator frequently stops mid-way for several minutes before resuming",
        ]
    },
    "access_control": {
        "urgency": "MEDIUM",
        "descriptions": [
            "Building access control broken, card swipe has no response, door stays open, not safe",
            "Access control system down, anyone can enter, please fix urgently",
            "Building door won't close, spring is loose, opens with the wind",
            "Access intercom has no sound, can't hear when visitors arrive",
            "Underground garage access card reader not working, can't get in or out",
            "Video doorbell screen is black, can't see anything",
            "Building door lock broken, can't open with key either, locked out",
            "Access control keypad has several keys not working, can't enter password",
        ]
    },
    "power_trip": {
        "urgency": "HIGH",
        "descriptions": [
            "Power suddenly went out at home, circuit breaker tripped, flips back up when I try to reset",
            "Lights trip the breaker as soon as I turn on the kitchen light, other rooms are fine",
            "Bathroom outlet has no power, might be a tripped breaker",
            "AC trips the breaker as soon as I turn it on, other appliances are normal",
            "Frequent breaker trips at home, several times a day, appliances are unusable",
            "Living room outlet trips as soon as I plug something in, is there a wiring problem",
            "Whole house lost power, can't push the breaker back up",
            "Microwave trips the breaker when heating food, didn't happen before",
        ]
    },
    "wall_seepage": {
        "urgency": "MEDIUM",
        "descriptions": [
            "Wall next to bathroom is seeping water, paint has peeled off a large area",
            "Balcony exterior wall seeping, worse when it rains, wall is moldy",
            "Water stain next to window, getting bigger, worried it will spread",
            "Ceiling is seeping, might be a waterproofing issue from upstairs",
            "Living room east wall seeping, wallpaper is bulging",
            "Bedroom exterior corner moldy and seeping, especially obvious when it rains",
            "Bathroom exterior wall seeping, putty is blistering",
            "Balcony sliding door side wall seeping, water comes in when it rains",
        ]
    },
    "public_facility": {
        "urgency": "LOW",
        "descriptions": [
            "Hallway lights broken, several floors dark, very dark coming home at night",
            "Community fitness equipment is loose, safety hazard",
            "Underground garage entrance barrier gate broken, inconvenient to enter and exit",
            "Community pavilion bench is broken, elderly can't sit",
            "Children's playground slide has cracks, worried about hurting kids",
            "Hallway fire escape door won't open, safety hazard",
            "Community street lights not working, can't see clearly when walking at night",
            "Elevator hall tiles fell off, broken tiles all over the floor",
        ]
    },
}

ORDER_STATUSES = [
    ("CREATED", 0.10),
    ("ASSIGNED", 0.05),
    ("PROCESSING", 0.15),
    ("COMPLETED", 0.60),
    ("CLOSED", 0.10),
]

SELF_PAY_RANGE = (80, 800)

repair_orders = []
order_id = 1
order_no_counter = 1

owner_ids = list(owner_house_map.keys())
random.shuffle(owner_ids)
num_orders = 50
selected_owners = owner_ids[:num_orders]

for oid in selected_owners:
    hid = owner_house_map[oid]

    fault_type = random.choice(list(REPAIR_TYPES.keys()))
    fault_info = REPAIR_TYPES[fault_type]
    description = random.choice(fault_info["descriptions"])

    status = random.choices(
        [s[0] for s in ORDER_STATUSES],
        weights=[s[1] for s in ORDER_STATUSES]
    )[0]

    if status == "CREATED":
        worker_id_val = "NULL"
    else:
        worker_id_val = str(random.choice(repair_worker_ids))

    urgency = fault_info["urgency"]
    if status in ("COMPLETED", "CLOSED"):
        urgency = random.choice(["LOW", "MEDIUM", "HIGH"])

    # Cost: public facility = 0, self-pay has cost, CREATED/ASSIGNED/PROCESSING may not have cost yet
    if fault_type == "public_facility":
        cost = 0
    elif status in ("COMPLETED", "CLOSED"):
        cost = random.randint(*SELF_PAY_RANGE)
    else:
        cost = 0  # not yet determined

    # Completed time
    if status in ("COMPLETED", "CLOSED"):
        completed_year = random.choice([2024, 2025, 2026])
        completed_month = random.randint(1, 12)
        completed_day = random.randint(1, 28)
        completed_at = f"{completed_year}-{completed_month:02d}-{completed_day:02d} {random.randint(10,18):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"
    else:
        completed_at = "NULL"

    created_year = random.choice([2024, 2025, 2026])
    created_month = random.randint(1, 12)
    created_day = random.randint(1, 28)
    order_no = f"R{created_year}{created_month:02d}{created_day:02d}{order_no_counter:03d}"
    order_no_counter += 1

    created_at = f"{created_year}-{created_month:02d}-{created_day:02d} {random.randint(8,20):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"

    repair_orders.append({
        "id": order_id,
        "order_no": order_no,
        "user_id": oid,
        "house_id": hid,
        "worker_id": worker_id_val,
        "type": fault_type,
        "description": description,
        "urgency": urgency,
        "status": status,
        "cost": cost,
        "created_at": created_at,
        "completed_at": completed_at,
    })
    order_id += 1

print(f"  Repair orders: {len(repair_orders)}")

# Generate repair_order INSERT
repair_values = []
for ro in repair_orders:
    completed_val = sql_str(ro['completed_at']) if ro['completed_at'] != "NULL" else "NULL"
    repair_values.append(
        f"({ro['id']}, {sql_str(ro['order_no'])}, {ro['user_id']}, {ro['house_id']}, {ro['worker_id']}, {sql_str(ro['type'])}, {sql_str(ro['description'])}, {sql_str(ro['urgency'])}, {sql_str(ro['status'])}, {ro['cost']}, {sql_str(ro['created_at'])}, {completed_val})"
    )

repair_sql = f"""-- ============================================================
-- 6. Repair orders (repair_order table)
-- {len(repair_orders)} historical repair tickets
-- Types: water_leak / elevator_fault / access_control / power_trip / wall_seepage / public_facility
-- Status: CREATED / ASSIGNED / PROCESSING / COMPLETED / CLOSED
-- Cost: self-pay repairs have cost; public facility repairs cost=0
-- completed_at: only for COMPLETED/CLOSED orders
-- ============================================================

INSERT INTO repair_order (id, order_no, user_id, house_id, worker_id, type, description, urgency, status, cost, created_at, completed_at)
VALUES
{',\n'.join(repair_values)};
"""

write_sql_file("repair_orders.sql", f"6. Repair order data (repair_order table) - {len(repair_orders)} tickets", repair_sql)

# ============================================================
# 7. Fee Bills
# ============================================================

PROPERTY_FEE_RATE = 2.8
PARKING_FEE = 400
UTILITY_FEE_RANGE = (50, 120)
MAINTENANCE_FEE_RANGE = (200, 500)

fee_bills = []
bill_id = 1
occupied_houses = sampled_houses

# Build a reverse map: house_id -> user_id (owner)
house_to_user = {v: k for k, v in owner_house_map.items()}

# Property fee bills (2-4 months per house)
for h in occupied_houses:
    num_months = random.randint(2, 4)
    bill_months = []
    for _ in range(num_months):
        year = random.choice([2025, 2026])
        month = random.randint(1, 12)
        bill_months.append((year, month))
    bill_months = list(set(bill_months))[:num_months]

    for (year, month) in bill_months:
        amount = round(h["area"] * PROPERTY_FEE_RATE, 2)
        period = f"{year}-{month:02d}"
        due_date = f"{year}-{month:02d}-15"
        user_id_val = house_to_user.get(h["id"], "NULL")

        if year == 2026 and month >= 6:
            status = random.choice(["PAID", "UNPAID", "UNPAID", "OVERDUE"])
        else:
            status = random.choice(["PAID", "PAID", "PAID", "UNPAID"])

        paid_at = "NULL"
        if status == "PAID":
            pay_day = random.randint(1, 28)
            paid_at = f"{year}-{month:02d}-{pay_day:02d} {random.randint(9,17):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"

        fee_bills.append({
            "id": bill_id,
            "house_id": h["id"],
            "user_id": user_id_val,
            "bill_type": "property_fee",
            "period": period,
            "amount": amount,
            "status": status,
            "due_date": due_date,
            "paid_at": paid_at
        })
        bill_id += 1

# Parking fee bills (~30% of owners)
parking_houses = random.sample(occupied_houses, min(60, len(occupied_houses)))
for h in parking_houses:
    year = random.choice([2025, 2026])
    month = random.randint(1, 12)
    period = f"{year}-{month:02d}"
    due_date = f"{year}-{month:02d}-15"
    status = random.choice(["PAID", "PAID", "UNPAID"])
    user_id_val = house_to_user.get(h["id"], "NULL")

    paid_at = "NULL"
    if status == "PAID":
        paid_at = f"{year}-{month:02d}-{random.randint(1,28):02d} {random.randint(9,17):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"

    fee_bills.append({
        "id": bill_id,
        "house_id": h["id"],
        "user_id": user_id_val,
        "bill_type": "parking_fee",
        "period": period,
        "amount": PARKING_FEE,
        "status": status,
        "due_date": due_date,
        "paid_at": paid_at
    })
    bill_id += 1

# Utility fee bills
utility_houses = random.sample(occupied_houses, min(80, len(occupied_houses)))
for h in utility_houses:
    year = random.choice([2025, 2026])
    month = random.randint(1, 12)
    period = f"{year}-{month:02d}"
    due_date = f"{year}-{month:02d}-15"
    amount = round(random.uniform(*UTILITY_FEE_RANGE), 2)
    status = random.choice(["PAID", "PAID", "UNPAID"])
    user_id_val = house_to_user.get(h["id"], "NULL")

    paid_at = "NULL"
    if status == "PAID":
        paid_at = f"{year}-{month:02d}-{random.randint(1,28):02d} {random.randint(9,17):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"

    fee_bills.append({
        "id": bill_id,
        "house_id": h["id"],
        "user_id": user_id_val,
        "bill_type": "utility_fee",
        "period": period,
        "amount": amount,
        "status": status,
        "due_date": due_date,
        "paid_at": paid_at
    })
    bill_id += 1

# Maintenance fee bills
maintenance_houses = random.sample(occupied_houses, min(20, len(occupied_houses)))
for h in maintenance_houses:
    year = random.choice([2024, 2025])
    month = random.randint(1, 12)
    period = f"{year}-{month:02d}"
    due_date = f"{year}-{month:02d}-15"
    amount = round(random.uniform(*MAINTENANCE_FEE_RANGE), 2)
    status = "PAID"
    user_id_val = house_to_user.get(h["id"], "NULL")

    paid_at = f"{year}-{month:02d}-{random.randint(1,28):02d} {random.randint(9,17):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"

    fee_bills.append({
        "id": bill_id,
        "house_id": h["id"],
        "user_id": user_id_val,
        "bill_type": "maintenance_fee",
        "period": period,
        "amount": amount,
        "status": status,
        "due_date": due_date,
        "paid_at": paid_at
    })
    bill_id += 1

print(f"  Fee bills: {len(fee_bills)}")

# Batch INSERT
fee_chunks = []
for i in range(0, len(fee_bills), 200):
    chunk = fee_bills[i:i+200]
    values = []
    for fb in chunk:
        paid_val = sql_str(fb['paid_at']) if fb['paid_at'] != "NULL" else "NULL"
        uid_val = str(fb['user_id']) if fb['user_id'] != "NULL" else "NULL"
        values.append(
            f"({fb['id']}, {fb['house_id']}, {uid_val}, {sql_str(fb['bill_type'])}, {sql_str(fb['period'])}, {fb['amount']}, {sql_str(fb['status'])}, {sql_str(fb['due_date'])}, {paid_val})"
        )
    fee_chunks.append(
        f"INSERT INTO fee_bill (id, house_id, user_id, bill_type, period, amount, status, due_date, paid_at) VALUES\n"
        + ",\n".join(values) + ";"
    )

paid_count = sum(1 for fb in fee_bills if fb["status"] == "PAID")
unpaid_count = sum(1 for fb in fee_bills if fb["status"] == "UNPAID")
overdue_count = sum(1 for fb in fee_bills if fb["status"] == "OVERDUE")

fee_sql = f"""-- ============================================================
-- 7. Fee bills (fee_bill table)
-- {len(fee_bills)} bills total
-- Types: property_fee / parking_fee / utility_fee / maintenance_fee
-- Property fee: area x 2.8 CNY/sqm/month
-- Parking: 400 CNY/month | Utility: 50-120 CNY | Maintenance: 200-500 CNY
-- Status: PAID({paid_count}) / UNPAID({unpaid_count}) / OVERDUE({overdue_count})
-- paid_at: only for PAID bills
-- ============================================================

""" + "\n\n".join(fee_chunks)

write_sql_file("fee_bills.sql", f"7. Fee bill data (fee_bill table) - {len(fee_bills)} bills", fee_sql)

# ============================================================
# 8. Notices
# ============================================================

notice_data = [
    ("Water Supply Suspension Notice - July 15",
     "Dear Residents,\n\nDue to annual inspection of the main water supply pipeline, temporary water suspension will be implemented on July 15, 2024 (Monday) from 8:00 to 17:00. Buildings B1-B8 will be affected.\n\nPlease prepare water storage in advance. For special circumstances, please contact the Property Service Center: 021-5896XXXX.\n\nWe apologize for the inconvenience!\n\nYunxi Property Service Co., Ltd.\nJuly 12, 2024",
     "water_power_outage", True, "PUBLISHED", "2024-07-12"),
    ("Temporary Power Outage Notice - July 20",
     "Dear Residents,\n\nPer notice from the power company, due to grid upgrade in the Zhangjiang Road area, temporary power outage will be implemented on July 20, 2024 (Saturday) from 9:00 to 12:00. Elevators and water pumps will be suspended during this period.\n\nPlease prepare in advance. If you have special power needs (medical equipment, etc.), please contact the property in advance.\n\nYunxi Property Service Co., Ltd.\nJuly 18, 2024",
     "water_power_outage", False, "PUBLISHED", "2024-07-18"),
    ("Q3 2024 Elevator Maintenance Notice",
     "Dear Residents,\n\nTo ensure safe elevator operation, the Property Service Center will conduct Q3 routine elevator maintenance from July 22-26, 2024. Elevators will be serviced in rotation, with each building's downtime not exceeding 4 hours.\n\nSchedule:\n  Jul 22: B1, B2\n  Jul 23: B3, B4\n  Jul 24: B5, B6\n  Jul 25: B7, B8\n  Jul 26: Inspection and wrap-up\n\nPlease plan your travel accordingly. For temporary access arrangements during maintenance, please contact the property.\n\nYunxi Property Service Center - Engineering Dept.\nJuly 19, 2024",
     "elevator_maintenance", False, "PUBLISHED", "2024-07-19"),
    ("Fire Safety Equipment Quarterly Inspection Notice",
     "Dear Residents,\n\nTo ensure community fire safety, the Property Service Center will conduct quarterly fire equipment inspection from August 5-9, 2024.\n\nInspection includes:\n  1. Fire hydrants and extinguishers on all floors\n  2. Smoke detectors and sprinkler system testing\n  3. Fire escape route clearance check\n  4. Underground garage fire equipment inspection\n\nBrief alarm test sounds may occur during inspection - please do not be alarmed. For questions, contact the Property Service Center.\n\nYunxi Property Service Center - Security Dept.\nAugust 2, 2024",
     "fire_inspection", False, "PUBLISHED", "2024-08-02"),
    ("Mid-Autumn & National Day Community Event Notice",
     "Dear Residents,\n\nTo celebrate the Mid-Autumn Festival and National Day, the Property Service Center and Homeowners' Committee invite you to a community event: 'Moon Over Yunxi - Garden of Joy'\n\nTime: September 14, 2024 (Saturday) 15:00-20:00\nLocation: Community Central Plaza\nActivities:\n  - Lantern Riddle Guessing (15:00-17:00)\n  - Children's DIY Mooncake (15:30-17:00)\n  - Community Performance (18:00-20:00)\n  - Prizes and mooncake distribution\n\nAll residents are welcome to join!\n\nYunxi Property Service Center - Community Service Dept.\nSeptember 5, 2024",
     "community_activity", False, "PUBLISHED", "2024-09-05"),
    ("2024 Community Public Revenue Disclosure",
     "Dear Residents,\n\nPer Shanghai Residential Property Management Regulations, the 2024 H1 public revenue of Yunxi Garden Community is disclosed as follows:\n\nI. Revenue (Jan-Jun 2024)\n  1. Elevator advertising: CNY 48,200.00\n  2. Locker site fee: CNY 12,000.00\n  3. Vending machine site fee: CNY 3,600.00\n  4. Temporary parking: CNY 26,800.00\n  5. Other: CNY 2,400.00\n  Total: CNY 93,000.00\n\nII. Expenditure\n  1. Elevator maintenance (shared): CNY 18,000.00\n  2. Fire equipment maintenance: CNY 8,500.00\n  3. Public lighting renovation: CNY 12,300.00\n  4. Greening supplement: CNY 6,200.00\n  Total: CNY 45,000.00\n\nIII. Balance: CNY 48,000.00 (transferred to maintenance fund)\n\nDisclosure period: July 1-15, 2024\n\nYunxi Property Service Center - Homeowners' Committee\nJuly 1, 2024",
     "public_revenue", True, "PUBLISHED", "2024-07-01"),
    ("Homeowners' Committee Election Notice",
     "Dear Residents,\n\nThe first Homeowners' Committee term is expiring. Per the Owners' Assembly Rules, we hereby launch the second committee election.\n\nI. Candidate Registration\n  Period: August 1-20, 2024\n  Location: Property Service Center front desk\n  Requirements: Property owner, enthusiastic about community, responsible\n\nII. Election Method\n  Written ballot + electronic voting\n\nIII. Voting Period\n  September 10-15, 2024\n\nAll owners are encouraged to participate. Detailed rules available at the Property Service Center.\n\nYunxi Garden Homeowners' Committee Election Working Group\nJuly 28, 2024",
     "committee_notice", False, "PUBLISHED", "2024-07-28"),
    ("High Temperature Safety Reminder",
     "Dear Residents,\n\nShanghai is experiencing sustained high temperatures with an orange alert issued. The Property Service Center reminds you:\n\n1. Avoid prolonged outdoor activities during 11:00-15:00\n2. Set AC temperature to 26C+ for energy saving and health\n3. Be careful with electricity - avoid using multiple high-power appliances simultaneously\n4. Check water/gas/electricity before leaving home\n5. Elderly and children should avoid going out; contact property if help is needed\n\nWe have equipped outdoor staff with heat protection supplies and set up a free drinking water station at the lobby.\n\nWishing you a cool and safe summer!\n\nYunxi Property Service Center\nJuly 25, 2024",
     "weather_alert", False, "PUBLISHED", "2024-07-25"),
    ("Waste Sorting Compliance Report",
     "Dear Residents,\n\nSince the implementation of waste sorting, our community has achieved good results:\n\nI. Current Status\n  - Wet waste daily: ~280kg\n  - Dry waste daily: ~520kg\n  - Recyclables daily: ~85kg\n  - Sorting accuracy: ~82%\n\nII. Issues\n  1. Some households still mix waste\n  2. Off-schedule disposal occurs\n  3. Bulky waste randomly placed\n\nIII. Measures\n  1. Add guides during peak hours\n  2. Door-to-door education for repeat offenders\n  3. Set up temporary bulky waste storage (Garage B)\n\nPlease cooperate with waste sorting. Together we build a better community.\n\nYunxi Property Service Center - Environmental Dept.\nAugust 10, 2024",
     "facility_notice", False, "PUBLISHED", "2024-08-10"),
    ("Underground Garage Fire Lane Clearance Notice",
     "Dear Residents,\n\nRecent inspections found fire lanes in the underground garage being occupied by debris, posing serious safety hazards.\n\nI. Requirements\n  1. Residents with items in fire lanes/exit areas must clear them by August 20, 2024\n  2. Items not cleared by deadline will be removed by property\n  3. No non-vehicle parking in garage lanes\n\nII. Legal Liability\n  Per the Fire Protection Law, occupying fire lanes may result in fines of CNY 5,000-50,000.\n\nSafety first - please cooperate!\n\nYunxi Property Service Center - Security Dept.\nAugust 15, 2024",
     "fire_inspection", False, "PUBLISHED", "2024-08-15"),
    ("Winter Fire Safety Notice",
     "Dear Residents,\n\nWinter is a high-risk season for fires. The Property Service Center reminds you:\n\n1. Be mindful of electrical load when using heaters/electric blankets; turn off power when leaving\n2. No flammable materials in hallways/fire lanes\n3. No e-bikes inside buildings for charging\n4. Don't leave cooking gas unattended; close valves after use\n5. Check home wiring regularly; replace aging circuits\n6. Consider having a home fire extinguisher\n\nProperty will conduct winter fire safety home inspections in December.\n\nYunxi Property Service Center - Security Dept.\nNovember 20, 2024",
     "fire_inspection", False, "PUBLISHED", "2024-11-20"),
    ("Access Control System Replacement Notice",
     "Dear Residents,\n\nThe current access control system has been in use for 6 years with aging equipment. Per Homeowners' Committee proposal and assembly vote, the system will be replaced.\n\nI. Construction: October 8-20, 2024\nII. Scope: B1-B8, garage, main entrances\nIII. New Features:\n  1. Face recognition + card dual mode\n  2. Mobile APP remote unlock\n  3. Visitor QR code access\nIV. Cost: From public revenue, no additional charge to owners\nV. Note: During transition, brief card reader downtime may occur. Register face info at the Property Center after activation.\n\nYunxi Property Service Center - Engineering Dept.\nSeptember 28, 2024",
     "facility_notice", False, "PUBLISHED", "2024-09-28"),
    ("Winter Greening Maintenance Notice",
     "Dear Residents,\n\nTo ensure community plants survive winter, the greening team will conduct winter maintenance in December 2024:\n\n1. Cold protection wrapping for sensitive species\n2. Pruning dead/diseased branches\n3. Applying winter fertilizer\n4. Clearing fallen leaves to eliminate fire hazards\n\nSome noise from pruning may occur - thank you for understanding. Greening suggestions welcome at the Property Center.\n\nYunxi Property Service Center - Greening Dept.\nDecember 1, 2024",
     "facility_notice", False, "PUBLISHED", "2024-12-01"),
    ("Spring Festival 2025 Duty Arrangement",
     "Dear Residents,\n\nSpring Festival 2025 holiday duty arrangement:\n\nI. Holiday: January 28 (New Year's Eve) to February 4, 8 days\n\nII. Duty:\n  1. Front desk: 9:00-17:00 daily\n  2. Engineering: 24h duty, emergency response within 30 min\n  3. Security: 24h normal patrol\n  4. Cleaning: basic morning service\n\nIII. Hotline: 021-5896XXXX\n   Emergency: 138-XXXX-XXXX\n\nIV. Tips:\n  1. Close windows/doors, shut off utilities when away\n  2. Be vigilant against fire and theft\n  3. Fireworks at designated area only\n\nHappy Spring Festival!\n\nYunxi Property Service Center\nJanuary 20, 2025",
     "community_activity", False, "PUBLISHED", "2025-01-20"),
    ("Q1 2025 Elevator Maintenance Notice",
     "Dear Residents,\n\nQ1 2025 elevator maintenance schedule:\n\nDates: March 10-14, 2025\n  Mar 10: B1, B2\n  Mar 11: B3, B4\n  Mar 12: B5, B6\n  Mar 13: B7, B8\n  Mar 14: Final inspection\n\nTime: Max 4h per building (9:00-13:00 or 14:00-18:00)\n\nContent: Traction machine, wire rope, safety gear, speed limiter, door system, control cabinet\n\nPlease plan travel in advance. Contact property for temporary access arrangements.\n\nYunxi Property Service Center - Engineering Dept.\nMarch 5, 2025",
     "elevator_maintenance", False, "PUBLISHED", "2025-03-05"),
    ("Exterior Wall Renovation Notice",
     "Dear Residents,\n\nInspection found exterior wall paint peeling and localized seepage in some buildings. Per Homeowners' Committee approval, renovation will proceed.\n\nI. Construction: April 15 - May 30, 2025\nII. Scope: B3, B5, B7 exterior walls + waterproofing\nIII. Contractor: Shanghai XX Construction Co., Ltd. (fully qualified)\nIV. Notes:\n  1. Noise during 8:00-17:00\n  2. Keep windows closed to prevent dust\n  3. Don't place items on windowsills\n  4. No parking in suspended platform work areas\n\nFunding: Special maintenance fund\n\nYunxi Property Service Center - Engineering Dept.\nApril 8, 2025",
     "facility_notice", False, "PUBLISHED", "2025-04-08"),
    ("Summer 2025 Typhoon & Flood Prevention Notice",
     "Dear Residents,\n\nShanghai has entered peak typhoon season. The Property Service Center has activated the flood/typhoon emergency plan:\n\nI. Property preparations:\n  1. Checked and cleared all rooftop drainage\n  2. 200 sandbags ready at entrances\n  3. Checked garage drainage pumps\n  4. Pruned dangerous branches\n\nII. Resident cooperation:\n  1. Secure balcony items (flower pots, drying racks)\n  2. Close windows during typhoon, stay away from glass\n  3. Garage owners: watch for notices, move vehicles to ground if needed\n  4. Stock essential supplies\n\nIII. Emergency contact: 021-5896XXXX\n\nYunxi Property Service Center - Flood Prevention Group\nJuly 10, 2025",
     "weather_alert", True, "PUBLISHED", "2025-07-10"),
    ("Mosquito Control Notice",
     "Dear Residents,\n\nSummer mosquito activity is high. The property will conduct mosquito control in public areas on July 25, 2025.\n\nScope: Underground garage, hallways, garbage area, green belts, drainage\nTime: July 25 (Friday) 8:00-11:00\n\nNotes:\n  1. Keep windows closed during treatment\n  2. Don't dry clothes in treatment areas\n  3. Supervise children and pets\n  4. Wait 30 min after treatment before entering\n\nAgent: Low-toxicity eco-friendly insecticide, harmless to humans\n\nYunxi Property Service Center - Environmental Dept.\nJuly 22, 2025",
     "facility_notice", False, "PUBLISHED", "2025-07-22"),
    ("E-Bike Charging Regulation Notice",
     "Dear Residents,\n\nRecent e-bike fire incidents nationwide highlight safety risks. New charging rules:\n\nI. Prohibited:\n  1. No e-bikes inside buildings\n  2. No 'flying wire' charging (from windows)\n  3. No e-bikes in hallways/fire lanes\n  4. No battery removal for indoor charging\n\nII. Charging Facilities:\n  Centralized charging area in Garage B with 20 smart stations: auto-stop, overload protection\n\nIII. Violation Handling:\n  1. First offense: warning + deadline\n  2. Repeat: reported to fire department\n\nIV. Report violations: 021-5896XXXX\n\nSafety first!\n\nYunxi Property Service Center - Security Dept.\nAugust 1, 2025",
     "fire_inspection", False, "PUBLISHED", "2025-08-01"),
    ("2025 H1 Public Revenue Disclosure",
     "Dear Residents,\n\nYunxi Garden Community 2025 H1 (Jan-Jun) public revenue disclosure:\n\nI. Revenue\n  1. Elevator advertising: CNY 52,000.00\n  2. Locker site fee: CNY 12,000.00\n  3. Vending machine: CNY 3,600.00\n  4. Temporary parking: CNY 31,200.00\n  5. Charging station share: CNY 8,400.00\n  6. Other: CNY 1,800.00\n  Total: CNY 109,000.00\n\nII. Expenditure\n  1. Elevator maintenance: CNY 18,000.00\n  2. Fire equipment: CNY 9,500.00\n  3. Access control replacement: CNY 25,000.00\n  4. Greening: CNY 4,800.00\n  5. LED lighting: CNY 15,000.00\n  Total: CNY 72,300.00\n\nIII. Balance: CNY 36,700.00\n\nDisclosure period: July 1-15, 2025\n\nYunxi Property Service Center - Homeowners' Committee\nJuly 1, 2025",
     "public_revenue", True, "PUBLISHED", "2025-07-01"),
    ("2025 Annual Fire Drill Notice",
     "Dear Residents,\n\nTo improve fire safety awareness and emergency evacuation skills, the annual fire drill will be held on November 9, 2025 (National Fire Day).\n\nI. Time: November 9 (Sunday) 14:00-16:00\nII. Location: Community Central Plaza\nIII. Content:\n  1. Fire alarm and evacuation drill\n  2. Extinguisher hands-on practice\n  3. Fire hydrant demonstration\n  4. First aid knowledge\n  5. Fire truck display\n\nIV. Participation: Voluntary, no registration needed\nV. Note: Alarm sounds during drill - do not panic\n\nYunxi Property Service Center - Security Dept.\nOctober 28, 2025",
     "fire_inspection", False, "PUBLISHED", "2025-10-28"),
    ("Roof Waterproofing Repair Notice - B2 & B6",
     "Dear Residents,\n\nInspection found aging waterproofing on B2 and B6 roofs with localized seepage. Per Homeowners' Committee approval, repair will proceed.\n\nI. Construction: September 5-25, 2025\nII. Scope: B2, B6 roofs\nIII. Content:\n  1. Remove old waterproofing layer\n  2. Re-lay SBS modified asphalt membrane\n  3. Restore insulation and protection layers\n\nIV. Notes:\n  1. Top floor may experience noise\n  2. Don't dry items on rooftop\n  3. Rain delays construction\n\nFunding: Special maintenance fund\n\nYunxi Property Service Center - Engineering Dept.\nAugust 28, 2025",
     "facility_notice", False, "PUBLISHED", "2025-08-28"),
    ("Spring Festival 2026 Duty & Safety Tips",
     "Dear Residents,\n\nSpring Festival 2026 duty arrangement:\n\nI. Holiday: February 15 (New Year's Eve) to February 22, 8 days\nII. Duty:\n  Front desk: 9:00-17:00\n  Engineering: 24h\n  Security: 24h\n  Hotline: 021-5896XXXX\n\nIII. Tips:\n  1. Close windows/doors, shut off utilities when away\n  2. No flammable items on balconies\n  3. Be vigilant against theft\n  4. Fireworks at designated area (south gate open space)\n\nHappy New Year!\n\nYunxi Property Service Center\nFebruary 5, 2026",
     "community_activity", False, "PUBLISHED", "2026-02-05"),
    ("Surveillance System Upgrade Notice",
     "Dear Residents,\n\nTo improve community safety, per Homeowners' Committee proposal and assembly vote, the surveillance system will be upgraded.\n\nI. Upgrades:\n  1. Replace all cameras with HD network cameras (96 units)\n  2. Add face recognition capture system at entrances\n  3. Upgrade monitoring center storage and displays\n  4. Add e-bike entry alarm system\n\nII. Construction: March 1-20, 2026\nIII. Cost: From public revenue\nIV. Notes:\n  1. Brief surveillance interruption may occur\n  2. Workers in public areas - please do not disturb\n  3. Face data used for security only, strictly confidential\n\nYunxi Property Service Center - Security Dept.\nFebruary 20, 2026",
     "facility_notice", False, "PUBLISHED", "2026-02-20"),
]

notices = []
notice_id = 1
for (title, content, notice_type, is_pinned, status, date_str) in notice_data:
    publisher_id = random.choice(admin_worker_ids)
    created_at = f"{date_str} {random.randint(9, 17):02d}:{random.randint(0, 59):02d}:00"

    notices.append({
        "id": notice_id,
        "title": title,
        "content": content,
        "publisher_id": publisher_id,
        "notice_type": notice_type,
        "is_pinned": is_pinned,
        "status": status,
        "created_at": created_at
    })
    notice_id += 1

print(f"  Notices: {len(notices)}")

# Generate notice INSERT
notice_values = []
for n in notices:
    notice_values.append(
        f"({n['id']}, {sql_str(n['title'])}, {sql_str(n['content'])}, {n['publisher_id']}, {sql_str(n['notice_type'])}, {sql_bool(n['is_pinned'])}, {sql_str(n['status'])}, {sql_str(n['created_at'])})"
    )

notice_sql = f"""-- ============================================================
-- 8. Notices (notice table)
-- {len(notices)} property notices
-- Types: water_power_outage / elevator_maintenance / fire_inspection / community_activity / public_revenue / committee_notice / weather_alert / facility_notice
-- is_pinned: TRUE for pinned notices
-- Publisher: links to worker table admin (id=1~10)
-- ============================================================

INSERT INTO notice (id, title, content, publisher_id, notice_type, is_pinned, status, created_at)
VALUES
{',\n'.join(notice_values)};
"""

write_sql_file("notices.sql", f"8. Notice data (notice table) - {len(notices)} notices", notice_sql)

print(f"\nAll 8 SQL files generated to: {OUTPUT_DIR}")
print("File list:")
for f in sorted(os.listdir(OUTPUT_DIR)):
    if f.endswith(".sql"):
        size = os.path.getsize(os.path.join(OUTPUT_DIR, f))
        print(f"  {f:25s}  {size:>8,} bytes")
