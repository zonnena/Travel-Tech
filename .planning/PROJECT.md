# Geo-AR Interactive Experience Platform (Hackathon Demo)

## What This Is

A location-based cultural exploration platform — "TikTok meets Waze" for history and culture. Users stand at a location in Israel and discover its historical, archaeological, geological, and cultural layers through a dual-axis interface: vertical (time periods) and horizontal (content categories). AI generates rich, localized content on the fly. A social map shows friends exploring nearby. This is a hackathon demo targeting tomorrow's presentation.

## Core Value

Standing somewhere and feeling deeply connected to that place through personalized, layered information — past, present, and folklore — tailored to what interests you.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dual-axis navigator: vertical Y-axis (Past → Present → Folklore/Future) and horizontal X-axis (Archaeology, Nature, Religion, Geology)
- [ ] GPS-aware: detect user's current location and use it as context for all content
- [ ] AI-generated content: call Claude API with location + selected time period + category to produce rich historical/cultural content
- [ ] Google Maps integration with user's position marker
- [ ] Social map layer: simulated friend avatars on the map with movement (fake data for demo)
- [ ] Ghost Mode toggle (privacy concept — visual toggle, doesn't need real backend)
- [ ] Personalization hint: reorder categories based on simulated user interest (can be hardcoded for demo)
- [ ] Dark mode, neon-accented Gen-Z aesthetic
- [ ] Works on mobile browser (phone demo) and desktop browser (big screen presentation)
- [ ] Responsive layout that looks good on both form factors

### Out of Scope

- AR camera/shader effects — pitch deck only, not in demo
- Real authentication system — no login needed for demo
- Tokenomics/credit system — pitch deck concept
- NFT stamps / digital collectibles — pitch deck concept
- Creator marketplace — future feature
- Real social backend — using simulated friend data
- Firebase backend — not needed for demo scope
- Content moderation — not relevant for demo

## Context

- **Hackathon timeline:** Building now, presenting tomorrow
- **Demo format:** Live on phone (mobile browser) + localhost on big screen (projector)
- **Target region:** Israel — content generation focused on Israeli locations
- **Content strategy:** All content AI-generated via Claude API based on GPS coordinates
- **Audience:** Hackathon judges evaluating the concept and working demo
- **Full vision:** Flutter + Firebase + AR production app (documented in original spec for future development)

## Constraints

- **Timeline**: Must be demo-ready by tomorrow — ruthless scope cutting required
- **Tech stack**: Web app (HTML/CSS/JS or lightweight framework) — fastest path to working demo
- **Content**: AI-generated only — no pre-curated content database needed
- **Performance**: Must work smoothly on phone browser for live demo
- **API**: Claude API key needed for content generation
- **Maps**: Google Maps API key needed for map integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web app instead of Flutter | One-day timeline — web is faster to prototype | — Pending |
| AI-generated content instead of database | No time to curate content; AI fills all locations | — Pending |
| Fake social data | Real-time social requires Firebase setup — not worth it for demo | — Pending |
| No AR for demo | AR setup is complex and wasn't selected as must-have for demo | — Pending |
| Israel-focused | Specific region for demo, matches "Galilee Explorer" vision | — Pending |

---
*Last updated: 2026-02-03 after initialization*
