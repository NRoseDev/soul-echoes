# Soul Echoes — Developer Handoff Blueprint

## 🎯 Core Vision
Soul Echoes is an AI emotional advocate system designed to help users process thoughts, emotions, and communication through multiple input types (text, voice, sign, gestures, cards, assistive devices).

It is NOT a chatbot. It is an emotional navigation and advocacy system.

---

## 🧠 Core System Architecture

The system has 4 layers:

### 1. Universal Input Layer
All human input methods normalize into:
- emotion
- intent
- intensity
- clarity

Supports:
- text
- voice
- signed language
- gesture/card selection
- pendulum input
- eye movement
- braille devices
- external signals

---

### 2. Emotion Layer
Predefined emotion registry:
- Fear
- Overwhelm
- Heartbreak
- Guilt
- Numbness
- Betrayal
- Abandonment
- Hopelessness

Each emotion is a signal, not a conversation topic.

---

### 3. AI Advocate Layer
The AI must:

- Reflect user in 1–2 sentences max
- Never overwhelm with information
- Provide max 2 suggestions
- Always include “stay in Brain Dump”
- Prioritize emotional stabilization over explanation

---

### 4. Routing Layer (Rooms System)
Rooms are healing destinations:
- Brain Dump (release thoughts)
- Breathe (regulation)
- Journal (reflection)
- Unspoken (communication)
- Shadow Work (deeper patterns)
- Spiritual Tools (grounding)
- Wisdom (reframing)
- Portal (support connection)

AI selects max 2 rooms based on emotion.

---

## 🔄 Runtime Flow

1. User input (any modality)
2. Normalize to emotion + intent + intensity + clarity
3. Match emotion via registry
4. Apply AI advocate rules (tone + limits)
5. Run routing map (max 2 rooms)
6. Return response:
   - reflection
   - 1–2 room suggestions
   - always include “stay here”

---

## ⚠️ Critical Constraints

- No long explanations
- No multiple simultaneous suggestions
- No forcing transitions
- User always retains control
- Calm tone even in high emotional states

---

## 🔐 Product Philosophy

- Accessibility-first (all communication forms equal)
- Trauma-aware
- ADHD-friendly
- Low cognitive load
- Emotion-first, logic-second
- No overwhelm allowed in any response

---

## 🚀 Developer Goal

Build a working MVP where:
- user input → AI response → room suggestion works end-to-end
- system follows routing + advocate rules strictly
- outputs are consistent and minimal
