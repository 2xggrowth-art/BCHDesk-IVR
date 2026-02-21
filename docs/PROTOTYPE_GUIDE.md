# BCH LEAD MANAGEMENT SYSTEM — PROTOTYPE USAGE GUIDE
## How to Use the Prototype & How It Solves Every Problem
**Version:** 1.0
**Date:** February 21, 2026
**For:** Ibrahim, Arsalan, 2XG Team

---

## HOW TO OPEN THE PROTOTYPE

### Step 1: Open the File
```
Navigate to: prototype/index.html
Right-click → Open with → Google Chrome (or any browser)
```

### Step 2: You'll See the Home Screen
The home page shows:
- **Live stats bar** — Calls, Qualified, Walk-ins, Revenue (today)
- **Login As** — 4 role cards (BDC Agent, Sales Rep, Manager, Walk-in)
- **All Modules** — 7 module links to explore

### Step 3: Click Any Role or Module to Explore
Everything is interlinked. You can navigate freely between all pages using back buttons and module links.

---

## THE 10 FILES IN THE PROTOTYPE

```
prototype/
├── index.html        ← START HERE (home page)
├── styles.css        ← Shared styling (don't open directly)
├── data.js           ← Dummy data (don't open directly)
├── ivr.html          ← IVR Flow visualization
├── bdc.html          ← BDC Agent Dashboard (Anushka)
├── sales.html        ← Sales Rep App (Suma)
├── walkin.html        ← Walk-in Module (store entry)
├── manager.html       ← Manager Dashboard (Ibrahim)
├── reports.html       ← Reports & Analytics
└── automation.html    ← Automation Engine (18 rules)
```

---

## MODULE-BY-MODULE WALKTHROUGH

---

## MODULE 1: IVR FLOW (ivr.html)

### How to Use It
1. Open `index.html` → Click **"IVR Flow"** in All Modules
2. You'll see 3 tabs: **Flow View** | **Scripts** | **Impact**

### Tab 1: Flow View — Interactive IVR Walkthrough
This is a **clickable demo** of the CallerDesk IVR that customers will hear when they call.

**Try this:**
1. You'll see "INCOMING CALL" at the top
2. Click **"Kannada"** in Step 1 → the path lights up
3. Click **"Bangalore"** in Step 2 → continues to Step 3
4. Now click **"Outside BLR"** instead → see the RED filter path appear
   - "FILTERED — Auto-WhatsApp sent, call ends"
   - This customer never reaches a human. Saved Anushka 8-15 minutes.
5. Click **Reset** and try again
6. Click **"Under 12"** in Step 3 → another RED filter
   - Kids get auto-WhatsApp with pricing. No human needed.
7. Click **"12+"** → continues to Step 4 (Interest)
8. Click **"Electric"** → connects to BDC agent (GREEN path)

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| 70-80% waste calls reach Anushka | Click "Outside BLR" or "Under 12" → call ends automatically, never reaches human |
| Anushka handles 100% of calls | Only the GREEN path (Bangalore + 12+ + interested) reaches a human |
| No data captured from filtered calls | Even RED paths show "Lead created + Auto-WhatsApp sent" |
| Kids/outstation get nothing | They get helpful WhatsApp with pricing, delivery info, store location |

### Tab 2: Scripts — Full IVR Text
- Toggle between **Kannada** and **English**
- These are the exact words CallerDesk will play to callers
- Ibrahim can use this to record the IVR audio

### Tab 3: Impact — Filtering Numbers
- Shows: Outside BLR = 55%, Kids U12 = 17%, Qualified = 28%
- Bar chart of call distribution
- **"Only 20-35% reach a human agent"** — this is the key result
- Auto data capture table: 9 fields captured with ZERO human effort

---

## MODULE 2: BDC DASHBOARD (bdc.html)

### How to Use It
1. Open `index.html` → Click **"BDC Agent"** or **"BDC Agent Dashboard"**
2. You're now Anushka. You'll see 4 tabs: **Incoming** | **Qualify** | **Leads** | **Callbacks**

