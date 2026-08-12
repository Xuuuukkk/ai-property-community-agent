-- 8. Notice data (notice table) - 24 notices
-- Generated: 2026-08-12 | Database: PostgreSQL | Encoding: UTF-8
-- Community: Yunxi Garden Community (Yunxi Hua Yuan Xiao Qu)
-- Import order: 1.community -> 2.buildings -> 3.houses -> 4.users -> 5.workers -> 6.repair_orders -> 7.fee_bills -> 8.notices

-- ============================================================
-- 8. Notices (notice table)
-- 24 property notices
-- Types: water_power_outage / elevator_maintenance / fire_inspection / community_activity / public_revenue / committee_notice / weather_alert / facility_notice
-- is_pinned: TRUE for pinned notices
-- Publisher: links to worker table admin (id=1~10)
-- ============================================================

INSERT INTO notice (id, title, content, publisher_id, notice_type, is_pinned, status, created_at)
VALUES
(1, 'Water Supply Suspension Notice - July 15', 'Dear Residents,

Due to annual inspection of the main water supply pipeline, temporary water suspension will be implemented on July 15, 2024 (Monday) from 8:00 to 17:00. Buildings B1-B8 will be affected.

Please prepare water storage in advance. For special circumstances, please contact the Property Service Center: 021-5896XXXX.

We apologize for the inconvenience!

Yunxi Property Service Co., Ltd.
July 12, 2024', 10, 'water_power_outage', TRUE, 'PUBLISHED', '2024-07-12 10:41:00'),
(2, 'Temporary Power Outage Notice - July 20', 'Dear Residents,

Per notice from the power company, due to grid upgrade in the Zhangjiang Road area, temporary power outage will be implemented on July 20, 2024 (Saturday) from 9:00 to 12:00. Elevators and water pumps will be suspended during this period.

Please prepare in advance. If you have special power needs (medical equipment, etc.), please contact the property in advance.

Yunxi Property Service Co., Ltd.
July 18, 2024', 6, 'water_power_outage', FALSE, 'PUBLISHED', '2024-07-18 15:58:00'),
(3, 'Q3 2024 Elevator Maintenance Notice', 'Dear Residents,

To ensure safe elevator operation, the Property Service Center will conduct Q3 routine elevator maintenance from July 22-26, 2024. Elevators will be serviced in rotation, with each building''s downtime not exceeding 4 hours.

Schedule:
  Jul 22: B1, B2
  Jul 23: B3, B4
  Jul 24: B5, B6
  Jul 25: B7, B8
  Jul 26: Inspection and wrap-up

Please plan your travel accordingly. For temporary access arrangements during maintenance, please contact the property.

Yunxi Property Service Center - Engineering Dept.
July 19, 2024', 7, 'elevator_maintenance', FALSE, 'PUBLISHED', '2024-07-19 17:54:00'),
(4, 'Fire Safety Equipment Quarterly Inspection Notice', 'Dear Residents,

To ensure community fire safety, the Property Service Center will conduct quarterly fire equipment inspection from August 5-9, 2024.

Inspection includes:
  1. Fire hydrants and extinguishers on all floors
  2. Smoke detectors and sprinkler system testing
  3. Fire escape route clearance check
  4. Underground garage fire equipment inspection

Brief alarm test sounds may occur during inspection - please do not be alarmed. For questions, contact the Property Service Center.

Yunxi Property Service Center - Security Dept.
August 2, 2024', 7, 'fire_inspection', FALSE, 'PUBLISHED', '2024-08-02 12:14:00'),
(5, 'Mid-Autumn & National Day Community Event Notice', 'Dear Residents,

To celebrate the Mid-Autumn Festival and National Day, the Property Service Center and Homeowners'' Committee invite you to a community event: ''Moon Over Yunxi - Garden of Joy''

Time: September 14, 2024 (Saturday) 15:00-20:00
Location: Community Central Plaza
Activities:
  - Lantern Riddle Guessing (15:00-17:00)
  - Children''s DIY Mooncake (15:30-17:00)
  - Community Performance (18:00-20:00)
  - Prizes and mooncake distribution

All residents are welcome to join!

Yunxi Property Service Center - Community Service Dept.
September 5, 2024', 5, 'community_activity', FALSE, 'PUBLISHED', '2024-09-05 10:18:00'),
(6, '2024 Community Public Revenue Disclosure', 'Dear Residents,

Per Shanghai Residential Property Management Regulations, the 2024 H1 public revenue of Yunxi Garden Community is disclosed as follows:

I. Revenue (Jan-Jun 2024)
  1. Elevator advertising: CNY 48,200.00
  2. Locker site fee: CNY 12,000.00
  3. Vending machine site fee: CNY 3,600.00
  4. Temporary parking: CNY 26,800.00
  5. Other: CNY 2,400.00
  Total: CNY 93,000.00

II. Expenditure
  1. Elevator maintenance (shared): CNY 18,000.00
  2. Fire equipment maintenance: CNY 8,500.00
  3. Public lighting renovation: CNY 12,300.00
  4. Greening supplement: CNY 6,200.00
  Total: CNY 45,000.00

III. Balance: CNY 48,000.00 (transferred to maintenance fund)

Disclosure period: July 1-15, 2024

Yunxi Property Service Center - Homeowners'' Committee
July 1, 2024', 2, 'public_revenue', TRUE, 'PUBLISHED', '2024-07-01 10:05:00'),
(7, 'Homeowners'' Committee Election Notice', 'Dear Residents,

The first Homeowners'' Committee term is expiring. Per the Owners'' Assembly Rules, we hereby launch the second committee election.

I. Candidate Registration
  Period: August 1-20, 2024
  Location: Property Service Center front desk
  Requirements: Property owner, enthusiastic about community, responsible

II. Election Method
  Written ballot + electronic voting

III. Voting Period
  September 10-15, 2024

All owners are encouraged to participate. Detailed rules available at the Property Service Center.

Yunxi Garden Homeowners'' Committee Election Working Group
July 28, 2024', 6, 'committee_notice', FALSE, 'PUBLISHED', '2024-07-28 12:47:00'),
(8, 'High Temperature Safety Reminder', 'Dear Residents,

Shanghai is experiencing sustained high temperatures with an orange alert issued. The Property Service Center reminds you:

1. Avoid prolonged outdoor activities during 11:00-15:00
2. Set AC temperature to 26C+ for energy saving and health
3. Be careful with electricity - avoid using multiple high-power appliances simultaneously
4. Check water/gas/electricity before leaving home
5. Elderly and children should avoid going out; contact property if help is needed

We have equipped outdoor staff with heat protection supplies and set up a free drinking water station at the lobby.

Wishing you a cool and safe summer!

Yunxi Property Service Center
July 25, 2024', 2, 'weather_alert', FALSE, 'PUBLISHED', '2024-07-25 14:08:00'),
(9, 'Waste Sorting Compliance Report', 'Dear Residents,

Since the implementation of waste sorting, our community has achieved good results:

I. Current Status
  - Wet waste daily: ~280kg
  - Dry waste daily: ~520kg
  - Recyclables daily: ~85kg
  - Sorting accuracy: ~82%

II. Issues
  1. Some households still mix waste
  2. Off-schedule disposal occurs
  3. Bulky waste randomly placed

III. Measures
  1. Add guides during peak hours
  2. Door-to-door education for repeat offenders
  3. Set up temporary bulky waste storage (Garage B)

Please cooperate with waste sorting. Together we build a better community.

Yunxi Property Service Center - Environmental Dept.
August 10, 2024', 6, 'facility_notice', FALSE, 'PUBLISHED', '2024-08-10 15:36:00'),
(10, 'Underground Garage Fire Lane Clearance Notice', 'Dear Residents,

Recent inspections found fire lanes in the underground garage being occupied by debris, posing serious safety hazards.

I. Requirements
  1. Residents with items in fire lanes/exit areas must clear them by August 20, 2024
  2. Items not cleared by deadline will be removed by property
  3. No non-vehicle parking in garage lanes

II. Legal Liability
  Per the Fire Protection Law, occupying fire lanes may result in fines of CNY 5,000-50,000.

Safety first - please cooperate!

Yunxi Property Service Center - Security Dept.
August 15, 2024', 1, 'fire_inspection', FALSE, 'PUBLISHED', '2024-08-15 13:03:00'),
(11, 'Winter Fire Safety Notice', 'Dear Residents,

Winter is a high-risk season for fires. The Property Service Center reminds you:

1. Be mindful of electrical load when using heaters/electric blankets; turn off power when leaving
2. No flammable materials in hallways/fire lanes
3. No e-bikes inside buildings for charging
4. Don''t leave cooking gas unattended; close valves after use
5. Check home wiring regularly; replace aging circuits
6. Consider having a home fire extinguisher

Property will conduct winter fire safety home inspections in December.

Yunxi Property Service Center - Security Dept.
November 20, 2024', 10, 'fire_inspection', FALSE, 'PUBLISHED', '2024-11-20 17:12:00'),
(12, 'Access Control System Replacement Notice', 'Dear Residents,

The current access control system has been in use for 6 years with aging equipment. Per Homeowners'' Committee proposal and assembly vote, the system will be replaced.

I. Construction: October 8-20, 2024
II. Scope: B1-B8, garage, main entrances
III. New Features:
  1. Face recognition + card dual mode
  2. Mobile APP remote unlock
  3. Visitor QR code access
IV. Cost: From public revenue, no additional charge to owners
V. Note: During transition, brief card reader downtime may occur. Register face info at the Property Center after activation.

Yunxi Property Service Center - Engineering Dept.
September 28, 2024', 7, 'facility_notice', FALSE, 'PUBLISHED', '2024-09-28 15:20:00'),
(13, 'Winter Greening Maintenance Notice', 'Dear Residents,

To ensure community plants survive winter, the greening team will conduct winter maintenance in December 2024:

1. Cold protection wrapping for sensitive species
2. Pruning dead/diseased branches
3. Applying winter fertilizer
4. Clearing fallen leaves to eliminate fire hazards

Some noise from pruning may occur - thank you for understanding. Greening suggestions welcome at the Property Center.

Yunxi Property Service Center - Greening Dept.
December 1, 2024', 6, 'facility_notice', FALSE, 'PUBLISHED', '2024-12-01 11:33:00'),
(14, 'Spring Festival 2025 Duty Arrangement', 'Dear Residents,

Spring Festival 2025 holiday duty arrangement:

I. Holiday: January 28 (New Year''s Eve) to February 4, 8 days

II. Duty:
  1. Front desk: 9:00-17:00 daily
  2. Engineering: 24h duty, emergency response within 30 min
  3. Security: 24h normal patrol
  4. Cleaning: basic morning service

III. Hotline: 021-5896XXXX
   Emergency: 138-XXXX-XXXX

IV. Tips:
  1. Close windows/doors, shut off utilities when away
  2. Be vigilant against fire and theft
  3. Fireworks at designated area only

Happy Spring Festival!

Yunxi Property Service Center
January 20, 2025', 10, 'community_activity', FALSE, 'PUBLISHED', '2025-01-20 12:06:00'),
(15, 'Q1 2025 Elevator Maintenance Notice', 'Dear Residents,

Q1 2025 elevator maintenance schedule:

Dates: March 10-14, 2025
  Mar 10: B1, B2
  Mar 11: B3, B4
  Mar 12: B5, B6
  Mar 13: B7, B8
  Mar 14: Final inspection

Time: Max 4h per building (9:00-13:00 or 14:00-18:00)

Content: Traction machine, wire rope, safety gear, speed limiter, door system, control cabinet

Please plan travel in advance. Contact property for temporary access arrangements.

Yunxi Property Service Center - Engineering Dept.
March 5, 2025', 7, 'elevator_maintenance', FALSE, 'PUBLISHED', '2025-03-05 09:34:00'),
(16, 'Exterior Wall Renovation Notice', 'Dear Residents,

Inspection found exterior wall paint peeling and localized seepage in some buildings. Per Homeowners'' Committee approval, renovation will proceed.

I. Construction: April 15 - May 30, 2025
II. Scope: B3, B5, B7 exterior walls + waterproofing
III. Contractor: Shanghai XX Construction Co., Ltd. (fully qualified)
IV. Notes:
  1. Noise during 8:00-17:00
  2. Keep windows closed to prevent dust
  3. Don''t place items on windowsills
  4. No parking in suspended platform work areas

Funding: Special maintenance fund

Yunxi Property Service Center - Engineering Dept.
April 8, 2025', 8, 'facility_notice', FALSE, 'PUBLISHED', '2025-04-08 14:09:00'),
(17, 'Summer 2025 Typhoon & Flood Prevention Notice', 'Dear Residents,

Shanghai has entered peak typhoon season. The Property Service Center has activated the flood/typhoon emergency plan:

I. Property preparations:
  1. Checked and cleared all rooftop drainage
  2. 200 sandbags ready at entrances
  3. Checked garage drainage pumps
  4. Pruned dangerous branches

II. Resident cooperation:
  1. Secure balcony items (flower pots, drying racks)
  2. Close windows during typhoon, stay away from glass
  3. Garage owners: watch for notices, move vehicles to ground if needed
  4. Stock essential supplies

III. Emergency contact: 021-5896XXXX

Yunxi Property Service Center - Flood Prevention Group
July 10, 2025', 5, 'weather_alert', TRUE, 'PUBLISHED', '2025-07-10 12:31:00'),
(18, 'Mosquito Control Notice', 'Dear Residents,

Summer mosquito activity is high. The property will conduct mosquito control in public areas on July 25, 2025.

Scope: Underground garage, hallways, garbage area, green belts, drainage
Time: July 25 (Friday) 8:00-11:00

Notes:
  1. Keep windows closed during treatment
  2. Don''t dry clothes in treatment areas
  3. Supervise children and pets
  4. Wait 30 min after treatment before entering

Agent: Low-toxicity eco-friendly insecticide, harmless to humans

Yunxi Property Service Center - Environmental Dept.
July 22, 2025', 8, 'facility_notice', FALSE, 'PUBLISHED', '2025-07-22 11:38:00'),
(19, 'E-Bike Charging Regulation Notice', 'Dear Residents,

Recent e-bike fire incidents nationwide highlight safety risks. New charging rules:

I. Prohibited:
  1. No e-bikes inside buildings
  2. No ''flying wire'' charging (from windows)
  3. No e-bikes in hallways/fire lanes
  4. No battery removal for indoor charging

II. Charging Facilities:
  Centralized charging area in Garage B with 20 smart stations: auto-stop, overload protection

III. Violation Handling:
  1. First offense: warning + deadline
  2. Repeat: reported to fire department

IV. Report violations: 021-5896XXXX

Safety first!

Yunxi Property Service Center - Security Dept.
August 1, 2025', 5, 'fire_inspection', FALSE, 'PUBLISHED', '2025-08-01 11:47:00'),
(20, '2025 H1 Public Revenue Disclosure', 'Dear Residents,

Yunxi Garden Community 2025 H1 (Jan-Jun) public revenue disclosure:

I. Revenue
  1. Elevator advertising: CNY 52,000.00
  2. Locker site fee: CNY 12,000.00
  3. Vending machine: CNY 3,600.00
  4. Temporary parking: CNY 31,200.00
  5. Charging station share: CNY 8,400.00
  6. Other: CNY 1,800.00
  Total: CNY 109,000.00

II. Expenditure
  1. Elevator maintenance: CNY 18,000.00
  2. Fire equipment: CNY 9,500.00
  3. Access control replacement: CNY 25,000.00
  4. Greening: CNY 4,800.00
  5. LED lighting: CNY 15,000.00
  Total: CNY 72,300.00

III. Balance: CNY 36,700.00

Disclosure period: July 1-15, 2025

Yunxi Property Service Center - Homeowners'' Committee
July 1, 2025', 1, 'public_revenue', TRUE, 'PUBLISHED', '2025-07-01 14:19:00'),
(21, '2025 Annual Fire Drill Notice', 'Dear Residents,

To improve fire safety awareness and emergency evacuation skills, the annual fire drill will be held on November 9, 2025 (National Fire Day).

I. Time: November 9 (Sunday) 14:00-16:00
II. Location: Community Central Plaza
III. Content:
  1. Fire alarm and evacuation drill
  2. Extinguisher hands-on practice
  3. Fire hydrant demonstration
  4. First aid knowledge
  5. Fire truck display

IV. Participation: Voluntary, no registration needed
V. Note: Alarm sounds during drill - do not panic

Yunxi Property Service Center - Security Dept.
October 28, 2025', 9, 'fire_inspection', FALSE, 'PUBLISHED', '2025-10-28 10:17:00'),
(22, 'Roof Waterproofing Repair Notice - B2 & B6', 'Dear Residents,

Inspection found aging waterproofing on B2 and B6 roofs with localized seepage. Per Homeowners'' Committee approval, repair will proceed.

I. Construction: September 5-25, 2025
II. Scope: B2, B6 roofs
III. Content:
  1. Remove old waterproofing layer
  2. Re-lay SBS modified asphalt membrane
  3. Restore insulation and protection layers

IV. Notes:
  1. Top floor may experience noise
  2. Don''t dry items on rooftop
  3. Rain delays construction

Funding: Special maintenance fund

Yunxi Property Service Center - Engineering Dept.
August 28, 2025', 10, 'facility_notice', FALSE, 'PUBLISHED', '2025-08-28 16:40:00'),
(23, 'Spring Festival 2026 Duty & Safety Tips', 'Dear Residents,

Spring Festival 2026 duty arrangement:

I. Holiday: February 15 (New Year''s Eve) to February 22, 8 days
II. Duty:
  Front desk: 9:00-17:00
  Engineering: 24h
  Security: 24h
  Hotline: 021-5896XXXX

III. Tips:
  1. Close windows/doors, shut off utilities when away
  2. No flammable items on balconies
  3. Be vigilant against theft
  4. Fireworks at designated area (south gate open space)

Happy New Year!

Yunxi Property Service Center
February 5, 2026', 4, 'community_activity', FALSE, 'PUBLISHED', '2026-02-05 16:18:00'),
(24, 'Surveillance System Upgrade Notice', 'Dear Residents,

To improve community safety, per Homeowners'' Committee proposal and assembly vote, the surveillance system will be upgraded.

I. Upgrades:
  1. Replace all cameras with HD network cameras (96 units)
  2. Add face recognition capture system at entrances
  3. Upgrade monitoring center storage and displays
  4. Add e-bike entry alarm system

II. Construction: March 1-20, 2026
III. Cost: From public revenue
IV. Notes:
  1. Brief surveillance interruption may occur
  2. Workers in public areas - please do not disturb
  3. Face data used for security only, strictly confidential

Yunxi Property Service Center - Security Dept.
February 20, 2026', 7, 'facility_notice', FALSE, 'PUBLISHED', '2026-02-20 09:51:00');

