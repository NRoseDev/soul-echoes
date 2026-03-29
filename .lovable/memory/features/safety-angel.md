---
name: Safety angel system
description: Unicorn distress signal with Michael/Faith angels, situation codes, offline queuing, shake/voice activation
type: feature
---
Distress signal system activated by:
- Tapping unicorn 🦄 icon (bottom-right corner, every screen)
- Saying "angel" (background voice recognition)
- Shaking phone twice (DeviceMotion API)
- Native: long-press volume down, works with screen off (Capacitor only)

Flow: Verify access → Select angel → Select situation → Glitter burst → Signal queued

Angels:
- Michael ⚔️ — Physical Safety (codes 111-555)
- Faith 🕊️ — Inner Crisis (codes 111-555)

Access methods: PIN, code word, symbol, color sequence, sign gesture, drawn pattern
Signals stored in distress_signals table + localStorage queue for offline
SMS fallback via Twilio (future)

Safety settings stored in localStorage under "soul-echoes-safety"
