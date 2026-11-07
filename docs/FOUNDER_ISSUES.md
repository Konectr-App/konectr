# Founder-reported issues: last 30 days (8 Oct to 7 Nov 2026)

Snapshot of every bug, polish item and feature Dev reported from his phone in the
logging session, filed as GitHub Issues in `Konectr-App/konectr-mvp` (one tracker for
app, backend, web and console). **GitHub is the source of truth**: this file is a
handy index for Claude Code sessions. Re-check live state before acting:

```bash
gh issue view <n> -R Konectr-App/konectr-mvp --comments
gh pr list -R Konectr-App/konectr-mvp --state all --search "<n>"
```

Snapshot taken 2026-11-07: **22 items, 9 closed, 13 open.** Older items (1-5 Oct,
BUG-001 to BUG-010, #175, #176) live in `docs/BUGLOG.md` and the tracker.

## How to use this file

1. Open items: run the dedup check (open/merged PRs, branches, latest comments,
   overlapping 2.1 epics #273-#278, #452, #454) before writing code.
2. Items marked **Decision** wait on Dev: don't build them; at most post a design proposal.
3. Closed items: still need **device verification** on iPhone and Android before the
   next public build. Cloud sessions can't test camera, push, keyboard or haptics.
4. Process: branch, PR with `Closes #n`, green CI, merge (see `Development/docs/ENGINEERING.md`).

## Open (13)

| # | Title | Type | Area | Needs Dev? |
|---|---|---|---|---|
| [576](https://github.com/Konectr-App/konectr-mvp/issues/576) | Chat composer: inline camera that morphs out of the "+" menu (ChatGPT-style) | feature | chat | **Must ship in build 87** (future build); device test required |
| [567](https://github.com/Konectr-App/konectr-mvp/issues/567) | Pulse re-matches and re-adds me to the same plan; shows 3,212 km away | bug | explore-pulse | Decision: 30-min gap = buffer between plans (confirm); block or warn on manual Join; area radius (suggest 10 km) |
| [554](https://github.com/Konectr-App/konectr-mvp/issues/554) | Withdraw dialog: add an "Add a note" field (both options) | polish | plans | Decision: optional vs required; store note for moderation; quick-pick chips + 200-char limit |
| [535](https://github.com/Konectr-App/konectr-mvp/issues/535) | Chats > Plans tab: header action should be "Start a plan", not new message | polish | chat | No |
| [534](https://github.com/Konectr-App/konectr-mvp/issues/534) | Create sheet (iPhone): "All 56 activities" cut in half by sticky footer | bug | plans | No |
| [533](https://github.com/Konectr-App/konectr-mvp/issues/533) | New Message empty state: add "Invite friends" + "Find people" CTAs | polish | chat | Copy tweak only |
| [513](https://github.com/Konectr-App/konectr-mvp/issues/513) | "Your progress" Overview loading state (stretched oval ring, spinners, clipped tab) | polish | profile-badges | No; fold into #454 if that epic rebuilds the screen |
| [512](https://github.com/Konectr-App/konectr-mvp/issues/512) | Phase out Daily Check-in / "Claim Reward" (also broken) | chore | profile-badges | Decision: unclaimed rewards (suggest drop silently); streaks count completed meetups only? Web `/gamification` + FAQ need updating |
| [509](https://github.com/Konectr-App/konectr-mvp/issues/509) | Anonymous "favourite" on plans; others see count only | feature | plans | Decision: show count from 3+; alerts to favouriters; ranking signal; keep/clear after joining |
| [494](https://github.com/Konectr-App/konectr-mvp/issues/494) | Links in all user text + "opens outside Konectr" warning, no in-app browser | polish | chat | Defaults until decided: always ask; emails/phones plain text |
| [493](https://github.com/Konectr-App/konectr-mvp/issues/493) | Profile sheet (Add people): scroll to pinned photos, prompts, per visibility | polish | profile-badges | Decision: locked teaser vs hide for non-Circle viewers (suggest teaser) |
| [492](https://github.com/Konectr-App/konectr-mvp/issues/492) | Notifications: avatar opens profile, row opens plan | polish | notifications | Clarify: what's wrong with "Mark read" |
| [439](https://github.com/Konectr-App/konectr-mvp/issues/439) | Share a plan to Instagram, Threads, X, TikTok | feature | plans | Decision: approve poster design; set up Meta developer app for IG Stories link |

## Closed (9): verify on device before the next public build

| # | Title | Type | Fixed by |
|---|---|---|---|
| [511](https://github.com/Konectr-App/konectr-mvp/issues/511) | Chat composer looks broken with long messages | polish | PR #517 |
| [510](https://github.com/Konectr-App/konectr-mvp/issues/510) | In-app banner shows inside the same chat and covers the text box | bug | PR #514 |
| [508](https://github.com/Konectr-App/konectr-mvp/issues/508) | Notifications: Updates and Circle tabs use different designs | polish | No PR: closed after a design proposal (Circle tab is a browse list of Circle plans; proposal to move it next to plans + real Circle events in Notifications, rides #277, needs Dev OK) |
| [506](https://github.com/Konectr-App/konectr-mvp/issues/506) | Push tap only opens the app, not the plan | bug | PR #515 |
| [495](https://github.com/Konectr-App/konectr-mvp/issues/495) | Forgot Password: error text cut off, submit button clipped | bug | PR #516 |
| [442](https://github.com/Konectr-App/konectr-mvp/issues/442) | "Here for…" note editor font too big | polish | PR #478-481 batch |
| [441](https://github.com/Konectr-App/konectr-mvp/issues/441) | Links in plan chat and plan notes not tappable | bug | PR #480 (follow-up spec in #494) |
| [440](https://github.com/Konectr-App/konectr-mvp/issues/440) | Confirm Meetups shows a plan I never joined | bug | PR #478-481 batch + prod migration |
| [438](https://github.com/Konectr-App/konectr-mvp/issues/438) | Plan chat preview shows the wrong person's avatar | bug | PR #478-481 batch |

### Device checklist for the closed items

- [ ] #511: type a 15-line message in plan chat and DM; box grows to ~6 lines then scrolls; latest message stays visible.
- [ ] #510: stay in a chat while someone sends a photo; no banner; banners from other chats sit at the top and auto-dismiss.
- [ ] #506: tap an activity push with the app killed, in background and in foreground; each opens the plan.
- [ ] #495: forgot password with a weak password; full rule list visible; "Update password" button fully visible.
- [ ] #442: "Here for…" editor shows ~12 lines above the keyboard.
- [ ] #441: tap `konectr.app/a/…` in chat (opens in app) and a WhatsApp invite link (opens WhatsApp).
- [ ] #440: Confirm Meetups only lists plans you actually joined.
- [ ] #438: send a message in a plan chat; preview row shows your own avatar.
- [ ] #508: nothing to test yet; decide on the proposal in the issue's comment (move the Circle browse list out of Notifications?).

## Related, filed by other sessions (not founder reports)

#443 face-stack initials clipped (bundle with #438 checks), #452 new onboarding
(founder feedback on the old intro carousel is in its comments), #454 progress screens
rebuild, #473 analytics event catalog.
