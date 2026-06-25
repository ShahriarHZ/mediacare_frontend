# 🏥 MediCare Connect

**A full-stack Hospital Appointment & Healthcare Management System**

Live Demo: [https://mediacare-frontend.vercel.app](https://mediacare-frontend.vercel.app)  
Server API: [https://mediacare-server.onrender.com](https://mediacare-server.onrender.com)

---

## 📋 Project Overview

MediCare Connect is a modern healthcare management platform that connects patients with verified doctors. It enables online appointment booking, secure payments, prescription management, and role-based dashboards for patients, doctors, and administrators.

---

## ✨ Features

### 🧑‍⚕️ Patient
- Register and log in with email/password or Google OAuth
- Browse and search verified doctors by name, specialization, fee, experience, and rating
- Book appointments with real-time slot selection
- Pay consultation fees securely via **Stripe**
- Submit health problems/symptoms to the doctor after appointment is accepted
- View appointment status (Pending → Accepted → Completed)
- Cancel pending appointments
- View prescriptions written by doctors
- Submit and manage reviews for doctors
- View payment history with transaction IDs
- Manage personal profile (name, phone, blood group, address, age)

### 🩺 Doctor
- Register as a doctor (pending admin verification before appearing publicly)
- Complete profile with specialization, degree, experience, fee, hospital, bio
- Set weekly availability schedule (days + time slots)
- View and manage incoming appointments (Accept / Complete)
- View patient's submitted health problem before writing prescription
- Write prescriptions (diagnosis, medicines, notes) for completed appointments
- View all prescriptions written
- Dashboard overview with stats (total appointments, pending, completed, earnings)

### 🔐 Admin
- View platform-wide statistics (users, doctors, appointments, revenue)
- Manage all users (change roles, delete accounts)
- Verify or reject doctor registrations
- Monitor all appointments and payments
- View analytics (revenue over time, appointments by status, doctors by specialization)

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with SSR/SSG |
| Tailwind CSS v4 | Utility-first styling |
| DaisyUI v5 | Component library |
| Better Auth | Authentication (email + Google OAuth) |
| Stripe.js + React Stripe | Payment processing |
| Recharts | Analytics charts |
| React Hot Toast | Notifications |
| Framer Motion | Animations |

### Backend (Server)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB (Atlas) | Database |
| Better Auth (bearer plugin) | Session verification |
| Stripe | Payment intent creation |
| CORS + Cookie Parser | Security middleware |

---

## 🔐 Authentication & Security

This project uses **Better Auth** for authentication, running inside Next.js API routes. Key security design decisions:

### Role-Based Access Control
Every user has a `role` field stored in MongoDB (`patient`, `doctor`, or `admin`). Roles are assigned at registration and enforced server-side on every protected route.

### JWT / Session Flow
1. User registers or logs in via Better Auth (email/password or Google OAuth)
2. Better Auth issues a session token stored as an `HttpOnly` cookie on the client domain
3. Client requests to the Express server include the session token as a **Bearer token** in the `Authorization` header (using Better Auth's bearer plugin)
4. Express `verifySession` middleware forwards this Bearer token to Better Auth's `/api/auth/get-session` endpoint for validation
5. On success, the user's identity is attached to `req.user` for downstream route handlers

### Why Bearer Token (not cookie forwarding)?
The client (`mediacare-frontend.vercel.app`) and server (`mediacare-server.onrender.com`) run on different domains. Browsers enforce same-origin cookie policies, so session cookies from Vercel cannot be automatically sent to Render. The Bearer token approach solves this by explicitly passing the token via `Authorization` header, which is cross-origin safe.

### Protected Routes
All sensitive Express routes use two middleware layers:
```js
// Authentication check
app.get('/protected-route', verifySession, async (req, res) => { ... });

// Authentication + role check
app.get('/admin-only-route', verifySession, verifyAdmin, async (req, res) => { ... });
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test keys)
- Google Cloud Console project (OAuth credentials)

### 1. Clone the repositories

```bash
# Client
git clone https://github.com/ShahriarHZ/mediacare_frontend.git
cd mediacare_frontend/client
npm install

# Server
git clone https://github.com/ShahriarHZ/mediacare_server.git
cd mediacare_server
npm install
```

Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Google OAuth Setup

In [Google Cloud Console](https://console.cloud.google.com):
- Create an OAuth 2.0 Client ID
- Add `http://localhost:3001` to Authorized JavaScript Origins
- Add `http://localhost:3001/api/auth/callback/google` to Authorized Redirect URIs

### 4. Run both servers

```bash
# Terminal 1 — Express server (port 5000)
cd mediacare_server
npm run dev

# Terminal 2 — Next.js client (port 3001)
cd mediacare_frontend/client
npm run dev
```

Open `http://localhost:3001`

---

## 📁 Project Structure

```
mediacare_frontend/client/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/   # Better Auth route handler
│   │   ├── dashboard/
│   │   │   ├── patient/         # Patient dashboard pages
│   │   │   ├── doctor/          # Doctor dashboard pages
│   │   │   └── admin/           # Admin dashboard pages
│   │   ├── doctors/             # Find Doctors + Doctor detail/booking
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   └── layout.js            # Root layout
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PaymentForm.jsx      # Stripe card payment
│   │   └── PatientProfileCard.jsx
│   ├── hooks/
│   │   └── useRole.js           # Auth + role hook
│   └── lib/
│       ├── auth.js              # Better Auth server config
│       ├── auth-client.js       # Better Auth client config
│       ├── api.js               # Shared authenticated fetch helper
│       └── stripe.js            # Stripe loader

mediacare_server/
├── index.js                     # Express app + all routes
├── auth.js                      # Better Auth server config (legacy)
├── middlewares/
│   ├── verifyToken.js
│   └── verifyAdmin.js
└── package.json
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend (Next.js) | Vercel | https://mediacare-frontend.vercel.app |
| Backend (Express) | Render | https://mediacare-server.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

### Deployment Notes
- Environment variables are configured separately in Vercel and Render dashboards
- Vercel auto-deploys on push to `main` branch of the frontend repo
- Render auto-deploys on push to `main` branch of the server repo
- MongoDB Atlas Network Access is set to allow all IPs (`0.0.0.0/0`) for compatibility with Vercel's dynamic IPs

---

## 💳 Test Payments

Use Stripe's test card to simulate payments:

| Field | Value |
|---|---|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |
| ZIP | Any 5 digits |

---

## 📊 Database Collections

| Collection | Purpose |
|---|---|
| `users` | Patient, Doctor, Admin profiles with roles |
| `doctors` | Doctor professional profiles + verification status |
| `appointments` | Booking records with status, slot, problem description |
| `prescriptions` | Doctor-written prescriptions linked to appointments |
| `payments` | Payment records with Stripe transaction IDs |
| `reviews` | Patient reviews for doctors |
| `user`, `session`, `account` | Better Auth internal collections |

---

## 👥 Default Roles

| Role | How to Get |
|---|---|
| Patient | Default role on registration |
| Doctor | Select "Doctor" on registration → Admin must verify |
| Admin | Manually set via Admin dashboard → Manage Users |

---

## 📝 License

This project was built as part of the **MediCare Connect** assignment for the selection process.

---

## 👨‍💻 Author

LinkedIn : https://www.linkedin.com/in/shahriarhossain-zisan/
Facebook : https://www.facebook.com/shahriar.zisan.864712
Portfolio : portfolio-shahriar-zisan.netlify.app

**Md Shahriar Hossain Zisan**  
GitHub: [@ShahriarHZ](https://github.com/ShahriarHZ)
