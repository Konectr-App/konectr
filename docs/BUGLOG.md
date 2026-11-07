# Konectr Bug Log

> Since 2026-10-05 founder reports go straight to GitHub Issues. Index of the last 30 days: `docs/FOUNDER_ISSUES.md`.

**Capture inbox only (since 2026-10-01).** The tracker for every bug and task is GitHub Issues in
`Konectr/konectr-mvp` (`Development/docs/ENGINEERING.md`). Log here only when you can't reach GitHub (phone
without the GitHub app, a cloud session without issue access). The next Mac session turns each Open entry
into an issue (quoting BUG-NNN), moves it to "Moved to issues" with the issue number, and works it there.
This file never holds status.

**Rules**
- Log sessions only append entries. No code changes happen in a logging session.
- Newest bugs go at the top of "Open".
- Each Open entry becomes a GitHub issue at the next Mac session; status lives on the issue, not here.

**Entry format**

```
### BUG-NNN · <short title>
- **Logged:** YYYY-MM-DD
- **Area:** web (konectr.app) / mobile iOS / mobile Android / backend / other
- **Page / screen:** <URL or screen name>
- **What happened:** <observed behaviour>
- **Expected:** <what should happen>
- **Steps to reproduce:** <if known>
- **Severity:** P0 blocker / P1 major / P2 minor / P3 cosmetic
- **Status:** Open
```

---

## Open

### BUG-010 · Nearby > Your plans: option to pin an activity when a day has several (feature request)
- **Logged:** 2026-10-02
- **Area:** mobile iOS (dark mode, seen 7:47)
- **Page / screen:** Nearby (home) -> "Your plans" (Upcoming) -> day group "Saturday" with 5+ plans (F1 Week - Go-Kart, Afternoon coffee cat..., Walk and explore, Evening park loop, Drinks after work, ...) separated by "≈ N min between plans" travel hints
- **Evidence:** Screenshot from founder ("PIN ACTIVITY" drawn over the Saturday list)
- **Requested:** Give users the **option to pin** the activity of their choice when they have multiple activities on the same day, so the one they care about stays at the top of that day.
  - Entry point: add "📌 Pin to top" / "Unpin" to the row's "..." menu (and long-press).
  - Pinned plan floats to the top of its day group with a small pin icon; others keep their time order. Suggest max 1 pinned per day (pinning another replaces it) -- confirm with founder.
  - Pin is per user (private), persisted server-side so it syncs across devices; auto-clears once the activity is past.
  - Optional: the pinned plan becomes the "NEXT UP" card on Home for that day; travel-time hints should still compute in chronological order, not pinned order.
- **Also seen on this screen (verify):**
  - A grey **"Show menu" tooltip is stuck** on screen over the F1 Week row (iOS long-press tooltip from the "..." button) -- should disappear on release or not show at all (`tooltip: null` / custom semantics label).
  - Titles truncate hard ("F1 Week - G...", "Afternoon · LYL...") because the host avatar + "Circle" chip + "..." eat the row width -- consider 2-line titles or moving the Circle chip below the title.
  - The sticky "Your plans / Upcoming" header clips the card scrolling under it (top "Evening out" row half-cut with no fade/background).
  - The orange "+" FAB overlaps the "..." menu of the row behind it -- add bottom padding / hide FAB on scroll.
