// src/data/mockData.js — shared mock data for all ITSM modules

export const ASSIGNEES = [
  { name: "Sarah K.",     role: "Senior Engineer",   team: "Infrastructure" },
  { name: "James T.",     role: "Support Analyst",   team: "Desktop Support" },
  { name: "Alex M.",      role: "Network Engineer",  team: "Network Ops" },
  { name: "Priya R.",     role: "Security Analyst",  team: "Security" },
  { name: "Mohammed A.",  role: "Systems Admin",     team: "Infrastructure" },
  { name: "Emma L.",      role: "Change Manager",    team: "Change Mgmt" },
  { name: "Daniel O.",    role: "Problem Manager",   team: "ITSM" },
  { name: "Yuki N.",      role: "Asset Manager",     team: "Infrastructure" },
];

export const TEAMS = ["Infrastructure", "Desktop Support", "Network Ops", "Security", "Change Mgmt", "ITSM"];

export function avatarProps(name) {
  const parts = (name || "").split(" ");
  const init = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f97316","#06b6d4","#10b981","#f59e0b","#3b82f6"];
  const bg = name !== "Unassigned" ? colors[(name || "").charCodeAt(0) % colors.length] : "#94a3b8";
  return { init, bg };
}

// ---- Service Requests -------------------------------------------------------
export const SERVICE_REQUESTS = Array.from({ length: 28 }, (_, i) => {
  const types = ["New Laptop Setup", "VPN Access", "Software Installation", "Email Account", "System Access", "Password Reset", "Hardware Upgrade", "Mobile Device", "Printer Setup", "Cloud Storage"];
  const statuses = ["Pending Approval", "In Progress", "Fulfilled", "Rejected", "On Hold"];
  const priorities = ["High", "Medium", "Low"];
  const cats = ["Hardware", "Software", "Access", "Account", "Infrastructure"];
  return {
    id: `SR-${2100 + i}`,
    title: types[i % types.length] + (i > 9 ? ` #${i}` : ""),
    requester: ASSIGNEES[i % ASSIGNEES.length].name,
    assignee: i % 5 === 0 ? "Unassigned" : ASSIGNEES[(i + 2) % ASSIGNEES.length].name,
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    category: cats[i % cats.length],
    created: new Date(Date.now() - (i * 86400000 * 1.3)).toISOString(),
    sla: i % 3 === 0 ? "Breached" : i % 4 === 0 ? "At Risk" : "On Track",
  };
});

// ---- Changes ----------------------------------------------------------------
export const CHANGES = Array.from({ length: 24 }, (_, i) => {
  const titles = ["Firewall Rule Update", "Server OS Patch", "Network Reconfiguration", "Database Migration", "SSL Certificate Renewal", "Switch Firmware Upgrade", "AD Policy Update", "Load Balancer Config", "Backup Policy Change", "DNS Record Update"];
  const statuses = ["Draft", "Pending Approval", "Approved", "In Progress", "Completed", "Failed", "Cancelled"];
  const types = ["Standard", "Normal", "Emergency"];
  const risks = ["Low", "Medium", "High"];
  return {
    id: `CHG-${3000 + i}`,
    title: titles[i % titles.length] + (i > 9 ? ` v${Math.floor(i/10)+1}` : ""),
    type: types[i % types.length],
    risk: risks[i % risks.length],
    status: statuses[i % statuses.length],
    assignee: ASSIGNEES[(i + 1) % ASSIGNEES.length].name,
    cab: i % 2 === 0,
    scheduledStart: new Date(Date.now() + ((i - 10) * 86400000 * 2)).toISOString(),
    scheduledEnd:   new Date(Date.now() + ((i - 10) * 86400000 * 2) + 7200000).toISOString(),
    created: new Date(Date.now() - (i * 86400000 * 2)).toISOString(),
    team: TEAMS[i % TEAMS.length],
  };
});

// ---- Problems ---------------------------------------------------------------
export const PROBLEMS = Array.from({ length: 18 }, (_, i) => {
  const titles = ["Recurring Network Drops", "Email Delivery Failures", "Slow Login Times", "Printer Connectivity Issues", "VPN Instability", "Database Timeout Errors", "Wi-Fi Dead Zones", "Application Crashes", "Backup Job Failures", "Certificate Expiry Pattern"];
  const statuses = ["Open", "Under Investigation", "Root Cause Identified", "Fix In Progress", "Resolved", "Known Error"];
  const impacts = ["Critical", "High", "Medium", "Low"];
  return {
    id: `PRB-${4000 + i}`,
    title: titles[i % titles.length],
    status: statuses[i % statuses.length],
    impact: impacts[i % impacts.length],
    assignee: ASSIGNEES[(i + 3) % ASSIGNEES.length].name,
    linkedIncidents: Math.floor(Math.random() * 8) + 1,
    rootCause: i % 3 === 0 ? "Hardware failure" : i % 3 === 1 ? "Configuration drift" : null,
    workaround: i % 2 === 0,
    created: new Date(Date.now() - (i * 86400000 * 3)).toISOString(),
    lastUpdated: new Date(Date.now() - (i * 86400000 * 0.5)).toISOString(),
  };
});

