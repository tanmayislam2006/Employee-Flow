# Employee Flow Server

This is the backend server for the Employee Flow application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for employee management, payroll, transactions, and HR/admin dashboards.

## Features

- **User Management:** Register, verify, update, and delete users.
- **Work Sheets:** Employees can submit, update, and delete work sheets.
- **Payroll:** HR/Admin can manage payroll requests, approve payments, and track payroll status.
- **Transactions:** Track all payment transactions, including employee-specific histories.
- **Contacts:** Store and retrieve contact messages.
- **Dashboards:** 
  - Employee dashboard: View total hours, payments, and work breakdown.
  - HR dashboard: View payroll stats, requests, and salary summaries.
  - Admin dashboard: View overall spending, payroll status, and analytics.
- **Stripe Integration:** Create payment intents for payroll using Stripe.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with MongoDB Atlas)
- Stripe (for payments)
- JWT (for authentication, if implemented)
- CORS (for frontend integration)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account
- Stripe account (for payment integration)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/employee-flow-server.git
   cd employee-flow-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add:
   ```
   PORT=5000
   DB_USER=your_mongodb_user
   DB_PASSWORD=your_mongodb_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

## API Endpoints

### User APIs

- `GET /user/:email` - Get user info by email
- `POST /register` - Register a new user
- `PATCH /user/:id` - Update user info
- `PATCH /user/:id/verify` - Verify user status

### Work Sheet APIs

- `GET /myWorkSheet/:email` - Get work sheets for a user
- `POST /workSheet` - Add a new work sheet
- `PATCH /workSheet/:id` - Update a work sheet
- `DELETE /myWorkSheet/:id` - Delete a work sheet

### Payroll APIs

- `GET /payRolls` - Get all payrolls (with filters)
- `GET /payRoll/:id` - Get payroll by ID
- `POST /payRoll` - Create a payroll request
- `PATCH /payRoll/:id` - Update payroll status
- `DELETE /payRoll/:id` - Delete payroll

### Transaction APIs

- `GET /transactions` - Get all transactions
- `GET /transactions/:email` - Get transactions for a user
- `POST /transaction` - Add a transaction

### Contact APIs

- `GET /contacts` - Get all contact messages
- `POST /contact` - Add a contact message

### Dashboard APIs

- `GET /dashboard-employee/:email` - Employee dashboard summary
- `GET /hrDashboardSummary/:hrEmail` - HR dashboard summary
- `GET /adminDashboardSummary` - Admin dashboard summary

### Payment API

- `POST /create-payment-intent` - Create a Stripe payment intent for payroll

## Notes

- All date/time calculations use UTC to ensure consistency with MongoDB ISO date storage.
- Pagination is supported on most list endpoints via `item` (items per page) and `page` query parameters.
- Make sure to whitelist your IP in MongoDB Atlas for database access.

## License

MIT

---
