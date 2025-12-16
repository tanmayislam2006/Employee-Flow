const express = require("express");

const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://employee-flow-app.web.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xozk3nx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.get("/", (req, res) => {
  res.send("Employee Flow Server Is Running");
});
async function run() {
  try {
    const employeeFLow = client.db("Employee-Flow");
    const userCollection = employeeFLow.collection("Users");
    const employeeWorkSheets = employeeFLow.collection("Work-Sheets");
    const payRolls = employeeFLow.collection("Pay-Rolls");
    const transactions = employeeFLow.collection("Transactions");
    const contacts = employeeFLow.collection("Contacts");
    // get signle user information
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email,
      };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // get specific user work sheets
    app.get("/myWorkSheet/:email", async (req, res) => {
      const email = req.params.email;
      const query = { employee_email: email };
      // Pagination defaults
      const { item, page } = req.query;

      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;
      const totalItems = await employeeWorkSheets.countDocuments(query);
      const result = await employeeWorkSheets
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      res.send({
        myEntries: result,
        totalItems,
      });
    });
    // get all user(employee) work sheets for HR
    app.get("/workSheets", async (req, res) => {
      const { employee, search, month, year } = req.query;

      /**
       * Build $match stage dynamically based on provided query parameters
       */
      const matchStage = {};

      // Filter by employee name (exact match)
      if (employee) {
        matchStage.employee_name = employee;
      }

      // Filter by search term (partial match, case-insensitive) on name or email
      if (search) {
        matchStage.$or = [
          { employee_name: { $regex: search, $options: "i" } },
          { employee_email: { $regex: search, $options: "i" } },
        ];
      }

      // Later we'll add month and year filtering after projecting them

      try {
        const pipeline = [
          /**
           * Stage 1: Add month and year fields
           * - Converts 'date' string to Date
           * - Extracts month and year
           */
          {
            $addFields: {
              parsedDate: { $toDate: "$date" },
            },
          },
          {
            $addFields: {
              month: { $month: "$parsedDate" },
              year: { $year: "$parsedDate" },
            },
          },

          /**
           * Stage 2: Match stage
           * - Includes employee, search filters from query
           * - Adds month and year if provided
           */
          {
            $match: {
              ...matchStage,
              ...(month ? { month: parseInt(month) } : {}),
              ...(year ? { year: parseInt(year) } : {}),
            },
          },

          /**
           * Stage 3: Optionally remove added fields
           * (you can keep them if you want)
           */
          {
            $project: {
              parsedDate: 0,
              month: 0,
              year: 0,
            },
          },
        ];

        // Run aggregation pipeline
        const results = await employeeWorkSheets.aggregate(pipeline).toArray();

        res.send(results);
      } catch (error) {
        console.error("Error in /workSheets:", error);
        res.status(500).send({ message: "Server error", error });
      }
    });
    // get all user for Hr
    app.get("/users", async (req, res) => {
      const query = {};
      const { isVerified, item, page } = req.query;
      if (isVerified) {
        query.isVerified = isVerified === "true";
      }
      // Pagination defaults
      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;
      const totalItems = await userCollection.countDocuments(query);
      const result = await userCollection
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      res.send({
        employees: result,
        totalItems,
      });
    });
    // get all pay roll for admin and hr
    app.get("/payRolls", async (req, res) => {
      const query = {};
      const { status, employeeEmail, item, page, hrEmail } = req.query;

      // Build the query
      if (status) {
        query.status = status;
      }
      if (employeeEmail) {
        query.employeeEmail = employeeEmail;
      }
      if (hrEmail) {
        query.hrEmail = hrEmail;
      }
      // Pagination defaults
      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;

      // Count AFTER building the filter
      const totalItems = await payRolls.countDocuments(query);

      // Fetch paginated results
      const result = await payRolls
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .sort({ payrequest_at: -1 })
        .toArray();

      res.send({
        payRolls: result,
        totalItems,
      });
    });
    // get specifif id pay roll details for admin
    app.get("/payRoll/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await payRolls.findOne(query);
      res.send(result);
    });
    // get al payment transactions
    app.get("/transactions", async (req, res) => {
      const { item, page } = req.query;
      // Pagination defaults
      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;
      const totalItems = await transactions.countDocuments();
      const result = await transactions
        .find()
        .sort({ paid_at: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      res.send({
        transactions: result,
        totalItems,
      });
    });
    // get single user specific trasaction history this api is use for hr and employee
    app.get("/transactions/:email", async (req, res) => {
      const email = req.params.email;
      const query = { employeeEmail: email };
      const { item, page } = req.query;
      // Default values
      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;
      // Get total count
      const totalItems = await transactions.countDocuments(query);
      const result = await transactions
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .sort({ paid_at: -1 })
        .toArray();
      res.send({
        transactions: result,
        totalItems,
      });
    });
    // get all contact messages for admin
    app.get("/contacts", async (req, res) => {
      const { item, page } = req.query;
      // Pagination defaults
      const itemsPerPage = parseInt(item);
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * itemsPerPage;
      const totalItems = await contacts.countDocuments();
      const result = await contacts
        .find()
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();
      res.send({
        messages: result,
        totalItems,
      });
    });
    // get user status is he Active or Fired
    app.get("/user/email/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send({
        status: result.status,
      });
    });
    // get dashboard summary for employee
    app.get("/dashboard-employee/:email", async (req, res) => {
      const email = req.params.email;
      /**
       * GET /dashboard-employee/:email
       *
       * Returns a summary dashboard for an employee:
       * - Total hours worked
       * - Work hours by task (for chart)
       * - Total amount paid
       * - Last payment date
       * - Optional recent payment records
       */
      try {
        // -----------------------------
        // Part 1: Aggregate employeeWorkSheets
        // -----------------------------
        const workAggregation = await employeeWorkSheets
          .aggregate([
            { $match: { employee_email: email } },
            {
              $group: {
                _id: "$task",
                totalHours: { $sum: "$hour" },
              },
            },
          ])
          .toArray();

        // Sum all tasks for total hours
        const totalHours = workAggregation.reduce(
          (acc, item) => acc + item.totalHours,
          0
        );

        // -----------------------------
        // Part 2: Aggregate Transactions
        // -----------------------------
        // Get total paid and last payment date
        const transactionsData = await transactions
          .find({ employeeEmail: email })
          .sort({ paid_at: -1 }) // latest first
          .toArray();

        const totalPaid = transactionsData.reduce(
          (acc, tx) => acc + Number(tx.amount),
          0
        );
        const lastPaidDate =
          transactionsData.length > 0 ? transactionsData[0].paid_at : null;

        // Optional: pick only recent N payments
        const recentPayments = transactionsData.slice(0, 5).map((tx) => ({
          amount: Number(tx.amount),
          pay_for_month: tx.pay_for_month,
          pay_for_year: tx.pay_for_year,
          paid_at: tx.paid_at,
        }));

        // -----------------------------
        // Build response
        // -----------------------------
        res.send({
          totalHours,
          workByTask: workAggregation.map((item) => ({
            task: item._id,
            totalHours: item.totalHours,
          })),
          totalPaid,
          lastPaidDate,
          payments: recentPayments,
        });
      } catch (error) {
        console.error("Error in /dashboard-employee:", error);
        res.status(500).send({ message: "Server error", error });
      }
    });
    // get dashboard summary for HR
    app.get("/hrDashboardSummary/:hrEmail", async (req, res) => {
      const hrEmail = req.params.hrEmail;

      if (!hrEmail) {
        return res.status(400).send({ message: "hrEmail is required" });
      }

      const now = new Date();

      // Calculate UTC date ranges
      const todayStart = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0,
          0
        )
      );
      const weekStart = new Date(todayStart);
      weekStart.setUTCDate(todayStart.getUTCDate() - 7);

      const yearStart = new Date(
        Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0)
      );
      const monthStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      );

      try {
        const pipeline = [
          {
            $facet: {
              totalCounts: [
                { $match: { hrEmail } },
                {
                  $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                  },
                },
              ],

              paidTotalSalary: [
                { $match: { hrEmail, status: "paid" } },
                {
                  $group: {
                    _id: null,
                    totalSalary: { $sum: "$salary" },
                  },
                },
              ],

              todayRequests: [
                { $match: { hrEmail, payrequest_at: { $gte: todayStart } } },
                { $count: "count" },
              ],

              weeklyRequests: [
                { $match: { hrEmail, payrequest_at: { $gte: weekStart } } },
                { $count: "count" },
              ],

              yearlyRequests: [
                { $match: { hrEmail, payrequest_at: { $gte: yearStart } } },
                { $count: "count" },
              ],

              monthlyRequests: [
                { $match: { hrEmail, payrequest_at: { $gte: monthStart } } },
                { $count: "count" },
              ],

              latestRequests: [
                { $match: { hrEmail } },
                { $sort: { payrequest_at: -1 } },
                { $limit: 5 },
              ],
            },
          },
        ];

        const result = await payRolls.aggregate(pipeline).toArray();

        if (!result || result.length === 0) {
          return res.send({
            totalRequests: 0,
            totalPaid: 0,
            totalPending: 0,
            paidTotalSalary: 0,
            todayRequests: 0,
            weeklyRequests: 0,
            yearlyRequests: 0,
            monthlyRequests: 0,
            latestRequests: [],
          });
        }

        const data = result[0];

        // Parse total status counts
        let totalPaid = 0;
        let totalPending = 0;
        data.totalCounts.forEach((item) => {
          if (item._id === "paid") totalPaid = item.count;
          if (item._id === "pending") totalPending = item.count;
        });

        res.send({
          totalRequests: totalPaid + totalPending,
          totalPaid,
          totalPending,
          paidTotalSalary: data.paidTotalSalary[0]?.totalSalary || 0,
          todayRequests: data.todayRequests[0]?.count || 0,
          weeklyRequests: data.weeklyRequests[0]?.count || 0,
          yearlyRequests: data.yearlyRequests[0]?.count || 0,
          monthlyRequests: data.monthlyRequests[0]?.count || 0,
          latestRequests: data.latestRequests,
        });
      } catch (error) {
        console.error("Error in /hrDashboardSummary:", error);
        res.status(500).send({ message: "Server error", error });
      }
    });
    // get admin dashboard summary
    app.get("/adminDashboardSummary", async (req, res) => {
      try {
        const now = new Date();

        // 🧮 Time Ranges (UTC-safe)
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const weekStart = new Date(todayStart);
        weekStart.setDate(todayStart.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const yearStart = new Date(now.getFullYear(), 0, 1);

        // 🚀 Step 1: Aggregation on payRolls (for counts)
        const payrollStats = await payRolls
          .aggregate([
            {
              $facet: {
                // 🧮 Count by status (paid, pending)
                statusCounts: [
                  { $group: { _id: "$status", count: { $sum: 1 } } },
                ],
              },
            },
          ])
          .toArray();

        const counts = payrollStats[0].statusCounts || [];
        let totalPaid = 0,
          totalPending = 0;
        counts.forEach((item) => {
          if (item._id === "paid") totalPaid = item.count;
          if (item._id === "pending") totalPending = item.count;
        });

        // 🚀 Step 2: Aggregation on transactions (for financial data)
        const transactionStats = await transactions
          .aggregate([
            {
              $facet: {
                // 💰 Total amount paid
                totalSpent: [
                  {
                    $group: {
                      _id: null,
                      total: { $sum: { $toDouble: "$amount" } },
                    },
                  },
                ],
                // 🧾 Today spending
                todaySpent: [
                  { $match: { paid_at: { $gte: todayStart, $lte: now } } },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: { $toDouble: "$amount" } },
                    },
                  },
                ],
                // 📆 Weekly spending
                weekSpent: [
                  { $match: { paid_at: { $gte: weekStart, $lte: now } } },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: { $toDouble: "$amount" } },
                    },
                  },
                ],
                // 🗓️ Monthly spending
                monthSpent: [
                  { $match: { paid_at: { $gte: monthStart, $lte: now } } },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: { $toDouble: "$amount" } },
                    },
                  },
                ],
                // 📅 Yearly spending
                yearSpent: [
                  { $match: { paid_at: { $gte: yearStart, $lte: now } } },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: { $toDouble: "$amount" } },
                    },
                  },
                ],
                // 📈 Per month analysis (for chart)
                perMonth: [
                  {
                    $group: {
                      _id: {
                        month: "$pay_for_month",
                        year: "$pay_for_year",
                      },
                      total: { $sum: { $toDouble: "$amount" } },
                      count: { $sum: 1 },
                    },
                  },
                  { $sort: { "_id.year": 1, "_id.month": 1 } },
                ],
                // 🕐 Latest 5 transactions
                latestTransactions: [
                  { $sort: { paid_at: -1 } },
                  { $limit: 5 },
                  {
                    $project: {
                      transactionId: 1,
                      employeeName: 1,
                      amount: 1,
                      paid_at: 1,
                      paymentMethod: 1,
                    },
                  },
                ],
              },
            },
          ])
          .toArray();

        const t = transactionStats[0];

        // 📦 Final response
        res.send({
          totalRequests: totalPaid + totalPending,
          totalPaid,
          totalPending,
          totalMoneySpent: t.totalSpent[0]?.total || 0,
          todaySpent: t.todaySpent[0]?.total || 0,
          weekSpent: t.weekSpent[0]?.total || 0,
          monthSpent: t.monthSpent[0]?.total || 0,
          yearSpent: t.yearSpent[0]?.total || 0,
          paidRequestsPerMonth: t.perMonth || [],
          latestTransactions: t.latestTransactions || [],
        });
      } catch (error) {
        console.error("Error in /adminDashboardSummary:", error);
        res.status(500).send({ message: "Server error", error });
      }
    });

    // register the user data
    app.post("/register", async (req, res) => {
      try {
        const { profileInfo } = req.body;
        const email = profileInfo?.email;

        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        // 1️⃣ Check if user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(200).send({ message: "User already exists" });
        }

        // 2️⃣ Insert new user
        const result = await userCollection.insertOne(profileInfo);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });
    // register user work sheets
    app.post("/workSheet", async (req, res) => {
      const sheetData = req.body;
      const result = await employeeWorkSheets.insertOne(sheetData);
      res.send(result);
    });
    // register the requested pay roll for employee by the user
    app.post("/payRoll", async (req, res) => {
      const payRollData = req.body;
      const result = await payRolls.insertOne(payRollData);
      res.send(result);
    });
    // create a payment api
    app.post("/create-payment-intent", async (req, res) => {
      const { payRollId, amount } = req.body;
      const payRoll = await payRolls.findOne({ _id: new ObjectId(payRollId) });
      if (!payRoll) {
        return res.status(404).send({ message: "PayRoll not found" });
      }
      if (Number(payRoll.salary) === Number(amount)) {
        const salary = Number(payRoll.salary) * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: salary, // amount in cents or paisa
          currency: "usd", // use "usd" or "bdt" if available
          payment_method_types: ["card"],
        });
        // Send clientSecret to frontend
        res.send({ clientSecret: paymentIntent.client_secret });
      } else {
        return res.status(400).send({ message: "Salary amount mismatch" });
      }
    });
    app.post("/transaction", async (req, res) => {
      const transactionData = req.body;
      const result = await transactions.insertOne(transactionData);
      res.send(result);
    });
    // cont register al contact message and contact information
    app.post("/contact", async (req, res) => {
      const contactData = req.body;
      const result = await contacts.insertOne(contactData);
      res.send(result);
    });
    // update the entires informatrion
    app.patch("/workSheet/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const result = await employeeWorkSheets.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
      res.send(result);
    });
    // update the user verify status by HR
    app.patch("/user/:id/verify", async (req, res) => {
      const id = req.params.id;
      const { isVerified } = req.body;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isVerified } }
      );
      res.send(result);
    });
    // PATCH user by ID (update fields like role, salary, designation)
    app.patch("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedFields = req.body;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
      );
      res.send(result);
    });
    // after payment success update the pay roll status
    app.patch("/payRoll/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const result = await payRolls.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send(result);
    });

    // update the last log int information
    app.patch("/login", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    //  delete a single entry form my work sheet
    app.delete("/myWorkSheet/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await employeeWorkSheets.deleteOne(query);
      res.send(result);
    });
    // delete or payroll by id a user by Admin
    app.delete("/payRoll/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await payRolls.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  const time = new Date().toLocaleTimeString();
  console.log(`Server is running on ${time} port http://localhost:${port}`);
});
