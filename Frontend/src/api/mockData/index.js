// Comprehensive Enterprise Mock Data for AssetFlow Suite

export const mockUsers = [
  {
    id: 1,
    name: 'Marcus Sterling',
    email: 'marcus.s@assetflow.com',
    role: 'ADMIN',
    departmentId: 101,
    departmentName: 'Engineering & IT',
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah.j@assetflow.com',
    role: 'ASSET_MANAGER',
    departmentId: 102,
    departmentName: 'Facilities & Ops',
    status: 'ACTIVE'
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.c@assetflow.com',
    role: 'DEPARTMENT_HEAD',
    departmentId: 101,
    departmentName: 'Engineering & IT',
    status: 'ACTIVE'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    email: 'elena.r@assetflow.com',
    role: 'EMPLOYEE',
    departmentId: 101,
    departmentName: 'Engineering & IT',
    status: 'ACTIVE'
  },
  {
    id: 5,
    name: 'Michael Vance',
    email: 'michael.v@assetflow.com',
    role: 'EMPLOYEE',
    departmentId: 103,
    departmentName: 'Field Operations',
    status: 'ACTIVE'
  },
  {
    id: 6,
    name: 'Samantha Vance',
    email: 'samantha.v@assetflow.com',
    role: 'DEPARTMENT_HEAD',
    departmentId: 103,
    departmentName: 'Field Operations',
    status: 'ACTIVE'
  }
];

export const mockDepartments = [
  {
    id: 101,
    name: 'Engineering & IT',
    headId: 3,
    headName: 'Aditi Rao',
    parentId: null,
    parentName: null,
    status: 'ACTIVE',
    assetCount: 42
  },
  {
    id: 102,
    name: 'Facilities & Ops',
    headId: 2,
    headName: 'Rohan Mehta',
    parentId: null,
    parentName: null,
    status: 'ACTIVE',
    assetCount: 18
  },
  {
    id: 103,
    name: 'Field Operations',
    headId: 6,
    headName: 'Sana Iqbal',
    parentId: 101,
    parentName: 'Engineering & IT',
    status: 'ACTIVE',
    assetCount: 26
  },
  {
    id: 104,
    name: 'Human Resources & Administration',
    headId: null,
    headName: 'Unassigned',
    parentId: null,
    parentName: null,
    status: 'INACTIVE',
    assetCount: 4
  }
];

export const mockCategories = [
  {
    id: 201,
    name: 'Electronics & IT Hardware',
    warrantyPeriodMonths: 36,
    requiresSerial: true,
    totalAssets: 48
  },
  {
    id: 202,
    name: 'Office Furniture & Ergonomics',
    warrantyPeriodMonths: 60,
    requiresSerial: false,
    totalAssets: 25
  },
  {
    id: 203,
    name: 'Company Vehicles & Transport',
    warrantyPeriodMonths: 24,
    requiresSerial: true,
    totalAssets: 6
  },
  {
    id: 204,
    name: 'Shared AV Equipment & Projectors',
    warrantyPeriodMonths: 12,
    requiresSerial: true,
    totalAssets: 11
  }
];

