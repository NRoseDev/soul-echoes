# Soul Echoes: "Words and Behavior" Feature Specification
## Module: From Brain Up to Wisdom (Educational to Reflective Journey)

### 1. Feature Architecture Overview
The "Words and Behavior" feature is a core component of the tracking system. It provides users with an educational foundation to recognize toxic, narcissistic, or abusive communication patterns, tracks their real-time entries, and utilizes AI to reflect historical patterns and personal growth back to them.

### 2. Universal Accessibility Layer (Dynamic Communication Interface)
The interface must dynamically adapt based on the user's current communication level, sensory needs, or physical state:
*   **Text/Visual Mode:** Clean, high-contrast typography for standard reading and manual logging.
*   **Audio/Spoken Mode:** Full voice readout and conversational AI voice interface for hands-free reflection (critical during physical distress, cognitive fatigue, or visual impairment).
*   **Tactile/Assistive Mode:** Direct compatibility with system accessibility frameworks, including screen readers and refreshable Braille displays.

### 3. Database Schema: Words & Behavior Log
To track interactions and allow the AI to accurately answer reflective questions, each log entry must capture the following schema:

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `entry_id` | UUID | Unique identifier for the journal entry. |
| `timestamp` | DateTime | Universal timestamp of the log creation. |
| `external_actor` | String | Identifier/alias for the person involved (e.g., "Contact A"). |
| `observed_word_cue` | Text | The specific language used (e.g., high-urgency demands, spiritual weaponization). |
| `observed_behavior_pattern` | Array[String] | System tags matching the behavior (e.g., `hoovering`, `boundary_deflection`, `financial_exploitation`). |
| `user_action_taken` | Text | How the user responded/acted (e.g., "Enforced boundary, blocked contact"). |
| `user_somatic_state` | Map | Physical and emotional indicators (e.g., `{ anxiety: high, physical_pain: true }`). |

### 4. AI Engine Behavior & Reflection Prompts
When a user calls the AI to reflect on this module (e.g., "Hey, take me to words and behavior. What happened last time?"), the LLM must execute the following protocol:
*   **Historical Pattern Analysis:** Query the database for past entries involving the same external actor or behavioral tags.
*   **Comparative Feedback:** Contrast the user's current reaction with past reactions to highlight progress, agency, and held boundaries (e.g., *"The last time this happened, your anxiety spiked and the interaction continued. This time, you recognized the pattern, took immediate action, and enforced your boundary."*).
*   **Tone Regulation:** Maintain a deeply grounded, objective, yet supportive tone that validates reality and reinforces truth, avoiding overly academic jargon.
