# Portfolio design

The site introduces Varellio Louis Tinangon without asserting unverified career history. The visual direction is an editorial personal journal: warm paper, olive ink, oversized serif typography, generous spacing, and sculptural orange artwork made in CSS.

## Navigation and wireframe

```text
Header: vlt wordmark | About | Selected work | Contact | Theme
Hero: introduction + two actions | abstract orbital artwork
      name / scroll cue
About: section index | introduction, LinkedIn link, placeholder note
Experience: honest empty-state introduction + LinkedIn
Work: section heading | three project cards
Contact: invitation + LinkedIn | name, email, message, submit
Footer: wordmark + motto | copyright, LinkedIn, back to top
```

At desktop widths the hero, about, and contact use complementary columns. The work grid has three equal cards. Below 760px these become a single reading column; below 440px navigation becomes an expandable menu. Canva is unavailable in this environment; the implemented page and this wireframe provide the reviewable design.

## Tokens

- Paper `#f7f5ef`, ink `#242720`, muted text `#73756d`, divider `#dcded3`.
- Orange accent `#e66b36`, artwork background `#e9eadf`.
- Dark theme: paper `#20251f`, ink `#f2f0e6`, muted `#a6ad9e`.
- Instrument Serif for large editorial headings; DM Sans for body and controls; Manrope for wordmark and artwork.
- Main content maximum width 1440px with 6.25% side gutters. Cards and buttons use restrained 3px radii.

## Interaction states

Navigation anchors scroll to sections. The theme toggle persists in local storage. Mobile navigation exposes its expanded state. Project cards open native modal dialogs with clearly identified placeholder text; close button, Escape, and backdrop clicks dismiss them. LinkedIn links open the supplied profile in a new tab.

The contact form has idle, sending, success, and error states. Sending disables the button, success clears the form, and errors preserve user input. Browser validation checks required fields, email format, and message length. The hidden `company` field is a honeypot. Submission uses `POST /api/contact`; page views and successful submissions use the minimal analytics endpoint.

## Accessibility and motion

Semantic landmarks, one h1, explicit form labels, keyboard focus indicators, a skip link, accessible icon button names, polite submission announcements, and native modal focus handling are included. Both themes have dedicated text and surface tokens. Framer Motion provides one-time entrance transitions; GSAP animates the artwork and ScrollTrigger provides subtle scroll-driven orbital parallax. The operating system's reduced-motion preference disables those animations and smooth scrolling. No claims, fabricated clients, portraits, or career statistics appear; project cards and their dialogs explicitly label their content as placeholders.

## Design review and implementation handoff — 9 November 2026

### Baseline and direction

This document records the existing paper / olive / orange implementation in `src/App.jsx` and `src/styles.css`. The following refinements are a design handoff, not a claim that every item is already implemented or tested. Keep the editorial character: a strong typographic opening, sculptural hero, short biography, experience, selected work, and contact. Borrow the narrative pacing and distinctive identity of the Lando Norris reference; do not copy its branding, photos, biography, or sports language. A different palette should be an explicit coherent redesign rather than isolated neon effects.

### Content provenance

