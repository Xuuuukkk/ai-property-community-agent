-- 6. Repair order data (repair_order table) - 50 tickets
-- Generated: 2026-08-12 | Database: PostgreSQL | Encoding: UTF-8
-- Community: Yunxi Garden Community (Yunxi Hua Yuan Xiao Qu)
-- Import order: 1.community -> 2.buildings -> 3.houses -> 4.users -> 5.workers -> 6.repair_orders -> 7.fee_bills -> 8.notices

-- ============================================================
-- 6. Repair orders (repair_order table)
-- 50 historical repair tickets
-- Types: water_leak / elevator_fault / access_control / power_trip / wall_seepage / public_facility
-- Status: CREATED / ASSIGNED / PROCESSING / COMPLETED / CLOSED
-- Cost: self-pay repairs have cost; public facility repairs cost=0
-- completed_at: only for COMPLETED/CLOSED orders
-- ============================================================

INSERT INTO repair_order (id, order_no, user_id, house_id, worker_id, type, description, urgency, status, cost, created_at, completed_at)
VALUES
(1, 'R20250818001', 83, 973, 25, 'power_trip', 'Bathroom outlet has no power, might be a tripped breaker', 'HIGH', 'CLOSED', 366, '2025-08-18 08:32:22', '2025-04-25 12:03:33'),
(2, 'R20240719002', 43, 695, 12, 'power_trip', 'Bathroom outlet has no power, might be a tripped breaker', 'HIGH', 'COMPLETED', 610, '2024-07-19 09:20:23', '2025-06-23 10:00:43'),
(3, 'R20240516003', 116, 1395, 15, 'wall_seepage', 'Living room east wall seeping, wallpaper is bulging', 'MEDIUM', 'PROCESSING', 0, '2024-05-16 17:21:23', NULL),
(4, 'R20241022004', 54, 80, 17, 'elevator_fault', 'Elevator frequently stops mid-way for several minutes before resuming', 'HIGH', 'COMPLETED', 461, '2024-10-22 11:52:06', '2025-07-09 17:11:36'),
(5, 'R20240314005', 140, 1063, 19, 'public_facility', 'Children''s playground slide has cracks, worried about hurting kids', 'MEDIUM', 'COMPLETED', 0, '2024-03-14 15:08:57', '2025-04-05 12:30:51'),
(6, 'R20240107006', 108, 984, 15, 'public_facility', 'Hallway fire escape door won''t open, safety hazard', 'MEDIUM', 'COMPLETED', 0, '2024-01-07 12:30:53', '2026-10-02 16:06:44'),
(7, 'R20250601007', 73, 613, 16, 'public_facility', 'Community fitness equipment is loose, safety hazard', 'MEDIUM', 'COMPLETED', 0, '2025-06-01 14:07:22', '2025-06-18 18:59:51'),
(8, 'R20260916008', 96, 55, 21, 'public_facility', 'Community pavilion bench is broken, elderly can''t sit', 'HIGH', 'COMPLETED', 0, '2026-09-16 20:47:28', '2026-03-25 14:22:20'),
(9, 'R20261013009', 48, 408, 18, 'water_leak', 'Kitchen faucet makes a banging noise when turned off, pipe might have an issue', 'HIGH', 'COMPLETED', 228, '2026-10-13 09:05:10', '2024-11-26 15:26:40'),
(10, 'R20251219010', 118, 65, 21, 'access_control', 'Access intercom has no sound, can''t hear when visitors arrive', 'MEDIUM', 'COMPLETED', 353, '2025-12-19 16:28:26', '2026-11-13 14:56:28'),
(11, 'R20250204011', 11, 883, 13, 'elevator_fault', 'Elevator making strange noises during operation, creaking sound, scary', 'HIGH', 'COMPLETED', 320, '2025-02-04 09:59:56', '2026-05-24 11:13:10'),
(12, 'R20250925012', 163, 572, NULL, 'power_trip', 'Power suddenly went out at home, circuit breaker tripped, flips back up when I try to reset', 'HIGH', 'CREATED', 0, '2025-09-25 09:06:16', NULL),
(13, 'R20250508013', 162, 505, NULL, 'wall_seepage', 'Water stain next to window, getting bigger, worried it will spread', 'MEDIUM', 'CREATED', 0, '2025-05-08 11:47:18', NULL),
(14, 'R20240102014', 191, 162, 24, 'power_trip', 'Bathroom outlet has no power, might be a tripped breaker', 'HIGH', 'ASSIGNED', 0, '2024-01-02 18:22:55', NULL),
(15, 'R20260821015', 13, 542, 24, 'access_control', 'Access control keypad has several keys not working, can''t enter password', 'HIGH', 'COMPLETED', 358, '2026-08-21 19:40:56', '2026-08-05 18:11:37'),
(16, 'R20250512016', 198, 439, 21, 'wall_seepage', 'Bathroom exterior wall seeping, putty is blistering', 'HIGH', 'COMPLETED', 397, '2025-05-12 14:16:09', '2025-08-18 13:51:05'),
(17, 'R20240610017', 70, 805, NULL, 'access_control', 'Building access control broken, card swipe has no response, door stays open, not safe', 'MEDIUM', 'CREATED', 0, '2024-06-10 15:34:00', NULL),
(18, 'R20240912018', 20, 105, 18, 'public_facility', 'Elevator hall tiles fell off, broken tiles all over the floor', 'MEDIUM', 'CLOSED', 0, '2024-09-12 11:26:56', '2024-07-26 14:38:14'),
(19, 'R20260417019', 39, 199, 13, 'wall_seepage', 'Bathroom exterior wall seeping, putty is blistering', 'HIGH', 'COMPLETED', 741, '2026-04-17 20:51:58', '2025-07-08 14:05:27'),
(20, 'R20260514020', 123, 39, 22, 'wall_seepage', 'Living room east wall seeping, wallpaper is bulging', 'MEDIUM', 'PROCESSING', 0, '2026-05-14 11:54:04', NULL),
(21, 'R20251015021', 61, 936, 21, 'elevator_fault', 'Elevator making strange noises during operation, creaking sound, scary', 'URGENT', 'PROCESSING', 0, '2025-10-15 12:44:39', NULL),
(22, 'R20260824022', 183, 809, 13, 'power_trip', 'AC trips the breaker as soon as I turn it on, other appliances are normal', 'LOW', 'COMPLETED', 627, '2026-08-24 08:14:05', '2024-03-04 14:17:08'),
(23, 'R20240109023', 156, 1318, 16, 'elevator_fault', 'Elevator stuck on 5th floor, no response when pressing buttons, several people waiting to go to work', 'MEDIUM', 'COMPLETED', 399, '2024-01-09 20:25:04', '2025-06-15 10:21:05'),
(24, 'R20250727024', 8, 1100, 25, 'wall_seepage', 'Balcony sliding door side wall seeping, water comes in when it rains', 'MEDIUM', 'PROCESSING', 0, '2025-07-27 08:07:49', NULL),
(25, 'R20240922025', 199, 414, 18, 'public_facility', 'Community pavilion bench is broken, elderly can''t sit', 'LOW', 'COMPLETED', 0, '2024-09-22 11:30:24', '2026-01-07 17:47:49'),
(26, 'R20250821026', 30, 923, 13, 'public_facility', 'Children''s playground slide has cracks, worried about hurting kids', 'HIGH', 'CLOSED', 0, '2025-08-21 12:12:23', '2026-01-24 18:33:07'),
(27, 'R20250401027', 125, 643, 14, 'water_leak', 'Bathroom toilet tank keeps seeping water, floor is all wet', 'HIGH', 'CLOSED', 524, '2025-04-01 08:37:50', '2025-01-06 14:37:07'),
(28, 'R20260625028', 7, 586, 13, 'public_facility', 'Elevator hall tiles fell off, broken tiles all over the floor', 'MEDIUM', 'COMPLETED', 0, '2026-06-25 18:03:03', '2024-04-06 17:05:43'),
(29, 'R20250824029', 129, 1415, 23, 'access_control', 'Building door won''t close, spring is loose, opens with the wind', 'LOW', 'COMPLETED', 208, '2025-08-24 11:01:44', '2025-04-11 18:50:41'),
(30, 'R20250419030', 153, 726, 15, 'power_trip', 'Living room outlet trips as soon as I plug something in, is there a wiring problem', 'LOW', 'COMPLETED', 576, '2025-04-19 10:34:22', '2026-08-18 14:34:44'),
(31, 'R20260906031', 159, 1250, 24, 'access_control', 'Access control keypad has several keys not working, can''t enter password', 'MEDIUM', 'PROCESSING', 0, '2026-09-06 09:33:09', NULL),
(32, 'R20241028032', 81, 1153, 19, 'power_trip', 'Frequent breaker trips at home, several times a day, appliances are unusable', 'MEDIUM', 'COMPLETED', 544, '2024-10-28 13:49:39', '2024-11-17 16:46:11'),
(33, 'R20241010033', 18, 93, 21, 'elevator_fault', 'Elevator dropped two floors then stopped, terrifying, please inspect immediately', 'HIGH', 'COMPLETED', 476, '2024-10-10 13:26:41', '2024-09-22 17:49:35'),
(34, 'R20260202034', 85, 755, NULL, 'access_control', 'Access control system down, anyone can enter, please fix urgently', 'MEDIUM', 'CREATED', 0, '2026-02-02 10:11:55', NULL),
(35, 'R20240119035', 197, 982, 14, 'water_leak', 'Bathroom toilet tank keeps seeping water, floor is all wet', 'HIGH', 'ASSIGNED', 0, '2024-01-19 18:53:24', NULL),
(36, 'R20240107036', 136, 1507, 22, 'public_facility', 'Elevator hall tiles fell off, broken tiles all over the floor', 'HIGH', 'COMPLETED', 0, '2024-01-07 18:31:59', '2025-01-12 13:38:45'),
(37, 'R20241009037', 186, 1648, 11, 'water_leak', 'Shower floor drain is clogged and leaking, bath water won''t drain', 'MEDIUM', 'COMPLETED', 651, '2024-10-09 16:02:46', '2026-07-27 15:50:45'),
(38, 'R20240904038', 105, 467, NULL, 'water_leak', 'Kitchen faucet hose under the sink is old and leaking, can you send a technician to replace it', 'HIGH', 'CREATED', 0, '2024-09-04 09:46:14', NULL),
(39, 'R20260419039', 97, 1223, 19, 'wall_seepage', 'Bathroom exterior wall seeping, putty is blistering', 'MEDIUM', 'PROCESSING', 0, '2026-04-19 18:11:35', NULL),
(40, 'R20250206040', 82, 614, 23, 'public_facility', 'Community street lights not working, can''t see clearly when walking at night', 'HIGH', 'COMPLETED', 0, '2025-02-06 20:11:35', '2026-06-22 17:44:42'),
(41, 'R20251114041', 22, 1151, 19, 'power_trip', 'Living room outlet trips as soon as I plug something in, is there a wiring problem', 'HIGH', 'COMPLETED', 533, '2025-11-14 19:20:38', '2025-06-18 15:54:23'),
(42, 'R20240520042', 111, 1477, 19, 'elevator_fault', 'Elevator arrived at 1st floor but doors won''t open, two people trapped inside, please come quickly', 'HIGH', 'COMPLETED', 340, '2024-05-20 08:33:08', '2025-08-15 16:00:46'),
(43, 'R20260919043', 6, 964, 14, 'access_control', 'Building access control broken, card swipe has no response, door stays open, not safe', 'LOW', 'COMPLETED', 402, '2026-09-19 17:09:06', '2024-12-27 14:58:35'),
(44, 'R20241013044', 19, 821, 13, 'water_leak', 'Shower floor drain is clogged and leaking, bath water won''t drain', 'MEDIUM', 'COMPLETED', 455, '2024-10-13 17:58:13', '2026-04-08 14:51:19'),
(45, 'R20250124045', 16, 1565, 23, 'public_facility', 'Community fitness equipment is loose, safety hazard', 'MEDIUM', 'COMPLETED', 0, '2025-01-24 20:36:24', '2024-08-27 11:38:41'),
(46, 'R20260121046', 63, 1242, 16, 'water_leak', 'Kitchen pipe leaking under the sink, dripped all night, cabinet is soaked', 'MEDIUM', 'CLOSED', 524, '2026-01-21 20:40:24', '2025-02-28 13:47:41'),
(47, 'R20261213047', 56, 1462, 16, 'water_leak', 'Kitchen faucet hose under the sink is old and leaking, can you send a technician to replace it', 'HIGH', 'COMPLETED', 658, '2026-12-13 15:48:38', '2024-06-17 13:09:03'),
(48, 'R20250305048', 90, 1196, 15, 'wall_seepage', 'Balcony exterior wall seeping, worse when it rains, wall is moldy', 'MEDIUM', 'PROCESSING', 0, '2025-03-05 13:05:30', NULL),
(49, 'R20250907049', 35, 1394, 15, 'wall_seepage', 'Wall next to bathroom is seeping water, paint has peeled off a large area', 'LOW', 'COMPLETED', 488, '2025-09-07 15:25:41', '2026-07-25 12:48:08'),
(50, 'R20260204050', 171, 650, 22, 'wall_seepage', 'Ceiling is seeping, might be a waterproofing issue from upstairs', 'HIGH', 'COMPLETED', 332, '2026-02-04 18:26:27', '2024-02-09 16:20:43');

