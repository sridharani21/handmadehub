# 🌸 Handmade With Love — E-Commerce Website

A complete, cute handmade goods e-commerce shop built with React + Node.js + MongoDB.

---

## ✨ Features

- 🛍️ Product browsing with category filters & search
- 💝 Wishlist (save favourite items)
- 🛒 Shopping cart with quantity control
- 📦 Order placement — COD & Online (UPI QR)
- 🌟 Product reviews & star ratings
- 👤 User authentication (Register / Login)
- ⚙️ Admin panel — Add/Delete products, toggle stock, manage orders
- 📱 Fully responsive & mobile-friendly
- 🎨 Cute pastel pink theme with smooth animations

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|-------------|-------------------------|
| Frontend     | React 18 + Vite         |
| Styling      | Tailwind CSS + Custom CSS |
| Routing      | React Router v6         |
| State        | Context API + useReducer |
| Backend      | Node.js + Express.js    |
| Database     | MongoDB + Mongoose      |
| Auth         | JWT + bcrypt            |
| File Upload  | Multer                  |

---

## 📁 Folder Structure

```
handmade-shop/
├── client/                    ← React Frontend
│   ├── src/
│   │   ├── components/        ← Navbar, Cart, ProductCard, etc.
│   │   ├── pages/             ← Home, Shop, ProductDetail, Login, etc.
│   │   │   └── admin/         ← Admin Dashboard, Products, Orders
│   │   ├── context/           ← Auth, Cart, Wishlist state
│   │   ├── hooks/             ← useToast
│   │   └── utils/api.js       ← Axios instance
│   └── index.html
│
└── server/                    ← Node.js Backend
    ├── models/                ← User, Product, Order, Review
    ├── controllers/           ← Business logic
    ├── routes/                ← API routes
    ├── middleware/            ← Auth + Admin guards
    ├── uploads/               ← Product images & your QR code
    └── server.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Step 1 — Clone & Install

```bash
# Backend
cd handmade-shop/server
npm install

# Frontend
cd ../client
npm install
```

### Step 2 — Configure Environment

Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/handmade-shop
JWT_SECRET=your_super_secret_key_change_this_now
PORT=5000
```

For MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/handmade-shop
```

### Step 3 — Create uploads folder

```bash
mkdir server/uploads
```

### Step 4 — Run the App

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open: **http://localhost:5173**

---

## 👑 Becoming Admin

After registering on the website, open MongoDB Compass (or shell) and update your user:

```javascript
// MongoDB shell
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

Then log out and log back in. You'll see the **Admin Panel** option in your profile dropdown.

---

## 📱 Adding Your UPI QR Code

1. Save your QR code image as: `server/uploads/qr-code.jpg`
2. Open `client/src/pages/Checkout.jsx`
3. Find the QR code section and replace the placeholder div with:
```jsx
<img
  src="/uploads/qr-code.jpg"
  alt="UPI QR Code"
  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
/>
```

---

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile
- `POST /api/auth/wishlist/:id` — Toggle wishlist
- `GET /api/auth/wishlist` — Get wishlist

### Products
- `GET /api/products` — Get all (supports ?category=&search=&sort=)
- `GET /api/products/:id` — Get one
- `POST /api/products` — Create (admin)
- `PUT /api/products/:id` — Update (admin)
- `DELETE /api/products/:id` — Delete (admin)
- `PATCH /api/products/:id/stock` — Toggle stock (admin)

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders/my` — My orders
- `GET /api/orders` — All orders (admin)
- `PUT /api/orders/:id` — Update status (admin)

### Reviews
- `POST /api/reviews/:productId` — Add review
- `GET /api/reviews/:productId` — Get reviews
- `DELETE /api/reviews/:id` — Delete (admin)

---

## 🔧 Production Build

```bash
cd client
npm run build
# Serve the dist/ folder with nginx or Vercel/Netlify
```

---

Made with 🌸 and lots of love!
