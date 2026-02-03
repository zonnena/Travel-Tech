# Requirements: Geo-AR Hackathon Demo

**Defined:** 2026-02-03
**Core Value:** Standing somewhere and feeling deeply connected to that place through personalized, layered information

## v1 Requirements

### Map & Location

- [ ] **MAP-01**: Google Maps displays with user's live GPS position centered
- [ ] **MAP-02**: Simulated friend avatars appear on the map with names and movement
- [ ] **MAP-03**: Ghost Mode toggle visually hides/shows friend avatars
- [ ] **MAP-04**: Map shows POI markers for nearby points of interest

### Dual-Axis Navigator

- [ ] **NAV-01**: Y-axis control to select time period (Ancient, Medieval, Ottoman, Modern, Folklore)
- [ ] **NAV-02**: X-axis control to select content category (Archaeology, Nature, Religion, Geology)
- [ ] **NAV-03**: Visual feedback when switching time period (color/theme shift)
- [ ] **NAV-04**: Smooth 60fps transitions between category selections

### AI Content

- [ ] **AI-01**: Send current GPS coordinates + selected time period + category to Claude API
- [ ] **AI-02**: Display generated historical/cultural content in a readable content panel
- [ ] **AI-03**: Content updates when user changes time period or category
- [ ] **AI-04**: Loading state while AI generates content

### Look & Feel

- [ ] **UI-01**: Dark mode base theme with neon accent colors
- [ ] **UI-02**: Responsive layout — works on mobile browser and desktop
- [ ] **UI-03**: Gen-Z aesthetic: clean typography, gradients, glow effects
- [ ] **UI-04**: App feels polished enough for live demo (no broken states visible)

## v2 Requirements

### AR & Shaders

- **AR-01**: AR camera view with location-aware overlays
- **AR-02**: Time-period shaders (sepia for old, neon for folklore)

### Personalization

- **PERS-01**: Track user interest via dwell time
- **PERS-02**: Dynamically reorder categories based on interest vector

### Social (Real)

- **SOC-01**: Real-time friend positions via Firebase
- **SOC-02**: User authentication with Google Sign-In

### Gamification

- **GAM-01**: Credit system for check-ins and ratings
- **GAM-02**: Digital stamps for completing region sets

### Marketplace

- **MKT-01**: Creator content upload interface
- **MKT-02**: Content ranking algorithm

## Out of Scope

| Feature | Reason |
|---------|--------|
| Flutter native app | Web app chosen for hackathon speed |
| Firebase backend | Not needed for demo — fake data + direct API calls |
| Real authentication | No login needed for demo |
| Tokenomics / credits | Pitch deck concept only |
| NFT stamps | Pitch deck concept only |
| Content moderation | Not relevant for demo |
| AR camera integration | Too complex for one-day build |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MAP-01 | Phase 1 | Complete |
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| AI-01 | Phase 3 | Pending |
| AI-02 | Phase 3 | Pending |
| AI-03 | Phase 3 | Pending |
| AI-04 | Phase 3 | Pending |
| MAP-02 | Phase 4 | Pending |
| MAP-03 | Phase 4 | Pending |
| MAP-04 | Phase 4 | Pending |
| UI-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-03 after roadmap creation*
