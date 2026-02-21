# BCH LEAD MANAGEMENT SYSTEM — COMPLETE FLOW BREAKDOWN
## How Every Flow Tackles Every Problem
**Version:** 1.0
**Date:** February 21, 2026
**Companion to:** LEAD_MANAGEMENT_PRD.md

---

## TABLE OF CONTENTS

1. Flow 1: IVR Filtering Flow (The Gatekeeper)
2. Flow 2: Source Attribution Flow (The Gold Mine)
3. Flow 3: Lead Qualification Flow (Zero Typing)
4. Flow 4: Lead Distribution Engine (Right Lead → Right Person)
5. Flow 5: Follow-Up Flow (BCH Law #27 — The Money Flow)
6. Flow 6: Walk-In Tracking Flow (Closing The Loop)
7. Flow 7: Manager Visibility Flow (Ibrahim's Eyes)
8. Flow 8: Automation Engine (The Machine That Never Sleeps)
9. The Complete Journey: Content to Cash
10. Pain Point → Flow Mapping

---

## FLOW 1: IVR FILTERING FLOW (The Gatekeeper)

### The Problem It Solves
**Pain Points #4, #5, #6, #7, #8** — Anushka handles ALL 30-40K calls/month. 70-80% are waste (kids under 12, outstation callers). Each call takes 8-15 minutes. She can do max 30 calls/day vs 100+ incoming. No filtering exists.

### How It Works Step-by-Step

```
CUSTOMER SEES BCH CONTENT (Instagram/YouTube)
     |
     v
CALLS THE NUMBER IN BIO
     |
     v (CallerDesk picks up automatically)

STEP 1: LANGUAGE SELECT
"Kannada ge 1, English ge 2"
     |
     +-- System captures: language = Kannada/English
     |
     v
STEP 2: LOCATION CHECK
"Bangalore nalli iddira? 1 = Yes, 2 = No"
     |
     +-- If "2" (OUTSIDE BANGALORE) --> FILTERED OUT
     |   |
     |   +-- Caller hears: "We'll WhatsApp you delivery details"
     |   +-- System auto-sends WhatsApp with store info + delivery options
     |   +-- Lead created in CRM as "Outstation - Auto-WhatsApp"
     |   +-- Call ENDS. No human touched this call.
     |   +-- 50-60% of ALL calls eliminated here
     |
     +-- If "1" (BANGALORE) --> Continue
     |
     v
STEP 3: AGE CHECK
"Cycle yaarige? 1 = 12+, 2 = Under 12"
     |
     +-- If "2" (UNDER 12) --> FILTERED OUT
     |   |
     |   +-- Caller hears: "Kids cycles Rs.1,999 inda!"
     |   +-- Auto-WhatsApp: kids pricing + store location + map
     |   +-- Lead created as "Kids U12 - Auto-WhatsApp"
     |   +-- Call ENDS. No human touched this.
     |   +-- Another 15-20% eliminated here
     |
     +-- If "1" (12+ YEARS) --> Continue (QUALIFIED)
     |
     v
STEP 4: INTEREST CAPTURE
"1=Electric, 2=Gear, 3=Kids/Teen, 4=Second hand, 5=Service, 6=Other"
     |
     +-- System captures: interest category + starting price shown
     |
     v
STEP 5: CONNECT TO HUMAN
     |
     +-- Ring Anushka (15 sec) --> If answers: CONNECTED
     +-- If busy: Ring Agent 2 (15 sec) --> If answers: CONNECTED
     +-- If BOTH busy: "We'll call back in 15 min"
         +-- Lead created as "Callback Pending"
         +-- Auto-WhatsApp: "We'll call you back!"
         +-- BDC agents get callback queue notification
```

### Filtering Impact

| Call Type | % of Total | IVR Action | Reaches Human? |
|-----------|-----------|------------|---------------|
| Outside Bangalore | 50-60% | Auto-WhatsApp, no agent | NO |
| Kids under 12 (Bangalore) | 15-20% | Auto-WhatsApp, no agent | NO |
| Bangalore, 12+, qualified | 20-35% | Route to BDC agent | YES |

### Before vs After

| Before | After |
|--------|-------|
| 100% of calls reach Anushka | Only 20-35% reach a human |
| Anushka spends 5-6 hrs/day on non-buyers | She only talks to Bangalore, 12+, interested callers |
| 30 calls/day max capacity | 20-35 qualified calls/day = perfectly manageable with 2 agents |
| Zero data captured from filtered calls | Even filtered calls get WhatsApp + lead record in CRM |
| Kids/outstation callers get NOTHING | They get helpful auto-WhatsApp with pricing, delivery info |
| Missed calls vanish silently | Every missed call enters callback queue with 15-min SLA |

**Net result**: 60-70% of waste calls never reach a human, but still get served via WhatsApp. Anushka's 8-15 min wasted calls become 0 seconds.

---

## FLOW 2: SOURCE ATTRIBUTION FLOW (The Gold Mine)

### The Problem It Solves
**Pain Points #1, #2, #3, #21** — BCH spends Rs.5L+/month on content across 8 profiles but can't tell which profile generates revenue. Can't ask customers where they heard about BCH — they don't remember.

### The Architecture: 8 Profiles × 8 Unique Numbers

```
BCH Main         --> 9380097119  --> CRM tags as "BCH_MAIN"
Wattsonwheelz    --> 7996994427  --> CRM tags as "WATTSONWHEELZ"
BCH Toyz         --> 9019107283  --> CRM tags as "BCH_TOYZ"
BCH 2nd Life     --> 9844187264  --> CRM tags as "BCH_2NDLIFE"
EM Doodle BCH    --> 9844353759  --> CRM tags as "EM_DOODLE"
BCH Lux          --> NEW number  --> CRM tags as "BCH_LUX"
Raleigh x BCH    --> NEW number  --> CRM tags as "RALEIGH"
Next.BLR         --> NEW number  --> CRM tags as "NEXT_BLR"
Google Business  --> 8892031480  --> CRM tags as "GOOGLE"
```

### The Flow

```
Customer sees EM DOODLE Instagram video about EMotorad Doodle
     |
     v
Goes to EM Doodle profile bio
     |
     v
Clicks phone number: 9844353759 (unique to EM Doodle)
     |
     v
CallerDesk receives call on 9844353759
     |
     v
Webhook fires to CRM:
  { caller: "9876543210", callerdesk_number: "9844353759" }
     |
     v
CRM auto-maps: 9844353759 = EM_DOODLE
     |
     v
Lead created with SOURCE = "EM_DOODLE" (ZERO human effort)
     |
     v
Lead goes through pipeline: qualify → assign → follow-up → visit → purchase
     |
     v
REVENUE ATTRIBUTED:
  "EM Doodle generated 540 calls → 160 qualified → 55 visited → 42 purchased → Rs.3.8L"
```

### Before vs After

| Before | After |
|--------|-------|
| "Which profile generated this sale?" — No idea | Every lead tagged to exact profile automatically |
| Rs.5L/month content spend, zero ROI visibility | Full funnel: Profile → Calls → Qualified → Visit → Purchase → Revenue |
| Can't optimize: which profile deserves more content? | Data shows: Wattsonwheelz = Rs.8.4L, Next.BLR = Rs.30K — invest accordingly |
| Need to ask customers (they don't remember) | Phone number IS the attribution — no asking needed |

**Net result**: Ibrahim can see exactly which of his 8 profiles is making money and which is wasting resources. First time ever — content ROI is measurable.

---

## FLOW 3: LEAD QUALIFICATION FLOW (Zero Typing)

### The Problem It Solves
**Pain Points #17, #18, #19** — Staff can't type (no formal education). TeleCRM required typing → 37% data completeness. Manual data entry = system gets abandoned.

### How It Works

```
BDC AGENT (Anushka) PICKS UP QUALIFIED CALL
     |
     v
SCREEN AUTO-POPULATES (from CallerDesk data):
  - Phone: 9876543210
  - Source: Wattsonwheelz
  - Location: Bangalore
  - Age: 12+
  - Interest: Electric cycle
  - RETURNING CALLER? Shows previous history if exists
     |
     v (9 fields already filled with ZERO effort)

ANUSHKA TALKS TO CUSTOMER, TAPS BUTTONS:
     |
     +-- NAME: [Voice-to-text button] or [Didn't share]
     |         (Tap mic, speak "Ravi Kumar", auto-fills)
     |
     +-- AREA: Tap one chip
     |   [Yelahanka] [Hebbal] [RT Nagar] [Whitefield]
     |   [Electronic City] [Rajajinagar] [Jayanagar]
     |   [Other BLR] [Outskirts 20km+]
     |
     +-- BUDGET: Tap one chip
     |   [Under 10K] [10-20K] [20-35K] [35-50K] [50K-1L] [1L+]
     |
     +-- BRAND: Tap one chip
     |   [EMotorad] [Raleigh] [AOKI] [Hercules] [Hero Lectro]
     |
     +-- MODEL: Tap one chip
     |   [Desire] [Doodle] [T-Rex] [X1] [Raleigh Eco] [Other] [None]
     |
     +-- VISIT INTENT: Tap one chip
     |   [Coming today] [Tomorrow] [Weekend] [Next week] [Not sure] [Refused]
     |
     +-- EMI: Tap one chip
     |   [Yes - 999 offer] [Yes - regular] [No - cash/card] [Didn't discuss]
     |
     +-- NOTES: Tap multiple chips
     |   [Wants test ride] [Comparing competitor] [Family approval]
     |   [Price concern] [Specific color] [Warranty] [Delivery]
     |   [Called before] [Clear - no issues]
     |
     v
SYSTEM AUTO-CALCULATES:
  - Lead Score: HOT (based on budget + visit intent + interest)
  - Auto-Assign: Suma (because interest = Electric)
     |
     v
ANUSHKA TAPS: [ SAVE & ASSIGN ]
     |
     v
DONE. 14 data points captured. Zero typing. 30 seconds of tapping.
```

### Auto-Scoring Logic

```
VERY HOT (0.8-1.0):
  Budget 35K+ AND Visit today/tomorrow AND specific model mentioned

HOT (0.6-0.8):
  Budget 20K+ AND Visit this week AND brand known

WARM (0.4-0.6):
  Budget known AND visit intent "not sure" OR "next week"

COLD (0.0-0.4):
  Budget unknown AND no visit intent AND "just looking"
```

### Before vs After

| Before (TeleCRM) | After (BCH CRM) |
|--------|-------|
| Typing required for every field | ZERO typing — all buttons and chips |
| 37% data completeness | Target: 95%+ (only need to tap, not type) |
| 8-15 min per lead to enter data | 30-60 seconds of button taps |
| No auto-scoring | System auto-scores Very Hot/Hot/Warm/Cold |
| No auto-assignment | System auto-assigns to right salesperson |
| Staff abandon the tool | Staff LOVE it — faster than doing nothing |

**Net result**: The system that staff "can't type into" is replaced by one where they never have to type. 9 fields auto-filled + 5 fields via button taps = 14 data points in under a minute.

---

## FLOW 4: LEAD DISTRIBUTION ENGINE (Right Lead → Right Person)

### The Problem It Solves
**Pain Points #10, #11, #12** — No lead distribution exists. Qualified leads aren't routed to salespeople. Sales team sits idle while BDC drowns. No category-based routing.

### Routing Table

| Lead Interest (from IVR) | Budget Indicator | Primary Assign | Backup Assign |
|--------------------------|-----------------|----------------|---------------|
| Electric cycle | Any | **Suma** | Sunil |
| Gear cycle | Under Rs.20K | **Nithin** | Abhi Gowda |
| Kids/teen cycle | Any | **Nithin** | Abhi Gowda |
| Adult cycle (non-electric) | Rs.20K-50K | **Abhi Gowda** | Sunil |
| Premium (any type) | Rs.50K+ | **Sunil** | Iqbal |
| Second hand / exchange | Any | **Baba** | Nithin |
| Service / repair | Any | **Ranjitha** then **Mujju** | — |
| Other / unknown | Any | **Round-robin** | — |

### The Assignment Flow

```
QUALIFIED LEAD ARRIVES (from BDC qualification)
     |
     v
STEP 1: CHECK INTEREST + BUDGET
  Interest = Electric, Budget = 35-50K
     |
     v
STEP 2: LOOK UP ROUTING TABLE
  Electric (any budget) → PRIMARY: Suma | BACKUP: Sunil
     |
     v
STEP 3: CHECK AVAILABILITY
  Is Suma ON LEAVE? → No → Continue
  Does Suma have 10+ uncontacted leads? → No → Continue
  Is Suma at max (30 active leads)? → No → Continue
     |
     v
STEP 4: ASSIGN TO SUMA
  Lead status → "Qualified"
  Assigned_to → "Suma"
     |
     v
STEP 5: NOTIFY
  Push notification on Suma's phone:
  "New HOT lead: Ravi Kumar — EMotorad Desire, 35-50K, visit this weekend"
     |
     v
STEP 6: START TIMER
  +2 hours: If Suma hasn't contacted → Reminder notification
  +4 hours: If still no action → Escalate to Ibrahim
     |
     v
STEP 7: LOAD BALANCING (if needed)
  If PRIMARY full → assign to BACKUP
  If BACKUP full → round-robin to any available
  Ibrahim can manually reassign anytime
```

### Why Each Salesperson Gets Specific Leads

| Salesperson | Strength | Avg Ticket | Gets | Expected Impact |
|------------|----------|-----------|------|-----------------|
| **Suma** | E-cycle knowledge, 999 EMI closing | Rs.47K | ALL electric leads | Rs.17.88L → Rs.20-22L |
| **Sunil** | High-ticket closing, premium brands | Rs.74K | 50K+ premium leads | Rs.15-27L → Rs.20-25L |
| **Abhi Gowda** | Mid-range, +82% growth rate | Rs.30K | 20-50K adult leads | Rs.10L → Rs.14-16L |
| **Nithin** | Knows kids segment well | Rs.30K | Kids + under 20K | Rs.10L → Rs.12L |
| **Baba** | Full second-hand lifecycle | Rs.15K | Exchange/used leads | Rs.2L → Rs.3-4L |

**Total current: ~Rs.55L. Target with routing: ~Rs.70-80L**

### Before vs After

| Before | After |
|--------|-------|
| Leads go NOWHERE after BDC call | Every lead auto-assigned within seconds |
| Sales team sits idle | Each rep gets leads matched to their strength |
| Nithin wants kids leads but gets random | Nithin ONLY gets kids + budget leads |
| Suma is best at e-cycles but misses them | Suma gets EVERY electric lead automatically |
| No accountability — who was supposed to call? | Clear assignment + timer + escalation |
| Ibrahim doesn't know if leads are being worked | 2-hr reminder → 4-hr escalation to Ibrahim |

**Net result**: Lead goes from "qualified by BDC" to "on Suma's phone with a push notification" in under 10 seconds. No manual routing. No leads falling through cracks.

---

## FLOW 5: FOLLOW-UP FLOW (BCH Law #27 — The Money Flow)

### The Problem It Solves
**Pain Points #13, #14, #15, #16** — ZERO follow-up exists. Once a call ends, the lead is forgotten. No callbacks for warm leads. No nurturing pipeline. BCH Law #27 says follow-up = 30% more conversion.

### The Complete Follow-Up Journey

```
SALESPERSON (Suma) GETS ASSIGNED LEAD: Ravi Kumar
     |
     v
DAY 0: FIRST CONTACT
  Suma sees notification → Opens lead detail → Taps [CALL NOW]
     |
     +-- Call happens through app (auto-logged)
     |
     v
  AFTER CALL → Suma taps outcome:
  [Coming this weekend] ← she taps this
     |
     v
  System auto-sets:
    - Stage → "Visit Scheduled"
    - Follow-up date → Friday (this weekend)
    - Auto-WhatsApp scheduled → Thursday 6 PM (day before reminder)
     |
     v
DAY 1 (Thursday 6 PM): AUTO-WHATSAPP
  "Hi Ravi! Neenu naale BCH ge bartheeni antha heldidde.
   EMotorad Desire ready idthu! Location: [map link]"
  → Sent automatically. Zero effort from Suma.
     |
     v
DAY 2 (Friday): VISIT DAY
  +-- Ravi walks in → matched by phone → Suma alerted
  |   "RAVI KUMAR just walked in! EMotorad Desire, 35-50K, 999 EMI"
  |
  +-- Suma already knows EVERYTHING about Ravi before he says a word
  |
  +-- OUTCOME A: PURCHASED
  |   → Invoice linked → Revenue attributed to Wattsonwheelz + Suma
  |   → Day 3: Auto-WhatsApp: "Please leave a Google review!"
  |   → Day 7: Auto-WhatsApp: "Refer a friend, get Rs.500 off service"
  |   → Day 30: Auto-WhatsApp: "Your free service is due!"
  |
  +-- OUTCOME B: DIDN'T BUY — Suma taps reason:
  |   [Needs family approval] ← she taps this
  |   |
  |   v
  |   System triggers SOP #8 "Family Approval" sequence:
  |   - Day 1: Suma calls → "Uncle/Aunty kosag namme store details kalistheve"
  |   - Day 3: Auto-WhatsApp → "Family discount available this week!"
  |   - Day 7: Final call from Suma → "Stock limited, idu last week"
  |   |
  |   +-- If family approves → Ravi returns → PURCHASED
  |   +-- If no response after 3 attempts → Stage = "Lost"
  |       Reason captured: "Family said no"
  |
  +-- OUTCOME C: DIDN'T SHOW UP
      → System flags: "Visit scheduled but no-show"
      → Suma gets reminder: "Ravi didn't come. Call now?"
      → Follow-up continues...
```

### The Complete Follow-Up Timeline

```
DAY 0:   Lead assigned → Salesperson notified → First call
DAY 0:   Auto-WhatsApp: store location + offers (immediate)
DAY 1:   If not contacted → 2-hr reminder → 4-hr escalation
DAY 3:   If no visit scheduled → follow-up call reminder
DAY 7:   If still in pipeline → escalation call reminder
DAY 14:  If no response at all → Auto-move to LOST

POST-VISIT (didn't buy):
+2 hrs:  Auto-WhatsApp: "Thanks for visiting!"
Day 3:   Auto-WhatsApp: "Limited stock + offers"
Day 7:   Final follow-up call reminder

POST-PURCHASE:
Day 3:   Auto-WhatsApp: Google review request
Day 7:   Auto-WhatsApp: "Refer a friend, get Rs.500 off"
Day 30:  Auto-WhatsApp: "Free service due!"
```

### The "Family Approval" Recovery (Rs.6.5L/month Opportunity)

```
PROBLEM: 28% of lost deals = "Family said no" = Rs.6.5L/month lost

SOP #8 SEQUENCE (auto-triggered when salesperson marks "Family approval"):

DAY 1: Salesperson calls lead
  Script: "Nimage family discussion aaytha? Naavu nimma
  parents/spouse ge direct call madbahudu — questions iddare
  answer maadtheve."

DAY 3: Auto-WhatsApp to lead
  "Hi [Name]! Nimma family kosag BCH special offer:
  - Extra Rs.2000 discount this week only
  - Free accessories worth Rs.3,500
  - 1 year free AMC
  Family members welcome to visit — we'll explain everything!"

DAY 7: Final call from salesperson
  Script: "Last week for this offer. Stock limited for [model].
  Nimma family ge ond visit maadi — 30 min only."

RECOVERY TARGET: 30-40% of "family approval" leads come back
= Rs.2-2.6L/month recovered from this ONE sequence alone
```

### Before vs After

| Before | After |
|--------|-------|
| Call ends → lead forgotten forever | 18 automated touchpoints over 30 days |
| Zero callbacks to warm leads | System forces follow-up with reminders + escalation |
| No nurturing pipeline | WhatsApp sequences keep lead warm automatically |
| Can't verify if follow-ups happened | Every action logged — compliance rate visible, target 100% |
| "Family approval" leads die (Rs.6.5L/month lost) | SOP #8 auto-triggers 3-call sequence over 7 days |
| 30-40% conversion left on table (BCH Law #27) | Systematic follow-up recovers this revenue |

**Net result**: No lead ever dies silently again. Even if a salesperson forgets, the system reminds them at 2 hours, escalates at 4 hours, and auto-sends WhatsApp regardless.

---

## FLOW 6: WALK-IN TRACKING FLOW (Closing The Loop)

### The Problem It Solves
**Pain Points #9, #21** — Data lives in Excel. No connection between "someone called" and "someone walked in." Can't tell if content-generated calls are converting to store visits.

### Walk-In Types

| Type | How They Enter System | Data Available |
|------|----------------------|----------------|
| **Phone lead then walk-in** | Auto-matched by phone number when they arrive | Full history from phone call |
| **Fresh walk-in** | Sales rep creates entry via "New Walk-in" button | Minimal — captured at store |
| **Returning customer** | Auto-matched by phone number in system | Full purchase + service history |

### The Flow

```
CUSTOMER ENTERS BCH STORE
     |
     v
SALES REP OPENS APP → [ NEW WALK-IN ]
     |
     v
ENTERS PHONE NUMBER (or scans from their phone)
     |
     v
SYSTEM CHECKS: Is this number in our database?
     |
     +-- YES! MATCH FOUND!
     |   |
     |   v
     |   "This is RAVI KUMAR!
     |    Called from Wattsonwheelz on Feb 18
     |    Interest: EMotorad Desire
     |    Budget: 35-50K, wants 999 EMI
     |    Comparing with Hero Lectro
     |    Assigned to: SUMA"
     |   |
     |   v
     |   Suma gets alert: "Your lead RAVI KUMAR is here!"
     |   Suma knows EVERYTHING before saying hello.
     |   |
     |   v
     |   INTERACTION ON FLOOR
     |   |
     |   +-- [ PURCHASED ] → enter invoice # →
     |   |   Lead CLOSED WON → Revenue = Rs.42,999
     |   |   Attributed to: Wattsonwheelz → Suma
     |   |
     |   +-- [ WALKED OUT ] → capture reason:
     |   |   [Too expensive] [Not in stock] [Family approval]
     |   |   [Just looking] [Competitor] [EMI rejected]
     |   |   → Lead stays in follow-up pipeline
     |   |   → Capture phone if not already have it
     |   |
     |   +-- [ COMING BACK ] → set follow-up date
     |       → Day-before reminder auto-sent
     |
     +-- NO MATCH (Fresh walk-in)
         |
         v
         Quick capture:
         - Interest: [Electric] [Gear] [Kids]...
         - Assign to: [Suma] [Nithin] [Abhi]...
         - [ CAPTURE ]
         |
         v
         SAME OUTCOME FLOW:
         Purchased / Walked out / Coming back
         |
         v
         IF WALKED OUT:
         "Can I get your number? We'll WhatsApp you offers."
         → Phone captured = NEW lead in follow-up pipeline
         → 62% phone capture target from walk-outs
```

### End-of-Day Summary

```
TODAY'S WALK-INS: 45
├── From phone leads: 12 (27%) ← CONTENT IS WORKING
├── Fresh walk-ins: 28 (62%)
└── Returning customers: 5 (11%)

PURCHASED: 32 (71% conversion)
WALKED OUT: 13 (29%)
├── Too expensive: 4
├── Not in stock: 3    ← INVENTORY PROBLEM VISIBLE
├── Family approval: 3 ← SOP #8 AUTO-TRIGGERED
├── Just looking: 2
└── EMI rejected: 1    ← PRE-QUALIFY ON CALL NEXT TIME

PHONES CAPTURED FROM WALK-OUTS: 8/13 (62%)
→ 8 new leads entered follow-up pipeline!
```

### Before vs After

| Before | After |
|--------|-------|
| Can't connect "called from Instagram" to "bought in store" | Phone number matching links entire journey |
| Walk-ins are invisible | Every visitor logged: from-lead vs fresh vs returning |
| Walk-out reasons unknown | Dropdown capture: know WHY they didn't buy |
| "Not in stock" lost silently | Data shows stock issues → Ibrahim fixes inventory |
| Walk-out = lost forever | 62% phone capture → enters follow-up pipeline |
| Content ROI unmeasurable | 12/45 walk-ins came from leads → content generating 27% of foot traffic |

**Net result**: For the first time, BCH can say "Wattsonwheelz generated 850 calls → 280 qualified → 95 visited → 72 purchased → Rs.8.4L revenue." The full funnel is visible.

---

## FLOW 7: MANAGER VISIBILITY FLOW (Ibrahim's Eyes)

### The Problem It Solves
**Pain Points #21, #22, #23, #24** — Ibrahim flies blind. No content-to-revenue reporting. No call volume analytics. No pipeline dashboard. No salesperson performance on leads.

### What Ibrahim Sees (Real-Time Dashboard)

```
LIVE DASHBOARD (updates every minute):

═══ CALLS TODAY ═══
Total: 112 | Answered: 34 | IVR Filtered: 71 | Missed: 7

By Source:
  Wattsonwheelz: 28 | BCH Main: 22 | EM Doodle: 18
  BCH Toyz: 15 | Raleigh: 12 | Google: 9
  2nd Life: 5 | Next.BLR: 2 | BCH Lux: 1

═══ LEADS TODAY ═══
Created: 34 | Qualified: 28 | Assigned: 28 | Contacted: 19

═══ WALK-INS TODAY ═══
Total: 45 | From leads: 12 | Fresh: 28 | Returning: 5
Purchased: 32 | Walk-out: 13 | Conversion: 71%

═══ REVENUE TODAY ═══
Total: Rs.5.2L
From leads: Rs.1.8L (35%)
From walk-ins: Rs.3.4L (65%)

═══ MISSED CALLS ═══
7 missed | 4 callback pending | Oldest: 45 min ago

═══ SALESPERSON PERFORMANCE ═══
Suma:   8 leads | 5 contacted | 2 converted | Rs.1.2L  ← GOOD
Sunil:  6 leads | 4 contacted | 1 converted | Rs.45K   ← OK
Abhi:   5 leads | 5 contacted | 1 converted | Rs.22K   ← GOOD EFFORT
Nithin: 7 leads | 3 contacted | 0 converted | Rs.0     ← WARNING!
        ⚠️ "4 uncontacted leads > 4 hours old"

═══ FOLLOW-UP COMPLIANCE ═══
Due today: 18 | Completed: 11 | Pending: 7
Compliance: 61% (target: 100%)
Overdue 2+ days: 5 leads
```

### Content ROI View (Monthly)

```
PROFILE         | CALLS | QUAL | VISIT | PURCH | REVENUE
-----------     | ----- | ---- | ----- | ----- | -------
Wattsonwheelz   |   850 |  280 |    95 |    72 | Rs.8.4L  ← BEST VOLUME
BCH Main        |   620 |  210 |    85 |    68 | Rs.5.1L
EM Doodle       |   540 |  160 |    55 |    42 | Rs.3.8L
BCH Toyz        |   480 |  120 |    48 |    38 | Rs.2.9L
Raleigh         |   320 |  110 |    40 |    32 | Rs.3.2L
Google          |   280 |  140 |    65 |    55 | Rs.4.1L  ← BEST ROI
2nd Life        |   180 |   45 |    20 |    15 | Rs.1.2L
BCH Lux         |    40 |   15 |     8 |     5 | Rs.1.5L
Next.BLR        |    30 |   10 |     4 |     3 | Rs.0.3L  ← NEEDS WORK
Direct          |   160 |   80 |    45 |    38 | Rs.3.1L
-----------     | ----- | ---- | ----- | ----- | -------
TOTAL           | 3,500 |1,170 |   465 |   368 | Rs.33.6L

CONVERSION FUNNEL:
Calls to Qualified:    33%
Qualified to Visit:    40%
Visit to Purchase:     79%
Overall:               10.5%
```

### Ibrahim's Action Powers

| See A Problem? | Action Ibrahim Takes |
|---------------|---------------------|
| Nithin not contacting leads | Tap "Reassign" → move leads to Abhi |
| Too many missed calls at 12 PM | Schedule both BDC agents for 11 AM-1 PM |
| "Family approval" = #1 lost reason | SOP #8 auto-triggering + train sales team |
| "Not in stock" causing walk-outs | Fix inventory for top-requested models |
| Wattsonwheelz crushing, Next.BLR isn't | Invest more content in Wattsonwheelz |
| Follow-up compliance at 61% | Talk to team, link to incentives |

### Before vs After

| Before | After |
|--------|-------|
| Ibrahim makes decisions without data | Real-time dashboard with every metric |
| Can't see which salesperson ignores leads | Per-person: leads received vs contacted vs converted |
| Doesn't know peak call hours | Hour-by-hour bar chart → staff appropriately |
| Content spend with no per-piece ROI | Profile → Calls → Qualified → Visit → Purchase → Revenue |
| No follow-up accountability | Compliance rate visible: 61% → target 100% |
| "Holds all the ropes" alone | System distributes, escalates, and reports automatically |

**Net result**: Ibrahim goes from flying blind to seeing everything in real-time. Every decision backed by data. Every problem visible before it becomes a crisis.

---

## FLOW 8: AUTOMATION ENGINE (The Machine That Never Sleeps)

### The Problem It Solves
All 24 pain points at some level — automation removes human dependency for repetitive actions.

### The 18 Auto-Actions

| # | Trigger | Action | Timing | Type |
|---|---------|--------|--------|------|
| 1 | Lead created (any source) | Auto-WhatsApp: store location + offers | Immediate | WhatsApp |
| 2 | Lead qualified as Hot/Very Hot | Push notification to assigned salesperson | Immediate | Notification |
| 3 | Lead uncontacted for 2 hours | Reminder to salesperson | 2 hours | Reminder |
| 4 | Lead uncontacted for 4 hours | Escalation to Ibrahim | 4 hours | Escalation |
| 5 | Visit scheduled for tomorrow | Auto-WhatsApp: visit reminder | 6 PM day before | WhatsApp |
| 6 | Visited but didn't buy | Auto-WhatsApp: thanks + questions | 2 hrs after visit | WhatsApp |
| 7 | Visited, didn't buy, Day 3 | Auto-WhatsApp: offers + urgency | Day 3 | WhatsApp |
| 8 | Visited, didn't buy, Day 7 | Final follow-up call reminder | Day 7 | Reminder |
| 9 | Lead purchased | Auto-WhatsApp: thank you + review link | Day 3 | WhatsApp |
| 10 | Lead purchased, Day 7 | Auto-WhatsApp: referral ask | Day 7 | WhatsApp |
| 11 | Lead purchased, Day 30 | Auto-WhatsApp: free service reminder | Day 30 | WhatsApp |
| 12 | Missed call | Add to callback queue + notify BDC | Immediate | Notification |
| 13 | Callback not done in 15 min | Escalation to 2nd BDC agent | 15 minutes | Escalation |
| 14 | Outstation caller (IVR filtered) | Auto-WhatsApp: delivery info | Immediate | WhatsApp |
| 15 | Kids U12 caller (IVR filtered) | Auto-WhatsApp: kids pricing | Immediate | WhatsApp |
| 16 | Lead marked "Family Approval" | Start SOP #8 follow-up sequence | Next day | Sequence |
| 17 | Salesperson follow-up due today | Morning notification: follow-ups list | 10 AM | Notification |
| 18 | Lead inactive for 14 days | Auto-move to LOST | Day 14 | System |

### The Escalation Safety Net

```
LEVEL 1: System handles it automatically
  (WhatsApp, lead creation, scoring, assignment)
     |
     v (if human doesn't act)

LEVEL 2: Reminder to assigned person
  (Push notification at 2 hours / 15 minutes)
     |
     v (if STILL no action)

LEVEL 3: Escalation to manager
  (Ibrahim gets notified at 4 hours)
     |
     v (Ibrahim can)

LEVEL 4: Manager intervention
  - Reassign the lead
  - Call the customer directly
  - Flag the salesperson for performance review
```

### Callback Escalation Chain

```
Missed call detected
     |
     v
Add to callback queue + notify BDC Agent 1
     |
     | (15 minutes pass, no callback made)
     v
Escalate to BDC Agent 2
     |
     | (15 more minutes, still not done)
     v
Alert to Ibrahim: "Callback overdue 30+ minutes"
```

**Net result**: The system never forgets, never sleeps, never takes a day off. 18 actions fire automatically, ensuring every lead gets attention whether humans act or not.

---

## THE COMPLETE JOURNEY: Content to Cash

Here's how ALL 8 flows work together for one lead, end to end:

```
1. CONTENT CREATION
   Keshav posts EMotorad Desire video on Wattsonwheelz Instagram
   Video shows: test ride, Rs.999 EMI, store experience

2. CUSTOMER DISCOVERY
   Ravi Kumar in Hebbal sees the video
   Goes to Wattsonwheelz profile bio
   Clicks unique phone number: 7996994427

3. IVR FLOW (Flow 1)
   CallerDesk picks up → IVR starts
   - Language: Kannada ✓
   - Location: Bangalore ✓  (50-60% filtered here)
   - Age: 12+ ✓              (15-20% more filtered here)
   - Interest: Electric ✓
   → QUALIFIED → Connect to Anushka

4. SOURCE ATTRIBUTION (Flow 2)
   7996994427 = WATTSONWHEELZ
   Lead auto-tagged: Source = "WATTSONWHEELZ"
   Zero human effort for attribution.

5. LEAD QUALIFICATION (Flow 3)
   Anushka sees auto-populated screen
   Talks to Ravi → Taps 8 buttons in 60 seconds:
   Area=Hebbal, Budget=35-50K, Brand=EMotorad, Model=Desire
   Visit=This weekend, EMI=999 offer
   Notes=[Test ride, Comparing competitor]
   Auto-score: HOT | Auto-assign: Suma

6. LEAD DISTRIBUTION (Flow 4)
   Electric interest → Suma (primary)
   Suma is available, under max load
   → Assigned to Suma
   → Push notification: "New HOT lead: Ravi Kumar"
   → 2-hour timer starts

7. AUTOMATION FIRES (Flow 8)
   Immediate: Auto-WhatsApp to Ravi (store location + offers)
   Immediate: Push notification to Suma
   Suma opens app → sees full lead detail

8. FOLLOW-UP (Flow 5)
   Suma calls Ravi from app (auto-logged)
   Outcome: "Coming this weekend"
   System sets: Visit Scheduled for Friday
   Thursday 6 PM: Auto-WhatsApp → "See you tomorrow! Desire ready!"

9. WALK-IN (Flow 6)
   Friday: Ravi enters BCH store
   Sales rep enters phone number → MATCH!
   "RAVI KUMAR from Wattsonwheelz! EMotorad Desire, 35-50K, 999 EMI"
   Suma alerted → Knows everything before Ravi says a word

10. PURCHASE
    Ravi buys EMotorad Desire → Rs.42,999
    Invoice: BCH-2026-0847
    Suma taps: [PURCHASED] → enters invoice number
    Revenue attributed: Wattsonwheelz → Suma → Rs.42,999

11. POST-SALE AUTOMATION (Flow 8)
    Day 3: Auto-WhatsApp → "Please leave a Google review!"
    Day 7: Auto-WhatsApp → "Refer a friend, get Rs.500 off service"
    Day 30: Auto-WhatsApp → "Your free service is due!"

12. MANAGER VISIBILITY (Flow 7)
    Ibrahim's dashboard shows:
    Wattsonwheelz → Ravi Kumar → Suma → Rs.42,999
    One more data point in the content ROI funnel.
```

### Total Effort Breakdown

| Who | What They Did | Time Spent |
|-----|--------------|-----------|
| **System (auto)** | 9 data captures + 5 WhatsApp messages + 3 notifications + scoring + assignment + attribution | 0 human minutes |
| **Anushka (BDC)** | Talked to Ravi + tapped 8 buttons | 3-5 minutes |
| **Suma (Sales)** | 1 phone call + closed the sale in store | 15-20 minutes |
| **Ravi (Customer)** | Called, talked, visited, bought | Happy customer |
| **Ibrahim (Manager)** | Saw it all happen on dashboard | 0 minutes (just visibility) |

---

## PAIN POINT → FLOW MAPPING

### Complete Resolution Matrix

| # | Pain Point | Layer | Primary Flow | Secondary Flow | Status |
|---|-----------|-------|-------------|---------------|--------|
| 1 | No channel attribution | Source | **Flow 2** (8 numbers) | Flow 7 (ROI dashboard) | SOLVED |
| 2 | No profile attribution | Source | **Flow 2** (unique numbers) | Flow 7 (Content ROI tab) | SOLVED |
| 3 | Can't ask customers where they heard | Source | **Flow 2** (number IS attribution) | — | SOLVED |
| 4 | 70-80% calls from kids | Qualification | **Flow 1** (IVR age filter) | Flow 8 (auto-WhatsApp) | SOLVED |
| 5 | 50-60% calls from outstation | Qualification | **Flow 1** (IVR location filter) | Flow 8 (auto-WhatsApp) | SOLVED |
| 6 | No IVR-level filtering | Qualification | **Flow 1** (5-step IVR) | — | SOLVED |
| 7 | Only 1 caller (Anushka) | Qualification | **Flow 1** (filter reduces load) | Hire Agent 2 | SOLVED |
| 8 | Each call takes 8-15 min | Qualification | **Flow 3** (60-sec qualification) | Flow 1 (waste filtered) | SOLVED |
| 9 | Data lives in Excel | Management | **Flow 3** (CRM captures all) | Flow 7 (dashboard) | SOLVED |
| 10 | No lead distribution | Management | **Flow 4** (auto-distribution) | Flow 8 (notifications) | SOLVED |
| 11 | No category-based routing | Management | **Flow 4** (routing table) | — | SOLVED |
| 12 | Content leads not distributed | Management | **Flow 4** (auto-assign) | Flow 2 (source tagged) | SOLVED |
| 13 | No follow-up system | Follow-up | **Flow 5** (full pipeline) | Flow 8 (auto-reminders) | SOLVED |
| 14 | No warm lead callbacks | Follow-up | **Flow 5** (callback queue) | Flow 8 (escalation) | SOLVED |
| 15 | No lead nurturing pipeline | Follow-up | **Flow 5** (WhatsApp sequences) | Flow 8 (18 auto-actions) | SOLVED |
| 16 | No follow-up tracking | Follow-up | **Flow 5** (all actions logged) | Flow 7 (compliance view) | SOLVED |
| 17 | Staff can't type | UX | **Flow 3** (zero typing) | All flows (button-based) | SOLVED |
| 18 | No click-based UI | UX | **Flow 3** (chips/dropdowns) | All modules (PWA) | SOLVED |
| 19 | Calls not auto-recorded | UX | **Flow 1** (CallerDesk auto-log) | Flow 3 (auto-populate) | SOLVED |
| 20 | No missed call tracking | UX | **Flow 1** (callback queue) | Flow 8 (escalation) | SOLVED |
| 21 | No content-to-revenue reporting | Reporting | **Flow 7** (Content ROI tab) | Flow 2 (attribution) | SOLVED |
| 22 | No call volume analytics | Reporting | **Flow 7** (peak hours) | Flow 1 (CallerDesk data) | SOLVED |
| 23 | No lead pipeline dashboard | Reporting | **Flow 7** (pipeline view) | — | SOLVED |
| 24 | No salesperson performance on leads | Reporting | **Flow 7** (team scorecard) | Flow 4 (tracked assigns) | SOLVED |

### Score: 24/24 Pain Points Resolved

---

## REVENUE IMPACT SUMMARY

| Revenue Source | Monthly Estimate | How |
|---------------|-----------------|-----|
| IVR filtering → BDC capacity freed | Rs.0 (enabler) | Allows handling 3x more qualified calls |
| Lead distribution → sales team activated | Rs.15-25L | Matched leads to right salespeople |
| Follow-up recovery → warm leads converted | Rs.5-8L | 30-40% more conversion from follow-up |
| Family approval recovery (SOP #8) | Rs.2-2.6L | 30-40% recovery of Rs.6.5L opportunity |
| Walk-out phone capture → new pipeline | Rs.1-2L | 62% capture × follow-up conversion |
| Content ROI optimization | Rs.3-5L | Invest in what works, cut what doesn't |
| **TOTAL INCREMENTAL** | **Rs.26-42L/month** | Across all flows working together |

### System Cost

| Item | Monthly Cost |
|------|-------------|
| Hosting (shared with EARN CRM) | Rs.10-15K |
| 2nd BDC agent hire | Rs.15-17K |
| CallerDesk (8 numbers) | TBD |
| **Total** | **~Rs.30-35K/month** |

### ROI

**Even the conservative Rs.26L/month additional revenue vs Rs.35K/month cost = 74:1 ROI**

---

> **BCH Law #27**: Follow-up converts 30% more. Not following up is the most expensive thing you can do for free.
>
> This system ensures BCH never leaves that 30% on the table again.

---

*Version 1.0 — February 21, 2026*
*Companion to: LEAD_MANAGEMENT_PRD.md*
