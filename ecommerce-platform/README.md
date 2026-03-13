# 🛒 E-Commerce Microservices Platform

A full-stack e-commerce web application built using **Microservices Architecture** with Node.js, Express, MongoDB, and a vanilla HTML/CSS/JS frontend.

---

## 📁 Project Structure

```
Ecommerce-web/
├── api-gateway/          → Single entry point for all API calls
├── frontend/             → UI (HTML, CSS, JS)
├── services/
│   ├── user-service/     → Handles registration, login, JWT
│   ├── product-service/  → Manages products (CRUD)
│   ├── cart-service/     → Manages user cart
│   ├── order-service/    → Creates and tracks orders
│   └── payment-service/  → Simulates payment processing
```

---

## 🧠 How It Works (Simple Explanation)

### The Big Picture

Instead of one big server doing everything, we split the app into **6 small independent servers** (microservices). Each one does **one job only**. They all talk to each other through HTTP requests.

```
Browser (Frontend)
    ↓
API Gateway (port 3000)  ← Single door for everything
    ↓ routes to ↓
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ User Service │ Product Svc  │ Cart Service │ Order Service│ Payment Svc  │
│  :3001       │  :3002       │  :3003       │  :3004       │  :3005       │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘
       │              │              │              │              │
       └──────────────┴──────────────┴──────────────┴──────────────┘
                              MongoDB (port 27017)
```

---

## 🔧 Each Service Explained

### 1. 👤 User Service (port 3001)

**Job:** Handle user registration and login.

| What it does | How |
|---|---|
| Register a new user | Takes name, email, password → hashes password with **bcrypt** → saves to MongoDB |
| Login | Checks email & password → generates a **JWT token** |
| Get current user | Verifies JWT → returns user info |

**Key files:**
- `models/User.js` → Defines what a user looks like in the database (name, email, password, role)
- `controllers/userController.js` → The logic for register, login, getMe
- `middleware/auth.js` → Checks if the JWT token is valid

**What is JWT?**
> JWT (JSON Web Token) is like a **digital ID card**. When you login, the server gives you a token. You send this token with every request to prove who you are. The server verifies it without needing to check the database each time.

---

### 2. 📦 Product Service (port 3002)

**Job:** Manage products (add, list, view).

| What it does | How |
|---|---|
| Add a product | Takes name, description, price, category, image, stock → saves to MongoDB |
| Get all products | Returns every product from the database |
| Get one product | Returns a single product by its ID |

**Key files:**
- `models/Product.js` → Defines product structure (name, price, category, stock, etc.)
- `controllers/productController.js` → Logic for add, getAll, getOne
- `seed.js` → Script to insert 12 sample products into the database

**No authentication needed** — anyone can browse products.

---

### 3. 🛒 Cart Service (port 3003)

**Job:** Manage each user's shopping cart.

| What it does | How |
|---|---|
| Add item to cart | Takes productId, name, price, quantity → adds to user's cart (or increases quantity if already there) |
| Get cart | Returns all items in the logged-in user's cart |
| Remove item | Deletes a specific product from the cart |

**Key files:**
- `models/Cart.js` → Each user has ONE cart with an array of items
- `controllers/cartController.js` → Add, get, remove logic
- `middleware/auth.js` → **All cart routes require JWT** (must be logged in)

**How does it know which user?**
> The JWT token contains the user's ID. When you send the token, the middleware extracts the ID and uses it to find YOUR cart (not someone else's).

---

### 4. 📋 Order Service (port 3004)

**Job:** Create and track orders.

| What it does | How |
|---|---|
| Create order | Takes cart items → calculates total → saves as a new order with status "pending" |
| Get all orders | Returns all orders for the logged-in user |
| Get one order | Returns a single order (checks you own it) |
| Update status | Payment service calls this to change status to "confirmed" |

**Key files:**
- `models/Order.js` → Order has userId, items[], totalAmount, status
- `controllers/orderController.js` → Create, list, view, updateStatus

**Order statuses:** `pending` → `confirmed` → `shipped` → `delivered` (or `cancelled`)

---

### 5. 💳 Payment Service (port 3005)

**Job:** Process payments (currently simulated/fake).

| What it does | How |
|---|---|
| Process payment | Takes orderId + amount → waits 500ms (fake delay) → returns success with a fake transactionId |
| Update order | After payment succeeds → calls order-service to change order status to "confirmed" |

**Key files:**
- `utils/paymentGateway.js` → The fake payment simulator (always returns success)
- `controllers/paymentController.js` → Handles the payment flow

**Why fake?**
> Real payment gateways (Stripe, Razorpay) need API keys and setup. This fake one lets us test the full flow without real money.

---

### 6. 🚪 API Gateway (port 3000)

**Job:** Single entry point for the frontend. Routes requests to the correct service.

```
Frontend calls:  http://localhost:3000/api/products
Gateway routes:  http://localhost:3002/api/products  (product-service)
```

| Route | Goes to | Auth at Gateway? |
|---|---|---|
| `/api/users/*` | User Service :3001 | ❌ No (public) |
| `/api/products/*` | Product Service :3002 | ❌ No (public) |
| `/api/cart/*` | Cart Service :3003 | ✅ Yes (JWT required) |
| `/api/orders/*` | Order Service :3004 | ✅ Yes (JWT required) |
| `/api/payment/*` | Payment Service :3005 | ✅ Yes (JWT required) |