### Tab 1: Incoming — What Anushka Sees When a Call Connects

**What's on screen:**
- Big phone number: **9876543210**
- Source: **BCH Toyz (IG)** — system already knows which profile they called from
- Location: **Bangalore** | Age: **12+** | Interest: **Electric cycle**
- **RETURNING CALLER** banner: "Kumar - Doodle inquiry Feb 15, Score: HOT"

**Try this:**
1. See how 6 fields are already filled — Anushka typed NOTHING
2. Click **"QUALIFY THIS LEAD"** → switches to the qualification form
3. Click **"SPAM / WRONG NUMBER"** → shows toast "Marked as spam"

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| No data captured automatically | 6 fields auto-filled from CallerDesk before Anushka says a word |
| Can't tell if customer called before | "RETURNING CALLER" banner shows previous history |
| Each call takes 8-15 min of manual entry | Auto-populated screen = Anushka starts qualifying immediately |

### Tab 2: Qualify — Zero-Typing Qualification Form

**This is the most important screen in the entire system.**

Every field is a **button tap** — no keyboard, no typing, no free-text.

**Try this:**
1. Tap any **Area** chip (e.g., "Hebbal") → it turns blue
2. Tap a **Budget** chip (e.g., "35-50K") → blue
3. Tap a **Brand** (e.g., "EMotorad") → blue
4. Tap a **Model** (e.g., "Desire") → blue
5. Tap **Visit Intent** (e.g., "This weekend") → blue
6. Tap **EMI** (e.g., "Yes - 999 offer") → blue
7. Tap multiple **Call Notes** (e.g., "Wants test ride" + "Comparing competitor") → both turn blue
8. See the **Auto-Score** update: "HOT (0.8)"
9. See the **Auto-Assign**: "Suma (E-cycles)"
10. Click **"SAVE & ASSIGN"** → toast: "Lead saved and assigned to Suma!"

