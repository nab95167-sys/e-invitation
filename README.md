# 👑 Royal E-Invitation Platform (ធៀបការឌីជីថលបែបប្រណីត)

A high-security, luxury 3D digital wedding invitation and event management system built with **Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM (SQLite), Framer Motion, and Jose JWT**.

---

## 🏛️ Project Architecture & Structure (រចនាសម្ព័ន្ធគម្រោង)

```text
d:\E-invitation/
├── .env.example                  # Template for required environment variables
├── .gitignore                    # Git ignore rules (node_modules, .next, .env, etc.)
├── next.config.ts                # Next.js configuration and route rewrites
├── package.json                  # Dependencies & scripts
├── tailwind.config.ts            # Custom luxury gold, royal palette & fonts
├── tsconfig.json                 # TypeScript compiler configuration
│
├── prisma/                       # Database layer (SQLite + Prisma)
│   ├── schema.prisma             # Data models: User, Event, Guest, Wish, MediaItem
│   ├── dev.db                    # SQLite database file
│   └── seed.js                   # Initial seed data for users, events, and VIP guests
│
├── public/                       # Static public assets
│   ├── audio/                    # Background wedding music (MP3)
│   ├── img/                      # Wedding hero photos, background covers & illustrations
│   ├── tex/                      # 3D envelope paper textures (gold foil, cream paper)
│   ├── uploads/                  # Uploaded bride/groom photos, QR codes, venue pictures
│   └── raksmey/                  # High-performance luxury Khmer 3D interactive invitation
│       └── index.html            # 3D interactive envelope, wax seal & animations
│
└── src/
    ├── app/                      # Next.js App Router (Pages & API endpoints)
    │   ├── layout.tsx            # Global HTML shell & font definitions
    │   ├── globals.css           # Global Tailwind styling & animations
    │   ├── page.tsx              # Landing page / portal
    │   ├── portal/               # Guest invitation code access portal
    │   ├── login/                # Admin & Couple Authentication Sign-In page
    │   │
    │   ├── dashboard/            # Protected Management Console (JWT Authenticated)
    │   │   ├── layout.tsx        # Dashboard sidebar, header, and auth enforcement
    │   │   ├── page.tsx          # Real-time RSVP analytics, guests summary, check-in
    │   │   ├── event/            # Wedding details, couple profiles, theme customizer, venue photo
    │   │   ├── guests/           # Guest list, custom invitation links, QR generator, CSV export
    │   │   ├── media/            # Photo & video gallery upload & management
    │   │   ├── wishes/           # Guestbook wishes moderation & approval
    │   │   └── users/            # User account management & role assignments (SUPERADMIN only)
    │   │
    │   ├── invite/[slug]/        # Live Invitation Route
    │   │   └── page.tsx          # Dynamic invitation loader by event slug and guest code
    │   │
    │   └── api/                  # REST API Backend Routes
    │       ├── auth/             # Login, logout, current user session (/api/auth/*)
    │       ├── events/           # Event CRUD, slug checks, theme & venue photo saving
    │       ├── guests/           # Guest management & lookup by invitation token code
    │       ├── media/            # Gallery photo & video operations
    │       ├── rsvp/             # Public guest RSVP attendance submission
    │       ├── upload/           # Multipart image & audio file uploader
    │       ├── users/            # System user admin operations
    │       └── wishes/           # Public guestbook blessing messages
    │
    ├── components/               # Modular UI Components
    │   ├── dashboard/            # Sidebar navigation, stat cards, data tables
    │   ├── invitation/           # 3D Envelope, wax seal, countdown, music player, RSVP, gallery
    │   └── khmer/                # Traditional Khmer Kbach ornaments, frames, calligraphy
    │
    └── lib/                      # Core Utility Libraries
        ├── auth.ts               # JWT creation, cookie storage, session verification (jose)
        ├── prisma.ts             # Global Prisma Client singleton
        ├── security.ts           # Input sanitization (XSS defense) & rate limiting
        └── translations.ts       # Bilingual dictionary (Khmer & English)
```

---

## 🔐 Login & Authentication (ការចូលប្រើប្រព័ន្ធ)

The platform features secure, role-based access control with stateless **JWT tokens** signed with `jose` and stored in **`HttpOnly` secure cookies**.

### 1. How to Login:
1. Open your browser and visit: `http://localhost:3000/login`
2. Enter your email and password, or **click any of the 1-Click Quick Demo Login buttons** at the bottom of the form.
3. Upon successful sign-in, you are redirected to the management dashboard (`/dashboard`).

### 2. Available System Accounts:

| Role | Email | Password | Permissions & Capabilities |
|---|---|---|---|
| 👑 **Super Administrator** | `admin@wedding.com` | `Admin@123456` | Full platform control: manage all events, create users, assign roles, access all settings. |
| 💑 **Couple** | `alex.sophia@wedding.com` | `Wedding@2026` | Edit wedding details, customize 3D theme & colors, upload photos, manage guests & RSVPs. |
| 📋 **Event Organizer** | `organizer@wedding.com` | `Organizer@2026` | Coordinate guest arrivals, scan QR check-in passes, manage seating arrangements. |

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js**: v18.0 or newer (tested on Node.js v24)
- **Git**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/nab95167-sys/e-invitation.git
cd e-invitation

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Initialize database & run seed
npx prisma generate
npx prisma db push
node prisma/seed.js

# Launch local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live site.
Visit [http://localhost:3000/login](http://localhost:3000/login) to log into the admin dashboard.

---

## 🎨 Key Features & Highlights

1. **3D Interactive Envelope Gate**: Realistic wax seal, golden kbach embossing, flap opening animations, and personalized guest name badge.
2. **Real-time Color & Theme Customizer**: 6 curated presets + custom color pickers with instant auto-save and live 3D preview.
3. **Venue & Location Details**: Physical address, Google Maps direct navigation, and location photo upload directly from the dashboard.
4. **Tokenized Anti-Tamper Invitation Links**: Unique secure links for each guest (e.g., `/invite/so-vith-and-ma-na?code=vip-guest-01`).
5. **Interactive RSVP & Wishes**: Headcount, dietary preferences, celebratory animations, and moderated live guestbook.
6. **Mobile QR VIP Passes**: Instant QR code generation for smooth contactless guest check-in at the wedding reception.
