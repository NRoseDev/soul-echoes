-- Compliance & Legal Infrastructure

-- Affiliate Books Registry
CREATE TABLE affiliate_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  isbn TEXT UNIQUE,
  external_link TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  commission_percentage DECIMAL(5, 2) DEFAULT 3.00,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Book Highlights
CREATE TABLE book_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES affiliate_books(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  quote TEXT NOT NULL,
  page_number INT,
  author_name TEXT,
  publisher_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending_approval', -- 'active', 'archived', 'pending_approval'
  created_at TIMESTAMP DEFAULT now()
);

-- Book Checkout Orders
CREATE TABLE book_checkout_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES affiliate_books(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  external_order_id TEXT,
  purchase_price DECIMAL(10, 2),
  platform_share DECIMAL(10, 2), -- 3% to nonprofit
  user_discount DECIMAL(10, 2), -- 33% member discount
  author_payment DECIMAL(10, 2),
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);

-- Practitioner Compliance Violations
CREATE TABLE compliance_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_name TEXT NOT NULL,
  business_entity TEXT,
  violation_type TEXT NOT NULL,
  -- Types: external_payment_link, off_platform_solicitation, price_gouging,
  --        predatory_messaging, unauthorized_external_contact, fraud, shady_business_practice
  severity TEXT NOT NULL, -- 'warning', 'critical'
  detection_method TEXT, -- 'automated_keyword', 'automated_link_detection', 'user_report'
  evidence TEXT,
  flagged_at TIMESTAMP DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  status TEXT DEFAULT 'flagged', -- 'flagged', 'under_review', 'verified', 'dismissed'
  action_taken TEXT, -- 'suspended', 'terminated'
  action_date TIMESTAMP,
  confidential BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX compliance_violations_practitioner ON compliance_violations(practitioner_id);
CREATE INDEX compliance_violations_status ON compliance_violations(status);

-- Compliance Patterns (Automated Detection Rules)
CREATE TABLE compliance_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern TEXT NOT NULL,
  pattern_type TEXT NOT NULL, -- 'payment_link', 'off_platform_keyword', 'predatory_language'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  last_triggered TIMESTAMP
);

-- Off-Platform Waivers (Liability Release)
CREATE TABLE off_platform_waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_name TEXT NOT NULL,
  waiver_text TEXT NOT NULL,
  signature_url TEXT, -- Base64 or image URL
  signing_date TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  status TEXT DEFAULT 'pending', -- 'not_applicable', 'pending', 'signed', 'rejected'
  acknowledges_leaving_safe_space BOOLEAN DEFAULT FALSE,
  acknowledges_releasing_platform BOOLEAN DEFAULT FALSE,
  acknowledges_no_liability BOOLEAN DEFAULT FALSE,
  acknowledges_private_agreement BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX off_platform_waivers_user ON off_platform_waivers(user_id);
CREATE INDEX off_platform_waivers_practitioner ON off_platform_waivers(practitioner_id);

-- Public Disciplinary Ledger
CREATE TABLE disciplinary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_name TEXT NOT NULL,
  business_entity TEXT,
  violation_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  ban_date TIMESTAMP DEFAULT now(),
  banned_permanently BOOLEAN DEFAULT TRUE,
  publicly_listed BOOLEAN DEFAULT TRUE,
  victim_count INT,
  confidential_details TEXT,
  reported_by TEXT, -- 'User Report' or 'Automated Detection'
  listing_date TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX disciplinary_records_public ON disciplinary_records(publicly_listed, banned_permanently);
CREATE INDEX disciplinary_records_practitioner ON disciplinary_records(practitioner_name);

-- Shady Business Reports (User Reporting Portal)
CREATE TABLE shady_business_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  practitioner_name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- Violation types
  description TEXT NOT NULL,
  date_of_incident TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP DEFAULT now(),
  status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'verified', 'false_report', 'dismissed'
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  findings TEXT,
  action_recommended TEXT,
  anonymous BOOLEAN DEFAULT TRUE,
  user_consent BOOLEAN DEFAULT TRUE,
  follow_up_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX shady_business_reports_status ON shady_business_reports(status);
CREATE INDEX shady_business_reports_practitioner ON shady_business_reports(practitioner_name);
CREATE INDEX shady_business_reports_reporter ON shady_business_reports(reporter_id);

-- Report Evidence (Screenshots, etc.)
CREATE TABLE report_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES shady_business_reports(id) ON DELETE CASCADE,
  evidence_type TEXT, -- 'screenshot', 'message_excerpt', 'audio', 'other'
  file_url TEXT,
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT now()
);

-- RLS Policies
ALTER TABLE compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE off_platform_waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shady_business_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_checkout_orders ENABLE ROW LEVEL SECURITY;

-- Admins can view all compliance records
CREATE POLICY "Admins view compliance violations"
  ON compliance_violations FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Users can only view public disciplinary ledger
CREATE POLICY "Public can view disciplinary ledger"
  ON disciplinary_records FOR SELECT
  USING (publicly_listed = TRUE);

-- Users can view their own waivers
CREATE POLICY "Users view own waivers"
  ON off_platform_waivers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can submit reports
CREATE POLICY "Users submit reports"
  ON shady_business_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id OR anonymous = TRUE);

-- Users can view their own orders
CREATE POLICY "Users view own orders"
  ON book_checkout_orders FOR SELECT
  USING (auth.uid() = user_id);