// ---- Assets -----------------------------------------------------------------
const ASSET_TYPES = ["Laptop", "Desktop", "Server", "Switch", "Router", "Printer", "Monitor", "Mobile", "Firewall", "Access Point"];
const MANUFACTURERS = ["Dell", "HP", "Apple", "Cisco", "Lenovo", "Microsoft", "Brother", "Samsung"];
const LOCATIONS = ["London HQ", "Manchester Office", "Remote", "Data Centre", "Edinburgh Branch"];
export const ASSETS = Array.from({ length: 32 }, (_, i) => {
  const type = ASSET_TYPES[i % ASSET_TYPES.length];
  const statuses = ["Active", "Inactive", "In Repair", "Retired", "In Stock"];
  return {
    id: `AST-${5000 + i}`,
    name: `${MANUFACTURERS[i % MANUFACTURERS.length]} ${type} ${String(i+1).padStart(3,"0")}`,
    type,
    manufacturer: MANUFACTURERS[i % MANUFACTURERS.length],
    status: statuses[i % statuses.length],
    assignedTo: i % 6 === 0 ? null : ASSIGNEES[i % ASSIGNEES.length].name,
    location: LOCATIONS[i % LOCATIONS.length],
    purchaseDate: new Date(Date.now() - (i * 86400000 * 90)).toISOString(),
    warrantyEnd: new Date(Date.now() + ((36 - i) * 86400000 * 30)).toISOString(),
    serialNumber: `SN${String(100000 + i * 137).padStart(6,"0")}`,
    value: (800 + i * 234) % 8000 + 400,
  };
});

// ---- Knowledge Base ---------------------------------------------------------
const KB_CATEGORIES = ["Getting Started", "Network", "Hardware", "Software", "Security", "Email", "Remote Working", "Accounts"];
export const KB_ARTICLES = Array.from({ length: 26 }, (_, i) => {
  const titles = [
    "How to Reset Your Password", "Setting Up VPN on Windows", "Connecting to the Corporate Wi-Fi",
    "Installing Microsoft 365", "Setting Up Multi-Factor Authentication", "Requesting New Hardware",
    "Mapping Network Drives", "Setting Up Remote Desktop", "Email Signature Template",
    "How to Raise a Service Request", "Printer Driver Installation", "Approved Software List",
    "Data Backup Best Practices", "Phishing Awareness Guide", "Laptop Setup Checklist",
    "Video Conferencing Setup", "Accessing SharePoint", "Mobile Device Enrollment",
    "Out of Office Auto-Reply Setup", "IT Acceptable Use Policy", "Onboarding IT Checklist",
    "Software Licence Management", "Network Drive Permissions", "Secure File Sharing Guide",
    "Endpoint Protection Guide", "IT Asset Return Process",
  ];
  return {
    id: `KB-${6000 + i}`,
    title: titles[i] || `Article ${i}`,
    category: KB_CATEGORIES[i % KB_CATEGORIES.length],
    author: ASSIGNEES[i % ASSIGNEES.length].name,
    status: i % 7 === 0 ? "Draft" : i % 11 === 0 ? "Under Review" : "Published",
    views: Math.floor(Math.random() * 800) + 20,
    helpful: Math.floor(Math.random() * 95) + 60,
    lastUpdated: new Date(Date.now() - (i * 86400000 * 7)).toISOString(),
    tags: [KB_CATEGORIES[i % KB_CATEGORIES.length], i % 2 === 0 ? "Windows" : "macOS"].slice(0, i % 3 === 0 ? 1 : 2),
  };
});

// ---- Approvals --------------------------------------------------------------
export const APPROVALS = Array.from({ length: 20 }, (_, i) => {
  const types = ["Change Request", "Service Request", "Access Request", "Purchase Request", "Policy Exception"];
  const statuses = ["Pending", "Approved", "Rejected", "Escalated", "Delegated"];
  const urgencies = ["Critical", "High", "Normal", "Low"];
  const refPrefixes = ["CHG", "SR", "ACC", "PO", "EXC"];
  return {
    id: `APV-${7000 + i}`,
    refId: `${refPrefixes[i % refPrefixes.length]}-${3000 + i * 7}`,
    title: types[i % types.length] + ": " + ["Firewall Change", "New Laptop", "Admin Access", "Software Licences", "VPN Exception"][i % 5],
    type: types[i % types.length],
    status: statuses[i % statuses.length],
    urgency: urgencies[i % urgencies.length],
    requester: ASSIGNEES[i % ASSIGNEES.length].name,
    approver: ASSIGNEES[(i + 4) % ASSIGNEES.length].name,
    dueDate: new Date(Date.now() + ((5 - i) * 86400000)).toISOString(),
    created: new Date(Date.now() - (i * 86400000 * 1.5)).toISOString(),
    notes: i % 3 === 0 ? "Requires CAB sign-off" : "",
  };
});
