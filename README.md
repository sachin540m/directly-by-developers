# Directly By Developers 🏢

A premium, fully responsive, and SEO-optimized real estate platform built with **React**, **Vite**, and **Tailwind CSS**. This platform lists verified premium properties in Navi Mumbai (Nerul, Panvel, Kharghar, and Vashi) with details sourced directly from developer landing pages, offering users direct contact channels with **zero brokerage**.

## 🌟 Key Features

*   **Verified Official Data**: Details like MahaRERA registration numbers, pricing configurations, and actual possession dates are matched with the developers' official listings.
*   **Official Banner Extraction**: The desktop hero banners are extracted directly from the official developer websites.
*   **Dynamic City Filtering**: Fully functional navigation filters by geolocations (Nerul, Panvel, Kharghar, Vashi) synced with URL search parameters.
*   **Premium Custom UI/UX**:
    *   Clean gold-tinted theme (`#B8860B`) with custom font pairing (*Cormorant Garamond* & *Plus Jakarta Sans*).
    *   Responsive navigation bar featuring hover-activated dropdown menus, Lucide icons, and mobile-friendly accordion toggles.
    *   Interactive floating CTA buttons (Direct Call, WhatsApp Chat) for instant support.
    *   Elegant double-column callback inquiry forms and interactive accordions for Frequently Asked Questions (FAQs).
*   **Interactive Modals**: Multi-state enquiry form overlay validating input and capturing direct leads for builders.

## 🛠️ Technology Stack

*   **Frontend Library**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (PostCSS)
*   **Routing**: React Router DOM (v6)
*   **Icons**: Lucide React
*   **Hosting Compatibility**: Ready for Vercel, Netlify, or self-hosted static hosting.

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v16.x or higher) and npm installed.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/syntaxcoder13/directly-by-developers.git
    cd directly-by-developers
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will be live at `http://localhost:5173/`.

4.  **Build for Production**:
    ```bash
    npm run build
    ```
    This builds the production assets inside the `dist/` directory.

## 📁 Project Structure

```text
├── public/                # Static assets (images, favicons)
├── src/
│   ├── components/        # Reusable UI components (Navbar, PropertyCard, Modal, FAQ, etc.)
│   ├── data/              # Properties database (properties.js)
│   ├── pages/             # Route-level pages (Home, PropertyDetail)
│   ├── App.jsx            # Main Router setup
│   ├── index.css          # Tailwind CSS base and custom styles
│   └── main.jsx           # App entry point
├── index.html             # HTML entry point with premium SVG favicon and SEO meta tags
├── tailwind.config.js     # Custom color palettes, typography, and font family configurations
└── package.json           # Project dependencies and script aliases
```

## 📄 License

This project is licensed under the MIT License.
