// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// FAQ data shared between FAQContent (client) and page.tsx (server JSON-LD)
// v3 — 58 questions across 9 categories (updated 2026-03-01)

export type FAQ = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  title: string;
  icon: string;
  faqs: FAQ[];
};

// ============================================
// EMOJI REFERENCE (synced with mobile: lib/constants/category_reference.dart)
// ============================================
// VENUE: ☕ Cafe | 🍽️ Restaurant | 🍻 Bar | 💪 Fitness | ⛰️ Outdoors | 🎭 Entertainment
// ACTIVITY: ☕ Chill | 💪 Active | 🎯 Focus | 🎨 Creative | ⛰️ Adventure | 🎉 Social | 📌 Default

export const faqCategories: FAQCategory[] = [
  {
    title: "About Konectr",
    icon: "📱",
    faqs: [
      {
        question: "What is Konectr?",
        answer: "Konectr is a free social app that helps adults make real friends through shared activities in Kuala Lumpur. Instead of endless swiping, you pick an activity, get matched with nearby people who want to do the same thing, and meet at a public venue. It's activity-first, not profile-first."
      },
      {
        question: "How much does Konectr cost?",
        answer: "Konectr is completely free. Creating activities, matching with others, messaging, and meeting up cost nothing. We may add optional premium features in the future, but the core experience of meeting people will always be free."
      },
      {
        question: "Is Konectr available in my city?",
        answer: "Konectr is currently available in Kuala Lumpur, Malaysia only. We're starting with one city to build a strong, active community before expanding. Next cities planned: more Malaysian cities, then Southeast Asia. Follow @konectrapp for news on new cities."
      },
      {
        question: "How is Konectr different from Meetup or Bumble BFF?",
        answer: "Meetup is built around large anonymous groups (20-100+) where you can easily get lost. Bumble BFF is one-on-one swiping that often leads to chats that go nowhere. Konectr sits in the sweet spot: small groups, activity-based matching at public venues. More intimate than Meetup, more social than Bumble BFF, and every match leads to a real meetup — not just another chat."
      },
      {
        question: "How do I meet people in KL if I'm an expat?",
        answer: "Konectr was built for exactly this. Pick any activity — coffee at a cafe, a fitness class, outdoor hiking — and Konectr matches you with locals and other expats who want to do the same thing. Small groups at public venues make it easy and safe to meet new people."
      },
      {
        question: "What kind of activities can I do on Konectr?",
        answer: "Six categories: Chill (coffee, brunch), Active (fitness, hiking, running), Creative (art, photography, cooking), Social (happy hours, board games), Focus (language exchange, networking), and Adventure (day trips, exploring). You can also create custom activities."
      },
      {
        question: "Can I use Konectr for dating?",
        answer: "No. Konectr is for friendship only. Our community guidelines explicitly prohibit using the app for dating or romantic approaches. This is what makes Konectr a safe space — everyone knows the intention is genuine friendship through shared activities."
      }
    ]
  },
  {
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Get Konectr from the App Store on iPhone or Google Play on Android (links at konectr.app). Sign up with your email (we'll send a one-time code), add your interests and a photo. Takes about 2 minutes."
      },
      {
        question: "Do I need to verify my identity?",
        answer: "You sign in with a one-time code sent to your email — nothing to remember. Every account is tied to a real email address, and reputation is built through badges earned at real meetups, never ratings."
      },
      {
        question: "What makes Konectr different from other social apps?",
        answer: "No chat that goes nowhere. On Konectr, every connection leads to a real meetup. You pick an activity, get matched with people planning the same thing, and meet IRL at a public venue. No endless swiping, no ghosting — just real people doing real things."
      },
      {
        question: "I'm new in KL. Can Konectr help me make friends?",
        answer: "This is exactly what we built Konectr for. Create an activity you'd enjoy—hiking at outdoor spots, brunch at a restaurant, or coffee at a cafe. Meet people who share your interests."
      },
      {
        question: "How complete does my profile need to be?",
        answer: "The more complete your profile, the better your matches. To use Pulse (AI matching), your profile needs to be at least 70% complete. Your name, photo and bio count most; your age, gender, vibes and languages add the rest. Even without Pulse, a complete profile helps other members decide to join your activities."
      }
    ]
  },
  {
    title: "How Konectr Works",
    icon: "💡",
    faqs: [
      {
        question: "What if I'm shy or introverted?",
        answer: "Small groups, activity-focused conversation topics, and everyone's there for the same reason. Many of our most active users are introverts who prefer this structured approach over traditional social settings."
      },
      {
        question: "Can I start my own activities?",
        answer: "Yes! Anyone can start an activity — there's no host role on Konectr. Pick a venue, set your group size, choose a time, and publish. Anyone who can see it joins instantly, and you're all equal members of the plan."
      },
      {
        question: "How does the matching work?",
        answer: "Pick your vibe, time slot, and venue. Konectr finds people planning the same activity at the same time nearby — 10km by default, and you can widen the search up to 50km. You can also use Pulse — our AI matching feature — which automatically finds your best match on venue type, time, distance, and vibe. Either way, every match leads to a real meetup."
      },
      {
        question: "What is Pulse and how does AI matching work?",
        answer: "Pulse is Konectr's AI-powered matching feature. Instead of browsing activities manually, Pulse finds your best match automatically based on your interests, availability, location, and profile. It uses a commit-then-reveal flow: you opt in, Pulse finds a match, and both of you get a celebration reveal with activity details. It unlocks once your profile is at least 70% complete."
      },
      {
        question: "How do referral links work?",
        answer: "Every Konectr user gets a unique referral link (konectr.app/r/yourcode). Share it with friends — when they sign up through your link, both of you earn XP and progress toward referral badges. Find your link in your profile or share it directly from the app."
      },
      {
        question: "What if no one matches my activity?",
        answer: "Share it with your Konectr Circle, or keep it open for up to 7 days. Others might plan the same thing later. Plenty of good plans started with one person—then others joined."
      },
      {
        question: "What are time slots and how do they work?",
        answer: "Instead of exact times, pick a window: Morning (9AM-12PM), Afternoon (12PM-3PM), Late Afternoon (3PM-6PM), Evening (6PM-9PM), or Night (9PM-12AM). Coordinate specifics through chat. Plan up to 7 days ahead."
      },
      {
        question: "What's a 'Konectr Circle'?",
        answer: "Your friend network within the app — people you've connected with. Anyone can add anyone to their Circle (no mutual activity required). Circle perks: permanent 1:1 chat, see when they create activities, broadcast your plans to them."
      },
      {
        question: "What happens after an activity ends?",
        answer: "Confirm you met and everyone who turned up earns XP and progress toward badges. You can add people you got on with to your Circle. The group chat stays open for 48 hours after the end time, so you can sort out photos and next plans, then it closes."
      },
      {
        question: "What can I do in the activity chat?",
        answer: "Every plan gets a group chat the moment you join. Send photos straight from the camera or your library, react to messages, quote a message to reply to it, and translate anything into your own language in place. Chat stays in-app — no phone numbers are shared."
      },
      {
        question: "Can I keep an activity private?",
        answer: "Yes. Choose 'Public' (visible to matching users) or 'Circle Only' (visible only to your friends). Circle-only is great for reunions or testing new activity ideas."
      }
    ]
  },
  {
    title: "Safety & Trust",
    icon: "🛡️",
    faqs: [
      {
        question: "How do I know the people I meet are safe?",
        answer: "Every account is tied to a real email. All meetups at public venues only. Badge system tracks positive participation. Three-strike system for violations: 3 reports = warning, 6 = suspension, 9 = six-month ban. Zero tolerance for harassment with 24-hour report review."
      },
      {
        question: "What kind of venues does Konectr use?",
        answer: "Public places only — cafes, restaurants, bars, gyms, parks, and entertainment spots. You can start an activity at any public venue you like. The featured venues in our hubs are hand-picked by us for the things that matter: well-lit, easy to find, easy to leave, and good for a conversation."
      },
      {
        question: "What if someone makes me uncomfortable?",
        answer: "Report in-app anytime—during or after an activity. Block instantly. Your safety comes first; leave if needed. We review urgent reports within hours, all reports within 24 hours. Serious violations = permanent bans."
      },
      {
        question: "Can I remain anonymous?",
        answer: "Your full name, phone, email, and exact location are never shared. You control your display name, photos, and bio. Your photo is only shown to people you share a plan, a chat or your Circle with; everyone else sees your initials. Chat stays in-app."
      },
      {
        question: "Is my data safe?",
        answer: "All data is encrypted in transit and at rest, and stored in Singapore. We never sell your data, and you can download or delete everything we hold at any time from Settings."
      },
      {
        question: "What happens if I report someone?",
        answer: "Reports go to our safety team immediately. Review within 24 hours, faster for urgent issues. Outcomes range from warnings to permanent bans. Reports are confidential—they won't know who reported."
      },
      {
        question: "What are the community guidelines?",
        answer: "Do: Show up when committed, be inclusive, communicate if plans change. Don't: Ghost, harass, share others' contact info, discriminate, use for dating. Violations = warnings, suspension, or bans."
      },
      {
        question: "What are women-only activities?",
        answer: "Women-only activities are open only to members whose profile gender is Woman. Whoever started the plan can remove someone who isn't a woman, anyone in it can report them, and Konectr reviews every removal. Misrepresenting your gender to access a women-only space is a Community Guidelines violation and results in immediate suspension. You can change your profile gender once; after that, changes require contacting support. Joining from a shared link without the app? You'll confirm you're a woman before you RSVP, and the exact time and place show once you're in."
      },
      {
        question: "Where can I read the Terms of Service and Privacy Policy?",
        answer: "You can read our full Terms of Service at konectr.app/terms and our Privacy Policy at konectr.app/privacy. Both are accessible from the app settings and from the footer of our website. We believe in transparency — no hidden clauses."
      }
    ]
  },
  {
    title: "Activities & Meetups",
    icon: "🎯",
    faqs: [
      {
        question: "How many people are typically at an activity?",
        answer: "Whoever starts the plan sets the group size, anywhere from a one-on-one to 20 people. Most plans are small. There's no minimum — a plan stays live as long as at least one person is still in."
      },
      {
        question: "What if I need to cancel?",
        answer: "You can withdraw anytime — your spot opens up for someone else and the plan carries on without you. Within 3 hours of start time, the group is notified right away and the late withdrawal counts toward your reliability record. Repeated no-shows without notice can lead to restrictions. If emergencies happen, just message the group—people understand."
      },
      {
        question: "Can I bring a friend?",
        answer: "Everyone joins a plan on their own spot. Want to bring a friend? Have them download Konectr and join the same plan themselves."
      },
      {
        question: "What if no one talks to me?",
        answer: "Everyone on a plan is an equal member, so nobody's a guest. Small groups mean you can't get lost, and the activity itself gives you something to talk about. If it still happens, let us know and we'll follow up."
      },
      {
        question: "How do I know what to expect at an activity?",
        answer: "Every listing shows the venue, the time, the group size, the vibe (Chill, Active, Social, Creative, Focus, Adventure) and a note from whoever started it."
      },
      {
        question: "What's the etiquette for a first activity?",
        answer: "Arrive on time, introduce yourself to the group, put your phone away, ask questions and listen. After: add people you vibed with to your Circle."
      },
      {
        question: "Can I suggest new venue types?",
        answer: "Yes! Email hello@konectr.app with the venue name, location, and why it's good for socializing. Many of our best venues came from community suggestions."
      },
      {
        question: "What if the activity is cancelled?",
        answer: "If everyone else withdraws, the plan ends and you're notified immediately — no impact on your reliability. If nobody has joined by the time it starts, nothing cancels it: the plan simply expires. Consider starting your own version."
      },
      {
        question: "Can I join an activity that's already in progress?",
        answer: "No — once an activity's time slot has started, it's no longer open for new joiners. This protects the experience for everyone already there. Keep an eye on upcoming activities and join before they start. You can also create your own activity for a time that works for you."
      }
    ]
  },
  {
    title: "Badges & Gamification",
    icon: "🏆",
    faqs: [
      {
        question: "Why badges instead of ratings?",
        answer: "We don't rate humans. Star ratings create anxiety and can be weaponized. Badges only go up, never down. They celebrate consistency and positive participation, not perfection."
      },
      {
        question: "What badges can I earn?",
        answer: "Badges come in families: Social (people you meet), Explorer (venues you visit), Activity (plans you turn up to), Streak (consistency), Starter (activities you start), plus Special one-offs like KL Champion and Early Adopter. Try all six vibes to grow your collection."
      },
      {
        question: "How do badges help me?",
        answer: "Trust signals for people deciding whether to join your plans. Personal milestones to track your journey. Conversation starters."
      },
      {
        question: "What are XP points and how do I earn them?",
        answer: "XP (experience points) measure your overall engagement on Konectr. You earn XP by attending activities, starting them, adding people to your Circle, keeping a streak going, and checking in daily. XP is separate from your tier — tiers are counted in activities, not points."
      },
      {
        question: "What are the tier levels?",
        answer: "Konectr has 6 tiers, based on activities you've been part of: Basic (0), Bronze (10), Silver (50), Gold (100), Platinum (200), and Legendary (300). Each tier changes the frame around your profile photo — thicker borders, gradients, and at the top a glow. Check your progress on your profile page."
      }
    ]
  },
  {
    title: "Account & Settings",
    icon: "⚙️",
    faqs: [
      {
        question: "How do I edit my profile?",
        answer: "Profile tab, then Edit Profile. Update photos, display name, bio, interests, and availability. Tip: 3+ photos and detailed interests = better matches."
      },
      {
        question: "Can I pause my account?",
        answer: "There's no pause option. If you want to step away, turn Konectr's notifications off in your phone's settings. If you want to leave for good, go to Profile, Settings, Delete Account: your profile disappears straight away and you have 30 days to change your mind."
      },
      {
        question: "How do I delete my account?",
        answer: "Profile, Settings, Delete Account (or konectr.app/delete-account). Your profile disappears immediately and you have 30 days to change your mind; after that your personal data, photos, connections and badges are erased. Messages and attendance records stay but are no longer linked to you, and safety reports are kept — the full list is on the delete-account page. Having issues? Reach out to hello@konectr.app first."
      },
      {
        question: "Why am I not seeing many activities?",
        answer: "Try: expanding search radius (up to 50km), adding more availability slots, broadening vibe filters. Still quiet? You might be in a new area—create an activity yourself and others will join."
      },
      {
        question: "How do I change my notification settings?",
        answer: "Settings, Notifications. Toggle match alerts, activity suggestions, messages, reminders, and Circle updates. Keep match and message notifications on to avoid missing connections."
      },
      {
        question: "How do I share my Konectr profile or referral link?",
        answer: "Go to your profile and tap the share icon. You can share your unique referral link (konectr.app/r/yourcode) via WhatsApp, Instagram, or any messaging app. When friends sign up through your link, both of you earn XP."
      }
    ]
  },
  {
    title: "Premium & Future Features",
    icon: "✨",
    faqs: [
      {
        question: "Are there any paid features?",
        answer: "Currently everything is free. We may add optional premium features later (priority matching, advanced filters), but core functionality—meeting people—stays free."
      },
      {
        question: "Is Konectr on Android?",
        answer: "Yes. Konectr is free on Google Play. Search for Konectr or use the download link at konectr.app."
      },
      {
        question: "What new features are coming?",
        answer: "Near-term: more Malaysian cities, venue partnerships. Future: AI recommendations, weather-aware suggestions, group planning tools. What stays: activity-first matching, small groups, badges (not ratings)."
      }
    ]
  },
  {
    title: "Troubleshooting & Support",
    icon: "🔧",
    faqs: [
      {
        question: "The app is crashing/slow. What do I do?",
        answer: "Force close and restart. Make sure you have the latest version. Restart your phone. Check your internet. Still broken? Email hello@konectr.app with device model, iOS version, and screenshots."
      },
      {
        question: "I'm not receiving notifications. Help!",
        answer: "Check: Settings, Notifications (toggles on). iOS Settings, Konectr, Notifications (allowed). Do Not Disturb (off for Konectr). Still nothing? Reinstall the app."
      },
      {
        question: "How do I contact support?",
        answer: "Email hello@konectr.app. Response times: general questions within 24 hours, safety issues within hours, technical bugs same business day. Include screenshots and details."
      },
      {
        question: "I have an idea/feedback for Konectr!",
        answer: "Visit konectr.app/feedback to see community feature requests and suggestions. You can also email hello@konectr.app with 'Feature Idea' in the subject. Tell us the problem you want solved. We read everything and add good ideas to our roadmap."
      },
      {
        question: "What is the feedback board?",
        answer: "The feedback board at konectr.app/feedback is where you can see feature requests, bug reports, and suggestions from the Konectr community. It's fully transparent — you can see what others have asked for and how many votes each idea has. Voting is available in the mobile app, and viewing is available on the web."
      }
    ]
  }
];

export const helpfulResources = [
  {
    title: "How It Works",
    description: "See Konectr in action",
    href: "/how-it-works",
    icon: "📱",
  },
  {
    title: "Safety",
    description: "Our commitment to you",
    href: "/safety",
    icon: "🛡️",
  },
  {
    title: "About Us",
    description: "Our story and mission",
    href: "/about",
    icon: "💜",
  },
  {
    title: "Blog",
    description: "Tips and stories",
    href: "/blog",
    icon: "📖",
  },
  {
    title: "Terms of Service",
    description: "Our terms and conditions",
    href: "/terms",
    icon: "📜",
  },
  {
    title: "Privacy Policy",
    description: "How we protect your data",
    href: "/privacy",
    icon: "🔒",
  },
];
