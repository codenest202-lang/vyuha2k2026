# Vyuha 2K26

A groundbreaking, single-day event management platform for our college, scheduled for **March 30, 2026**.

## Tech Stack

- **Frontend**: React.js + Vite, Three.js (3D animations), Framer Motion
- **Backend**: Node.js + Express, MongoDB Atlas
- **Authentication**: Google OAuth 2.0, Magic Link / OTP email login
- **Payments**: Razorpay
- **AI**: Gemini AI chatbot
- **Deployment**: Cloudflare Pages (frontend), Cloudflare Workers / traditional VM (backend)

## Project Structure

```
vyuha2k2026/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions and API clients
│   │   ├── assets/        # Static assets (images, fonts)
│   │   └── styles/        # Global styles and theme
│   └── public/            # Public static files
├── backend/           # Node.js + Express backend API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # MongoDB/Mongoose models
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration
│   └── tests/             # Backend tests
└── docs/              # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Copy the `.env.example` files in both `frontend/` and `backend/` directories and fill in your credentials.

## Design Philosophy

- **Dark mode first**: Black, gray, gold/white accents. No blue anywhere.
- **3D animations**: Three.js powered plant root growth background animation
- **Performance**: Optimized for 2,000+ concurrent users
- **Security**: HTTPS, encrypted data at rest, DDoS protection, WAF

## License

Private - All rights reserved.
