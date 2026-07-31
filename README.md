# Ziadera Store

A modern, full-featured e-commerce storefront built with **Angular 20** and styled with **Tailwind CSS**. It connects to a REST API to deliver a complete shopping experience with authentication, product discovery, cart management, and user dashboards.

---

## Overview

Ziadera Store is a single-page e-commerce application designed for performance and usability. It features a responsive UI, dark mode support, real-time product filtering, and secure user authentication—including Google OAuth 2.0 and JWT-based session management.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Angular 20 (Standalone Components, Zoneless Change Detection) |
| **Styling** | Tailwind CSS v4 + PostCSS |
| **UI Kit** | `@ziadshalaby/ngx-zs-component` (custom design system) |
| **Icons** | Font Awesome 6 |
| **Auth** | Google Identity Services (OAuth 2.0) + JWT (Access / Refresh) |
| **HTTP** | Angular `HttpClient` |
| **Build** | Angular CLI (`@angular/build:application`) |

---

## Key Features

- **Product Catalog** — Browse products with pagination, category carousel, brand filters, price range, stock status, and sorting.
- **Smart Filtering** — Real-time filter updates with clean URL-integrated state.
- **User Authentication** — Login / Sign-up with username & password or Google One Tap.
- **Password Recovery** — Secure reset-password flow via email token.
- **User Dashboard** — Profile, Orders, Addresses, and Reviews.
- **Responsive Navbar** — Mega-menu navigation, search bar, and user dropdown.
- **Dark Mode** — Seamless theme toggle across all components.
- **Reusable UI** — Built on a custom Angular component library (`ngx-zs-component`).

---