The public search-indexed version of [the supplied LinkedIn profile](https://id.linkedin.com/in/varellio-louis-tinangon-4172702a0) was accessible on 9 November 2026; direct page retrieval failed. The indexed content was crawled approximately one month earlier. It identifies Varellio Louis Tinangon as an Informatics undergraduate at Petra Christian University, based in Surabaya, and describes interests in network and cyber security, digital transformation, entrepreneurship, and creative industry. It lists Student Council Treasurer at Frateran Catholic Senior High School (March 2025–February 2026), and Social & Community Relations member (February 2024–February 2025). These are self-reported profile facts, not independently certified credentials. Use those concise facts for biography and experience instead of the current generic coming-soon copy. Do not invent employment, client names, expertise levels, results, contact addresses, or availability. Project concepts must stay visibly labeled until supported by real case-study material.

### Responsive layout contract

| Width | Layout and behavior |
| --- | --- |
| 320–439px | One reading column, 20px gutters, collapsed navigation, full-width main CTA when necessary. Hero title wraps naturally; no nowrap on long phrases. Artwork scales inside its container. |
| 440–759px | One column with 24–32px gutters. Prefer collapsed navigation if all links plus theme control cannot fit with 44px targets. Contact fields stack. |
| 760–1023px | Two-column hero only when both copy and artwork remain readable; two-column work grid with the last card retaining normal width. |
| 1024px+ | Complementary hero/about/contact columns, three-column work grid, maximum content width 1440px, existing 6.25% gutters. |

Read order remains introduction → artwork → biography → experience → work → contact at every size. Never hide meaningful content solely to fit a viewport. Test 320, 390, 768, 1024, and 1440px, plus 200% zoom. Decorative art may crop; text, focus rings, controls, and dialog content must not.

### Token refinements

Keep the existing color and font tokens above as the baseline. Body copy should be at least 16px with approximately 1.6 line height; use 12px as the minimum for nonessential captions. Existing 7–11px labels are a review target, not a model for new content. Use a spacing scale of 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Keep radius restrained at 3–6px on controls/cards, with larger radius reserved for special compositions. Text uses semantic ink/muted tokens; validate muted text in both themes before release. Orange is an accent rather than the default small-text color. Focus outlines need an accessible contrasting token in each theme.

### State and interaction contract

| Element | Required behavior |
| --- | --- |
| Primary/secondary actions | Distinct idle, hover, focus-visible, pressed, and disabled states. Press feedback is brief; links retain their normal browser behavior. |
| Navigation | Visible current section when provided, expanded/collapsed accessible state, close after selection, Escape closes mobile menu, and focus remains predictable. |
| Theme control | Accessible name states the destination theme. Persist explicit choice; retain usable colors if storage is unavailable. |
| Project dialog | Named modal, sensible initial focus, Escape and close button, contained scroll on small screens, focus restored to opening card. Concept label remains visible. |
| Contact | Idle → validating → sending → success or error. Preserve input after failure, prevent duplicate submission while sending, announce result. Show success only after server acceptance; no claim of email delivery without evidence. |
| External profile | Meaningful LinkedIn label and valid supplied URL. New-tab behavior is disclosed accessibly where practical. |
| Unavailable data | Plain-language explanation with an actionable next step; no invented portfolio metrics or experience. |

### Motion and accessibility acceptance

Use animation to connect states and guide attention. Keep one dominant effect per viewport: the orbital artwork can lead the hero while text uses quiet entrance motion. Entrances use ease-out; buttons use 100–160ms feedback; ordinary UI transitions generally remain under 300ms. Longer editorial sequences must never block navigation or reading. Avoid animating every section identically, perpetual competing effects, heavy layout-property animation, or forced scroll locking. Only animate transforms/opacity where practical; clean up animation subscriptions when components unmount.

With `prefers-reduced-motion: reduce`, provide the final readable composition, turn off parallax and decorative looping, and use immediate section navigation. Content must remain visible if animation initialization fails. Reserve artwork space to prevent layout shifts. Decorative rings and symbols are hidden from assistive technology; meaningful artwork descriptions remain concise. Maintain one h1, logical heading hierarchy, landmarks, skip link, explicit form labels, and keyboard operation. Targets are at least 44×44px, and normal text contrast is at least 4.5:1. Verify these properties in the rendered page rather than assuming that semantic markup alone proves compliance.

### Reference decisions

- [Lando Norris](https://landonorris.com/): distinct identity and chapter-based narrative. Page structure was inspected; animation choreography was not visually audited.
- [Emil Kowalski design engineering](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md): purposeful motion, responsive easing, short feedback, restraint for frequent interactions.
- [Benji Taylor Stageshow](https://github.com/benjitaylor/skills/blob/main/stageshow/SKILL.md): if a product demo is added, tell one clear story, frame the focal object intentionally, and make its static poster meaningful.
- [Magic UI](https://github.com/magicuidesign/magicui/blob/main/skills/magic-ui/SKILL.md): one core effect plus one supporting effect; validate keyboard access, mobile overflow, and performance. Do not add a dependency merely to decorate an already sufficient component.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md): prioritize accessibility, touch, and performance before visual effects.
- [Awesome UI Motion Skills](https://github.com/romanticamaj/awesome-ui-motion-skills) and [scroll-animation topic](https://github.com/topics/scroll-animation): discovery indexes, not libraries to install wholesale.
- [Scenario Labs](https://github.com/scenario-labs/skills): relevant only if custom generated visual assets are needed; it is not a prerequisite for the existing CSS artwork.
