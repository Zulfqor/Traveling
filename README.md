# Traveler. - Travel Booking Web Application 🏨✈️

A modern, highly-polished React & Node.js Travel Booking Application built for Hackathons.

## 🚀 Quick Start

Run the entire application (Backend + Frontend) with a single command:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001/hotels`

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS v3, Axios, Lucide React icons
- **Backend**: Node.js, Express, JSON Server (`db.json`) with CORS enabled
- **Design Tokens**:
  - Light Background: `#FBFAF7`
  - Dark Background: `#0F172A` | Card: `#1A2332`
  - Primary Accent: `#FF6B4A` (Book Now buttons & Active Filters)
  - Secondary Accent: `#0EA5A0` (Ratings & Active Favorites)
  - Fonts: `Space Grotesk` (Headings), `Inter` (Body)

---

## ✨ Key Features

1. **Ticket Perforation UI**: Signature horizontal dashed line with semicircular side cutouts simulating a boarding pass/ticket punch.
2. **Zero Emojis Policy**: Clean SVG icons from `lucide-react` with line stroke `1.5–2`.
3. **Control Panel**: Sticky top panel with real-time name search, city dropdown, price order, rating sorting, and price range slider modal/bottom sheet.
4. **Booking System**: Interactive booking confirmation modal with real-time `PATCH` requests to `http://localhost:3001/hotels/:id`. Updates state & `db.json` with toast feedback.
5. **Dark Mode & LocalStorage Favorites**: Theme switcher and favorite hotel list persisted across browser sessions.
6. **Accessible & Responsive**: Keyboard focus ring states (`focus:ring-2 focus:ring-[#FF6B4A]`), image fallbacks (`ImageOff` icon), and mobile drawer navigation.

---

## 📁 Project Structure

```
hotel/
├── beck/
│   ├── db.json          # Pre-populated hotels database
│   ├── server.js        # Express + JSON Server CORS wrapper
│   └── package.json
├── front/
│   ├── src/
│   │   ├── components/  # Navbar, ControlPanel, HotelCard, BookingModal, FilterBottomSheet, Pagination, SkeletonCard, ErrorState
│   │   ├── context/     # ThemeContext, FavoritesContext, ToastContext
│   │   ├── pages/       # HomePage, FavoritesPage, HotelDetailsPage, NotFoundPage
│   │   ├── services/    # Axios API client
│   │   ├── App.jsx      # Routes definition
│   │   └── main.jsx     # Entry point & Providers
│   └── package.json
└── package.json         # Root monorepo script using concurrently
```
