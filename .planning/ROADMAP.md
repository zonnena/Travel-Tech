# Roadmap: Geo-AR Hackathon Demo

## Overview

Build a location-based cultural exploration demo in one day: start with a working map and dark theme shell, add the dual-axis time/category navigator, wire up Claude API for AI-generated content, then polish with social map layer and demo-readiness fixes. Four tight phases, each shippable and verifiable on a phone browser.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Map integration and dark theme shell
- [ ] **Phase 2: Dual-Axis Navigator** - Time period and category selection controls
- [ ] **Phase 3: AI Content** - Claude API integration for location-aware content
- [ ] **Phase 4: Polish & Social** - Social map layer, POI markers, and demo readiness

## Phase Details

### Phase 1: Foundation
**Goal**: User sees a live map centered on their GPS position inside a dark, neon-accented app shell that works on both phone and desktop
**Depends on**: Nothing (first phase)
**Requirements**: MAP-01, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Opening the app on a phone browser shows Google Maps centered on the user's current GPS location
  2. The app has a dark background with neon accent colors and clean Gen-Z typography
  3. The layout adapts between mobile phone and desktop browser without breaking
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding, Google Maps integration, GPS positioning, dark theme and responsive layout

### Phase 2: Dual-Axis Navigator
**Goal**: User can select any combination of time period and content category with smooth, visually distinct transitions
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. User can slide or tap to select a time period on the Y-axis (Ancient, Medieval, Ottoman, Modern, Folklore)
  2. User can slide or tap to select a content category on the X-axis (Archaeology, Nature, Religion, Geology)
  3. Changing the time period produces a visible color or theme shift in the UI
  4. Transitions between selections are smooth (no jank or stutter)
**Plans**: TBD

Plans:
- [ ] 02-01: Y-axis time period control, X-axis category control, visual feedback and transition animations

### Phase 3: AI Content
**Goal**: User sees rich, AI-generated historical/cultural content that updates based on their location and navigator selections
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, AI-04
**Success Criteria** (what must be TRUE):
  1. Selecting a time period and category triggers a Claude API call with the user's GPS coordinates
  2. Generated content displays in a readable panel with proper formatting
  3. Changing the time period or category fetches and displays new content
  4. A loading indicator appears while content is being generated
**Plans**: TBD

Plans:
- [ ] 03-01: Claude API integration, content panel UI, loading states, content refresh on selection change

### Phase 4: Polish & Social
**Goal**: Demo is presentation-ready with simulated social presence on the map and no visible broken states
**Depends on**: Phase 3
**Requirements**: MAP-02, MAP-03, MAP-04, UI-04
**Success Criteria** (what must be TRUE):
  1. Simulated friend avatars appear on the map with names and gentle movement animation
  2. Ghost Mode toggle hides and shows friend avatars on the map
  3. POI markers appear on the map for nearby points of interest
  4. The full app flow works end-to-end on a phone browser with no broken or empty states visible during demo
**Plans**: TBD

Plans:
- [ ] 04-01: Social avatar layer, Ghost Mode toggle, POI markers, and end-to-end demo polish

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation | 0/1 | Not started | - |
| 2. Dual-Axis Navigator | 0/1 | Not started | - |
| 3. AI Content | 0/1 | Not started | - |
| 4. Polish & Social | 0/1 | Not started | - |
