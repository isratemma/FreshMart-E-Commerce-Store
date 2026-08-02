# 🛒 FreshMart — Full Stack Grocery E-Commerce Store

A modern, fully responsive online grocery store built with React, Node.js, MongoDB, and Tailwind CSS.

🌐 **Live Demo:** [fresh-mart-e-commerce-store.vercel.app](https://fresh-mart-e-commerce-store.vercel.app)
💻 **GitHub:** [github.com/isratemma/FreshMart-E-Commerce-Store](https://github.com/isratemma/FreshMart-E-Commerce-Store)

---

## ✨ Features

### Customer
- 🔐 Email/password registration & login
- 🔑 Google Sign-in (Firebase)
- 🛍️ Browse products by category with search & sort
- 🛒 Shopping cart with real-time sync
- 📦 Checkout with address selection
- 💳 Multiple payment options (COD, Card, UPI)
- 📋 Order history & tracking
- 📍 Address book (save multiple addresses)
- 🔔 Toast notifications

### Seller Dashboard
- 🔒 Separate seller authentication
- 📊 Dashboard with live stats (products, orders, revenue)
- ➕ Add products with image upload (Cloudinary)
- ✏️ Inline product edit & delete
- 🔄 Toggle product stock status
- 📦 View & manage all customer orders
- 🔄 Update order status

### Technical
- ⚡ Code splitting & lazy loading (fast load times)
- 🔒 JWT auth with httpOnly cookies
- 🛡️ Helmet security headers
- 🚦 Rate limiting (API abuse protection)
- 📱 Fully responsive (mobile + desktop)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + Firebase Google Auth |
| Images | Cloudinary |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Firebase project

### Clone the repo
```bash
git clone https://github.com/isratemma/FreshMart-E-Commerce-Store.git
cd FreshMart-E-Commerce-Store
```

### Backend setup
```bash
# Install dependencies
npm install

# Create server/.env from example
cp server/.env.example server/.env
# Fill in your values in server/.env

# Start the server
npm run server
```

### Frontend setup
```bash
cd client

# Install dependencies
npm install

# Create .env from example
cp .env.example .env
# Fill in your values in client/.env

# Start dev server
npm run dev
```

### Seed the database (first time only)
```bash
node server/seed.js
```

---

## 📁 Project Structure

```
FreshMart/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard, Login, etc.
│   │   ├── pages/           # Home, AllProducts, Cart, Checkout, etc.
│   │   ├── pages/seller/    # Seller dashboard pages
│   │   ├── contexts/        # AppContext (global state)
│   │   └── configs/         # Firebase config
│   └── .env.example
│
├── server/                  # Express backend
│   ├── controllers/         # userController, productController, etc.
│   ├── models/              # User, Product, Order, Address
│   ├── routes/              # API routes
│   ├── middleware/          # auth, multer, rate limiting
│   ├── configs/             # db.js, cloudinary.js
│   └── .env.example
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/user/register` | — | Register customer |
| POST | `/api/user/login` | — | Customer login |
| POST | `/api/user/google-login` | — | Google auth |
| GET | `/api/products` | — | Get all products |
| POST | `/api/products` | Seller | Add product |
| PUT | `/api/products/:id` | Seller | Update product |
| DELETE | `/api/products/:id` | Seller | Delete product |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/my` | User | Customer orders |
| GET | `/api/orders` | Seller | All orders |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add to cart |
| GET | `/api/address` | User | Get addresses |
| POST | `/api/address` | User | Save address |

---

## 🌍 Deployment

- **Frontend:** Vercel — set `VITE_BACKEND_URL` to your Render URL
- **Backend:** Render — set all env vars from `server/.env.example`
- **Database:** MongoDB Atlas (already hosted)
- **Images:** Cloudinary (already configured)

---

## 👩‍💻 Author

**Israt Emma**
- GitHub: [@isratemma](https://github.com/isratemma)

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
