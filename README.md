# 🚀 Employee Flow

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Employee%20Flow-00BFB2?style=for-the-badge&logo=vercel&logoColor=white)](https://employee-flow-app.web.app)

A modern, full-featured Employee & HR Management platform built with React, Vite, Tailwind CSS, DaisyUI, Firebase, and more.  
Easily manage employees, HR tasks, payroll, and analytics—all in one place.

---
## Admin  Account 
--
admin@gmail.com
123456Aa@
--
## 📑 Table of Contents

- [Live Demo](#-employee-flow)
- [Project Map](#-project-map)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Folder Structure](#-folder-structure)
- [License](#-license)

---

## 🗺️ Project Map

- **Home**: Landing page with hero, features, how it works, pricing, testimonials, and FAQ.
- **Authentication**: Register and login with email/password or Google.
- **Dashboard**: Role-based navigation for Employee, HR, and Admin.
  - **Employee**: My Profile, Work Sheet, Salary Info.
  - **HR**: Employee List, Work Progress, Pay Requests.
  - **Admin**: Admin Actions, Pay Sheets, Pay History, Contacts.
- **Details**: Employee payment and work analytics.
- **Contact & About**: Company info, mission, and support.

---

## 🛠️ Tech Stack

| Frontend         | Backend/API      | Auth & Hosting | UI/UX         | State/Data         |
|------------------|------------------|----------------|---------------|--------------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) | ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) | ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=black) | ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white) | ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?logo=reactquery&logoColor=white) |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) | Node.js/Express (API) | Google Auth | ![DaisyUI](https://img.shields.io/badge/-DaisyUI-FF69B4?logo=daisyui&logoColor=white) | ![SweetAlert2](https://img.shields.io/badge/-SweetAlert2-FF5F6D?logo=sweetalert2&logoColor=white) |
| ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-EF008F?logo=framer&logoColor=white) | MongoDB (API) | | ![Recharts](https://img.shields.io/badge/-Recharts-FF7300?logo=recharts&logoColor=white) | ![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white) |

---

## ✨ Key Features

- **Role-based Dashboard**: Employee, HR, and Admin views with dynamic navigation.
- **Employee Work Sheet**: Log daily tasks, hours, and view/edit history.
- **Payroll Management**: HR can manage pay requests, approve, and track salary status.
- **Employee List & Verification**: HR/Admin can verify, edit, or remove employees.
- **Analytics & Reports**: Visual charts for work distribution and payment history.
- **Responsive UI**: Optimized for desktop, tablet, and mobile.
- **Secure Auth**: Firebase authentication (email/password & Google).
- **Modern UI/UX**: Tailwind CSS, DaisyUI, and Framer Motion for smooth experience.
- **Notifications**: Toasts and alerts for all major actions.
- **Pagination & Search**: Efficient data browsing for large teams.

---

## 🖼️ Screenshots

> _Add your own screenshots in this section!_

| Home Page | Dashboard | Work Sheet | Employee List | Payroll |
|-----------|-----------|------------|--------------|---------|
| ![Home](./src/assets/screenshots/home.png) | ![Dashboard](./src/assets/screenshots/dashboard.png) | ![Work Sheet](./src/assets/screenshots/worksheet.png) | ![Employee List](./src/assets/screenshots/employeelist.png) | ![Payroll](./src/assets/screenshots/payroll.png) |

---

## 🚦 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/employee-flow-client.git
   cd employee-flow-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file for your Firebase and API keys.

4. **Run the app**
   ```bash
   npm run dev
   ```

5. **Visit the app**
   - Local: [http://localhost:5173](http://localhost:5173)
   - Live: [https://employee-flow-app.web.app](https://employee-flow-app.web.app)

---

## 📁 Folder Structure

```
src/
│
├── Authentication/      # Login & Register pages
├── Components/          # Reusable UI components (Navbar, Footer, Table, etc.)
├── Context/             # React Context providers
├── Firebase/            # Firebase config
├── Hook/                # Custom React hooks
├── Layout/              # Main, Dashboard, and Auth layouts
├── Pages/               # All main pages (Home, About, Dashboard, HR, Employee, Admin)
├── Routes/              # App routing
├── assets/              # Images, logos, and static assets
├── index.css            # Tailwind & DaisyUI config
└── main.jsx             # App entry point
```

---

## 📜 License

MIT License.  
© 2025 Employee Flow

---

> _Built with ❤️ by your team. For any issues, please open an issue or
