// BCH Lead Management System - Shared Dummy Data
// All data based on PRD specifications

const BCH = {
  // ===== STAFF =====
  staff: {
    bdc: [
      { id: 'anushka', name: 'Anushka', role: 'BDC', phone: '9876500001', active: true, onLeave: false },
      { id: 'agent2', name: 'Meera', role: 'BDC', phone: '9876500002', active: true, onLeave: false }
    ],
    sales: [
      { id: 'suma', name: 'Suma', role: 'Sales', phone: '9876500010', categories: ['Electric'], avgTicket: 47000, monthlyTarget: 2200000 },
      { id: 'sunil', name: 'Sunil', role: 'Sales', phone: '9876500011', categories: ['Premium', 'Adult 20K+'], avgTicket: 74000, monthlyTarget: 2500000 },
      { id: 'abhi', name: 'Abhi Gowda', role: 'Sales', phone: '9876500012', categories: ['Adult 20-50K'], avgTicket: 30000, monthlyTarget: 1600000 },
      { id: 'nithin', name: 'Nithin', role: 'Sales', phone: '9876500013', categories: ['Kids', 'Budget'], avgTicket: 30000, monthlyTarget: 1200000 },
      { id: 'baba', name: 'Baba', role: 'Sales', phone: '9876500014', categories: ['SecondHand'], avgTicket: 15000, monthlyTarget: 400000 },
      { id: 'iqbal', name: 'Iqbal', role: 'Sales', phone: '9876500015', categories: ['Premium'], avgTicket: 65000, monthlyTarget: 1500000 }
    ],
    service: [
      { id: 'ranjitha', name: 'Ranjitha', role: 'Service', phone: '9876500020' },
      { id: 'mujju', name: 'Mujju', role: 'Service', phone: '9876500021' }
    ],
    manager: [
      { id: 'ibrahim', name: 'Ibrahim', role: 'Manager', phone: '9876500000' }
    ]
  },

  // ===== SOURCE PROFILES =====
  profiles: [
    { id: 'BCH_MAIN', name: 'Bharath Cycle Hub', shortName: 'BCH Main', number: '9380097119', platform: 'IG/YT' },
    { id: 'WATTSONWHEELZ', name: 'Wattsonwheelz', shortName: 'Wattsonwheelz', number: '7996994427', platform: 'IG/YT' },
    { id: 'BCH_2NDLIFE', name: 'BCH 2nd Life', shortName: '2nd Life', number: '9844187264', platform: 'IG' },
    { id: 'BCH_TOYZ', name: 'BCH Toyz', shortName: 'BCH Toyz', number: '9019107283', platform: 'IG' },
    { id: 'BCH_LUX', name: 'BCH Lux', shortName: 'BCH Lux', number: 'NEW-001', platform: 'IG' },
    { id: 'EM_DOODLE', name: 'EM Doodle BCH', shortName: 'EM Doodle', number: '9844353759', platform: 'IG' },
    { id: 'RALEIGH', name: 'Raleigh x BCH', shortName: 'Raleigh', number: 'NEW-002', platform: 'IG/YT' },
    { id: 'NEXT_BLR', name: 'Next.BLR', shortName: 'Next.BLR', number: 'NEW-003', platform: 'IG' },
    { id: 'GOOGLE', name: 'Google Business', shortName: 'Google', number: '8892031480', platform: 'Google' },
    { id: 'DIRECT', name: 'Direct / Referral', shortName: 'Direct', number: '-', platform: 'WOM' }
  ],

  // ===== ENUMS =====
  interests: ['Electric', 'Gear', 'Kids/Teen', 'Second Hand', 'Service', 'Other'],
  budgets: ['Under 10K', '10-20K', '20-35K', '35-50K', '50K-1L', '1L+', 'Not shared'],
  brands: ['EMotorad', 'Raleigh', 'AOKI', 'Hercules', 'Hero Lectro', 'Giant', 'Other'],
  models: ['Desire', 'Doodle', 'T-Rex', 'X1', 'X2', 'X3', 'Raleigh Eco', 'Other', 'None'],
  visitIntents: ['Coming today', 'Coming tomorrow', 'This weekend', 'Next week', 'Not sure', 'Refused'],
  emiOptions: ['Yes - 999 offer', 'Yes - regular EMI', 'No - cash/card', "Didn't discuss"],
  callNotes: ['Wants test ride', 'Comparing with competitor', 'Needs family approval', 'Price concern', 'Looking for specific color', 'Asked about warranty', 'Asked about delivery', 'Called before, following up', 'Clear - no issues'],
  areas: ['Yelahanka', 'Hebbal', 'RT Nagar', 'Whitefield', 'Electronic City', 'Rajajinagar', 'Jayanagar', 'Bannerghatta', 'Marathahalli', 'Other BLR', 'Outskirts 20km+'],
  lostReasons: ['Too expensive', 'Not in stock', 'Family said no', 'Competitor', 'Not interested', 'EMI rejected', 'Wrong size/color', 'Other'],
  walkoutReasons: ['Too expensive', 'Not in stock', 'Needs family approval', 'Just looking', 'Will come back', 'Went to competitor', 'EMI rejected', "Didn't find right size/color"],
  stages: ['IVR Filtered', 'Lead Created', 'BDC Contacted', 'Qualified', 'Follow-up Active', 'Visit Scheduled', 'Visit Done', 'Purchased', 'Post-Sale', 'Lost'],
  scores: ['Very Hot', 'Hot', 'Warm', 'Cold'],

  // ===== SAMPLE LEADS =====
  leads: [
    {
      id: 'L001', phone: '9876543210', name: 'Ravi Kumar', source: 'WATTSONWHEELZ', language: 'Kannada',
      location: 'Bangalore', area: 'Hebbal', ageBracket: '12+', interest: 'Electric',
      brand: 'EMotorad', model: 'Desire', budget: '35-50K', emi: 'Yes - 999 offer',
      visitIntent: 'This weekend', score: 'Hot', stage: 'Follow-up Active',
      assignedTo: 'suma', callNotes: ['Wants test ride', 'Comparing with competitor'],
      createdAt: '2026-02-18 10:23', lastContact: '2026-02-19 14:15', followUpDate: '2026-02-21'
    },
    {
      id: 'L002', phone: '9988776655', name: 'Priya Sharma', source: 'BCH_MAIN', language: 'English',
      location: 'Bangalore', area: 'Yelahanka', ageBracket: '12+', interest: 'Kids/Teen',
      brand: 'Hercules', model: 'None', budget: '10-20K', emi: "Didn't discuss",
      visitIntent: 'This weekend', score: 'Warm', stage: 'Qualified',
      assignedTo: 'nithin', callNotes: ['Clear - no issues'],
      createdAt: '2026-02-20 11:45', lastContact: '2026-02-20 11:45', followUpDate: '2026-02-22'
    },
    {
      id: 'L003', phone: '9123456789', name: 'Mohammed Aslam', source: 'RALEIGH', language: 'Kannada',
      location: 'Bangalore', area: 'RT Nagar', ageBracket: '12+', interest: 'Electric',
      brand: 'Raleigh', model: 'Raleigh Eco', budget: '50K-1L', emi: 'No - cash/card',
      visitIntent: 'Coming tomorrow', score: 'Very Hot', stage: 'Visit Scheduled',
      assignedTo: 'suma', callNotes: ['Asked about warranty'],
      createdAt: '2026-02-19 09:30', lastContact: '2026-02-20 16:00', followUpDate: '2026-02-21'
    },
    {
      id: 'L004', phone: '9871234567', name: 'Deepak R', source: 'EM_DOODLE', language: 'Kannada',
      location: 'Bangalore', area: 'Whitefield', ageBracket: '12+', interest: 'Electric',
      brand: 'EMotorad', model: 'Doodle', budget: '20-35K', emi: 'Yes - 999 offer',
      visitIntent: 'Not sure', score: 'Warm', stage: 'BDC Contacted',
      assignedTo: 'suma', callNotes: ['Price concern', 'Needs family approval'],
      createdAt: '2026-02-21 09:15', lastContact: '2026-02-21 09:15', followUpDate: '2026-02-23'
    },
    {
      id: 'L005', phone: '9900112233', name: 'Sneha K', source: 'BCH_TOYZ', language: 'Kannada',
      location: 'Bangalore', area: 'Jayanagar', ageBracket: '12+', interest: 'Kids/Teen',
      brand: 'Other', model: 'None', budget: 'Under 10K', emi: "Didn't discuss",
      visitIntent: 'Coming today', score: 'Hot', stage: 'Visit Scheduled',
      assignedTo: 'nithin', callNotes: ['Clear - no issues'],
      createdAt: '2026-02-21 10:30', lastContact: '2026-02-21 10:30', followUpDate: '2026-02-21'
    },
    {
      id: 'L006', phone: '9988001122', name: 'Venkatesh B', source: 'BCH_LUX', language: 'English',
      location: 'Bangalore', area: 'Rajajinagar', ageBracket: '12+', interest: 'Electric',
      brand: 'Giant', model: 'Other', budget: '1L+', emi: 'No - cash/card',
      visitIntent: 'Next week', score: 'Hot', stage: 'Qualified',
      assignedTo: 'sunil', callNotes: ['Wants test ride'],
      createdAt: '2026-02-20 15:00', lastContact: '2026-02-20 15:30', followUpDate: '2026-02-24'
    },
    {
      id: 'L007', phone: '9844556677', name: 'Anjali M', source: 'GOOGLE', language: 'English',
      location: 'Bangalore', area: 'Electronic City', ageBracket: '12+', interest: 'Gear',
      brand: 'AOKI', model: 'None', budget: '20-35K', emi: 'Yes - regular EMI',
      visitIntent: 'This weekend', score: 'Warm', stage: 'Follow-up Active',
      assignedTo: 'abhi', callNotes: ['Comparing with competitor'],
      createdAt: '2026-02-19 13:20', lastContact: '2026-02-20 10:00', followUpDate: '2026-02-22'
    },
    {
      id: 'L008', phone: '9900334455', name: 'Rahul Naik', source: 'BCH_2NDLIFE', language: 'Kannada',
      location: 'Bangalore', area: 'Yelahanka', ageBracket: '12+', interest: 'Second Hand',
      brand: 'EMotorad', model: 'X1', budget: '10-20K', emi: "Didn't discuss",
      visitIntent: 'Coming today', score: 'Hot', stage: 'Visit Scheduled',
      assignedTo: 'baba', callNotes: ['Called before, following up'],
      createdAt: '2026-02-20 09:00', lastContact: '2026-02-21 08:30', followUpDate: '2026-02-21'
    },
    {
      id: 'L009', phone: '9876000111', name: 'Lakshmi Devi', source: 'WATTSONWHEELZ', language: 'Kannada',
      location: 'Bangalore', area: 'Marathahalli', ageBracket: '12+', interest: 'Electric',
      brand: 'EMotorad', model: 'T-Rex', budget: '35-50K', emi: 'Yes - 999 offer',
      visitIntent: 'Not sure', score: 'Warm', stage: 'Follow-up Active',
      assignedTo: 'suma', callNotes: ['Needs family approval'],
      createdAt: '2026-02-17 14:00', lastContact: '2026-02-19 11:00', followUpDate: '2026-02-21'
    },
    {
      id: 'L010', phone: '9988223344', name: null, source: 'EM_DOODLE', language: 'Kannada',
      location: 'Bangalore', area: null, ageBracket: '12+', interest: 'Electric',
      brand: null, model: null, budget: null, emi: null,
      visitIntent: null, score: null, stage: 'Lead Created',
      assignedTo: null, callNotes: [],
      createdAt: '2026-02-21 11:23', lastContact: null, followUpDate: null
    },
    {
      id: 'L011', phone: '9900556677', name: 'Kiran S', source: 'BCH_MAIN', language: 'Kannada',
      location: 'Bangalore', area: 'Yelahanka', ageBracket: '12+', interest: 'Electric',
      brand: 'EMotorad', model: 'Desire', budget: '35-50K', emi: 'Yes - 999 offer',
      visitIntent: 'Coming today', score: 'Very Hot', stage: 'Visit Done',
      assignedTo: 'suma', callNotes: ['Wants test ride'],
      createdAt: '2026-02-18 10:00', lastContact: '2026-02-21 11:00', followUpDate: null,
      visitDate: '2026-02-21', purchased: true, invoiceNumber: 'BCH-2026-0847', purchaseAmount: 42999
    },
    {
      id: 'L012', phone: '9876112233', name: 'Naveen Kumar', source: 'WATTSONWHEELZ', language: 'English',
      location: 'Bangalore', area: 'Hebbal', ageBracket: '12+', interest: 'Gear',
      brand: 'AOKI', model: 'None', budget: '10-20K', emi: "Didn't discuss",
      visitIntent: 'Coming tomorrow', score: 'Hot', stage: 'Qualified',
      assignedTo: 'abhi', callNotes: ['Looking for specific color'],
      createdAt: '2026-02-21 10:00', lastContact: '2026-02-21 10:15', followUpDate: '2026-02-22'
    }
  ],

  // ===== CALLBACK QUEUE =====
  callbacks: [
    { phone: '9988223344', source: 'EM_DOODLE', interest: 'Electric', missedAt: '11:23 AM', status: 'pending' },
    { phone: '9876999888', source: 'BCH_MAIN', interest: 'Gear', missedAt: '11:45 AM', status: 'pending' },
    { phone: '9123000456', source: 'RALEIGH', interest: 'Electric', missedAt: '12:10 PM', status: 'pending' },
    { phone: '9844111222', source: 'WATTSONWHEELZ', interest: 'Kids/Teen', missedAt: '12:35 PM', status: 'pending' },
    { phone: '9900777888', source: 'GOOGLE', interest: 'Service', missedAt: '1:15 PM', status: 'pending' }
  ],

  // ===== TODAY'S STATS =====
  todayStats: {
    totalCalls: 112,
    answered: 34,
    ivrFiltered: 71,
    missed: 7,
    leadsCreated: 34,
    leadsQualified: 28,
    leadsAssigned: 28,
    leadsContacted: 19,
    walkInsTotal: 45,
    walkInsFromLeads: 12,
    walkInsFresh: 28,
    walkInsReturning: 5,
    purchased: 32,
    walkOut: 13,
    revenueTotal: 520000,
    revenueFromLeads: 180000,
    followUpsDueToday: 18,
    followUpsCompleted: 11,
    followUpsPending: 7,
    callbacksPending: 5
  },

  // ===== MONTHLY CONTENT ROI =====
  contentROI: [
    { profile: 'Wattsonwheelz', calls: 850, qualified: 280, visits: 95, purchases: 72, revenue: 840000 },
    { profile: 'BCH Main', calls: 620, qualified: 210, visits: 85, purchases: 68, revenue: 510000 },
    { profile: 'EM Doodle', calls: 540, qualified: 160, visits: 55, purchases: 42, revenue: 380000 },
    { profile: 'BCH Toyz', calls: 480, qualified: 120, visits: 48, purchases: 38, revenue: 290000 },
    { profile: 'Raleigh', calls: 320, qualified: 110, visits: 40, purchases: 32, revenue: 320000 },
    { profile: 'Google', calls: 280, qualified: 140, visits: 65, purchases: 55, revenue: 410000 },
    { profile: '2nd Life', calls: 180, qualified: 45, visits: 20, purchases: 15, revenue: 120000 },
    { profile: 'BCH Lux', calls: 40, qualified: 15, visits: 8, purchases: 5, revenue: 150000 },
    { profile: 'Next.BLR', calls: 30, qualified: 10, visits: 4, purchases: 3, revenue: 30000 },
    { profile: 'Direct', calls: 160, qualified: 80, visits: 45, purchases: 38, revenue: 310000 }
  ],

  // ===== SALESPERSON PERFORMANCE (weekly) =====
  salesPerformance: [
    { id: 'suma', name: 'Suma', leadsReceived: 35, contacted: 32, contactRate: 91, visits: 12, purchased: 9, convRate: 26, revenue: 450000, avgTicket: 50000, responseTime: 1.2 },
    { id: 'sunil', name: 'Sunil', leadsReceived: 28, contacted: 24, contactRate: 86, visits: 10, purchased: 7, convRate: 25, revenue: 520000, avgTicket: 74000, responseTime: 2.1 },
    { id: 'abhi', name: 'Abhi Gowda', leadsReceived: 22, contacted: 20, contactRate: 91, visits: 8, purchased: 6, convRate: 27, revenue: 180000, avgTicket: 30000, responseTime: 0.8 },
    { id: 'nithin', name: 'Nithin', leadsReceived: 30, contacted: 18, contactRate: 60, visits: 5, purchased: 3, convRate: 10, revenue: 90000, avgTicket: 30000, responseTime: 5.4 },
    { id: 'baba', name: 'Baba', leadsReceived: 12, contacted: 10, contactRate: 83, visits: 4, purchased: 3, convRate: 25, revenue: 45000, avgTicket: 15000, responseTime: 1.5 },
    { id: 'iqbal', name: 'Iqbal', leadsReceived: 8, contacted: 7, contactRate: 88, visits: 3, purchased: 2, convRate: 25, revenue: 130000, avgTicket: 65000, responseTime: 1.8 }
  ],

  // ===== PEAK HOURS DATA =====
  peakHours: [
    { hour: '10 AM', calls: 45 },
    { hour: '11 AM', calls: 62 },
    { hour: '12 PM', calls: 78 },
    { hour: '1 PM', calls: 48 },
    { hour: '2 PM', calls: 42 },
    { hour: '3 PM', calls: 65 },
    { hour: '4 PM', calls: 72 },
    { hour: '5 PM', calls: 55 },
    { hour: '6 PM', calls: 48 },
    { hour: '7 PM', calls: 38 },
    { hour: '8 PM', calls: 25 }
  ],

  // ===== LOST DEAL DATA =====
  lostDeals: [
    { reason: 'Family approval', count: 18, pct: 28, revenueLost: 650000 },
    { reason: 'Too expensive', count: 12, pct: 19, revenueLost: 400000 },
    { reason: 'Not in stock', count: 8, pct: 13, revenueLost: 320000 },
    { reason: 'EMI rejected', count: 7, pct: 11, revenueLost: 210000 },
    { reason: 'Competitor', count: 6, pct: 9, revenueLost: 240000 },
    { reason: 'Just looking', count: 5, pct: 8, revenueLost: 150000 },
    { reason: 'Outstation', count: 4, pct: 6, revenueLost: 160000 },
    { reason: 'Other', count: 4, pct: 6, revenueLost: 120000 }
  ],

  // ===== AUTOMATION RULES =====
  automationRules: [
    { id: 1, trigger: 'Lead created (any source)', action: 'Auto-WhatsApp: store location + offers', timing: 'Immediate', type: 'whatsapp', active: true },
    { id: 2, trigger: 'Lead qualified as Hot/Very Hot', action: 'Push notification to salesperson', timing: 'Immediate', type: 'notification', active: true },
    { id: 3, trigger: 'Lead uncontacted for 2 hours', action: 'Reminder to salesperson', timing: '2 hours', type: 'reminder', active: true },
    { id: 4, trigger: 'Lead uncontacted for 4 hours', action: 'Escalation to Ibrahim', timing: '4 hours', type: 'escalation', active: true },
    { id: 5, trigger: 'Visit scheduled for tomorrow', action: 'Auto-WhatsApp: visit reminder', timing: '6 PM day before', type: 'whatsapp', active: true },
    { id: 6, trigger: "Visited but didn't buy", action: 'Auto-WhatsApp: thanks + questions', timing: '2 hours after', type: 'whatsapp', active: true },
    { id: 7, trigger: "Visited, didn't buy, Day 3", action: 'Auto-WhatsApp: offers + urgency', timing: 'Day 3', type: 'whatsapp', active: true },
    { id: 8, trigger: "Visited, didn't buy, Day 7", action: 'Final follow-up call reminder', timing: 'Day 7', type: 'reminder', active: true },
    { id: 9, trigger: 'Lead purchased', action: 'Auto-WhatsApp: thank you + review link', timing: '3 days after', type: 'whatsapp', active: true },
    { id: 10, trigger: 'Lead purchased, Day 7', action: 'Auto-WhatsApp: referral ask', timing: '7 days after', type: 'whatsapp', active: true },
    { id: 11, trigger: 'Lead purchased, Day 30', action: 'Auto-WhatsApp: free service reminder', timing: '30 days after', type: 'whatsapp', active: true },
    { id: 12, trigger: 'Missed call', action: 'Add to callback queue + notify BDC', timing: 'Immediate', type: 'notification', active: true },
    { id: 13, trigger: 'Callback not done in 15 min', action: 'Escalation to 2nd BDC agent', timing: '15 minutes', type: 'escalation', active: true },
    { id: 14, trigger: 'Outstation caller (IVR filtered)', action: 'Auto-WhatsApp: delivery info', timing: 'Immediate', type: 'whatsapp', active: true },
    { id: 15, trigger: 'Kids U12 caller (IVR filtered)', action: 'Auto-WhatsApp: kids pricing', timing: 'Immediate', type: 'whatsapp', active: true },
    { id: 16, trigger: 'Lead marked "Family Approval"', action: 'Start SOP #8 follow-up sequence', timing: 'Next day', type: 'sequence', active: true },
    { id: 17, trigger: 'Salesperson follow-up due today', action: 'Morning notification: follow-ups list', timing: '10 AM', type: 'notification', active: true },
    { id: 18, trigger: 'Lead inactive for 14 days', action: 'Auto-move to LOST', timing: 'Day 14', type: 'system', active: true }
  ],

  // ===== PIPELINE COUNTS =====
  pipeline: {
    ivrFiltered: 1220,
    leadCreated: 34,
    bdcContacted: 89,
    qualified: 45,
    followUpActive: 38,
    visitScheduled: 23,
    visitDone: 12,
    purchased: 368,
    postSale: 320,
    lost: 156
  },

  // ===== WALK-IN DATA TODAY =====
  walkInsToday: [
    { id: 'W001', phone: '9876543210', name: 'Ravi Kumar', fromLead: true, source: 'WATTSONWHEELZ', interest: 'Electric', assignedTo: 'suma', outcome: null, time: '11:30 AM' },
    { id: 'W002', phone: null, name: null, fromLead: false, source: null, interest: 'Gear', assignedTo: 'abhi', outcome: 'Purchased', time: '10:15 AM' },
    { id: 'W003', phone: '9900112233', name: 'Sneha K', fromLead: true, source: 'BCH_TOYZ', interest: 'Kids/Teen', assignedTo: 'nithin', outcome: null, time: '12:00 PM' },
    { id: 'W004', phone: null, name: null, fromLead: false, source: null, interest: 'Electric', assignedTo: 'suma', outcome: 'Purchased', time: '10:45 AM' },
    { id: 'W005', phone: null, name: null, fromLead: false, source: null, interest: 'Kids/Teen', assignedTo: 'nithin', outcome: 'WalkedOut', walkoutReason: 'Too expensive', time: '11:00 AM' },
    { id: 'W006', phone: '9900334455', name: 'Rahul Naik', fromLead: true, source: 'BCH_2NDLIFE', interest: 'Second Hand', assignedTo: 'baba', outcome: null, time: '12:30 PM' }
  ]
};