**Why a gateway?**
> Without it, the frontend would need to know 5 different URLs. With the gateway, it only talks to ONE URL (`localhost:3000`) and the gateway figures out where to send it.

**Key files:**
- `config/services.js` → URL map of all services
- `middleware/authMiddleware.js` → JWT check at gateway level
- `routes/gatewayRoutes.js` → Proxy rules using `http-proxy-middleware`

---

## 🖥️ Frontend

**Job:** The user interface — what people see and click.

Built with **plain HTML, CSS, and JavaScript**. No frameworks (React, Vue, etc.).

### Pages

| Page | File | What it shows |
|---|---|---|
| Home | `index.html` | Landing page with "Browse Products" button |
| Login | `login.html` | Email + password form |
| Register | `register.html` | Name + email + password form |
| Products | `products.html` | Grid of product cards with "Add to Cart" |
| Cart | `cart.html` | Table of cart items with remove buttons |
| Checkout | `checkout.html` | Order summary + "Pay & Place Order" button |

### JS Modules

| File | What it does |
|---|---|
| `js/api.js` | **Core helper** — makes API calls to gateway, attaches JWT token automatically, manages login state, updates navbar |
| `js/auth.js` | Handles login/register form submissions |
| `js/products.js` | Fetches products from API, renders cards, handles "Add to Cart" |
| `js/cart.js` | Loads cart, removes items, handles checkout (create order → pay → clear cart) |

### How auth works in the frontend:
1. User logs in → server returns JWT token
2. Token is saved in `localStorage`
3. Every API call reads the token from `localStorage` and adds it to the request header
4. If no token → user is redirected to login page for protected pages

---

## 🔄 Complete User Flow

```
1. User opens website
        ↓
2. Registers (name, email, password)
        ↓  → User Service creates account, returns JWT
3. Browses products
        ↓  → Product Service returns all products
4. Adds items to cart
        ↓  → Cart Service saves items (JWT identifies user)
5. Goes to checkout
        ↓  → Order Service creates order from cart items
6. Clicks "Pay"
        ↓  → Payment Service processes fake payment
        ↓  → Payment Service tells Order Service → status = "confirmed"
7. Order confirmed! 🎉
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Gateway | http-proxy-middleware |
| Container | Docker (for MongoDB) |

---

## 📦 Key NPM Packages Used

| Package | Used In | Purpose |
|---|---|---|
| `express` | All services | Web server framework |
| `mongoose` | All services | MongoDB object modeling |
| `jsonwebtoken` | User, Cart, Order, Payment, Gateway | Create & verify JWT tokens |
| `bcryptjs` | User Service | Hash passwords securely |
| `cors` | All services | Allow cross-origin requests |
| `http-proxy-middleware` | API Gateway | Forward requests to services |
| `axios` | Payment Service | Make HTTP calls to other services |

---

## 🚀 How to Run

### Prerequisites
- Node.js installed
- Docker installed (for MongoDB)

### Steps

```bash
# 1. Start MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest

# 2. Install dependencies for each service
cd services/user-service && npm install
cd ../product-service && npm install
cd ../cart-service && npm install
cd ../order-service && npm install
cd ../payment-service && npm install
cd ../../api-gateway && npm install

# 3. Start all services (each in a separate terminal)
cd services/user-service && node src/app.js       # port 3001
cd services/product-service && node src/app.js    # port 3002
cd services/cart-service && node src/app.js       # port 3003
cd services/order-service && node src/app.js      # port 3004
cd services/payment-service && node src/app.js    # port 3005
cd api-gateway && node src/server.js              # port 3000

# 4. Seed products
cd services/product-service && node seed.js

# 5. Open frontend
# Serve the frontend folder on port 8080
# Open http://localhost:8080/public/index.html
```

---

## 🧩 Why Microservices?

| Monolith (one big server) | Microservices (many small servers) |
|---|---|
| One codebase does everything | Each service has its own codebase |
| One bug can crash everything | One service failing doesn't kill others |
| Hard to scale specific features | Scale only what needs scaling |
| One team works on everything | Different teams can own different services |

**Example:** If Black Friday traffic hits and product browsing is slow, you can scale ONLY the product service instead of the entire app.

---

## 📝 Environment Variables

Each service can be configured with these env vars:

| Variable | Default | Used In |
|---|---|---|
| `PORT` | Service-specific | All services |
| `MONGO_URI` | `mongodb://localhost:27017/<service-name>` | All services |
| `JWT_SECRET` | `your_jwt_secret_key` | User, Cart, Order, Payment, Gateway |
| `USER_SERVICE_URL` | `http://localhost:3001` | Gateway |
| `PRODUCT_SERVICE_URL` | `http://localhost:3002` | Gateway |
| `CART_SERVICE_URL` | `http://localhost:3003` | Gateway |
| `ORDER_SERVICE_URL` | `http://localhost:3004` | Gateway, Payment |
| `PAYMENT_SERVICE_URL` | `http://localhost:3005` | Gateway |

---

*Built as a learning project to understand microservices architecture.*