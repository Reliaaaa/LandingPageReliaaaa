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
