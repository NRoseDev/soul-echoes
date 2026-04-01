---
name: Safety angel system
description: Distress signal with Michael/Faith guides, situation codes, AES-256 encryption, offline queuing, shake/voice activation
type: feature
---
Distress signal system activated by:
- Tapping 🛡️ shield icon (bottom-right corner, every screen)
- Saying "angel" (background voice recognition)
- Shaking phone twice (DeviceMotion API)
- Native: long-press volume down, works with screen off (Capacitor only)

Flow: Verify access → Choose Your Guide (title, no emoji) → Select situation → AES-256 encrypt → 🦄 confirmation shown → Signal queued

🦄 unicorn is EXCLUSIVELY the confirmation signal shown AFTER distress signal is received. It appears nowhere else in the app.

Angels (no unicorn horns on images):
- Michael ⚔️ — Physical Safety (codes 111-555)
- Faith 🕊️ — Inner Crisis (codes 111-555)

Angel selection does NOT appear in onboarding. Onboarding has a quiet safety info screen instead:
"This app includes a private safety feature. You can access it anytime from the main menu. Only you will know what it does."

Access methods: PIN, code word, symbol, color sequence, sign gesture, drawn pattern
Signals encrypted with AES-256-GCM (Web Crypto API) before storage/transmission
Signals stored in distress_signals table + localStorage queue for offline
SMS fallback via Twilio (future)

Safety settings stored in localStorage under "soul-echoes-safety"
