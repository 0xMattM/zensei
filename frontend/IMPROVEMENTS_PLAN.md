# ZenSei Frontend - Improvements Plan

## Overview
This document outlines planned improvements to enhance user experience and add new features to the ZenSei frontend application.

## Priority A: Chat Interface Improvements

### 1. Fixed Clear Chat Button
**Issue**: Clear chat button disappears when scrolling down
**Solution**: Make button always visible (sticky/fixed position)
- Position: Top right corner of chat interface
- Behavior: Always visible regardless of scroll position
- Implementation: Change from relative to fixed positioning

### 2. Tips Button Alignment
**Issue**: Tips button positioning needs adjustment
**Solution**: Improve alignment and spacing
- Move down to align with chat input and send button
- Move slightly to the right for better spacing
- Ensure consistent height alignment

### 3. Avatar Images
**Issue**: No visual distinction between user and agent messages
**Solution**: Add avatar images for both user and agent
- Agent: Use ZenSei icon (one color variant)
- User: Use ZenSei icon (different color variant)
- Position: Left side of each message
- Future: Allow user avatar customization (Settings page)

## Priority B: Portfolio Page Improvements

### 1. Remove SEI Price Indicator
**Issue**: Redundant price information displayed
**Solution**: Clean up wallet overview display
- Remove SEI price from user wallet section
- Remove SEI price from agent wallet section
- Keep only balance and USD value

## Priority C: Analytics Page Improvements

### 1. Historical TVL Chart
**Changes needed**:
- Default to "All time" data (no timeframe selector)
- Remove TVL value and 24h change (already shown in stats cards)
- Remove bottom indicators: "Showing 702 data points" and "Range: All time"
- Change title from "Total Value Locked" to "TVL History"

### 2. Protocol Analysis Component
**Changes needed**:
- Sort by TVL only (remove other sorting options)
- Remove category filter (show all protocols by default)
- Remove bottom text: "Showing 6 of 6 protocols Category: All"
- Improve hover highlight color (not white)
- Keep tooltip functionality

### 3. Protocol Categories Card
**Issue**: Tooltip has poor contrast
**Solution**: Change tooltip background color for better text readability

### 4. 7-Day Activity Card
**Issue**: Too many decimals in numbers
**Solution**: Format numbers for better readability
- Avg Daily Txns: Remove decimals, show whole numbers
- Avg Users: Remove decimals, show whole numbers

## Priority D: Future Features (Implementation Later)

### 1. Settings Page
**Purpose**: User customization options
**Features**:
- Change username
- Change avatar image
- User preferences

### 2. Transactions Page
**Purpose**: Show agent transaction history
**Features**:
- Display last 10-20 transactions
- Use agent address from ENV file
- Add link to blockchain explorer for full history
- Transaction details: hash, amount, type, timestamp

### 3. Voice Support
**Purpose**: Audio message functionality
**Features**:
- Record voice messages
- Send audio via webhook URL
- Receive text or audio responses
- Play/pause controls for audio messages
- WhatsApp/Telegram style voice messages
- **Note**: NOT real-time audio, asynchronous like messaging

### 4. Automations Page (Mockup)
**Purpose**: Create expectations for upcoming features
**Features**: "Coming Soon" page with planned automations:
- DCA (Dollar Cost Averaging)
- Notifications
- Reports
- Rebalancing
- Limit Orders
- Auto-compounding

## Implementation Approach

### Phase 1: Quick Wins (Priority A & B)
- Fix chat interface issues
- Clean up portfolio page
- **Estimated time**: 1-2 days

### Phase 2: Analytics Improvements (Priority C)
- Update all analytics components
- Improve data visualization
- **Estimated time**: 2-3 days

### Phase 3: New Features (Priority D)
- Build new pages and functionality
- Integrate advanced features
- **Estimated time**: 1-2 weeks per feature

## Technical Notes

### Chat Interface
- Use `position: sticky` or `position: fixed` for clear button
- Adjust flexbox alignment for tips button
- Create avatar component with conditional styling

### Analytics
- Modify chart configurations
- Update data formatting functions
- Improve CSS for tooltips and hover states

### Future Features
- Create new route pages
- Integrate audio recording APIs
- Design mockup components for automations

## Success Metrics
- Improved user experience with persistent controls
- Cleaner, more focused analytics display
- Enhanced visual communication with avatars
- Foundation for advanced features

---

*This plan prioritizes immediate UX improvements while setting the foundation for future feature expansion.* 