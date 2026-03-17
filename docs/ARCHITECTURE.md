# Vyuha 2K26 - Architecture Overview

## System Architecture

```
                    +-------------------+
                    |   Cloudflare DNS  |
                    |   WAF + DDoS      |
                    +--------+----------+
                             |
              +--------------+--------------+
              |                             |
    +---------v---------+        +----------v---------+
    | Frontend           |        | Backend API         |
    | (Cloudflare Pages) |        | (Node.js/Express)   |
    | React + Vite       |        | Port 4000           |
    | Three.js           |        +----------+----------+
    | Framer Motion      |                   |
    +--------------------+        +----------v----------+
                                  | MongoDB Atlas        |
                                  | (User, Booking, OTP) |
                                  +---------------------+
```

## Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom theme (dark mode first, no blue)
- **3D Graphics**: Three.js via React Three Fiber
- **Animations**: Framer Motion
- **Routing**: React Router v6

### Key Components

| Component | Purpose |
|-----------|---------|
| `PlantRootBackground` | Three.js 3D plant root growth animation |
| `IntroAnimation` | Launch sequence with sliding text |
| `HeroSection` | Main landing page hero |
| `EventCard` | Floating event program cards |
| `Navbar` | Responsive navigation with theme toggle |

## Backend Architecture

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB via Mongoose
- **Auth**: JWT tokens, Google OAuth, Email OTP
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, rate limiting

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/email/send-otp` | POST | Send OTP to email |
| `/api/auth/email/verify-otp` | POST | Verify OTP, get JWT |
| `/api/auth/google` | POST | Google OAuth login |
| `/api/auth/me` | GET | Get current user |
| `/api/bookings/create` | POST | Create booking |
| `/api/bookings/verify-payment` | POST | Verify Razorpay payment |
| `/api/bookings/my-bookings` | GET | User's bookings |
| `/api/admin/dashboard` | GET | Admin analytics |
| `/api/admin/bookings` | GET | All bookings (paginated) |
| `/api/admin/verify-qr` | POST | QR code verification |
| `/api/chatbot/message` | POST | AI chatbot |

### Database Models

- **User**: email, name, googleId, role, phone, college, year, department
- **Booking**: userId, transactionId, participants[], totalAmount, status, qrCode, attendanceStatus
- **OTP**: email, otp, expiresAt, verified (TTL auto-delete)

## Design System

### Color Palette (No Blue!)

| Token | Value | Usage |
|-------|-------|-------|
| `vyuha-black` | `#0A0A0A` | Primary background |
| `vyuha-dark` | `#111111` | Card backgrounds |
| `vyuha-gold` | `#D4A843` | Primary accent |
| `vyuha-gold-accent` | `#FFD700` | Highlights |
| `vyuha-white` | `#FFFFFF` | Light mode bg |

### Typography

- **Display**: Playfair Display (headings)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (technical elements)

## Deployment

### Option A: Cloudflare (Recommended)
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers or traditional VM
- Assets: Cloudflare R2
- Videos: Cloudflare Stream

### Option B: Docker
- `docker-compose up` for local development
- Includes frontend, backend, and MongoDB containers
