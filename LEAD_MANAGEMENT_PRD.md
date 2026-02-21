# BCH LEAD MANAGEMENT SYSTEM — PRD
## Product Requirements Document
**Version:** 1.0
**Date:** February 21, 2026
**Author:** Ibrahim + Claude (Strategic Partner)
**Dev Team:** Arsalan (Sr Dev/Partner) + 2XG junior developers
**Architecture Base:** 2XG EARN CRM (leadcrm.2xg.in)

---

## TABLE OF CONTENTS

1. Executive Summary
2. Problem Statement
3. System Architecture
4. CallerDesk IVR Script (Redesigned)
5. Phone Number Architecture
6. Lead Lifecycle Pipeline
7. Lead Distribution Engine
8. Module 1: BDC Agent Dashboard
9. Module 2: Sales Rep Mobile App
10. Module 3: Walk-In Module
11. Module 4: Manager Dashboard
12. Module 5: Reporting & Analytics
13. Automation Engine
14. WhatsApp Integration
15. Data Model
16. Tech Stack
17. Development Phases
18. Success Metrics
19. CallerDesk IVR Script (Full Kannada + English)
20. Risk & Mitigation

---

## 1. EXECUTIVE SUMMARY

### What We're Building
A fully custom Lead Management System that replaces TeleCRM, integrates with CallerDesk (IVR), and gives BCH complete visibility from **content to call to qualification to assignment to follow-up to store visit to purchase**.