- **Severity:** P3 (enhancement) + P2 for the stuck tooltip
- **Status:** Open (feature part) · Stuck "Show menu" tooltip fixed 2026-10-03 in `14a620dd` (PR #164, rides build 73, Konectr/konectr-mvp#163). Pin-to-top is blocked by the feature freeze: parked as PF-51. Other "verify" items (title truncation, sticky header clip, FAB overlap) not yet triaged.

### BUG-007 · Messages > Activity Chatter: add a sorting mechanism (feature request)
- **Logged:** 2026-10-01
- **Area:** mobile iOS (dark mode, seen 8:38 -- older build, bottom nav still shows "Suggested" tab)
- **Page / screen:** Bottom nav Messages -> "Activity Chatter" tab -> chat list
- **Evidence:** Screenshot from founder ("SORT ME" + up/down arrow drawn over list)
- **Current behaviour (from screenshot):** Fixed implicit order -- appears to be by last message time (HIKE @ BUKIT GASING 7:28 PM, then Wed, Wed), with chats that have "No messages yet" (GAMES & CHILL, Let's Go bowling!) dumped at the bottom with no date. User can't change the order; no way to bring the soonest upcoming activity to the top.
- **Requested:** A sort control on the Activity Chatter list. Suggested options:
  1. **Recent activity** (last message / system event time) -- default
  2. **Happening soonest** (activity start date ascending; past activities last or archived)
  3. **Unread first**
  4. Optional: **A-Z**
  - UI: small "Sort" chip/icon next to the Activity Chatter / Direct toggle (bottom sheet with radio options), remember the last choice per user (local storage).
  - Show each row's activity date (e.g. "Sat, Oct 3") so date-based sorting is legible -- rows currently show "N going" but not the activity date for every chat.
  - Consider the same control on the "Direct" tab (recent / unread).
- **Related:** BUG-006 (inconsistent avatars) is visible here too -- letter initials vs ☕ emoji.
- **Severity:** P3 (enhancement)
- **Status:** Open · blocked by the feature freeze; same box as parked PF-25 (noted there 2026-10-01).

---

## Fixed

### BUG-009 · Profile > Pinned photos: uploading one photo adds it twice (duplicate)
- **Logged:** 2026-10-02
- **Area:** mobile iOS (seen 4:24)
- **Page / screen:** Profile tab -> "Pinned photos" ("Visible to your Circle, matches and plan-mates") -> "+ Add photo" / "+" tile
- **Evidence:** Screenshot from founder -- the same picnic selfie appears in **slot 1 and slot 2** (both circled), slot 3 empty "+". Founder drew a "2" next to the profile-completion banner (75%).
- **What happened:** Adding a single pinned photo results in two identical photos in the grid.
- **Expected:** One upload = one photo. Re-picking the same image should be ignored or replace, never duplicated. Profile completion % counts unique photos only.
- **Likely causes to check (for the fix session):** upload handler fired twice (double tap on "+ Add photo" not debounced, or both the header "+ Add photo" and the "+" tile listeners triggered); optimistic local insert + realtime/refetch insert of the same row (no dedupe by id/storage path); insert retried after a slow response; image picker callback registered twice after rebuild. Check the DB/storage: are there 2 rows / 2 storage objects, or 1 row rendered twice?
- **Also seen on this screen (verify):**
  - A hard black full-width divider line under the "Complete your profile" banner looks out of place vs the rest of the soft UI.
  - Bottom nav bar overlaps the "Your Interests" chips (Wine Tasting / Street Food peek out below the nav) -- check bottom padding so the last content clears the floating nav.
  - Confirm whether the duplicate photo is inflating the 75% completion score.
- **Severity:** P1 (user-facing data bug on own profile, visible to others)
- **Status:** Fixed 2026-10-03 · `14a620dd` (konectr-mvp PR #164, merged to main, rides 1.1.2 build 73) · Issue Konectr/konectr-mvp#162 · Display bug, not a duplicate upload: photos loaded newest-first, and a slot whose photo changed cached the previous photo under the new one's key, so two slots showed the same picture. Now oldest-first, renders only a settled url, fresh cache key. The row deleted at 16:25 KL on 10-02 was most likely a different photo. Completion % never counted pinned photos.

### BUG-008 · Website still uses beta/waitlist CTAs -- switch to App Store + Play Store now both apps are live
- **Logged:** 2026-10-02
- **Area:** web (konectr.app) -- sitewide, highest impact on `/a/[code]` RSVP share page
- **Page / screen:** `/a/[code]` RSVP page (e.g. the Merdeka 118 teh tarik plan, "Started by Konectr", 5 spots left) seen on iPhone at 4:28
- **Evidence:** Screenshot from founder, circled: the RSVP form block (name / email / +60 phone / "I'm in") and the bottom CTA block ("OR" -> black "Get Konectr on iPhone" + "Already on Konectr? Open in the app")
- **Context:** Konectr is now **live on both the App Store and Google Play**. The web still treats the app as iPhone-only beta / Android waitlist.
- **What's wrong:**
  - CTA says "Get Konectr on iPhone" only (from `TestFlightRequestCTA.tsx` -- TestFlight-era component); Android visitors get the "Coming soon to Android -- get notified" waitlist (`AndroidWaitlistCTA.tsx`) instead of a Play Store link.
  - Download is visually secondary ("OR" under the web RSVP form). Now that the app is public, installing the app should be the primary path, with the web RSVP as the fallback.
  - Store URL env vars `NEXT_PUBLIC_IOS_STORE_URL` / `NEXT_PUBLIC_ANDROID_STORE_URL` were still unset at last check, so `smartLink.ts` falls back to `https://konectr.app/#waitlist`.
  - Also verify: in the screenshot "I'm in ->" looks **disabled (pale)** even though name + phone are filled -- confirm whether the phone validation is rejecting `102833593` (9 digits after +60) or it's just the styling.
- **Expected / requested:**
  - Platform-aware primary CTA everywhere: iOS -> **App Store** ("Download on the App Store" badge), Android -> **Google Play** ("Get it on Google Play" badge), desktop -> both badges + QR code. Keep "Already on Konectr? Open in the app" deep link.
  - On `/a/[code]`: decide hierarchy (founder call) -- recommended: "Join in the app" (store/deep link with share code) as primary, web RSVP form kept as "No app? RSVP on web" secondary.
  - Retire TestFlight request flow + Android waitlist on the web (or hide behind the store URLs being set). Remove/replace "beta" and "waitlist" copy sitewide.
- **Files to sweep (grep hits for testflight / store URL / #waitlist / AndroidWaitlist):**
  - `src/app/a/[code]/` -- `ActivityRsvpPage.tsx`, `TestFlightRequestCTA.tsx`, `AndroidWaitlistCTA.tsx`, `redesign/SimpleStateLayout.tsx` (ended / not-found states)
  - `src/app/r/[code]/page.tsx` (referral landing -- step 1 "install")
  - `src/lib/smartLink.ts`, `src/lib/usePrimaryCta.ts` (shared CTA destination), `src/lib/seo.ts` (`APP_STRUCTURED_DATA` MobileApplication still points at TestFlight -> use store URLs, add Android)
  - `src/components/Navigation.tsx`, `src/components/sections/` (Hero, FindYourVibe, CTAFooter Tally waitlist)
  - Pages: about, how-it-works, gamification, feedback (+ detail), blog post, `/hyrox`, `/h/[slug]`, `/leaderboard`
  - `public/llms.txt` (TestFlight link), `public/.well-known/assetlinks.json` (confirm real Android SHA-256, not placeholder) + AASA
  - `messages/*.json` (8 locales) for "beta" / "waitlist" / "coming soon to Android" strings; `src/config/brand.ts` launch copy
  - `/api/testflight-request`, `/api/android-waitlist` -- keep for history or retire
- **Founder actions:** set `NEXT_PUBLIC_IOS_STORE_URL` + `NEXT_PUBLIC_ANDROID_STORE_URL` in Vercel (production + preview) with the real store links; update Tally waitlist form / homepage waitlist section decision.
- **Severity:** P0 / P1 -- every shared link is the app's main acquisition funnel and currently can't send Android users to the store
- **Status:** Fixed 2026-10-03 · `2077df3` on `fix/buglog-008` (konectr-web, PR #23, not yet merged to main) · Issue Konectr/konectr-mvp#160 · One store-URL source with the live listings as fallback; share pages, hubs, /hyrox and the home footer now show App Store / Google Play (desktop both), store button above the RSVP form. Pale "I'm in" was the required email field, not phone validation.

### BUG-006 · Messages > Activity Chatter: chat avatars show broken "?" glyph and are inconsistent
- **Logged:** 2026-10-01
- **Area:** mobile iOS (dark mode, seen 9:43)
- **Page / screen:** Bottom nav Messages -> "Activity Chatter" tab -> chat list
- **Evidence:** Screenshot from founder, three avatars circled
- **What happened:**
  - "EAT, CHAT & MEET THE ..." (title starts with 🥐) -> avatar shows a **grey diamond "?"** (Unicode replacement character).
  - "ZERO SKILL. MAXIMUM ..." (title starts with 🤸) -> avatar shows a **yellow diamond "?"**.
  - "A LITTLE COFFEE, ..." (title starts with ☕) -> avatar shows ☕ correctly, but the emoji is then **duplicated** in the title right next to it.
  - Titles without a leading emoji ("Sunday HYROX simulation", "Sled + wall balls...") show a **letter initial "S"** -- so the list mixes letters, emoji and broken glyphs.
- **Likely root cause (strong hypothesis):** the avatar takes the **first character of the title via a code-unit index** (e.g. `title[0]` / `substring(0,1)`). ☕ (U+2615) is one UTF-16 unit so it survives; 🥐 and 🤸 are astral emoji (surrogate pairs), so taking one code unit yields half a surrogate pair -> rendered as "?" in a diamond. Fix: use grapheme clusters (Dart `characters` package: `title.characters.first`) everywhere initials/emoji are derived (also check profile initials, crew stacks, Participants sheet, web `/a/[code]` initials).
- **Expected:** One consistent avatar rule for activity chats. Preferred: the **activity category/vibe icon** (☕ Chill, 💪 Active, etc. per `category_reference.dart`) or the activity's photo -- not a character from the title. Never render a broken glyph. If an emoji avatar is used, strip that emoji from the displayed title to avoid duplication.
- **Severity:** P2 (visible on a core screen; looks broken)
- **Status:** Fixed 2026-10-02 · `cfdf6e7e` on `fix/buglog-005-006` (konectr-mvp, pushed, not yet merged to main) · Initials now use the first grapheme, not a UTF-16 unit, in the shared helper + 4 other sites. Avatar design (title emoji vs category vs venue photo, the duplicated-emoji part) still open as FOUNDER_BUGLOG_2026-09 item 31.

### BUG-005 · "This Week" tab: swipe to last week doesn't work
- **Logged:** 2026-10-01
- **Area:** mobile iOS (dark mode, seen 9:52)
- **Page / screen:** Bottom nav "This Week" tab -> THIS WEEK header (16 SEP - 22 SEP), "This week I want run club, weekend plans and meet new people" intent sentence, "This weekend" list (Pickle ball, Sun 20, 3:00 PM, Bistari Condominium)
- **Evidence:** Screenshot from founder -- page indicator under the header shows **2 dots with the 2nd (current week) active**, implying a previous page (last week) exists to the left
- **What happened:** Swiping right to go back to last week does nothing. The dot indicator advertises a swipeable previous page but the gesture doesn't navigate.
- **Expected:** Swipe right -> last week's page (with its dates/plans); swipe left -> back to this week. Dots update with the page. If last week isn't meant to be reachable, remove the 2-dot indicator so it doesn't promise a swipe.
- **Likely causes to check (for the fix session):** PageView gesture swallowed by a parent/child horizontal gesture (tab-level swipe, horizontally scrollable chips in the intent sentence, or the iOS back-swipe edge gesture); PageView `physics` set to NeverScrollable; initialPage = last index with no page built at index 0; or dots rendered from a hardcoded count.
- **Also check:** tapping the dots should switch weeks too (accessibility / discoverability).
- **Severity:** P2
- **Status:** Fixed 2026-10-02 · `cfdf6e7e` on `fix/buglog-005-006` (konectr-mvp, pushed, not yet merged to main) · Dots hidden when there is no pager (city_lately is off live, so no previous page was ever built). There is no 'last week' page; the left page is Lately.

### BUG-004 · Create Activity "Here for..." text box looks dated / clunky -- modernise
- **Logged:** 2026-10-01
- **Area:** mobile iOS (seen 3:57 PM)
- **Page / screen:** Create Activity sheet -> "Here for..." section -> "Here for... (optional)" multiline field
- **Evidence:** Screenshot from founder (field contains pasted venue + Google Maps link: "📍 LYL International Karting Circuit, Monkeys Canopy, Cheras -- https://share.google/YQwRvdq0BUaPOdTrb...", text selected)
- **What's wrong (from screenshot):**
  - Old-style Material **outlined box with floating label** ("Here for... (optional)") that duplicates the section header "Here for..." directly above it -- redundant.
  - **Text is oversized** for a description field and wraps into a narrow column (text area doesn't use the field's full width; large empty gutter on the right).
  - **Selection highlight renders as chunky salmon blocks per line with gaps** between lines (line-height / selection colour) -- looks broken.
  - **Pasted URL shown raw** and breaks mid-word across lines ("https:// / share.google/ / YQwRvdq0...") -- no link detection/shortening.
  - Field content gets **cut off behind the iOS edit menu + "I'm in" button**; the field doesn't auto-grow/scroll nicely with the keyboard up.
- **Expected / requested (founder):** Make it feel like a **modern 2026 text box** (iMessage / Notion / Linear / Threads composer style):
  - No outlined border + floating label; soft filled background (subtle rounded rect), placeholder text that disappears on type, single header (drop the duplicate label).
  - Body-size text (~16pt), comfortable line height, full-width wrapping, auto-grow to a max height then internal scroll.
  - Native-looking selection colour (brand tint at low opacity, continuous, no gaps).
  - Detect links: show pasted URLs as a compact chip/preview (e.g. "📍 Google Maps" link) instead of raw wrapped text; never break mid-word awkwardly.
  - Optional character counter subtly in the corner if there's a limit.
  - Field and CTA stay visible above the keyboard (proper keyboard insets / scroll-into-view).
  - Apply the same text-field style consistently across the app (other Create Activity inputs, chat, profile edit) -- consider a shared input component.
- **Severity:** P2 (UX/design polish)
- **Status:** Fixed 2026-10-02 · `db5fcca7` on `fix/buglog-003-004` (konectr-mvp, pushed, not yet merged to main) · Filled borderless field, single header, 16pt text, continuous selection, counter only when typing; plan-name field matches. Link chips left out (new capability).

### BUG-003 · "You're in!" post-create dialog: clipped text, no cancel/close -- redesign minimal
- **Logged:** 2026-10-01
- **Area:** mobile iOS (seen 4:04 PM)
- **Page / screen:** Create Activity sheet -> submit -> "You're in! Let's see who vibes." success dialog (activity: "F1 Week - Go-Kart Grand Prix!")
- **Evidence:** Screenshot from founder
- **What happened:**
  - a) **Broken / clipped text:** the primary button label "Go to activity" is cut off -- only the top half of the glyphs render (vertical clipping, button height/padding or text-scale issue). The activity title "Grand Prix!" line above it is also clipped at the bottom where it meets the button area.
  - b) **No cancel / close:** the dialog has only "Go to activity" and "Undo". There is no X or "Close/Done" to simply dismiss and stay where you are. ("Undo" deletes the activity, so it is not a cancel.)
  - Also seen: the hero icon is a plain yellow circle (looks like a missing emoji/illustration placeholder); behind the dialog the Create Activity submit button is still showing a loading spinner.
- **Expected / requested change (founder, design):** Redesign this dialog to be **minimalistic**:
  - Clean title + activity name, no clipped text at any text scale (test with iOS Larger Text / Dynamic Type).
  - Actions:
    1. **Go to activity** (primary)
    2. **Go to that day** -- opens the calendar on the activity's date (NEW)
    3. **Close / Done** -- dismiss, stay on current screen (NEW, explicit cancel; also allow tap-outside / X)
    4. Undo -- keep, but de-emphasised (text link)
  - Replace or remove the yellow-circle placeholder.
  - Ensure the Create Activity sheet's loading spinner is resolved/closed once the success dialog shows.
- **Severity:** P2 (bug parts: clipped text, missing close) + design change request
- **Status:** Fixed 2026-10-02 · `db5fcca7` on `fix/buglog-003-004` (konectr-mvp, pushed, not yet merged to main) · X / tap-outside / back now close the dialog and the create sheet (Android back no longer strands a spinning wizard), tick animation replaces the yellow dot, graphite CTA label. Clipped label was already fixed in 6fb67497 (live in 1.1.1). 'Go to that day' is freeze-parked as PF-50.

### BUG-002 · Keyboard stuck open on Home screen, won't dismiss
- **Logged:** 2026-10-01
- **Area:** mobile iOS (seen once, 4:09 PM)
- **Page / screen:** Home ("Good afternoon, Konectr") -- Your plans / "This weekend" / Next Up card (F1 Week - Go-Kart Gra..., Sat Oct 3)
- **Evidence:** Screenshot from founder (keyboard covering bottom half of Home, no text field visible or focused on screen)
- **What happened:** The iOS keyboard stayed on screen over the Home feed and refused to go away. No visible text input on the page, so there was nothing to tap "done"/return on, and it would not dismiss. Happened once; trigger not captured.
- **Expected:** Keyboard only appears while a text field is focused and dismisses when leaving that field/screen (tap outside, scroll, or navigating back to Home).
- **Likely causes to check (for the fix session):** a TextField on a previous screen/sheet (search, chat, create-plan, circle sheet) kept focus when its route was popped or a sheet was dismissed, so the FocusNode stayed attached; Home has no tap-outside / scroll-to-dismiss (`FocusScope.of(context).unfocus()`, `keyboardDismissBehavior: onDrag`); an offstage/hidden TextField in the Home tree holding focus.
- **Repro to try:** open any screen/sheet with a text field (search, chat, create plan, add to circle), focus it, then go back / swipe-dismiss the sheet / switch tabs to Home while keyboard is up.
- **Severity:** P1 major (blocks half the screen; user may have to force-close)
- **Status:** Fixed 2026-10-02 · `b3e66d9a` on `fix/buglog-001-002` (konectr-mvp, pushed, not yet merged to main) · Keyboard now dismissed on every tab change and Discover segment switch. Cause: Explore search kept focus because Pulse keep-alive holds the Discover tab alive.

### BUG-001 · "Add to Circle" from activity Participants sheet: profile sheet bounces open/closed repeatedly before request sends
- **Logged:** 2026-10-01
- **Area:** mobile iOS
- **Page / screen:** Activity detail (Pickleball @ Bistari Co..., Sun Oct 4, 3:00 PM) -> Participants (3) sheet -> tap participant "Timmy" -> profile sheet -> "Add to Circle"
- **Evidence:** Screen recording `ScreenRecording_10-01-2026_6-32-17AM_1.MP4` (9.3s), timeline below
- **What happened:**
  - 0.0-2.0s: Timmy's profile sheet is open (avatar is just a "T" initial, no photo/details), "Add to Circle" button shown.
  - ~2.0s: after tapping "Add to Circle", the profile sheet slides DOWN and the Participants sheet is revealed. No in-sheet confirmation.
  - ~3.0s: the profile sheet RE-OPENS by itself ("Loading profile..." then Timmy's profile again, still showing "Add to Circle" -- button state never changes to "Requested").
  - ~3.75s: "Add to Circle" button briefly disappears, then reappears.
  - ~5.0-5.25s: profile sheet dismisses, flashes open AGAIN for a frame, then dismisses.
  - ~5.5-6.5s: Participants sheet visible, then it also dismisses.
  - ~6.75s: back on the activity page, green toast "Circle request sent to Timmy" appears -- only after the whole sheet stack has collapsed.
- **Expected:** One tap on "Add to Circle" sends the request once, the button changes in place to "Requested"/"Pending" (disabled), a confirmation shows on the profile sheet, and the user stays on the profile/Participants sheet. No sheet should re-open itself.
- **Likely causes to check (for the fix session):** a pop/navigation fired on tap plus a rebuild/listener re-pushing the profile sheet (double navigation); participant list refresh re-triggering the "open profile" action; snackbar shown on the root scaffold after popping all sheets; button state not bound to circle-request status.
- **Also verify:** whether multiple circle requests were sent to Timmy (check for duplicate rows in the circle request table for this pair); profile sheet showing only an initial "T" with no photo/bio -- confirm whether that is expected for this user or a loading/data bug.
- **Severity:** P1 major (core social action feels broken, possible duplicate requests)
- **Status:** Fixed 2026-10-02 · `b3e66d9a` on `fix/buglog-001-002` (konectr-mvp, pushed, not yet merged to main) · Profile sheet now guards double taps and confirms in place with a disabled 'Request sent' button; the toast that rendered under the modals is gone. No code reopened the sheets: the bounce was re-taps with no feedback. Duplicates impossible (unique index + ON CONFLICT DO NOTHING, verified live).
