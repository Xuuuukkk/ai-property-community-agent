-- 2. Building data (building table) - 8 high-rise towers
-- Generated: 2026-08-12 | Database: PostgreSQL | Encoding: UTF-8
-- Community: Yunxi Garden Community (Yunxi Hua Yuan Xiao Qu)
-- Import order: 1.community -> 2.buildings -> 3.houses -> 4.users -> 5.workers -> 6.repair_orders -> 7.fee_bills -> 8.notices

-- ============================================================
-- 2. Buildings (building table)
-- 8 high-rise residential towers, each with 26 floors and 2 units
-- ============================================================

INSERT INTO building (id, community_id, building_no, floors, unit_count, elevator_config)
VALUES
(1, 1, 'B1', 26, 2, '2 elevators per unit'),
(2, 1, 'B2', 26, 2, '2 elevators per unit'),
(3, 1, 'B3', 26, 2, '2 elevators per unit'),
(4, 1, 'B4', 26, 2, '2 elevators per unit'),
(5, 1, 'B5', 26, 2, '2 elevators per unit'),
(6, 1, 'B6', 26, 2, '2 elevators per unit'),
(7, 1, 'B7', 26, 2, '2 elevators per unit'),
(8, 1, 'B8', 26, 2, '2 elevators per unit');