### Why We're Building It
BCH generates **30-40K calls/month** (15-20K unique) through 8 social media profiles with 500K+ combined followers. Current conversion is near zero because:
- 70-80% of calls are waste (kids under 12, outstation)
- Only 1 BDC agent (Anushka) handles ALL calls
- No lead distribution to the 5-person sales team
- Zero follow-up system (BCH Law #27: follow-up = 30% more conversion)
- Data lives in Excel — no real-time visibility

### What Success Looks Like
- **IVR filters 60-70% of waste calls** before reaching a human
- **Every qualified lead** is auto-assigned to the right salesperson
- **100% follow-up compliance** — no lead dies silently
- **Content ROI visible** — which profile, which video, which money
- **Zero typing required** — staff use buttons and dropdowns only
- **Target: 23% conversion** of unique qualified callers to purchase

### Investment
- **Development:** Rs.50K-1L one-time (2XG team builds on EARN CRM architecture)
- **Hosting:** Rs.10-15K/month (shared infra with EARN CRM)
- **CallerDesk upgrade:** TBD (API access + 8 numbers)
- **2nd BDC agent hire:** Rs.15-17K/month

### Expected Return
- Recovering even 10% more of 15-20K unique monthly leads = 1,500-2,000 additional qualified interactions
- At BCH's 88% in-store conversion rate and Rs.9K avg ticket: **Rs.12-15L/month additional revenue**
- Plus: follow-up recovery (30-40% uplift on warm leads) + "family approval" recovery (Rs.6.5L/month opportunity already identified)

---

## 2. PROBLEM STATEMENT

### 24 Pain Points Across 6 Layers

#### LAYER 1: SOURCE ATTRIBUTION (Don't know WHERE leads come from)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 1 | No channel attribution | Can't tell if caller came from YouTube, Instagram, Google, or referral | Content spend (Rs.5L+/month) with zero ROI measurement |
| 2 | No profile attribution | 8 profiles share 4-5 numbers, all calls look the same | Can't optimize: which profile deserves more content? |
| 3 | Can't ask customers where they heard about us | They don't remember, kids definitely don't | Traditional attribution doesn't work at BCH's scale |

#### LAYER 2: LEAD QUALIFICATION (Waste leads eat your team alive)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 4 | 70-80% calls from kids | Below purchase age, excited by content | Anushka spends 5-6 hours/day on non-buyers |
| 5 | 50-60% calls from outside Bangalore | Can't fully serve them | Even more wasted agent time |
| 6 | No IVR-level filtering | Current CallerDesk = "press 1 for offers" only | Every caller, qualified or not, reaches human |
| 7 | Only 1 caller (Anushka) | Can't handle 30-40K calls/month | Peak hours: calls abandoned = lost revenue |
| 8 | Each call takes 8-15 minutes | Even for waste leads | Max 30 calls/day vs 100+ incoming |

#### LAYER 3: LEAD MANAGEMENT (Qualified leads die silently)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 9 | Data lives in Excel | Not in any real-time application | No dashboards, no alerts, no visibility |
| 10 | No lead distribution | Qualified leads not routed to salespeople | Sales team sits idle while BDC drowns |
| 11 | No category-based routing | Nithin wants kids, Abhi wants 20K+, Sunil wants premium — no routing exists | Sales strength mismatched to leads |
| 12 | Content leads not distributed to floor | Complete disconnect between content funnel and sales funnel | Content generates calls that go nowhere |

#### LAYER 4: FOLLOW-UP & NURTURING (Zero follow-up = 30-40% conversion lost)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 13 | No follow-up system | Once a call ends, lead is forgotten | BCH Law #27: 30-40% conversion left on the table |
| 14 | No warm lead callbacks | Warm leads not called back | People who called YOU are interested — not calling back burns money |
| 15 | No lead nurturing pipeline | No WhatsApp sequences, no drip content, no reminders | Warm leads go cold in 7 days with zero BCH contact |
| 16 | No follow-up tracking | Can't verify if follow-ups happened or what resulted | Can't manage what you can't measure |

#### LAYER 5: DATA CAPTURE & UX (Staff can't use the system)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 17 | Staff can't type | No formal education, text input is unrealistic | Any typing-heavy system = 0% adoption |
| 18 | No click-based UI | Current tools need manual data entry | TeleCRM adoption = 37% actual data completeness |
| 19 | Calls not auto-recorded | No automatic call logging | Manual logging = incomplete = bad data |
| 20 | No missed call tracking | Don't know how many calls went unanswered | Could be 30-50% of all calls vanishing silently |

#### LAYER 6: REPORTING & VISIBILITY (Flying blind)

| # | Pain Point | Current State | Impact |
|---|-----------|---------------|--------|
| 21 | No content-to-revenue reporting | Can't trace: video to calls to visits to purchases | Rs.5L+/month content with no per-piece ROI |
| 22 | No call volume analytics | Don't know peak hours, peak days, busiest numbers | Can't staff appropriately |
| 23 | No lead pipeline dashboard | Can't see leads by stage | Ibrahim makes decisions without data |
| 24 | No salesperson performance on leads | Can't see who converts leads vs ignores them | No accountability, incentives can't link to lead conversion |

---

## 3. SYSTEM ARCHITECTURE

```
                        BCH LEAD MANAGEMENT SYSTEM

  CALLERDESK          WHATSAPP            WALK-IN CAPTURE
  (IVR + API)         BUSINESS API        (Store Phone)
       |                   |                    |
       v                   v                    v
  +---------------------------------------------------------+
  |                    BCH LEAD CRM                          |
  |                                                          |
  |  +--------------------------------------------------+   |
  |  |           LEAD CAPTURE ENGINE                     |   |
  |  |  Auto-create lead from CallerDesk webhook         |   |
  |  |  Auto-tag source (profile phone = profile name)   |   |
  |  |  Auto-tag IVR data (location, age, interest)      |   |
  |  |  Walk-in manual entry (button-based)              |   |
  |  +-------------------------+------------------------+   |
  |                            |                             |
  |                            v                             |
  |  +--------------------------------------------------+   |
  |  |         LEAD DISTRIBUTION ENGINE                  |   |
  |  |  Category-based routing rules                     |   |
  |  |  Auto-assign to salesperson                       |   |
  |  |  Load balancing (if equal category)               |   |
  |  |  Backup assignment if primary unavailable          |   |
  |  +-------------------------+------------------------+   |
  |                            |                             |
  |          +-----------------+-----------------+           |
  |          v                 v                 v           |
  |  +-------------+  +---------------+  +-------------+   |
  |  | BDC AGENT   |  | SALES REP     |  | MANAGER     |   |
  |  | DASHBOARD   |  | MOBILE APP    |  | DASHBOARD   |   |
  |  | (Anushka +  |  | (Nithin,      |  | (Ibrahim)   |   |
  |  |  Agent 2)   |  |  Abhi, Sunil, |  |             |   |
  |  |             |  |  Suma)        |  |             |   |
  |  +-------------+  +---------------+  +-------------+   |
  |                                                          |
  |  +--------------------------------------------------+   |
  |  |           AUTOMATION ENGINE                       |   |
  |  |  Auto-WhatsApp on lead creation                   |   |
  |  |  Follow-up reminders (Day 1, 3, 7)                |   |
  |  |  Escalation on uncontacted leads                  |   |
  |  |  Missed call callback queue                       |   |
  |  +--------------------------------------------------+   |
  |                                                          |
  |  +--------------------------------------------------+   |
  |  |           REPORTING ENGINE                        |   |
  |  |  Content ROI (profile > calls > visits > revenue) |   |
  |  |  Salesperson lead conversion                      |   |
  |  |  Pipeline funnel metrics                          |   |
  |  |  Missed call analytics                            |   |
  |  +--------------------------------------------------+   |
  +---------------------------------------------------------+
```

### Key Integration Points

| System | Integration Type | What Data Flows |
|--------|-----------------|----------------|
| **CallerDesk** | Webhook (API) | Incoming call events: caller number, CallerDesk number (= source), IVR selections (location, age, interest), call duration, answered/missed status |
| **WhatsApp Business API** | API (existing connection via 9019107283) | Outbound: auto-location, offers, follow-up messages. Inbound: customer replies (future) |
| **Zoho Books** | Manual cross-reference (Phase 1), API (Phase 2) | Purchase confirmation: lead to invoice matching by phone number |

---

## 4. CALLERDESK IVR SCRIPT (REDESIGNED)

### Design Principles
1. **Filter 60-70% of calls at IVR level** — no human needed
2. **Capture data passively** — every IVR key press = a data point in CRM
3. **Be helpful, not blocking** — filtered leads still get auto-WhatsApp with useful info
4. **Maximum 45 seconds** from first ring to human agent for qualified leads
5. **Kannada first** — option for English

### Flow Diagram

```
INCOMING CALL
     |
     | <- System auto-tags: which CallerDesk number = which profile
     |
     v
WELCOME (5 seconds — Kannada)
"Bharath Cycle Hub ge call madidakkagi dhanyavadagalu!
 Store timing: beligge 10 inda raathri 9, varada ella dina."
     |
     v
STEP 1: LANGUAGE
"1 press maadi — Kannada
 2 press maadi — English"
     |
     +-- 1 = Kannada flow (below)
     +-- 2 = English flow (same structure, English script)
     |
     v
STEP 2: LOCATION
(Kannada): "Neevu Bangalore nalli iddira?
 1 press maadi — Houdhu, Bangalore (Yes, Bangalore)
 2 press maadi — Illa, bere oorininda (No, other city)"
     |
     +-- 1 (BANGALORE) = Continue to Step 3
     |
     +-- 2 (OUTSIDE BANGALORE) = FILTERED
         |
         v
     AUTO-RESPONSE (Outstation):
     "Dhanyavadagalu! Naavu nimage WhatsApp nalli
      store details, delivery options, mattu offers
      kalustheve. Questions iddare, aa number ge
      call back maadi."
         |
         v
     -> Auto-WhatsApp sent: Location + delivery info + current offers
     -> Lead created in CRM: Status = "Outstation - Auto-WhatsApp"
     -> Call ends (NO human agent)
     |
     v
STEP 3: AGE CHECK (Bangalore callers only)
"Cycle yaarige beku?
 1 press maadi — 12 varsha mattu mele (12 years and above)
 2 press maadi — 12 varsha kelage (Below 12 years)"
     |
     +-- 1 (12+ YEARS) = Continue to Step 4
     |
     +-- 2 (UNDER 12) = FILTERED
         |
         v
     AUTO-RESPONSE (Kids under 12):
     "Kids cycles Rs.1,999 inda start aagthave!
      Naavu nimage WhatsApp nalli full collection
      details kalustheve. Store ge banni —
      Yelahanka New Town, 10 AM to 9 PM!"
         |
         v
     -> Auto-WhatsApp sent: Kids pricing + location + store hours + map
     -> Lead created in CRM: Status = "Kids U12 - Auto-WhatsApp"
     -> Call ends (NO human agent)
     |
     v
STEP 4: INTEREST (Bangalore, 12+, qualified leads)
"Nimage yavudu interest?
 1 — Electric cycle (Rs.17,999 inda)
 2 — Gear cycle (Rs.11,999 inda)
 3 — Kids/teen cycle
 4 — Second hand / exchange
 5 — Service / repair
 6 — Bere vishaya (Other)"
     |
     v (Any selection)

STEP 5: CONNECT TO BDC AGENT
"Nimma call namme team ge connect aagthide.
 Dayavittu hold maadi..."
     |
     +-- Rings BDC Agent 1 (Anushka) for 15 seconds
     |   +-- If answered = Connected
     |
     +-- If busy = Rings BDC Agent 2 for 15 seconds
     |   +-- If answered = Connected
     |
     +-- If BOTH busy = CALLBACK QUEUE
         |
         v
     "Namme team yella busy iddare.
      Naavu nimage 15 minutes olagaga call back maadtheve.
      Dayavittu wait maadi, naavu nimage contact maadtheve!"
         |
         v
     -> Lead created: Status = "Callback Pending"
     -> Callback queue notification to BDC agents
     -> Auto-WhatsApp: "We'll call you back in 15 minutes!"
     -> Call ends
```

### Filtering Impact Estimate

| Call Type | % of Total | IVR Action | Reaches Human? |
|-----------|-----------|------------|---------------|
| Outside Bangalore | 50-60% | Auto-WhatsApp, no agent | NO |
| Kids under 12 (Bangalore) | 15-20% | Auto-WhatsApp, no agent | NO |
| Bangalore, 12+, qualified | 20-35% | Route to BDC agent | YES |

**Result: Only 20-35% of calls reach a human agent.** At 100+ calls/day, that's 20-35 qualified calls — perfectly manageable with 2 BDC agents (Anushka + new hire).

### Auto-Data Capture Per Call (NO human effort)

Every call automatically creates a lead in the CRM with:

| Field | Source | Human Effort |
|-------|--------|-------------|
| Phone number | CallerDesk caller ID | ZERO |
| Source profile | CallerDesk number to profile mapping | ZERO |
| Language preference | IVR Step 1 selection | ZERO |
| Location | IVR Step 2 selection (BLR / Outside) | ZERO |
| Age bracket | IVR Step 3 selection (12+ / Under 12) | ZERO |
| Interest category | IVR Step 4 selection | ZERO |
| Call status | CallerDesk: Answered / Missed / Callback | ZERO |
| Call duration | CallerDesk timestamp | ZERO |
| Call timestamp | CallerDesk | ZERO |
| Auto-WhatsApp sent? | System flag | ZERO |

**9 data points captured with ZERO human input.** BDC agent then adds 4-5 more during the call (name, budget, visit date, specific model, notes via dropdown).

---

## 5. PHONE NUMBER ARCHITECTURE

### 8 Profiles x 8 Unique CallerDesk Numbers

| # | Profile | CallerDesk Number | CRM Source Tag | Bio/Content Display |
|---|---------|------------------|----------------|-------------------|
| 1 | Bharath Cycle Hub (Main) | TBD — assign new | `BCH_MAIN` | All IG/YT bios |
| 2 | Wattsonwheelz | TBD — assign new | `WATTSONWHEELZ` | All IG/YT bios |
| 3 | BCH 2nd Life | TBD — assign new | `BCH_2NDLIFE` | IG bio |
| 4 | BCH Toyz | TBD — assign new | `BCH_TOYZ` | IG bio |
| 5 | BCH Lux | TBD — assign new | `BCH_LUX` | IG bio |
| 6 | EM Doodle BCH | TBD — assign new | `EM_DOODLE` | IG bio |
| 7 | Raleigh x BCH | TBD — assign new | `RALEIGH` | IG/YT bios |
| 8 | Next.BLR | TBD — assign new | `NEXT_BLR` | IG bio |
| 9 | Google Business Profile | 8892031480 (existing) | `GOOGLE` | Google listing |
| 10 | Direct / Referral | Main store number | `DIRECT` | Word of mouth |

### How Attribution Works

```
Customer sees BCH Toyz Instagram video
     |
     v
Clicks phone number in BCH Toyz bio
     |
     v
Calls BCH Toyz CallerDesk number (unique to this profile)
     |
     v
CallerDesk webhook fires -> CRM receives:
  { caller: "9876543210", callerdesk_number: "BCH_TOYZ_NUMBER" }
     |
     v
CRM auto-tags: Source = "BCH_TOYZ"
     |
     v
Lead is tracked from this point: BCH Toyz > call > qualification > visit > purchase
     |
     v
REPORTING: "BCH Toyz generated 45 calls this week > 12 qualified > 8 visited > 7 purchased > Rs.2.8L revenue"
```

**This is the GOLD.** Each profile with a unique number = built-in attribution system. No need to ask customers where they heard about BCH — the phone number tells you.

### Number Migration Plan

| Current Number | Current Assignment | New Assignment | Action |
|----------------|-------------------|----------------|--------|
| 9380097119 (TS01) | BCH Main | BCH Main (keep) | Migrate to new CallerDesk IVR |
| 7996994427 (TS02) | Wattsonwheelz | Wattsonwheelz (keep) | Migrate to new CallerDesk IVR |
| 9019107283 (TS03) | BCH Toyz | BCH Toyz (keep) | Migrate to new CallerDesk IVR |
| 9844187264 (TS04) | Second Hand | BCH 2nd Life | Migrate + rename |
| 9844353759 (TS05) | Unassigned | EM Doodle BCH | New assignment |
| NEW | — | BCH Lux | Get new CallerDesk number |
| NEW | — | Raleigh x BCH | Get new CallerDesk number |
| NEW | — | Next.BLR | Get new CallerDesk number |

**Action items for Ibrahim:**
1. Check CallerDesk pricing for 3 additional numbers
2. Update ALL 8 profile bios with the correct unique number
3. Ensure all 8 numbers route through the same IVR flow

---

## 6. LEAD LIFECYCLE PIPELINE

### 10-Stage Pipeline

```
STAGE 0: IVR FILTERED
  |  Outstation / Kids U12 / Abandoned
  |  -> Auto-WhatsApp sent
  |  -> No human contact
  |  -> Can re-enter pipeline if they call back
  |
  v
STAGE 1: LEAD CREATED
  |  CallerDesk webhook fires
  |  Auto-populated: phone, source, location, age, interest
  |  Status: FRESH
  |
  v
STAGE 2: BDC CONTACTED (First Response)
  |  BDC agent talks to lead
  |  Captures: name, budget, specific model, visit intent
  |  Lead SCORED (Very Hot / Hot / Warm / Cold)
  |  Auto-assigned to salesperson based on category
  |
  v
STAGE 3: QUALIFIED
  |  All prerequisite data captured
  |  Lead assigned to specific salesperson
  |  Salesperson notified (push notification)
  |
  v
STAGE 4: FOLLOW-UP ACTIVE
  |  Salesperson is actively calling/messaging the lead
  |  Follow-up actions logged (via button clicks)
  |  Auto-reminders on follow-up due dates
  |
  v
STAGE 5: VISIT SCHEDULED
  |  Lead confirmed a date to visit the store
  |  Salesperson + BDC both know the date
  |  Day-before reminder sent (auto-WhatsApp)
  |
  v
STAGE 6: VISIT DONE
  |  Customer physically came to the store
  |  Marked by salesperson (button click)
  |  If no purchase -> capture reason (dropdown)
  |
  v
STAGE 7: PURCHASED
  |  Customer bought
  |  Invoice number linked (manual entry or Zoho match)
  |  Revenue attributed to: source profile + salesperson
  |
  v
STAGE 8: POST-SALE
  |  Review request (auto-WhatsApp after 3 days)
  |  Service reminder (auto-WhatsApp after 30 days)
  |  Referral ask (auto-WhatsApp after 7 days)
  |
  v
STAGE 9: LOST
  |  Lead went cold after max follow-up attempts
  |  Reason captured (dropdown):
  |  Too expensive / Not in stock / Family said no /
  |  Competitor / Not interested / Outstation / Other
  |  Moved to "re-engagement" pool (quarterly retarget)
```

### Stage Transition Rules

| From | To | Trigger | Auto/Manual |
|------|----|---------|-------------|
| IVR Filtered to Lead Created | Qualified caller reaches BDC | Auto (CallerDesk API) |
| Lead Created to BDC Contacted | BDC agent picks up call | Auto (call connected event) |
| BDC Contacted to Qualified | BDC fills qualification form | Manual (BDC clicks) |
| Qualified to Follow-up Active | Salesperson makes first contact | Manual (salesperson clicks) |
| Follow-up Active to Visit Scheduled | Lead confirms visit date | Manual (salesperson clicks) |
| Visit Scheduled to Visit Done | Customer shows up at store | Manual (salesperson clicks) |
| Visit Done to Purchased | Invoice generated | Manual (link invoice) |
| Visit Done to Lost | Customer didn't buy + max follow-ups exhausted | Auto (after 3 failed follow-ups post-visit) |
| Any stage to Lost | Lead unresponsive for 14 days | Auto (system moves to Lost) |

---

## 7. LEAD DISTRIBUTION ENGINE

### Category-Based Routing Rules

| Lead Interest (from IVR) | Budget Indicator | Primary Assign | Backup Assign |
|--------------------------|-----------------|----------------|---------------|
| Electric cycle | Any | **Suma** | Sunil |
| Gear cycle | Under Rs.20K | **Nithin** | Abhi Gowda |
| Kids/teen cycle | Any | **Nithin** | Abhi Gowda |
| Adult cycle (non-electric) | Rs.20K-50K | **Abhi Gowda** | Sunil |
| Premium (any type) | Rs.50K+ | **Sunil** | Iqbal |
| Second hand / exchange | Any | **Baba** | Nithin |
| Service / repair | Any | **Ranjitha** then **Mujju** | — |
| Other / unknown | Any | **Round-robin** (Suma > Nithin > Abhi > Sunil) | — |

### Assignment Logic

```
WHEN new qualified lead arrives:
  1. Check INTEREST category from IVR + BDC qualification
  2. Check BUDGET from BDC qualification
  3. Look up routing table -> find PRIMARY salesperson
  4. IF Primary is ON LEAVE or has 10+ uncontacted leads:
     -> Assign to BACKUP
  5. IF Backup is also full:
     -> Round-robin to any available salesperson
  6. NOTIFY assigned salesperson (push notification on app)
  7. START 2-hour timer:
     -> IF no action in 2 hours -> send reminder
     -> IF no action in 4 hours -> escalate to Ibrahim
```

### Load Balancing Rules
- **Max active leads per salesperson:** 30 (prevents overwhelm)
- **Priority queue:** Very Hot > Hot > Warm > Cold
- **Off-day reassignment:** If salesperson is off, leads auto-route to backup
- **Re-assignment:** Ibrahim can manually reassign any lead from Manager Dashboard

### Why This Routing Matters

| Salesperson | Strength | Current Monthly | With Lead Routing Target |
|------------|----------|----------------|--------------------------|
| Suma | E-cycles, Rs.47K avg ticket | Rs.17.88L | Rs.20-22L |
| Sunil | Premium closing, high ticket | Rs.15-27L (historical) | Rs.20-25L |
| Abhi Gowda | Mid-range, growing fast (+82%) | Rs.10L | Rs.14-16L |
| Nithin | Budget/kids segment | Rs.10L (declining) | Rs.12L (with focused leads) |
| Baba | Second hand E2E | Rs.2L | Rs.3-4L |

**Total current: ~Rs.55L. Target with routing: ~Rs.70-80L**

---

## 8. MODULE 1: BDC AGENT DASHBOARD

### Who Uses It
- **Anushka** (current BDC agent)
- **New BDC Agent 2** (to be hired, Rs.15-17K)

### Device
- Store phones (existing Red, Blue, Green mobiles)
- PWA (Progressive Web App) — works in mobile browser, no app store needed

### Screen 1: INCOMING CALL (Auto-populated)

When a call connects, this screen auto-populates from CallerDesk data:

```
+----------------------------------------+
|  INCOMING CALL                         |
|                                        |
|  Number: 9876543210                    |
|  Source: BCH Toyz (IG)                 |
|  Location: Bangalore                   |
|  Age: 12+                              |
|  Interest: Electric cycle              |
|                                        |
|  RETURNING CALLER? Previous lead       |
|   found: "Kumar - Doodle inquiry       |
|   Feb 15, Score: HOT"                  |
|                                        |
|  -----------------------------------   |
|                                        |
|  ACTION:                               |
|  [ QUALIFY THIS LEAD ]                 |
|  [ SPAM / WRONG NUMBER ]              |
+----------------------------------------+
```

**Key feature:** If the caller has called before, the system shows their previous lead record. BDC agent doesn't start from zero.

### Screen 2: LEAD QUALIFICATION (During Call)

**ZERO TYPING. Every field is a button or dropdown.**

```
+----------------------------------------+
|  QUALIFY LEAD                          |
|                                        |
|  NAME: [Voice-to-Text button]          |
|  (OR tap to select: "Didn't share")    |
|                                        |
|  AREA (Bangalore):                     |
|  [Yelahanka] [Hebbal] [RT Nagar]       |
|  [Whitefield] [Electronic City]        |
|  [Rajajinagar] [Jayanagar]             |
|  [Other BLR] [Outskirts 20km+]         |
|                                        |
|  BUDGET:                               |
|  [Under 10K] [10-20K] [20-35K]         |
|  [35-50K] [50K-1L] [1L+]              |
|  [Didn't share]                        |
|                                        |
|  PRODUCT INTEREST:                     |
|  [EMotorad] [Raleigh] [AOKI]           |
|  [Hercules] [Hero Lectro]              |
|  [Kids cycle] [Gear cycle]             |
|  [Second hand] [Don't know yet]        |
|                                        |
|  SPECIFIC MODEL (if mentioned):        |
|  [Desire] [Doodle] [T-Rex] [X1]       |
|  [Raleigh Eco] [Other] [None]         |
|                                        |
|  VISIT INTENT:                         |
|  [Coming today] [Coming tomorrow]      |
|  [This weekend] [Next week]            |
|  [Not sure] [Refused]                  |
|                                        |
|  EMI INTERESTED?                       |
|  [Yes - 999 offer] [Yes - regular EMI] |
|  [No - cash/card] [Didn't discuss]     |
|                                        |
|  CALL NOTES (dropdown):               |
|  [Wants test ride]                     |
|  [Comparing with competitor]            |
|  [Needs family approval]               |
|  [Price concern]                        |
|  [Looking for specific color]           |
|  [Asked about warranty]                 |
|  [Asked about delivery]                 |
|  [Called before, following up]          |
|  [Clear — no issues]                   |
|                                        |
|  -----------------------------------   |
|                                        |
|  AUTO-SCORE: HOT (0.8)                 |
|  AUTO-ASSIGN TO: Suma (E-cycles)       |
|                                        |
|  [ SAVE & ASSIGN ]                     |
|  [ SCHEDULE CALLBACK ]                 |
|  [ MARK AS COLD ]                      |
+----------------------------------------+
```

### Screen 3: LEAD LIST

```
+----------------------------------------+
|  MY LEADS                    Filter    |
|                                        |
|  [All] [Today] [Callback] [Follow-up]  |
|                                        |
|  +----------------------------------+  |
|  | Kumar — EMotorad Desire           |  |
|  | Source: Wattsonwheelz | HOT       |  |
|  | Budget: 35-50K | Visit: Today     |  |
|  | Assigned: Suma | 2 hrs ago        |  |
|  +----------------------------------+  |
|                                        |
|  +----------------------------------+  |
|  | Priya — Kids cycle                |  |
|  | Source: BCH Main | WARM           |  |
|  | Budget: 10-20K | Visit: Weekend   |  |
|  | Assigned: Nithin | 4 hrs ago      |  |
|  +----------------------------------+  |
|                                        |
|  +----------------------------------+  |
|  | CALLBACK — Missed call            |  |
|  | Number: 9988776655                |  |
|  | Source: EM Doodle | 11:23 AM      |  |
|  | [ CALL BACK NOW ]                 |  |
|  +----------------------------------+  |
|                                        |
|  TODAY: 23 calls | 15 qualified |      |
|  8 assigned | 3 callbacks pending      |
+----------------------------------------+
```

### Screen 4: CALLBACK QUEUE

```
+----------------------------------------+
|  CALLBACKS PENDING                     |
|                                        |
|  WARNING: 5 callbacks waiting          |
|                                        |
|  1. 9988776655 — Missed at 11:23 AM   |
|     Source: EM Doodle | Interest: E-cyc|
|     [ CALL ] [ LATER ] [ SKIP ]        |
|                                        |
|  2. 9876543210 — Both busy at 11:45   |
|     Source: BCH Main | Interest: Gear  |
|     [ CALL ] [ LATER ] [ SKIP ]        |
|                                        |
|  3. 9123456789 — Missed at 12:10 PM   |
|     Source: Raleigh | Interest: E-cycle |
|     [ CALL ] [ LATER ] [ SKIP ]        |
|                                        |
|  Oldest callback: 2 hrs 15 min ago     |
|  Target: callback within 15 min        |
+----------------------------------------+
```

---

## 9. MODULE 2: SALES REP MOBILE APP

### Who Uses It
- **Nithin** (kids + budget)
- **Abhi Gowda** (mid-range)
- **Sunil** (premium)
- **Suma** (e-cycles + telecalling lead)
- **Iqbal** (backup for premium)
- **Baba** (second hand)

### Device
- Store phones (existing) — shared access via login
- PWA (works in browser)

### UX Principle: ZERO TYPING

Every interaction is:
- **Button tap** (action buttons)
- **Dropdown selection** (pre-set options)
- **Date picker** (calendar tap)
- **One-tap call** (click to call from app)
- **Voice note** (optional — if they want to record a note, they speak)

**NEVER:** text input, keyboard typing, free-form notes

### Screen 1: MY LEADS (Home Screen)

```
+----------------------------------------+
|  SUNIL                         Menu    |
|  Premium Sales                          |
|                                        |
|  +----------------------------------+  |
|  | 3 URGENT — Action needed NOW     |  |
|  +----------------------------------+  |
|                                        |
|  +----------------------------------+  |
|  | 5 Follow-ups due TODAY           |  |
|  +----------------------------------+  |
|                                        |
|  +----------------------------------+  |
|  | 2 New leads assigned             |  |
|  +----------------------------------+  |
|                                        |
|  --- MY PIPELINE ---                   |
|  New: 4 | Following up: 8 |           |
|  Visit scheduled: 3 | Visited: 2      |
|                                        |
|  --- THIS MONTH ---                    |
|  Leads received: 45                    |
|  Contacted: 38 (84%)                   |
|  Converted: 12 (27%)                   |
|  Revenue from leads: Rs.4.8L           |
+----------------------------------------+
```

### Screen 2: LEAD DETAIL

```
+----------------------------------------+
|  <- Back                               |
|                                        |
|  RAVI KUMAR                       HOT  |
|  Phone: 9876543210                     |
|  Source: Wattsonwheelz                 |
|  First call: Feb 18 (2 days ago)       |
|  Interest: EMotorad Desire             |
|  Budget: 35-50K                        |
|  EMI: Yes, 999 offer                   |
|  Area: Hebbal (8 km from store)        |
|  Note: Wants test ride, comparing      |
|        with Hero Lectro                |
|                                        |
|  --- HISTORY ---                       |
|  Feb 18: BDC call — qualified, HOT     |
|  Feb 19: You called — interested,      |
|          will come this weekend         |
|                                        |
|  --- ACTIONS ---                       |
|                                        |
|  [ CALL NOW ]                          |
|  (One tap > call from app > auto-log)  |
|                                        |
|  [ WHATSAPP ]                          |
|  (Opens WhatsApp with pre-filled msg)  |
|                                        |
|  AFTER CALL — What happened?           |
|  [ Coming today ]                      |
|  [ Coming tomorrow ]                   |
|  [ Coming this weekend ]               |
|  [ Will come next week ]               |
|  [ No answer — try again ]             |
|  [ Needs family approval ]             |
|  [ Price concern ]                     |
|  [ Visited competitor ]                |
|  [ Not interested anymore ]            |
|  [ Wrong number / spam ]               |
|                                        |
|  [ Set follow-up date: ________ ]      |
|                                        |
+----------------------------------------+
```

### Screen 3: WALK-IN CAPTURE (Quick Entry)

```
+----------------------------------------+
|  NEW WALK-IN                           |
|                                        |
|  INTEREST:                             |
|  [Electric] [Gear] [Kids]              |
|  [Second hand] [Service] [Other]       |
|                                        |
|  ASSIGN TO:                            |
|  [Me] [Suma] [Nithin] [Abhi]          |
|  [Sunil] [Iqbal] [Baba]               |
|                                        |
|  [ CAPTURE ]                           |
|                                        |
|  (After walk-in leaves without buying) |
|                                        |
|  [ WALKED OUT — capture reason ]       |
|                                        |
|  WHY DIDN'T THEY BUY?                 |
|  [Too expensive]                       |
|  [Not in stock]                        |
|  [Needs family approval]               |
|  [Just looking / browsing]             |
|  [Will come back later]                |
|  [Went to competitor]                  |
|  [EMI rejected]                        |
|  [Didn't find right size/color]        |
|                                        |
|  PHONE NUMBER: [___________]           |
|  (Optional but push for it)            |
|                                        |
|  [ SAVE ]                              |
+----------------------------------------+
```

### Screen 4: WHEN CUSTOMER VISITS (from a phone lead)

```
+----------------------------------------+
|  CUSTOMER ARRIVED                      |
|                                        |
|  RAVI KUMAR just walked in!            |
|  (Matched by phone number at counter)  |
|                                        |
|  Lead history:                         |
|  - Called from Wattsonwheelz           |
|  - Interested in Desire, 999 EMI       |
|  - Budget 35-50K                       |
|  - Compared with Hero Lectro           |
|  - This is their 1st visit             |
|                                        |
|  Assigned to: SUMA                     |
|                                        |
|  [ MARK AS VISITED ]                   |
|                                        |
|  (After interaction)                   |
|                                        |
|  [ PURCHASED — enter invoice # ]       |
|  [ DIDN'T BUY — capture reason ]       |
|  [ WILL COME BACK — set follow-up ]    |
+----------------------------------------+
```

---

## 10. MODULE 3: WALK-IN MODULE

### Purpose
Track every person who enters the store, whether they called first or not.

### Walk-In Types

| Type | How They Enter System | Data Available |
|------|----------------------|----------------|
| **Phone lead then walk-in** | Auto-matched by phone number when they arrive | Full history from phone call |
| **Fresh walk-in** | Sales rep creates entry via "New Walk-in" button | Minimal — captured at store |
| **Returning customer** | Auto-matched by phone number in system | Full purchase + service history |

### Walk-In Tracking Flow

```
CUSTOMER ENTERS STORE
     |
     +-- Sales rep opens app -> [ NEW WALK-IN ]
     |
     +-- System checks: is this phone number already in system?
     |   +-- YES -> Shows full lead history
     |   |         "This is RAVI KUMAR from Wattsonwheelz call on Feb 18!"
     |   |         -> Assigned salesperson alerted
     |   |
     |   +-- NO -> Fresh walk-in entry
     |         -> Quick capture: Interest category + Assign to salesperson
     |
     +-- INTERACTION HAPPENS ON FLOOR
     |
     +-- OUTCOME:
         +-- [ PURCHASED ] -> link invoice -> lead CLOSED WON
         +-- [ WALKED OUT ] -> capture reason (dropdown) -> enter follow-up pipeline
         +-- [ COMING BACK ] -> set follow-up date -> stays in pipeline
```

### Walk-In Dashboard (end of day)

```
TODAY'S WALK-INS: 45
+-- From phone leads: 12 (27%)
+-- Fresh walk-ins: 28 (62%)
+-- Returning customers: 5 (11%)

PURCHASED: 32 (71% conversion)
WALKED OUT: 13 (29%)
+-- Too expensive: 4
+-- Not in stock: 3
+-- Family approval: 3
+-- Just looking: 2
+-- EMI rejected: 1

PHONE CAPTURED FROM WALK-OUTS: 8/13 (62%)
-> 8 new leads in follow-up pipeline
```

---

## 11. MODULE 4: MANAGER DASHBOARD

### Who Uses It
- **Ibrahim** (primary)
- **Sravan** (Ops — limited view, future)

### Device
- Ibrahim's personal phone (PWA)
- Desktop (optional)

### Dashboard: LIVE VIEW

```
+---------------------------------------------------------------+
|  BCH LEAD DASHBOARD              Today: Feb 21, 2026          |
|                                                                |
|  --- CALLS TODAY ---                                           |
|  Total: 112 | Answered: 34 | IVR Filtered: 71 | Missed: 7    |
|                                                                |
|  By Source:                                                    |
|  Wattsonwheelz: 28 | BCH Main: 22 | EM Doodle: 18 |          |
|  BCH Toyz: 15 | Raleigh: 12 | Google: 9 | 2nd Life: 5 |      |
|  Next.BLR: 2 | BCH Lux: 1                                     |
|                                                                |
|  --- LEADS TODAY ---                                           |
|  Created: 34 | Qualified: 28 | Assigned: 28 | Contacted: 19   |
|                                                                |
|  --- WALK-INS TODAY ---                                        |
|  Total: 45 | From leads: 12 | Fresh: 28 | Returning: 5        |
|  Purchased: 32 | Walk-out: 13 | Conversion: 71%               |
|                                                                |
|  --- REVENUE TODAY ---                                         |
|  Total: Rs.5.2L                                                |
|  From leads: Rs.1.8L (35%)                                     |
|  From walk-ins: Rs.3.4L (65%)                                  |
|                                                                |
|  --- MISSED CALLS ---                                          |
|  7 missed | 4 callback pending | Oldest: 45 min ago           |
|  [View callbacks]                                              |
|                                                                |
|  --- SALESPERSON PERFORMANCE ---                               |
|  Suma: 8 leads | 5 contacted | 2 converted | Rs.1.2L          |
|  Sunil: 6 leads | 4 contacted | 1 converted | Rs.45K          |
|  Abhi:  5 leads | 5 contacted | 1 converted | Rs.22K          |
|  Nithin: 7 leads | 3 contacted | 0 converted | Rs.0           |
|  WARNING: Nithin has 4 uncontacted leads > 4 hours old         |
|                                                                |
|  --- PIPELINE ---                                              |
|  Fresh: 34 | Contacted: 89 | Visit scheduled: 23 |            |
|  Visited: 12 | Purchased: 8 | Lost: 15                        |
|  Pipeline value: Rs.12.4L                                      |
|                                                                |
|  --- FOLLOW-UP COMPLIANCE ---                                  |
|  Due today: 18 | Completed: 11 | Pending: 7                   |
|  Compliance rate: 61% (target: 100%)                           |
|  Overdue (2+ days): 5 leads                                   |
+---------------------------------------------------------------+
```

### Dashboard: CONTENT ROI (Weekly/Monthly)

```
+---------------------------------------------------------------+
|  CONTENT ROI — February 2026                                   |
|                                                                |
|  PROFILE         | CALLS | QUAL | VISIT | PURCH | REVENUE     |
|  --------------- | ----- | ---- | ----- | ----- | ----------- |
|  Wattsonwheelz   | 850   | 280  | 95    | 72    | Rs.8.4L     |
|  BCH Main        | 620   | 210  | 85    | 68    | Rs.5.1L     |
|  EM Doodle       | 540   | 160  | 55    | 42    | Rs.3.8L     |
|  BCH Toyz        | 480   | 120  | 48    | 38    | Rs.2.9L     |
|  Raleigh         | 320   | 110  | 40    | 32    | Rs.3.2L     |
|  Google          | 280   | 140  | 65    | 55    | Rs.4.1L     |
|  2nd Life        | 180   |  45  | 20    | 15    | Rs.1.2L     |
|  BCH Lux         |  40   |  15  |  8    |  5    | Rs.1.5L     |
|  Next.BLR        |  30   |  10  |  4    |  3    | Rs.0.3L     |
|  DIRECT          | 160   |  80  | 45    | 38    | Rs.3.1L     |
|  --------------- | ----- | ---- | ----- | ----- | ----------- |
|  TOTAL           | 3,500 |1,170 | 465   | 368   | Rs.33.6L    |
|                                                                |
|  CONVERSION FUNNEL:                                            |
|  Calls to Qualified: 33%                                       |
|  Qualified to Visit: 40%                                       |
|  Visit to Purchase: 79%                                        |
|  Overall (Call to Purchase): 10.5%                              |
|                                                                |
|  BEST PERFORMING: Wattsonwheelz (Rs.8.4L from 850 calls)      |
|  BEST ROI: Google (55/280 = 20% call-to-purchase conversion)  |
|  NEEDS WORK: Next.BLR (3/30 = 10% but tiny volume)            |
+---------------------------------------------------------------+
```

### Manager Actions

| Action | Where | What Happens |
|--------|-------|-------------|
| **Reassign lead** | Lead detail > "Reassign" button | Move lead from one salesperson to another |
| **View uncontacted leads** | Alert section | See all leads not contacted within 4 hours |
| **Call a lead directly** | Lead detail > "Call" button | Ibrahim calls from his phone, auto-logged |
| **View lost deal reasons** | Reports section | Aggregated reasons + filter by time/salesperson |
| **Export data** | Reports > "Download" | CSV export for analysis |

---

## 12. MODULE 5: REPORTING & ANALYTICS

### Report 1: DAILY PULSE (Auto-generated at 9 PM)

| Metric | Today | Yesterday | This Week | This Month |
|--------|-------|-----------|-----------|------------|
| Total calls | 112 | 98 | 445 | 1,890 |
| IVR filtered | 71 | 64 | 290 | 1,220 |
| Qualified leads | 34 | 28 | 125 | 520 |
| Leads assigned | 34 | 28 | 125 | 520 |
| Leads contacted (by sales) | 28 | 22 | 98 | 410 |
| Walk-ins | 45 | 38 | 195 | 780 |
| Walk-ins from leads | 12 | 8 | 45 | 180 |
| Purchases | 32 | 28 | 145 | 580 |
| Revenue | Rs.5.2L | Rs.4.8L | Rs.22L | Rs.88L |
| Revenue from leads | Rs.1.8L | Rs.1.5L | Rs.7.5L | Rs.30L |
| Missed calls | 7 | 5 | 28 | 110 |
| Follow-up compliance | 61% | 72% | 68% | 65% |

### Report 2: SALESPERSON LEAD SCORECARD (Weekly)

| Salesperson | Leads Received | Contacted | Contact Rate | Visits | Purchased | Conv Rate | Revenue | Avg Ticket | Response Time |
|------------|---------------|-----------|-------------|--------|-----------|-----------|---------|-----------|--------------|
| Suma | 35 | 32 | 91% | 12 | 9 | 26% | Rs.4.5L | Rs.50K | 1.2 hrs |
| Sunil | 28 | 24 | 86% | 10 | 7 | 25% | Rs.5.2L | Rs.74K | 2.1 hrs |
| Abhi | 22 | 20 | 91% | 8 | 6 | 27% | Rs.1.8L | Rs.30K | 0.8 hrs |
| Nithin | 30 | 18 | 60% | 5 | 3 | 10% | Rs.0.9L | Rs.30K | 5.4 hrs |

### Report 3: SOURCE ATTRIBUTION (Monthly)

| Source Profile | Calls | Qualified | Visits | Purchases | Revenue | Cost per Lead | ROI |
|---------------|-------|-----------|--------|-----------|---------|--------------|-----|
| Wattsonwheelz | 850 | 280 | 95 | 72 | Rs.8.4L | Rs.0 (organic) | Infinite |
| Paid Ads (future) | 200 | 80 | 30 | 22 | Rs.2.5L | Rs.50K spend | 5:1 |

### Report 4: LOST DEAL ANALYSIS (Monthly)

| Reason | Count | % | Revenue Lost (est.) | Recovery Action |
|--------|-------|---|--------------------|-----------------|
| Family approval | 18 | 28% | Rs.6.5L | SOP #8 follow-up script |
| Too expensive | 12 | 19% | Rs.4.0L | Offer alternatives, EMI push |
| Not in stock | 8 | 13% | Rs.3.2L | Inventory alert to Ibrahim |
| EMI rejected | 7 | 11% | Rs.2.1L | Pre-qualify on call |
| Competitor | 6 | 9% | Rs.2.4L | Competitive positioning |
| Just looking | 5 | 8% | Rs.1.5L | Follow-up WhatsApp |
| Outstation | 4 | 6% | Rs.1.6L | Delivery options |
| Other | 4 | 6% | Rs.1.2L | Case-by-case |

### Report 5: PEAK HOURS ANALYSIS (Weekly)

```
CALLS BY HOUR (This Week):
10 AM: ============ 45
11 AM: ================ 62
12 PM: ================== 78    <- PEAK
 1 PM: ============ 48
 2 PM: ========== 42
 3 PM: ================ 65
 4 PM: ================== 72    <- PEAK
 5 PM: ============== 55
 6 PM: ============ 48
 7 PM: ========== 38
 8 PM: ====== 25

RECOMMENDATION: 2 BDC agents MUST be available 11 AM-1 PM and 3 PM-5 PM
```

---

## 13. AUTOMATION ENGINE

### Auto-Actions (Zero Human Effort)

| # | Trigger | Action | Timing |
|---|---------|--------|--------|
| 1 | Lead created (any source) | Auto-WhatsApp: store location + current offers | Immediate |
| 2 | Lead qualified as Hot/Very Hot | Push notification to assigned salesperson | Immediate |
| 3 | Lead uncontacted for 2 hours | Reminder to salesperson | 2 hours |
| 4 | Lead uncontacted for 4 hours | Escalation to Ibrahim | 4 hours |
| 5 | Visit scheduled for tomorrow | Auto-WhatsApp to customer: "See you tomorrow! Here's our location..." | 6 PM day before |
| 6 | Lead visited but didn't buy | Auto-WhatsApp: "Thanks for visiting! Any questions?" + salesperson number | 2 hours after visit |
| 7 | Lead visited, didn't buy, Day 3 | Auto-WhatsApp: offers + "We have limited stock" | Day 3 |
| 8 | Lead visited, didn't buy, Day 7 | Final follow-up call reminder to salesperson | Day 7 |
| 9 | Lead purchased | Auto-WhatsApp: "Thank you!" + Google review link | 3 days after |
| 10 | Lead purchased, Day 7 | Auto-WhatsApp: "How's your new ride? Refer a friend, get Rs.500 off service" | 7 days after |
| 11 | Lead purchased, Day 30 | Auto-WhatsApp: "Your first free service is due! Book now." | 30 days after |
| 12 | Missed call | Add to callback queue + notify BDC agent | Immediate |
| 13 | Callback not done in 15 min | Escalation to 2nd BDC agent | 15 minutes |
| 14 | Outstation caller (IVR filtered) | Auto-WhatsApp: delivery info + offers + catalog link | Immediate |
| 15 | Kids U12 caller (IVR filtered) | Auto-WhatsApp: kids pricing + location + store hours | Immediate |
| 16 | Lead marked "Family Approval" | Start SOP #8 follow-up sequence (3 calls over 7 days) | Next day |
| 17 | Salesperson follow-up due today | Morning notification: "You have 5 follow-ups due today" | 10 AM |
| 18 | Lead inactive for 14 days | Auto-move to LOST + reason: "No response" | Day 14 |

### Escalation Chain

```
Lead not contacted in 2 hours
     |
     v
REMINDER to assigned salesperson (push notification)
     |
     | (2 more hours pass — no action)
     v
ESCALATION to Ibrahim (push notification)
     |
     v
Ibrahim can: reassign, call directly, or flag the salesperson
```

---

## 14. WHATSAPP INTEGRATION

### Using Existing Connection
BCH already has WhatsApp Business API connected via 9019107283 (TS03). This can be used for all automated messages.

### Message Templates (Pre-approved)

#### Template 1: WELCOME (On lead creation)
```
Namaskara! Bharath Cycle Hub ge call madidakkagi dhanyavadagalu!

Store: Yelahanka New Town, near Inox Garuda Mall
Timing: 10 AM - 9 PM, all days
Location: [Google Maps link]

Current offers:
- Rs.999/month EMI on electric cycles
- Buy 1 Get 5 free accessories
- Free 1 year AMC worth Rs.2,500
- Free delivery across Karnataka

Questions iddare, call maadi: [store number]
```

#### Template 2: VISIT REMINDER (Day before scheduled visit)
```
Hi [Name]!

Neenu naale Bharath Cycle Hub ge bartheeni antha heldidde.
Naavu ninna kosam [product interest] ready idthu!

Location: [Google Maps link]
We're open 10 AM - 9 PM

See you tomorrow!
```

#### Template 3: POST-VISIT NO PURCHASE (2 hours after visit)
```
Hi [Name]!

Thank you for visiting BCH today!

Yavudadru questions iddare, please [salesperson name] ge call maadi: [number]

Naavu nimma kosag best deal kodoththeve!
```

#### Template 4: POST-PURCHASE REVIEW (3 days after)
```
Hi [Name]!

Nimma hosa [product] enjoy maadtiddira antha hope!

Please namagagi ond Google review bari — it helps other customers find us:
[Google Review link]

1 year free service nimage available ide. Yavaga beku andre call maadi!
```

#### Template 5: OUTSTATION AUTO-RESPONSE (IVR filtered)
```
Namaskara! BCH ge call madidakkagi dhanyavadagalu!

Naavu Bangalore alli iddeve — BUT naavu all-India delivery maadtheve!

Delivery charges:
- Karnataka: FREE
- South India: Rs.1,500-2,500
- Rest of India: Rs.2,500-4,000

250+ pincodes ge deliver maadtheve.

Full catalog: [link]
Serious inquiry? Call back: [main number]
```

#### Template 6: KIDS U12 AUTO-RESPONSE (IVR filtered)
```
Namaskara!

Kids cycles BCH nalli Rs.1,999 inda start!

Age-wise collection:
Below 2 yrs: Rs.1,999 inda
2-4 yrs: Rs.3,499 inda
4-6 yrs: Rs.4,499 inda
6-10 yrs: Rs.7,499 inda

Store ge banni — huge collection ide!
Location: [Google Maps link]
Timing: 10 AM - 9 PM, all days

Parent/elder call madidare, naavu help maadtheve!
```

---

## 15. DATA MODEL

### Core Entities

#### LEAD

| Field | Type | Source | Required |
|-------|------|--------|----------|
| id | UUID | Auto | Yes |
| phone | String | CallerDesk / Manual | Yes |
| name | String | BDC agent (dropdown/voice) | No (initially) |
| source_profile | Enum | CallerDesk number mapping | Yes |
| source_medium | Enum (Call/Walk-in/WhatsApp) | System | Yes |
| language | Enum (Kannada/English) | IVR Step 1 | Yes |
| location | Enum (Bangalore/Outstation) | IVR Step 2 | Yes |
| location_area | Enum (Yelahanka/Hebbal/...) | BDC agent | No |
| age_bracket | Enum (12+/Under12) | IVR Step 3 | Yes |
| interest_category | Enum (Electric/Gear/Kids/2ndHand/Service/Other) | IVR Step 4 | Yes |
| brand_interest | Enum (EMotorad/Raleigh/AOKI/...) | BDC agent | No |
| model_interest | Enum (Desire/Doodle/T-Rex/...) | BDC agent | No |
| budget | Enum (Under10K/10-20K/20-35K/35-50K/50K-1L/1L+) | BDC agent | No |
| emi_interest | Enum (999/Regular/No/Unknown) | BDC agent | No |
| visit_intent | Enum (Today/Tomorrow/Weekend/NextWeek/Unsure/Refused) | BDC agent | No |
| lead_score | Enum (VeryHot/Hot/Warm/Cold) | Auto-calculated | Yes |
| stage | Enum (see pipeline) | System | Yes |
| assigned_to | FK to Staff | Distribution engine | Yes |
| call_notes | Array of Enum | BDC agent (dropdown select) | No |
| created_at | DateTime | System | Yes |
| updated_at | DateTime | System | Yes |
| lost_reason | Enum | Salesperson (dropdown) | No |
| invoice_number | String | Manual entry | No |
| purchase_amount | Number | Manual entry | No |

#### CALL_LOG

| Field | Type | Source |
|-------|------|--------|
| id | UUID | Auto |
| lead_id | FK to Lead | System |
| direction | Enum (Inbound/Outbound) | CallerDesk / App |
| caller_number | String | CallerDesk |
| callerdesk_number | String | CallerDesk |
| duration_seconds | Number | CallerDesk |
| status | Enum (Answered/Missed/Abandoned/Callback) | CallerDesk |
| ivr_selections | JSON | CallerDesk |
| agent_id | FK to Staff | System |
| timestamp | DateTime | System |

#### FOLLOW_UP

| Field | Type | Source |
|-------|------|--------|
| id | UUID | Auto |
| lead_id | FK to Lead | System |
| assigned_to | FK to Staff | System |
| due_date | Date | Salesperson / Auto |
| status | Enum (Pending/Completed/Overdue/Skipped) | System |
| outcome | Enum (same as "After Call" buttons) | Salesperson |
| created_at | DateTime | System |
| completed_at | DateTime | System |

#### WALK_IN

| Field | Type | Source |
|-------|------|--------|
| id | UUID | Auto |
| lead_id | FK to Lead (if matched) | System |
| is_from_lead | Boolean | System |
| interest | Enum | Salesperson |
| assigned_to | FK to Staff | Salesperson |
| outcome | Enum (Purchased/WalkedOut/ComingBack) | Salesperson |
| walkout_reason | Enum | Salesperson |
| phone_captured | Boolean | System |
| timestamp | DateTime | System |

#### STAFF

| Field | Type |
|-------|------|
| id | UUID |
| name | String |
| role | Enum (BDC/Sales/Ops/Mechanic/Manager) |
| phone | String |
| assigned_categories | Array of Enum |
| max_active_leads | Number (default 30) |
| is_active | Boolean |
| is_on_leave | Boolean |

#### WHATSAPP_MESSAGE

| Field | Type |
|-------|------|
| id | UUID |
| lead_id | FK to Lead |
| template_name | String |
| sent_at | DateTime |
| delivered | Boolean |
| read | Boolean |

---

## 16. TECH STACK

### Based on 2XG EARN CRM Architecture

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Frontend** | React (PWA) | Mobile-first, works in browser on store phones, no app store approval needed. Same as EARN CRM. |
| **Backend** | Node.js + Express | Same as EARN CRM. Team (Arsalan + jr devs) already know this stack. |
| **Database** | PostgreSQL | Relational data (leads, staff, follow-ups). Better than MongoDB for reporting queries. |
| **Hosting** | Same infra as EARN CRM | Shared hosting reduces cost. |
| **CallerDesk Integration** | Webhook receiver + API calls | CallerDesk pushes call events via webhook. CRM calls CallerDesk API for outbound actions. |
| **WhatsApp** | Existing Business API (9019107283) | Already connected. Use for all automated messages. |
| **Auth** | Phone-based OTP login | No passwords. Staff log in with phone number + OTP. Simple. |
| **Notifications** | Browser push notifications (PWA) | Free. Works on Android Chrome. No FCM setup needed. |
| **Real-time** | WebSocket (Socket.io) | Live dashboard updates. Incoming call alerts. |

### Infrastructure

```
          2XG SERVER INFRA

  +---------------+  +----------------+
  | EARN CRM      |  | BCH LEAD CRM   |
  | (existing)    |  | (new)          |
  | leadcrm.2xg.in|  | leads.bch.in   |
  +---------------+  +----------------+

  +-----------------------------------+
  | Shared PostgreSQL                 |
  | Shared Node.js runtime            |
  | Shared Nginx reverse proxy        |
  +-----------------------------------+
```

---

## 17. DEVELOPMENT PHASES

### Phase 1: FOUNDATION (Week 1-2)
**Goal:** CallerDesk integration + basic lead capture + lead list

| Task | Owner | Days |
|------|-------|------|
| Set up project (repo, DB, hosting) | Arsalan | 1 |
| CallerDesk webhook integration (receive call events) | Arsalan | 2 |
| Lead auto-creation from CallerDesk data | Arsalan | 1 |
| Phone number to source profile mapping | Jr Dev | 1 |
| Basic lead list page (view all leads) | Jr Dev | 2 |
| CallerDesk IVR script update (new flow) | Ibrahim (CallerDesk admin) | 1 |
| **Testing + fixes** | Team | 2 |

**Deliverable:** Every call automatically creates a lead in the CRM with source, location, age, interest. BDC agents can see the lead list.

---

### Phase 2: BDC DASHBOARD (Week 3-4)
**Goal:** BDC agents can qualify leads + auto-assignment

| Task | Owner | Days |
|------|-------|------|
| Incoming call screen (auto-populated from CallerDesk) | Jr Dev | 2 |
| Lead qualification form (all dropdowns, zero typing) | Jr Dev | 3 |
| Lead scoring algorithm (auto-calculate Very Hot/Hot/Warm/Cold) | Arsalan | 1 |
| Lead distribution engine (category-based routing rules) | Arsalan | 2 |
| Push notifications (new lead assigned to salesperson) | Arsalan | 1 |
| Callback queue management | Jr Dev | 2 |
| **Testing + fixes** | Team | 2 |

**Deliverable:** Anushka qualifies leads with button clicks, leads auto-assign to the right salesperson, salespeople get notified.

---

### Phase 3: SALES REP APP (Week 5-6)
**Goal:** Salespeople can see their leads, call from app, log outcomes

| Task | Owner | Days |
|------|-------|------|
| "My Leads" home screen | Jr Dev | 2 |
| Lead detail screen with call-from-app | Jr Dev | 2 |
| Outcome logging (button-based, post-call) | Jr Dev | 2 |
| Follow-up scheduling (date picker) | Jr Dev | 1 |
| Follow-up reminders (push notifications) | Arsalan | 1 |
| One-tap WhatsApp (pre-filled message) | Jr Dev | 1 |
| **Testing + fixes** | Team | 2 |

**Deliverable:** Nithin, Abhi, Sunil, Suma can see their assigned leads, call customers from the app, and log what happened with button clicks.

---

### Phase 4: WALK-IN + MANAGER DASHBOARD (Week 7-8)
**Goal:** Full store tracking + Ibrahim's visibility

| Task | Owner | Days |
|------|-------|------|
| Walk-in capture module (quick entry) | Jr Dev | 2 |
| Walk-out reason capture | Jr Dev | 1 |
| Phone number matching (walk-in to existing lead) | Arsalan | 2 |
| Manager dashboard — live metrics | Jr Dev | 3 |
| Manager dashboard — pipeline view | Jr Dev | 2 |
| Manager — reassign/escalation actions | Arsalan | 1 |
| **Testing + fixes** | Team | 2 |

**Deliverable:** Every walk-in tracked, Ibrahim sees everything in real-time.

---

### Phase 5: AUTOMATION + REPORTING (Week 9-10)
**Goal:** System runs itself + deep analytics

| Task | Owner | Days |
|------|-------|------|
| WhatsApp auto-messages (6 templates) | Arsalan | 3 |
| Automation engine (18 auto-actions) | Arsalan | 3 |
| Content ROI report (source to revenue) | Jr Dev | 2 |
| Salesperson lead scorecard | Jr Dev | 2 |
| Lost deal analysis report | Jr Dev | 1 |
| Peak hours analysis | Jr Dev | 1 |
| Daily pulse auto-report (WhatsApp to Ibrahim at 9 PM) | Arsalan | 1 |
| **Testing + fixes** | Team | 2 |

**Deliverable:** Full automation running, reports generated, Ibrahim gets daily WhatsApp summary.

---

### Phase 6: POLISH + INCENTIVE INTEGRATION (Week 11-12)
**Goal:** Link to incentives + refinements

| Task | Owner | Days |
|------|-------|------|
| Incentive integration (lead conversion to incentive calculation) | Arsalan | 3 |
| Zoho cross-reference (purchase verification by phone number) | Arsalan | 2 |
| UX refinements based on staff feedback | Jr Dev | 3 |
| Performance optimization | Arsalan | 2 |
| Staff training (in-store, hands-on) | Ibrahim + Arsalan | 1 |
| **Go live + monitoring** | Team | 2 |

**Deliverable:** Full system live, linked to incentives, staff trained.

---

### Timeline Summary

| Phase | Weeks | Key Deliverable |
|-------|-------|----------------|
| Phase 1: Foundation | Week 1-2 | CallerDesk integration, auto lead creation |
| Phase 2: BDC Dashboard | Week 3-4 | BDC qualification, auto-assignment |
| Phase 3: Sales Rep App | Week 5-6 | Salespeople managing leads |
| Phase 4: Walk-in + Manager | Week 7-8 | Full tracking, Ibrahim dashboard |
| Phase 5: Automation + Reports | Week 9-10 | Auto-WhatsApp, analytics |
| Phase 6: Polish + Incentives | Week 11-12 | Incentive link, go live |

**Total: 12 weeks (3 months) from start to full system.**

**Quick wins available in Phase 1 (2 weeks):** Just redesigning the CallerDesk IVR will filter 60-70% of waste calls immediately. This costs nothing and can be done TODAY independently of the CRM development.

---

## 18. SUCCESS METRICS

### Primary KPIs (Measure monthly)

| KPI | Current | Month 1 | Month 3 | Month 6 |
|-----|---------|---------|---------|---------|
| Qualified calls reaching agent (% of total) | 100% (no filter) | 30-35% | 30-35% | 30-35% |
| Lead contact rate (salesperson calls lead within 4 hrs) | ~0% | 50% | 80% | 95% |
| Follow-up compliance (due follow-ups completed) | ~0% | 40% | 75% | 95% |
| Missed call rate | Unknown (est. 30%+) | 15% | 5% | <3% |
| Lead to visit conversion | Unknown (est. 5%) | 10% | 20% | 30% |
| Lead to purchase conversion | Unknown (est. 2%) | 5% | 12% | 20% |
| Revenue attributed to leads | Rs.0 (not tracked) | Rs.5L | Rs.15L | Rs.25L |
| Content ROI visibility | 0 profiles tracked | 8 profiles tracked | Full funnel visible | Per-video attribution |

### Secondary KPIs

| KPI | Target |
|-----|--------|
| Average BDC agent response time | < 3 rings (10 seconds) |
| Average salesperson first contact time | < 2 hours |
| Walk-out phone capture rate | > 60% |
| Lost deal reason capture rate | > 80% |
| Auto-WhatsApp delivery rate | > 95% |
| Staff app adoption rate | 100% (daily active use) |
| Callback completion rate | > 90% within 15 minutes |

### Revenue Impact Projection

| Scenario | Assumptions | Monthly Revenue from Leads |
|----------|------------|--------------------------|
| **Conservative** | 10% of qualified leads convert, Rs.15K avg ticket | Rs.8-10L/month |
| **Moderate** | 15% of qualified leads convert, Rs.20K avg ticket | Rs.15-20L/month |
| **Optimistic** | 20% of qualified leads convert, Rs.25K avg ticket | Rs.25-30L/month |

**Even the conservative scenario (Rs.8-10L/month) more than covers the entire system cost** (Rs.10-15K/month hosting + Rs.17K/month 2nd BDC agent = Rs.30K/month).

---

## 19. CALLERDESK IVR SCRIPT (FULL KANNADA + ENGLISH)

### KANNADA SCRIPT

#### Welcome
> "Bharath Cycle Hub ge call madidakkagi dhanyavadagalu! Namme store beligge 10 inda raathri 9 varegu, varada ella dina open."

#### Step 1: Language
> "Kannada ge 1 press maadi. For English, press 2."

#### Step 2: Location (Kannada)
> "Neevu Bangalore nalli iddira? Bangalore aadre 1 press maadi. Bere oorininda call madthiddare 2 press maadi."

**If 2 (Outside):**
> "Dhanyavadagalu! Naavu nimage WhatsApp nalli namme store details mattu delivery information kalustheve. Nimage serious interest iddare, ee number ge call back maadi. Dhanyavadagalu!"

#### Step 3: Age (Kannada)
> "Cycle yaarige beku? 12 varsha mattu mele aadre 1 press maadi. 12 varsha kelage aadre 2 press maadi."

**If 2 (Under 12):**
> "Nanngalalli kids cycles Rs.1,999 inda start aagthave! Nimage WhatsApp nalli full collection details kalustheve. Store ge barobalaga best collection nodbahudu! Dhanyavadagalu!"

#### Step 4: Interest (Kannada)
> "Nimage yavudu interest ide? Electric cycle ge 1 press maadi — Rs.17,999 inda start. Gear cycle ge 2 press maadi — Rs.11,999 inda start. Kids cycle ge 3 press maadi. Second hand cycle ge 4 press maadi. Service mattu repair ge 5 press maadi. Bere vishaya ge 6 press maadi."

#### Step 5: Connect (Kannada)
> "Dhanyavadagalu! Nimma call namme team ge connect aagthide. Dayavittu hold maadi."

**If busy:**
> "Namme team yella busy iddare. Naavu nimage 15 minutes olagaga call back maadtheve. Dayavittu wait maadi!"

---

### ENGLISH SCRIPT

#### Welcome
> "Thank you for calling Bharath Cycle Hub! We're open 10 AM to 9 PM, every day of the week."

#### Step 2: Location (English)
> "Are you calling from Bangalore? Press 1 for Bangalore. Press 2 if you're calling from outside Bangalore."

**If 2 (Outside):**
> "Thank you for your interest! We'll send you our store details and delivery options on WhatsApp. For a serious inquiry, please call us back on this number. Thank you!"

#### Step 3: Age (English)
> "Who is the cycle for? Press 1 if the rider is 12 years or above. Press 2 if the rider is below 12 years."

**If 2 (Under 12):**
> "We have kids cycles starting from just Rs.1,999! We'll send you the full collection details on WhatsApp. Visit our store for the best selection! Thank you!"

#### Step 4: Interest (English)
> "What are you interested in? Press 1 for Electric cycles — starting Rs.17,999. Press 2 for Gear cycles — starting Rs.11,999. Press 3 for Kids and teen cycles. Press 4 for Second hand or exchange. Press 5 for Service and repair. Press 6 for anything else."

#### Step 5: Connect (English)
> "Thank you! We're connecting you to our team now. Please hold."

**If busy:**
> "Our team is currently busy. We'll call you back within 15 minutes. Thank you for your patience!"

---

## 20. RISK & MITIGATION

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|------------|-----------|
| 1 | **CallerDesk API limitations** — API may not support all data fields needed | Can't auto-create leads with full IVR data | Medium | Test API in Week 1. If limited, use CallerDesk webhooks for basic data + supplement with BDC agent input. |
| 2 | **Staff don't use the app** — same as TeleCRM 37% adoption issue | System exists but data is incomplete | High | Zero-typing UI, daily accountability, incentive linked to CRM compliance. BCH Law #4: visibility + reward = adoption. |
| 3 | **Arsalan bandwidth** — 2XG team has multiple priorities | Development delayed | High | Clear sprint planning. Phase 1 (IVR redesign) requires zero dev work — do it immediately. Parallel: Arsalan builds CRM while IVR is already filtering. |
| 4 | **WhatsApp template rejection** — WhatsApp may reject some message templates | Auto-messages don't get sent | Low | Submit templates for approval in Week 1. Use simple, non-promotional language. Adjust until approved. |
| 5 | **CallerDesk cost for 8 numbers** — may be expensive | Attribution system compromised | Medium | Start with 5 numbers (existing). Add 3 new numbers as budget allows. Even 5 numbers = partial attribution. |
| 6 | **Staff phone quality** — existing store phones may be slow for PWA | App unusable on actual devices | Medium | Test PWA on exact phones in Week 1. Optimize for low-end Android. Keep app extremely lightweight. |
| 7 | **Ibrahim as bottleneck for IVR content** — IVR script needs Kannada recording | IVR update delayed | Low | Record IVR audio in one session (30 minutes). Ibrahim reads the script. Done. |
| 8 | **Integration with Zoho** — matching leads to invoices by phone number may have mismatches | Revenue attribution inaccurate | Medium | Phase 1: manual matching. Phase 2: API integration. Accept 80% accuracy initially. |

---

## CONNECTED DOCUMENTS

| Document | Connection |
|----------|-----------|
| LEAD_QUALIFICATION.md | Current lead scoring framework — absorbed into this PRD's scoring logic |
| SOP_BDC.md | Current BDC processes — this system replaces TeleCRM referenced in that SOP |
| CONTENT_PROFILES.md | 8 profiles x 8 numbers = attribution architecture |
| INCENTIVE_STRUCTURE.md | Salesperson incentives tie to lead conversion metrics from this system |
| SALES_RECOVERY_90DAY.md | Move 6 (Conversion Optimization) = this system |
| FINANCIALS.md | Revenue attribution data feeds into financial analysis |
| FOUNDER_DIAGNOSIS.md | Root Cause #1 (holds all ropes) — this system distributes lead management to the team |
| DAILY_OPS_LOG.md | Issue #45 (Lead Management Pipeline Broken) — this PRD is the solution |

---

## BCH LAW #27

> **Follow-up converts 30% more. Not following up is the most expensive thing you can do for free.**
>
> BCH generates demand through content but lets leads die because nobody calls them back. The lead already called YOU — they're interested. Not following up on a warm lead is burning the money you spent creating the content that made them call.

---

## IMMEDIATE NEXT STEPS (This Week)

| # | Action | Owner | Effort | Impact |
|---|--------|-------|--------|--------|
| 1 | **Update CallerDesk IVR script** — record the new Kannada/English flow | Ibrahim | 1 hour (recording) + CallerDesk setup | Filters 60-70% waste calls IMMEDIATELY |
| 2 | **Assign 8 unique numbers** — check CallerDesk for 3 additional numbers | Ibrahim | 30 min (check pricing) | Enables attribution |
| 3 | **Hire 2nd BDC agent** — post job, Kannada + basic English, Rs.15-17K | Anushka + Ibrahim | 1 week | Handles qualified call volume |
| 4 | **Brief Arsalan on PRD** — share this document, align on Phase 1 sprint | Ibrahim | 1 hour meeting | Dev starts |
| 5 | **Update all 8 profile bios** — each profile gets its unique phone number | Keshav | 30 min | Attribution starts working |

---

*Version 1.0 — February 21, 2026*
*Next review: February 28, 2026 (Phase 1 kickoff)*
