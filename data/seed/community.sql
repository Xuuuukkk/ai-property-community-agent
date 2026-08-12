-- 1. Community base data (community table) - Yunxi Garden Community single record
-- Generated: 2026-08-12 | Database: PostgreSQL | Encoding: UTF-8
-- Community: Yunxi Garden Community (Yunxi Hua Yuan Xiao Qu)
-- Import order: 1.community -> 2.buildings -> 3.houses -> 4.users -> 5.workers -> 6.repair_orders -> 7.fee_bills -> 8.notices

-- ============================================================
-- 1. Community (community table)
-- Yunxi Garden Community - single record
-- ============================================================

INSERT INTO community (id, name, name_en, address, built_year, building_count, total_households, parking_spaces, property_company, description, created_at)
VALUES (1, 'Yunxi Hua Yuan Xiao Qu', 'Yunxi Garden Community', 'No.1268 Zhangjiang Road, Pudong New Area, Shanghai', 2018, 8, 1200, 800, 'Yunxi Property Service Co., Ltd.', 'Yunxi Garden Community is a high-rise residential community completed in 2018, comprising 8 towers with 1200 households and 800 underground parking spaces.', '2026-08-12 11:42:13');

