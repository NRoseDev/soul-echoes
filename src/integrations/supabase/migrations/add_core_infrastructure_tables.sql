-- Add CrisisContext table for crisis detection tracking
CREATE TABLE crisis_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  detected_at TIMESTAMP DEFAULT now(),
  severity TEXT NOT NULL, -- 'low', 'moderate', 'high', 'critical'
  detection_source TEXT, -- 'keyword_analysis', 'biometric_analysis', 'combined'
  triggered_resources JSONB, -- Resource recommendations sent
  user_acknowledged BOOLEAN DEFAULT FALSE,
  user_accepted_help BOOLEAN DEFAULT FALSE,
  follow_up_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX crisis_interventions_user ON crisis_interventions(user_id);
CREATE INDEX crisis_interventions_severity ON crisis_interventions(severity);

-- Accessibility session tracking
CREATE TABLE accessibility_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE,
  primary_modality TEXT,
  secondary_modalities TEXT[],
  assistive_devices TEXT[],
  start_time TIMESTAMP DEFAULT now(),
  end_time TIMESTAMP,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX accessibility_sessions_user ON accessibility_sessions(user_id);

-- Book checkout history for affiliate tracking
CREATE TABLE book_purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES book_checkout_orders(id),
  nonprofit_received DECIMAL(10, 2),
  user_saved DECIMAL(10, 2),
  author_received DECIMAL(10, 2),
  purchase_date TIMESTAMP DEFAULT now()
);

CREATE INDEX book_purchases_user ON book_purchase_history(user_id);
CREATE INDEX book_purchases_nonprofit_sum ON book_purchase_history(nonprofit_received);

-- Anti-burnout pause protocol tracking
CREATE TABLE pause_protocol_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  triggered_after_room TEXT,
  emotional_intensity INT,
  session_duration_minutes INT,
  pause_duration_seconds INT,
  completed BOOLEAN DEFAULT FALSE,
  breathing_phase_duration INT,
  gratitude_phase_duration INT,
  reward_phase_duration INT,
  user_reward_logged TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX pause_protocol_user ON pause_protocol_sessions(user_id);