**Total taps: 8. Total typing: ZERO. Total time: 30-60 seconds.**

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Staff can't type (no formal education) | Every single field is a button — try it, zero keyboard needed |
| TeleCRM had 37% data completeness | Chip-based form = near 100% completion (just tap, don't type) |
| 8-15 min per lead for data entry | 30-60 seconds of tapping chips |
| No lead scoring | Auto-calculated: Very Hot / Hot / Warm / Cold based on selections |
| No auto-assignment to salesperson | System auto-assigns based on interest category |

### Tab 3: Leads — All Leads List

**Try this:**
1. See lead cards with color-coded left borders (red = Very Hot, orange = Hot, yellow = Warm)
2. Each card shows: Name, Interest, Source tag, Budget tag, Visit intent, Assigned to, Time
3. Click filter chips: **All** | **Today** | **Callback** | **Follow-up**
4. Notice "TODAY: 23 calls | 15 qualified | 8 assigned | 3 callbacks" stats bar

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Data lives in Excel | All leads visible in real-time list, not a spreadsheet |
| No way to see today's work | Filter by "Today" → see exactly what happened today |
| Can't prioritize leads | Color-coded scores: Very Hot (red) gets attention first |

### Tab 4: Callbacks — Missed Call Queue

**Try this:**
1. See the red alert: "WARNING: 5 callbacks waiting"
2. Each callback shows: phone number, source, interest, missed time
3. Click **"CALL"** on any callback → toast: "Calling..." + card fades
4. Click **"LATER"** → snoozes it
5. Click **"SKIP"** → escalates to 2nd agent
6. Watch the callback badge count decrease as you handle them

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Missed calls vanish silently | Every missed call appears in this queue with 15-min SLA |
| Don't know how many calls went unanswered | Badge shows exact count: "5 callbacks waiting" |
| No callback priority | Sorted by time — oldest first, with "Oldest: 2 hrs 15 min ago" warning |

---

## MODULE 3: SALES REP APP (sales.html)

### How to Use It
1. Open `index.html` → Click **"Sales Rep"** or **"Sales Rep App"**
2. You're now **Suma** (Electric Cycles specialist). 4 tabs: **My Leads** | **Lead Detail** | **Walk-in** | **Visit**

### Tab 1: My Leads — Suma's Personal Lead Queue

**What's on screen:**
- 3 alert cards at top:
  - Red: **"3 URGENT — Action needed NOW"**
  - Orange: **"5 Follow-ups due TODAY"**
  - Blue: **"2 New leads assigned"**
- Pipeline strip: New: 4 | Following up: 8 | Visit scheduled: 3 | Visited: 2
- Monthly stats: Leads 45, Contacted 38 (84%), Converted 12 (27%), Revenue Rs.4.8L
- Lead cards (only Suma's leads, filtered automatically)

**Try this:**
1. See ONLY Suma's leads (not Nithin's, not Abhi's — role-based filtering)
2. Click any lead card → switches to Lead Detail tab with that lead's data

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| No lead distribution to sales team | Suma sees ONLY her assigned leads — automatically routed to her |
| Sales team sits idle while BDC drowns | Each rep has their own queue with urgent items highlighted |
| No accountability | Pipeline strip shows exactly: how many leads, how many contacted, conversion rate |
| Ibrahim can't see who's working | Monthly stats: 84% contact rate, 27% conversion — all visible |

### Tab 2: Lead Detail — Everything About One Lead

**Click on "Ravi Kumar" lead card to see this:**

- Full info: Phone, Source (Wattsonwheelz), Area (Hebbal), Budget (35-50K), EMI (999 offer)
- Interest: EMotorad Desire
- Notes: "Wants test ride, Comparing with competitor"
- Timeline: every interaction logged chronologically

**Action buttons (the core UX):**
1. **[CALL NOW]** — big blue button with ringing animation. One tap = call from app = auto-logged
2. **[WHATSAPP]** — green button. Opens WhatsApp with pre-filled message
3. **"AFTER CALL — What happened?"** — 10 outcome chips:
   - Coming today / Coming tomorrow / This weekend / Next week
   - No answer / Family approval / Price concern / Competitor / Not interested / Wrong number

**Try this:**
1. Click **[CALL NOW]** → simulates a call
2. Click **"Coming this weekend"** chip → turns blue
3. Set a follow-up date using the date picker
4. Click **"LOG THIS CALL"** → toast: "Call logged!"

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| No follow-up system | After every call, salesperson MUST tap an outcome — system tracks it |
| Zero follow-up tracking | Every action logged with timestamp in the timeline |
| Can't verify if follow-ups happened | Outcome chips = proof of what happened on each call |
| Staff can't type notes | 10 pre-set outcomes as buttons — zero typing needed |
| No connection between call and visit | "Coming this weekend" → system auto-schedules follow-up + reminder |

### Tab 3: Walk-in Quick Entry

**For when a customer walks into the store:**
1. Tap interest: **[Electric]** [Gear] [Kids] etc.
2. Tap assign to: **[Me]** [Nithin] [Abhi] etc.
3. Click **[CAPTURE]**
4. If they leave without buying → tap **[WALKED OUT]** → select reason
5. Enter phone number (the ONLY text input in the entire system)

### Tab 4: Customer Visit (When a Phone Lead Walks In)

**This is the magic moment:**
- Blue alert: **"RAVI KUMAR just walked in!"**
- "Matched by phone number at counter"
- Full history: Called from Wattsonwheelz, Interested in Desire, Budget 35-50K, Wants 999 EMI
- Assigned to: SUMA

**Suma knows EVERYTHING about Ravi before he says a single word.**

**Try this:**
1. Click **[MARK AS VISITED]** → confirmation banner
2. Choose outcome:
   - **[PURCHASED]** → enter invoice number
   - **[DIDN'T BUY]** → capture reason (chips)
   - **[WILL COME BACK]** → set follow-up date

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| No connection between "called" and "walked in" | Phone number matching links the entire journey |
| Salesperson knows nothing about the customer | Full lead history displayed instantly on walk-in |
| Walk-out reasons unknown | Dropdown capture: know exactly WHY they didn't buy |
| Walk-out = lost forever | Phone capture → enters follow-up pipeline |

---

## MODULE 4: WALK-IN MODULE (walkin.html)

### How to Use It
1. Open `index.html` → Click **"Walk-in"** or **"Walk-In Module"**
2. 3 tabs: **New Entry** | **Today's List** | **Summary**

### Tab 1: New Entry — Capture Every Store Visitor

**Try this:**
1. Enter phone number: **9876543210** in the input field
2. Click **[CHECK]**
3. See the green alert: **"MATCH FOUND! Ravi Kumar from Wattsonwheelz call on Feb 18"**
   - Interest and assignment auto-selected!
4. Now try: Enter **9999999999** → "Fresh walk-in — no prior record"
5. Select interest chip + assign to chip
6. Click **[CAPTURE WALK-IN]**
7. After interaction, select outcome: **Purchased** / **Walked Out** / **Coming Back**
   - If "Walked Out" → walkout reason chips appear
   - If "Purchased" → invoice number field appears
   - If "Coming Back" → date picker appears

### Tab 2: Today's List — All Walk-Ins Today

- Stats bar: Total: 45 | From Leads: 12 | Fresh: 28 | Returning: 5
- Filter chips: All, From Leads, Fresh, Purchased, Walked Out
- Walk-in cards with color coding:
  - Green border = Purchased
  - Red border = Walked Out
  - Blue pulse = Still in store
  - Purple "From Lead" badge if matched to existing lead

### Tab 3: Summary — End of Day Dashboard

- Big stat cards: 45 walk-ins, 27% from leads, 71% conversion
- Purchased: 32 (green) vs Walked Out: 13 (red)
- Walk-out reason bar chart: Too expensive (4), Not in stock (3), Family approval (3)...
- Phone capture rate: 62% with progress bar
- "8 new leads added to follow-up pipeline"

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Walk-ins are invisible | Every visitor logged with outcome |
| Can't tell if content generates store visits | "From Leads: 12 (27%)" — content is working! |
| "Not in stock" lost silently | Walk-out reasons bar chart shows inventory problems |
| Walk-out = lost forever | 62% phone capture rate → follow-up pipeline |

---

## MODULE 5: MANAGER DASHBOARD (manager.html)

### How to Use It
1. Open `index.html` → Click **"Manager"** or **"Manager Dashboard"**
2. You're now **Ibrahim**. 4 tabs: **Live** | **Content ROI** | **Pipeline** | **Team**

### Tab 1: Live — Real-Time Everything

**This is Ibrahim's command center.** Everything happening at BCH right now, on one screen.

**Scroll down and see:**
1. **CALLS TODAY** — 112 total | 34 answered | 71 IVR filtered | 7 missed
2. **BY SOURCE** — bar chart showing which profiles are getting calls
   - Wattsonwheelz: 28 calls (longest bar)
   - BCH Lux: 1 call (shortest bar)
3. **MISSED CALLS** — red alert: "7 missed | 4 callback pending | Oldest: 45 min ago"
4. **LEADS TODAY** — Created: 34 | Qualified: 28 | Assigned: 28 | Contacted: 19
5. **WALK-INS TODAY** — Total: 45 | Purchased: 32 | Conversion: 71%
6. **REVENUE TODAY** — Rs.5.2L total with split: From leads Rs.1.8L (35%) vs Walk-ins Rs.3.4L (65%)
7. **SALESPERSON PERFORMANCE** — cards for each rep:
   - Suma: 8 leads | 5 contacted | 2 converted | Rs.1.2L
   - **Nithin: WARNING — 4 uncontacted leads > 4 hours old** (yellow alert)
8. **FOLLOW-UP COMPLIANCE** — Due: 18 | Completed: 11 | Pending: 7 | 61% rate

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Ibrahim makes decisions without data | EVERYTHING is on one screen — calls, leads, walk-ins, revenue |
| Can't see who's working | Per-salesperson cards: leads, contacted, converted, revenue |
| Nithin ignoring leads? | Yellow warning: "4 uncontacted leads > 4 hours old" |
| Don't know peak call hours | By Source bar chart shows which profiles are active |
| No follow-up accountability | 61% compliance rate visible — target is 100% |
| "Holds all the ropes" alone | System auto-distributes, auto-escalates, auto-reports |

### Tab 2: Content ROI — Which Profile Makes Money

**This is the GOLD. First time ever at BCH.**

Full table:
```
Profile         | Calls | Qualified | Visits | Purchases | Revenue
Wattsonwheelz   |   850 |       280 |     95 |        72 | Rs.8.4L  ← BEST
BCH Main        |   620 |       210 |     85 |        68 | Rs.5.1L
Google          |   280 |       140 |     65 |        55 | Rs.4.1L  ← BEST ROI
Next.BLR        |    30 |        10 |      4 |         3 | Rs.0.3L  ← NEEDS WORK
```

Plus conversion funnel: Calls→Qualified 33%, Qualified→Visit 40%, Visit→Purchase 79%, Overall 10.5%

### What This Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Rs.5L/month content with zero ROI measurement | Full funnel: Profile → Calls → Qualified → Visit → Purchase → Revenue |
| Can't tell which profile deserves more content | Wattsonwheelz = Rs.8.4L vs Next.BLR = Rs.30K — data speaks |
| Traditional attribution doesn't work | Phone number IS the attribution — no asking needed |

### Tab 3: Pipeline — Lead Stages Visualization

- Visual pipeline with colored dots for each stage
- Counts: Fresh: 34 | Contacted: 89 | Visit scheduled: 23 | Purchased: 368 | Lost: 156
- Pipeline value: Rs.12.4L

### Tab 4: Team — Salesperson Scorecard

Full table with color-coded performance:
- Green cells: contact rate > 80%, response time < 2 hrs
- Red cells: Nithin at 60% contact rate, 5.4 hour response time
- Underperformer alerts with specific issues
- Manager action buttons: [Reassign Lead] [View Uncontacted] [Export Data]

---

## MODULE 6: REPORTS & ANALYTICS (reports.html)

### How to Use It
1. Open `index.html` → Click **"Reports & Analytics"**
2. 5 tabs: **Daily Pulse** | **Scorecard** | **Sources** | **Lost Deals** | **Peak Hours**

### Tab 1: Daily Pulse — Auto-Generated at 9 PM

**Scroll the table horizontally** to see: Metric | Today | Yesterday | This Week | This Month

12 metrics tracked:
- Total calls, IVR filtered, Qualified leads, Leads assigned
- Leads contacted, Walk-ins, Walk-ins from leads, Purchases
- Revenue, Revenue from leads, Missed calls, Follow-up compliance

**Trend arrows**: Green up = good, Red up = bad (e.g., missed calls rising = red even though it's "up")

### Tab 2: Scorecard — Salesperson Weekly Performance

Color-coded table:
- **Green row** = top performer (Abhi: 91% contact, 27% conversion)
- **Red row** = needs attention (Nithin: 60% contact, 10% conversion, 5.4 hr response)
- "TOP" badge on best revenue
- "LOW" badge on worst contact rate

### Tab 3: Sources — Where the Money Comes From

Full source table with ROI column (all organic = Infinite ROI)
- Best performing source highlighted in green

### Tab 4: Lost Deals — Why Customers Don't Buy

**This is where recovery revenue lives.**

| Reason | Count | % | Revenue Lost | Recovery Action |
|--------|-------|---|-------------|-----------------|
| Family approval | 18 | 28% | Rs.6.5L | SOP #8 follow-up sequence |
| Too expensive | 12 | 19% | Rs.4.0L | EMI 999 push + alternatives |
| Not in stock | 8 | 13% | Rs.3.2L | Inventory alert to Ibrahim |

Color-coded bar chart showing proportions. Total lost revenue: Rs.22.5L

### Tab 5: Peak Hours — When to Staff Up

Bar chart showing calls per hour:
- **RED bars**: 12 PM (78 calls) and 4 PM (72 calls) = PEAK
- **ORANGE bars**: High volume hours
- **Blue bars**: Normal hours
- Recommendation card: **"2 BDC agents MUST be available 11 AM-1 PM and 3 PM-5 PM"**

### What Reports Solve

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| Flying blind on everything | 5 report types covering every aspect |
| No content-to-revenue reporting | Sources tab: profile → calls → visits → revenue |
| No salesperson accountability | Scorecard: contact rate, conversion, response time per person |
| Don't know WHY customers don't buy | Lost Deals: top 8 reasons with recovery actions |
| Can't staff appropriately | Peak Hours: exact hours when you need both BDC agents |

---

## MODULE 7: AUTOMATION ENGINE (automation.html)

### How to Use It
1. Open `index.html` → Click **"Automation Engine"**
2. 4 tabs: **Rules** | **Escalation** | **WhatsApp** | **Activity**

### Tab 1: Rules — 18 Auto-Actions

**Summary strip at top**: 18 Rules | 18 Active | 0 Paused

**Try this:**
1. Use filter chips: **All** | **WhatsApp** | **Notifications** | **Escalation** | etc.
2. Click "WhatsApp" → see only the 8 WhatsApp auto-actions
3. Click the **toggle switch** on any rule → toast: "Rule paused" + card dims
4. Toggle it back → "Rule activated"
5. Watch the summary strip update: "17 Active | 1 Paused"

**Each rule card shows:**
- Color-coded left border (green = WhatsApp, blue = notification, red = escalation)
- Trigger: what causes this action
- Action: what the system does
- Timing: when it fires
- Toggle: on/off control

### Tab 2: Escalation — The Safety Net

**Two visual chains:**

**Chain 1: Lead Response**
```
Lead not contacted in 2 hours
     ↓
REMINDER to salesperson (push notification)
     ↓ (2 more hours, no action)
ESCALATION to Ibrahim
     ↓
Ibrahim can: reassign / call directly / flag salesperson
```

**Chain 2: Callback**
```
Missed call detected
     ↓
Callback queue + notify BDC Agent 1
     ↓ (15 minutes, no callback)
Escalate to BDC Agent 2
```

### Tab 3: WhatsApp Templates — Actual Messages

6 message templates in **WhatsApp bubble style** (dark green headers, chat background):

1. **Welcome** — Store location + offers (Kannada text)
2. **Visit Reminder** — "See you tomorrow!"
3. **Post-Visit** — "Thanks for visiting! Any questions?"
4. **Post-Purchase** — "Leave us a Google review!"
5. **Outstation** — Delivery info + pricing
6. **Kids U12** — Age-wise pricing + store location

### Tab 4: Activity Log — What the System Did Today

Live feed showing recent automation actions:
- "12:45 PM — Auto-WhatsApp sent to 9876543210 (Welcome template)"
- "12:40 PM — Escalation: Nithin has 4 uncontacted leads > 4 hrs"
- "12:30 PM — Lead L010 auto-created from EM Doodle call"
- "10:00 AM — Morning notification: Suma has 5 follow-ups today"

### What Automation Solves

| BCH Problem | What You See in Prototype |
|------------|--------------------------|
| No follow-up system | 18 rules fire automatically — reminders, WhatsApp, escalations |
| Leads forgotten after call | Rules 1-8: auto-WhatsApp + reminders from Day 0 to Day 30 |
| Missed calls vanish | Rule 12-13: instant callback queue + 15-min escalation |
| No post-purchase engagement | Rules 9-11: review request + referral ask + service reminder |
| Ibrahim must chase everyone | Rules 3-4: auto-reminders at 2 hrs, auto-escalation at 4 hrs |
| Family approval leads die | Rule 16: SOP #8 auto-triggers 3-call sequence over 7 days |

---

## THE COMPLETE DEMO WALKTHROUGH

### For presenting to Ibrahim / Arsalan / the team:

**Follow this 10-minute path through the prototype:**

### Minute 1-2: The Problem (Start at index.html)
> "BCH gets 30-40K calls/month. Only 20-35% are real buyers. Anushka handles everything. No follow-up. No data. Let me show you how this system fixes that."

### Minute 2-3: IVR Filtering (ivr.html → Flow View)
> Click through: Kannada → Outside BLR → FILTERED (red path)
> "See? This caller never reaches Anushka. Gets auto-WhatsApp with delivery info. Lead still created."
> Click through: Kannada → Bangalore → Under 12 → FILTERED
> "Kids get pricing on WhatsApp. No human time wasted."
> Click through: Kannada → Bangalore → 12+ → Electric → CONNECTED (green path)
> "Only THIS caller reaches Anushka. 60-70% waste eliminated."

### Minute 3-4: BDC Qualification (bdc.html → Incoming + Qualify)
> "When Anushka picks up, she already sees everything — source, location, age, interest."
> Switch to Qualify tab → tap chips: Hebbal, 35-50K, EMotorad, Desire, Weekend, 999 EMI
> "8 taps. Zero typing. Lead scored as HOT. Auto-assigned to Suma."

### Minute 4-5: Sales Rep View (sales.html → My Leads + Detail)
> "Now Suma opens her app. She sees ONLY her leads."
> Click Ravi Kumar → show full detail
> "She knows everything: budget, model, EMI interest, even that he's comparing with Hero Lectro."
> Click CALL NOW → show outcome chips
> "After the call, she taps 'Coming this weekend'. System schedules follow-up automatically."

### Minute 5-6: Walk-In Magic (walkin.html or sales.html → Visit tab)
> "Friday. Ravi walks in. Sales rep enters phone number."
> Type 9876543210 → CHECK → MATCH FOUND!
> "The system tells Suma: this is Ravi Kumar, he wants Desire, budget 35-50K, 999 EMI."
> "Suma knows everything before Ravi says a word. This is how 88% in-store conversion happens."

### Minute 6-7: Manager Dashboard (manager.html → Live)
> "Ibrahim opens his dashboard. Real-time. Everything."
> Scroll through: calls, sources, leads, walk-ins, revenue
> Point to Nithin's warning: "4 uncontacted leads > 4 hours"
> "Ibrahim sees the problem instantly. Can reassign those leads right now."

### Minute 7-8: Content ROI (manager.html → Content ROI)
> "For the FIRST TIME, Ibrahim can see which profile makes money."
> Point to table: "Wattsonwheelz = Rs.8.4L. Next.BLR = Rs.30K. Now he knows where to invest."

### Minute 8-9: Reports (reports.html → Lost Deals + Peak Hours)
> "28% of lost deals = family approval = Rs.6.5L/month. The system auto-triggers a recovery sequence."
> Switch to Peak Hours: "12 PM and 4 PM are peak. Both agents MUST be available."

### Minute 9-10: Automation (automation.html → Rules)
> "18 rules that run automatically. Zero human effort."
> Toggle one rule off/on to show control
> "WhatsApp messages, reminders, escalations — the system never forgets, never sleeps."
> Show WhatsApp tab: "These are the actual messages customers receive."

### Close:
> "From content to call to qualification to assignment to follow-up to store visit to purchase — every step tracked, every lead managed, every rupee attributed. No more Excel. No more guessing. No more leads dying silently."

---

## WHAT EACH ROLE SHOULD DEMO

| Who | Pages to Show | Key Message |
|-----|--------------|-------------|
| **Ibrahim** | manager.html → reports.html | "You see everything. Content ROI. Team performance. Revenue attribution. Real-time." |
| **Anushka (BDC)** | bdc.html | "Zero typing. 8 taps to qualify. Callbacks tracked. Returning callers recognized." |
| **Suma (Sales)** | sales.html | "Your leads, your pipeline, your stats. One-tap call. One-tap outcome. Follow-up automated." |
| **Arsalan (Dev)** | All pages + data.js | "React PWA. Node.js backend. PostgreSQL. Same stack as EARN CRM. 12-week build." |

---

## HOW THE PROTOTYPE MAPS TO DEVELOPMENT

| Prototype Page | Development Phase | Weeks |
|---------------|------------------|-------|
| IVR Flow (ivr.html) | Phase 1: Foundation | Week 1-2 |
| BDC Dashboard (bdc.html) | Phase 2: BDC Dashboard | Week 3-4 |
| Sales Rep App (sales.html) | Phase 3: Sales Rep App | Week 5-6 |
| Walk-in Module (walkin.html) | Phase 4: Walk-in + Manager | Week 7-8 |
| Manager Dashboard (manager.html) | Phase 4: Walk-in + Manager | Week 7-8 |
| Reports (reports.html) | Phase 5: Automation + Reports | Week 9-10 |
| Automation (automation.html) | Phase 5: Automation + Reports | Week 9-10 |

**What you see in the prototype = what will be built. Same screens. Same buttons. Same data flow.**

---

## QUICK REFERENCE: PROBLEM → PROTOTYPE PAGE

| Problem | Where to See the Solution |
|---------|--------------------------|
| 70-80% waste calls | ivr.html → Flow View (click filter paths) |
| Staff can't type | bdc.html → Qualify tab (all chips, zero typing) |
| No lead distribution | sales.html → My Leads (filtered by salesperson) |
| Zero follow-up | sales.html → Lead Detail (outcome chips + follow-up dates) |
| No content ROI | manager.html → Content ROI tab (full funnel table) |
| Ibrahim flies blind | manager.html → Live tab (everything real-time) |
| Missed calls vanish | bdc.html → Callbacks tab (queue with SLA) |
| Walk-outs lost forever | walkin.html → New Entry (phone capture + reason) |
| No salesperson accountability | reports.html → Scorecard tab (color-coded performance) |
| Don't know WHY they don't buy | reports.html → Lost Deals tab (8 reasons + recovery actions) |
| Don't know peak hours | reports.html → Peak Hours tab (bar chart + recommendation) |
| No automation | automation.html → Rules tab (18 auto-actions with toggles) |
| "Family approval" = Rs.6.5L lost | automation.html → Rules tab (Rule #16: SOP #8 sequence) |
| No post-purchase engagement | automation.html → WhatsApp tab (review + referral + service templates) |

---

## NOTES FOR ARSALAN (DEVELOPER)

### What's in the Prototype vs What Needs Backend

| Prototype Has | Backend Needs |
|--------------|--------------|
| Static dummy data in data.js | PostgreSQL database with real data model |
| Tab switching via JS | React Router or equivalent |
| Chip selection stored in-memory | API calls to save lead qualification |
| Simulated call/WhatsApp buttons | CallerDesk API + WhatsApp Business API integration |
| Hardcoded lead cards | Dynamic rendering from database queries |
| Toggle switches for automation | Cron jobs / event-driven automation engine |
| Simulated phone matching | Database lookup by phone number |
| Static bar charts | Chart.js or similar with real-time data |

### What Stays the Same

| From Prototype | In Production |
|---------------|--------------|
| Mobile-first 430px layout | Same — PWA on store phones |
| Chip-based zero-typing UX | Same — this IS the design |
| Color-coded score badges | Same |
| Tab-based navigation per module | Same |
| Bottom nav per role | Same |
| Lead card layout | Same |
| Stat grids and bar charts | Same (with real data) |

**The prototype IS the design spec. Build exactly what you see.**

---

*Version 1.0 — February 21, 2026*
*Open prototype/index.html to start exploring*
