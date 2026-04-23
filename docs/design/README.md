# Flash Design System

> **"Learn in a flash"** — AI-powered flashcards and quizzes from your study materials.

Flash is a mobile-first learning app (Expo React Native + Django REST backend) that turns uploaded assignments and textbooks into flashcards and graded quizzes with AI feedback. Users bring their own OpenAI key; the app handles generation, review, and scoring.

## Sources

- **Logo**: `uploads/flash.png` (provided by user)
- **Codebase**: https://github.com/hickeben000/data5570_flash — Django backend (`flash_backend/`) + Expo frontend (`flash-app/`)
- **Screens read**: LoginScreen, HomeScreen, CourseScreen, FlashcardScreen, QuizScreen, QuizResultsScreen, UploadScreen, SettingsScreen

---

## CONTENT FUNDAMENTALS

**Tone**: Encouraging, direct, student-friendly. Never condescending. Think supportive study partner, not corporate SaaS.

**Voice examples** (from codebase):
- "Study smarter, not harder"
- "Create a course, add study materials, and generate flashcards or quizzes."
- "No courses yet. Create one above to get started."
- "Generating flashcards..." (loading states are present-progressive, action-oriented)
- "Known ✓" / "Review ↩" (short, scannable action labels)

**Casing**: Title case for headings, sentence case for body copy and labels. Buttons are sentence case ("Add Course", "Submit Quiz", "Log In"). UI labels like "QUESTION" / "ANSWER" are uppercase 12px labels — the only all-caps usage.

**Pronouns**: Second person ("your materials", "Create a course"). No first person.

**Emoji**: Not used in UI copy. Only functional symbols: ✓ ↩ ← as inline text labels on action buttons.

**Error copy**: Plain and specific. "Don't have an account? Register" — never "Oops!" or filler apology language.

**Numerics**: Numbers shown inline without units when obvious ("1 / 10" card counter).

---

## VISUAL FOUNDATIONS

### Color
- **Primary**: `#4361ee` — electric blue, used for buttons, links, active states, card labels
- **Primary light**: `#eef1ff` — tinted blue for selected states / chips
- **Logo blue gradient**: `#2B7FFF` → `#1560F0` (logo icon) / `#69ADFF` (highlight shimmer)
- **Background**: `#f5f7fb` — cool blue-gray page bg
- **Surface**: `#ffffff` — cards, inputs
- **Input bg**: `#f8f9fd` — subtle tint inside white cards
- **Text / fg1**: `#1a1a2e` — near-black navy, headings and primary body
- **Text / fg2**: `#666666` / `#6b7280` — secondary text, subtitles
- **Text / fg3**: `#9ca3af` — hints, placeholders, disabled
- **Border**: `#dfe4f1` — card outlines, input borders
- **Success**: `#27ae60` — "Known ✓" green
- **Warning**: `#d97706` — "Review ↩" amber
- **Error**: `#c0392b` / `#e74c3c` — error messages

### Typography
No custom font files in codebase — uses React Native system font (San Francisco on iOS, Roboto on Android). **Design system substitution: Nunito** (Google Fonts) — rounded, friendly, matches the logo wordmark weight and approachable feel.

- **Display / h1**: 36px, weight 800 (`#1a1a2e`)
- **Title / h2**: 30px, weight 800
- **Section heading / h3**: 22–26px, weight 800
- **Card heading**: 16px, weight 700
- **Body**: 15–16px, weight 400, line-height 22–24px
- **Label / eyebrow**: 12px, weight 700, uppercase, letter-spacing 0.06em, `#4361ee`
- **Hint / caption**: 12px, weight 400, `#9ca3af`
- **Link**: 14px, weight 400, `#4361ee`

### Spacing & Layout
- Page padding: 20–24px
- Card inner padding: 16–28px
- Between cards: 12–16px
- Border radius — inputs: 10–12px; cards: 14–18px; flashcard: 18px
- Max content width: ~390px (mobile-first)

### Cards
White surface (`#fff`), border-radius 14–18px, soft shadow: `shadowColor #000`, `shadowOpacity 0.08–0.12`, `shadowRadius 8–10px`, `elevation 2–5`. No colored left-border accent.

### Backgrounds
Flat `#f5f7fb` blue-gray. No texture, patterns, or images in bg. The logo uses a bold blue gradient with a 3D-card tilt illusion — this motif can be used for hero/marketing contexts.

### Gradients
Used in logo: `#2B7FFF` → `#1560F0` (solid blue card), `#69ADFF` (light shimmer card). Gradient can be applied as a primary brand gradient for headers, hero sections, and onboarding screens.

### Animation / Interactions
- No declared animation library; minimal transitions
- Loading: `ActivityIndicator` spinner in `#4361ee`
- Tap states: `activeOpacity: 0.9` on flashcard (slight dim)
- Hover/press: buttons darken slightly (OS default); no custom press-shrink

### Borders
`1px solid #ddd` or `#dfe4f1` on inputs and cards. Selected/active state: `1px solid #4361ee`.

### Iconography
No icon library in codebase — uses text symbols (← ✓ ↩) and emoji-free approach. **Design system recommendation: Lucide Icons** (CDN) — clean 2px-stroke line icons, matches the modern-minimal feel. See ICONOGRAPHY section.

### Corner Radii Scale
- `sm`: 8px — chips, tags
- `md`: 10–12px — inputs, buttons
- `lg`: 14–16px — cards, panels
- `xl`: 18px — flashcard surface

### Shadows
- `low`: `0 1px 5px rgba(0,0,0,0.08)` — list cards
- `mid`: `0 2px 8px rgba(0,0,0,0.08)` — panels, create card
- `high`: `0 4px 10px rgba(0,0,0,0.12)` — flashcard (interactive surface)

---

## ICONOGRAPHY

No icon font or SVG sprite in codebase. Text symbols used inline:
- `←` Back navigation
- `✓` Known/correct
- `↩` Review/retry

**Design system uses Lucide Icons via CDN** (`https://unpkg.com/lucide@latest`) — 2px stroke, rounded caps, neutral weight. Key icons used in UI kit:
- `book-open` — Courses
- `zap` — Flash/generate (matches lightning logo)
- `file-text` — Documents
- `check-circle` — Known / correct
- `refresh-ccw` — Review
- `upload` — Upload screen
- `settings` — Settings
- `user` — Profile
- `plus` — Add/create
- `chevron-right` — Navigation

Logos: `assets/flash-logo.png`, `assets/flash-icon.png`, `assets/flash-adaptive-icon.png`

---

## FILE INDEX

```
README.md                     ← This file
SKILL.md                      ← Agent skill descriptor
colors_and_type.css           ← CSS custom properties (colors + typography)
assets/
  flash-logo.png              ← Full wordmark logo
  flash-icon.png              ← Square icon
  flash-adaptive-icon.png     ← Adaptive icon
preview/
  colors-primary.html         ← Primary & brand color swatches
  colors-neutral.html         ← Neutral & semantic color swatches
  type-scale.html             ← Typography scale specimen
  type-labels.html            ← Labels, hints, links
  spacing-tokens.html         ← Radius, shadow, spacing tokens
  components-buttons.html     ← Button states
  components-inputs.html      ← Input & form components
  components-cards.html       ← Card variants
  components-flashcard.html   ← Flashcard component
  components-quiz.html        ← Quiz question components
  components-badges.html      ← Status badges / chips
  brand-logo.html             ← Logo usage & gradient
ui_kits/
  flash-app/
    index.html                ← Interactive mobile prototype
    LoginScreen.jsx
    HomeScreen.jsx
    FlashcardScreen.jsx
    QuizScreen.jsx
```