export const mockAssets = [
  {
    id: 1,
    assetTag: 'AF-0114',
    name: 'MacBook Pro M3 Max 16-inch',
    categoryId: 201,
    categoryName: 'Electronics & IT Hardware',
    serialNumber: 'C02G1234JKM3',
    acquisitionDate: '2025-11-15',
    acquisitionCost: 3299.00,
    conditionStatus: 'GOOD',
    location: 'Bangalore HQ - Floor 3',
    status: 'ALLOCATED',
    isSharedBookable: false,
    assignedToId: 4,
    assignedToName: 'Priya Shah',
    departmentId: 101,
    departmentName: 'Engineering & IT',
    expectedReturnDate: '2026-06-30', // Overdue return example for testing alerts
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 101, date: '2025-11-15', action: 'REGISTERED', user: 'Rohan Mehta', notes: 'New asset purchased from Apple Store' },
      { id: 102, date: '2025-11-20', action: 'ALLOCATED', user: 'Priya Shah', notes: 'Assigned for AI Backend Dev Project' }
    ]
  },
  {
    id: 2,
    assetTag: 'AF-0062',
    name: '4K Laser Projector Sony VPL',
    categoryId: 204,
    categoryName: 'Shared AV Equipment & Projectors',
    serialNumber: 'SNY-PJ-99821',
    acquisitionDate: '2024-05-10',
    acquisitionCost: 1450.00,
    conditionStatus: 'NEEDS_SERVICING',
    location: 'Conference Room B2',
    status: 'UNDER_MAINTENANCE',
    isSharedBookable: true,
    assignedToId: null,
    assignedToName: null,
    departmentId: 102,
    departmentName: 'Facilities & Ops',
    expectedReturnDate: null,
    photoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 201, date: '2024-05-10', action: 'REGISTERED', user: 'Rohan Mehta', notes: 'Installed in main board room' },
      { id: 202, date: '2026-07-01', action: 'MAINTENANCE_RAISED', user: 'Aditi Rao', notes: 'Bulb flickering after 2 hours of usage' }
    ]
  },
  {
    id: 3,
    assetTag: 'AF-0312',
    name: 'Dell Latitude 7440 Ultrabook',
    categoryId: 201,
    categoryName: 'Electronics & IT Hardware',
    serialNumber: 'DL-7440-8819',
    acquisitionDate: '2026-01-20',
    acquisitionCost: 1650.00,
    conditionStatus: 'NEW',
    location: 'Bangalore HQ - Floor 2',
    status: 'AVAILABLE',
    isSharedBookable: false,
    assignedToId: null,
    assignedToName: null,
    departmentId: 101,
    departmentName: 'Engineering & IT',
    expectedReturnDate: null,
    photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 301, date: '2026-01-20', action: 'REGISTERED', user: 'Marcus Sterling', notes: 'Batch order for new engineering hires' }
    ]
  },
  {
    id: 4,
    assetTag: 'AF-0201',
    name: 'Herman Miller Aeron Office Chair',
    categoryId: 202,
    categoryName: 'Office Furniture & Ergonomics',
    serialNumber: 'HM-AER-4491',
    acquisitionDate: '2023-08-12',
    acquisitionCost: 1100.00,
    conditionStatus: 'GOOD',
    location: 'Bangalore HQ - Floor 3 Desk 12',
    status: 'AVAILABLE',
    isSharedBookable: false,
    assignedToId: null,
    assignedToName: null,
    departmentId: 101,
    departmentName: 'Engineering & IT',
    expectedReturnDate: null,
    photoUrl: 'https://images.unsplash.com/photo-1580481077494-e3299ac2fef6?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 401, date: '2023-08-12', action: 'REGISTERED', user: 'Rohan Mehta', notes: 'Ergonomic seating update' }
    ]
  },
  {
    id: 5,
    assetTag: 'AF-0410',
    name: 'Ford Transit Field Van (KA-04-EQ-1002)',
    categoryId: 203,
    categoryName: 'Company Vehicles & Transport',
    serialNumber: 'VIN-FORD-881923A',
    acquisitionDate: '2023-03-01',
    acquisitionCost: 45000.00,
    conditionStatus: 'GOOD',
    location: 'Basement Parking - Slot P4',
    status: 'AVAILABLE',
    isSharedBookable: true,
    assignedToId: null,
    assignedToName: null,
    departmentId: 103,
    departmentName: 'Field Operations',
    expectedReturnDate: null,
    photoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 501, date: '2023-03-01', action: 'REGISTERED', user: 'Sana Iqbal', notes: 'Assigned to field deployments' }
    ]
  },
  {
    id: 6,
    assetTag: 'AF-0099',
    name: 'iPad Pro M2 12.9-inch with Pencil',
    categoryId: 201,
    categoryName: 'Electronics & IT Hardware',
    serialNumber: 'IPAD-PRO-7718',
    acquisitionDate: '2025-02-10',
    acquisitionCost: 1299.00,
    conditionStatus: 'DAMAGED',
    location: 'Audit Flagged Area - IT Locker',
    status: 'LOST',
    isSharedBookable: false,
    assignedToId: 5,
    assignedToName: 'Arjun Nair',
    departmentId: 103,
    departmentName: 'Field Operations',
    expectedReturnDate: '2025-12-01', // Overdue long past
    photoUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    history: [
      { id: 601, date: '2025-02-10', action: 'REGISTERED', user: 'Rohan Mehta', notes: 'Tablet for site inspection surveys' },
      { id: 602, date: '2026-06-15', action: 'AUDIT_FLAGGED', user: 'Aditi Rao', notes: 'Not found at Arjun desk during Q2 audit' }
    ]
  }
];

export const mockBookings = [
  {
    id: 1001,
    resourceName: 'Conference Room B2 (4K Projector & Video Bar)',
    resourceId: 2,
    bookedById: 3,
    bookedByName: 'Aditi Rao',
    departmentName: 'Engineering & IT',
    startTime: '2026-07-12T09:00:00',
    endTime: '2026-07-12T10:00:00',
    status: 'ONGOING',
    purpose: 'Engineering Q3 Roadmap & Architecture Review'
  },
  {
    id: 1002,
    resourceName: 'Conference Room B2 (4K Projector & Video Bar)',
    resourceId: 2,
    bookedById: 2,
    bookedByName: 'Rohan Mehta',
    departmentName: 'Facilities & Ops',
    startTime: '2026-07-12T11:00:00',
    endTime: '2026-07-12T12:30:00',
    status: 'UPCOMING',
    purpose: 'Vendor Safety Protocol Briefing'
  },
  {
    id: 1003,
    resourceName: 'Ford Transit Field Van (KA-04-EQ-1002)',
    resourceId: 5,
    bookedById: 6,
    bookedByName: 'Sana Iqbal',
    departmentName: 'Field Operations',
    startTime: '2026-07-13T08:00:00',
    endTime: '2026-07-13T17:00:00',
    status: 'UPCOMING',
    purpose: 'Customer Site Equipment Installation'
  }
];