// ===== UTILITY FUNCTIONS =====
function formatRupees(amount) {
  if (amount >= 100000) return 'Rs.' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return 'Rs.' + (amount / 1000).toFixed(0) + 'K';
  return 'Rs.' + amount;
}

function getProfileName(id) {
  const p = BCH.profiles.find(p => p.id === id);
  return p ? p.shortName : id;
}

function getStaffName(id) {
  const all = [...BCH.staff.bdc, ...BCH.staff.sales, ...BCH.staff.service, ...BCH.staff.manager];
  const s = all.find(s => s.id === id);
  return s ? s.name : id;
}

function getScoreClass(score) {
  if (!score) return '';
  return score.toLowerCase().replace(' ', '');
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + ' min ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + ' hrs ago';
  const days = Math.floor(hrs / 24);
  return days + ' day' + (days > 1 ? 's' : '') + ' ago';
}

// Tab switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Chip selection
function initChips() {
  document.querySelectorAll('.chip-group').forEach(group => {
    const isMulti = group.dataset.multi === 'true';
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (!isMulti) {
          group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        }
        chip.classList.toggle('selected');
      });
    });
  });
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.cssText = 'position:fixed;top:60px;left:12px;right:12px;max-width:406px;margin:0 auto;z-index:999;animation:slideDown 0.3s ease;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
