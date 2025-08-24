# ZenSei Frontend - Future Features Implementation Plan

This document provides detailed guidelines, requirements, and actionable tasks for implementing the Priority D features in ZenSei.

---

## 1. Settings Page
**Purpose:** User customization options

### Features & Requirements
- Change username (with validation, e.g. min/max length, allowed characters)
- Change avatar image (upload or select from preset icons)
- User preferences (theme, notification settings, etc. - can be stubbed for now)
- Save settings to localStorage or backend (if available)
- Responsive and accessible UI

### Guidelines
- Use a modal or dedicated `/settings` route
- Avatar selection: show current avatar, allow upload or pick from ZenSei icons
- Username: input with live validation and save button
- Preferences: use toggles/switches for options
- Show success/error feedback on save

### To-Do Tasks
- [ ] Create Settings page route/component
- [ ] Implement username change with validation
- [ ] Implement avatar change (upload/select)
- [ ] Add user preferences section (stub or real)
- [ ] Save settings to localStorage (or backend if available)
- [ ] Add feedback (success/error)
- [ ] Link to settings from user menu/header

---

## 2. Transactions Page
**Purpose:** Show agent transaction history

### Features & Requirements
- Display last 10-20 transactions for agent wallet
- Use agent address from ENV file
- Show: hash, amount, type, timestamp
- Add link to blockchain explorer for each tx
- Paginate or scroll if more than 10-20 txs
- Show loading and error states

### Guidelines
- Use `/transactions` route
- Fetch data from blockchain API (or mock if not available)
- Use table or card layout for txs
- Format amounts and timestamps for readability
- Explorer link: open in new tab
- Responsive and accessible design

### To-Do Tasks
- [ ] Create Transactions page route/component
- [ ] Fetch agent address from ENV
- [ ] Fetch last 10-20 transactions (API or mock)
- [ ] Display tx details (hash, amount, type, timestamp)
- [ ] Add explorer links
- [ ] Handle loading/error states
- [ ] Paginate or scroll if needed
- [ ] Link to transactions page from portfolio/agent wallet

---

## 3. Voice Support
**Purpose:** Audio message functionality

### Features & Requirements
- Record voice messages (browser mic API)
- Send audio via webhook URL (as file/blob)
- Receive text or audio responses
- Play/pause controls for audio messages
- Show audio messages in chat (bubble with play button)
- WhatsApp/Telegram style (not real-time)
- Show upload/progress state
- Fallback for unsupported browsers

### Guidelines
- Use a record button in chat input area
- Show waveform or timer while recording
- Store audio as blob, send to webhook as FormData
- Display audio messages with play/pause, duration
- Use accessible audio controls
- Graceful fallback for browsers without mic support

### To-Do Tasks
- [ ] Add record button to chat input
- [ ] Implement audio recording (mic API)
- [ ] Send audio to webhook (FormData)
- [ ] Handle audio/text responses
- [ ] Display audio messages in chat
- [ ] Add play/pause controls
- [ ] Show upload/progress state
- [ ] Fallback for unsupported browsers

---

## 4. Automations Page (Mockup)
**Purpose:** Create expectations for upcoming features

### Features & Requirements
- "Coming Soon" page for automations
- List planned automations:
  - DCA (Dollar Cost Averaging)
  - Notifications
  - Reports
  - Rebalancing
  - Limit Orders
  - Auto-compounding
- Brief description for each automation
- Attractive, engaging design
- Optionally, allow users to "subscribe for updates" (email input, stub only)

### Guidelines
- Use `/automations` route
- Use cards or list for each automation
- Add icons/illustrations for visual appeal
- Responsive and accessible design
- Make it clear features are not yet available

### To-Do Tasks
- [ ] Create Automations page route/component
- [ ] List all planned automations with descriptions
- [ ] Add icons/visuals for each
- [ ] Add "Coming Soon" messaging
- [ ] (Optional) Add subscribe for updates input (stub)
- [ ] Link to automations page from main nav

---

*This plan ensures each feature is well-defined, actionable, and ready for phased implementation.* 