export const mockMaintenanceRequests = [
  {
    id: 5001,
    assetTag: 'AF-0062',
    assetName: '4K Laser Projector Sony VPL',
    raisedById: 3,
    raisedByName: 'Aditi Rao',
    departmentName: 'Engineering & IT',
    issueDescription: 'Projector bulb turns off automatically after 15 mins. Cooling fan makes loud grinding noise.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    technicianAssigned: 'Tech K. Sharma (External Sony Service)',
    raisedDate: '2026-07-01',
    costEstimate: 280.00,
    photoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5002,
    assetTag: 'AF-0089',
    assetName: 'LG UltraFine 5K Display',
    raisedById: 4,
    raisedByName: 'Priya Shah',
    departmentName: 'Engineering & IT',
    issueDescription: 'USB-C power delivery port intermittent connection when laptop is attached.',
    priority: 'MEDIUM',
    status: 'PENDING',
    technicianAssigned: 'Unassigned',
    raisedDate: '2026-07-10',
    costEstimate: null,
    photoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5003,
    assetTag: 'AF-0197',
    assetName: 'HP Color LaserJet Enterprise M553',
    raisedById: 2,
    raisedByName: 'Rohan Mehta',
    departmentName: 'Facilities & Ops',
    issueDescription: 'Paper jam sensor faulty, continuous jam error even when tray is cleared.',
    priority: 'LOW',
    status: 'RESOLVED',
    technicianAssigned: 'Internal IT Support (Arjun)',
    raisedDate: '2026-06-25',
    costEstimate: 45.00,
    photoUrl: null
  }
];

export const mockAuditCycles = [
  {
    id: 8001,
    title: 'Q3 2026 Engineering & IT Asset Verification',
    departmentId: 101,
    departmentName: 'Engineering & IT',
    locationScope: 'Bangalore HQ - Floor 2 & 3',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    status: 'OPEN',
    auditors: ['Aditi Rao', 'Rohan Mehta'],
    totalAssetsScoped: 42,
    verifiedCount: 38,
    missingCount: 2,
    damagedCount: 2,
    discrepancyReportUrl: '/reports/audit-8001-discrepancy.pdf',
    items: [
      { assetTag: 'AF-0114', assetName: 'MacBook Pro M3 Max 16-inch', holder: 'Priya Shah', verificationStatus: 'VERIFIED', note: 'Condition checked verified by Aditi' },
      { assetTag: 'AF-0312', assetName: 'Dell Latitude 7440 Ultrabook', holder: 'Unassigned', verificationStatus: 'VERIFIED', note: 'Present in Floor 2 storage rack' },
      { assetTag: 'AF-0099', assetName: 'iPad Pro M2 12.9-inch with Pencil', holder: 'Arjun Nair', verificationStatus: 'MISSING', note: 'Flagged missing during desk audit' },
      { assetTag: 'AF-0062', assetName: '4K Laser Projector Sony VPL', holder: 'Conference Room B2', verificationStatus: 'DAMAGED', note: 'Fan motor faulty, currently in repair workflow' }
    ]
  },
  {
    id: 8002,
    title: 'Q2 2026 Field Operations Vehicle & Tools Audit',
    departmentId: 103,
    departmentName: 'Field Operations',
    locationScope: 'All Field Sites & Basement Parking',
    startDate: '2026-04-01',
    endDate: '2026-04-15',
    status: 'CLOSED',
    auditors: ['Samantha Vance', 'Marcus Sterling'],
    totalAssetsScoped: 26,
    verifiedCount: 26,
    missingCount: 0,
    damagedCount: 0,
    discrepancyReportUrl: '/reports/audit-8002-final.pdf',
    items: []
  }
];

export const mockLogs = [
  { id: 901, timestamp: '2026-07-12 09:30 AM', user: 'Elena Rostova', action: 'BOOKING_CREATED', details: 'Booked Conference Room B2 for Jul 14 02:00 PM' },
  { id: 902, timestamp: '2026-07-12 08:45 AM', user: 'David Chen', action: 'MAINTENANCE_APPROVED', details: 'Approved repair request #5001 for Sony Projector AF-0062' },
  { id: 903, timestamp: '2026-07-11 04:15 PM', user: 'Sarah Jenkins', action: 'ASSET_REGISTERED', details: 'Registered new Dell Latitude 7440 (Asset Tag: AF-0312)' },
  { id: 904, timestamp: '2026-07-11 02:00 PM', user: 'Marcus Sterling', action: 'ROLE_PROMOTED', details: 'Promoted David Chen to DEPARTMENT_HEAD for Engineering & IT' },
  { id: 905, timestamp: '2026-07-10 11:20 AM', user: 'System Alert', action: 'OVERDUE_FLAGGED', details: 'MacBook Pro AF-0114 return overdue by 12 days (Elena Rostova)' }
];
