// Affiliate Book Registry & E-Commerce
export enum BookStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  PENDING_APPROVAL = "pending_approval",
}

export interface BookHighlight {
  id: string;
  bookId: string;
  imageUrl: string; // Highlight screenshot/photo
  title: string;
  quote: string;
  pageNumber?: number;
  authorName: string;
  publisherName: string;
  isbn?: string;
  uploadedBy: string; // User ID or admin
  createdAt: Date;
  status: BookStatus;
}

export interface AffiliateBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  externalLink: string; // Amazon, IndieBound, publisher link
  thumbnail?: string;
  description?: string;
  highlights: BookHighlight[];
  commissionPercentage: number; // Platform takes from sale
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCheckoutOrder {
  id: string;
  bookId: string;
  userId: string;
  externalOrderId: string; // Order ID from external vendor
  purchasePrice: number;
  platformShare: number; // 3% to nonprofit
  userDiscount: number; // 33% member discount
  authorPayment: number;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: Date;
  completedAt?: Date;
}

// Practitioner Compliance Tracking
export enum PractitionerViolationType {
  EXTERNAL_PAYMENT_LINK = "external_payment_link", // PayPal, Venmo, etc.
  OFF_PLATFORM_SOLICITATION = "off_platform_solicitation",
  PRICE_GOUGING = "price_gouging", // Over $55/hour
  PREDATORY_MESSAGING = "predatory_messaging",
  UNAUTHORIZED_EXTERNAL_CONTACT = "unauthorized_external_contact",
  FRAUD = "fraud",
  SHADY_BUSINESS_PRACTICE = "shady_business_practice",
}

export interface ComplianceViolation {
  id: string;
  practitionerId: string;
  practitionerName: string;
  businessEntity?: string;
  violationType: PractitionerViolationType;
  severity: "warning" | "critical";
  detectionMethod: "automated_keyword" | "automated_link_detection" | "user_report";
  evidence: string; // Message excerpt, screenshot URL, etc.
  flaggedAt: Date;
  reviewedBy?: string; // Admin ID
  reviewedAt?: Date;
  status: "flagged" | "under_review" | "verified" | "dismissed";
  actionTaken?: "suspended" | "terminated"; // permanent
  actionDate?: Date;
  confidential: boolean; // For internal review
}

export interface ComplianceKeywords {
  externalPaymentMethods: string[];
  offPlatformSolicitation: string[];
  predatoryLanguage: string[];
}

// User Liability & Waivers
export enum WaiverStatus {
  NOT_APPLICABLE = "not_applicable",
  PENDING = "pending",
  SIGNED = "signed",
  REJECTED = "rejected",
}

export interface OffPlatformWaiver {
  id: string;
  userId: string;
  practitionerId: string;
  practitionerName: string;
  waiverText: string;
  signatureUrl: string; // Digital signature image/data
  signingDate: Date;
  ipAddress: string;
  userAgent: string;
  status: WaiverStatus;
  acknowledgesLeavingSafeSpace: boolean;
  acknowledgesReleasingPlatform: boolean;
  acknowledgesNoLiability: boolean;
  acknowledgesPrivateAgreement: boolean;
  createdAt: Date;
}

// Public Disciplinary Ledger
export interface DisciplinaryRecord {
  id: string;
  practitionerId: string;
  practitionerName: string;
  businessEntity?: string;
  violationType: PractitionerViolationType;
  reason: string; // Public-facing explanation
  banDate: Date;
  bannedPermanently: boolean;
  publiclyListed: boolean; // Visible in community portal
  victimCount?: number; // Number of users affected
  affectedUserIds?: string[]; // For internal tracking
  confidentialDetails?: string; // Not public
  reportedBy?: string; // "User Report" or "Automated Detection"
  listingDate: Date;
}

// Shady Business Reporting Portal
export enum ReportStatus {
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  VERIFIED = "verified",
  FALSE_REPORT = "false_report",
  DISMISSED = "dismissed",
}

export interface ShadyBusinessReport {
  id: string;
  reporterId: string; // Anonymous option available
  practitionerId: string;
  practitionerName: string;
  reportType: PractitionerViolationType;
  description: string; // Detailed account of violation
  evidence: string[]; // Screenshot URLs, message excerpts
  dateOfIncident: Date;
  submittedAt: Date;
  status: ReportStatus;
  reviewedBy?: string; // Admin ID
  reviewedAt?: Date;
  findings?: string; // Investigation results
  actionRecommended?: string;
  anonymous: boolean;
  userConsent: boolean; // User agrees to investigation use of their data
  followUpRequired: boolean;
}

// Automated Detection Patterns
export interface CompliancePattern {
  id: string;
  pattern: string; // Regex or keyword
  type: "payment_link" | "off_platform_keyword" | "predatory_language";
  severity: "low" | "medium" | "high" | "critical";
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}
