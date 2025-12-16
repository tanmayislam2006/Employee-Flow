import { getCollection } from "../../config/db.js";
import { ObjectId } from "mongodb";
import config from "../../config/index.js";
import Stripe from "stripe";

let stripe;
if (config.STRIPE_SECRET_KEY) {
  stripe = new Stripe(config.STRIPE_SECRET_KEY);
}

const getPayRolls = async (filters, paginationOptions) => {
  const payRolls = getCollection("Pay-Rolls");
  const { status, employeeEmail, hrEmail } = filters;
  const { item, page } = paginationOptions;
  const query = {};

  if (status) {
    query.status = status;
  }
  if (employeeEmail) {
    query.employeeEmail = employeeEmail;
  }
  if (hrEmail) {
    query.hrEmail = hrEmail;
  }

  const itemsPerPage = parseInt(item);
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;

  const totalItems = await payRolls.countDocuments(query);
  const result = await payRolls
    .find(query)
    .skip(skip)
    .limit(itemsPerPage)
    .sort({ payrequest_at: -1 })
    .toArray();

  return {
    payRolls: result,
    totalItems,
  };
};

const getPayRollById = async (id) => {
  const payRolls = getCollection("Pay-Rolls");
  const query = { _id: new ObjectId(id) };
  const result = await payRolls.findOne(query);
  return result;
};

const updatePayRollStatus = async (id, status) => {
  const payRolls = getCollection("Pay-Rolls");
  const result = await payRolls.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
  return result;
};

const deletePayRoll = async (id) => {
  const payRolls = getCollection("Pay-Rolls");
  const query = { _id: new ObjectId(id) };
  const result = await payRolls.deleteOne(query);
  return result;
};

const createPaymentIntent = async (payRollId, amount) => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const payRolls = getCollection("Pay-Rolls");
  const payRoll = await payRolls.findOne({ _id: new ObjectId(payRollId) });

  if (!payRoll) {
    throw new Error("PayRoll not found");
  }

  if (Number(payRoll.salary) === Number(amount)) {
    const salary = Number(payRoll.salary) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: salary,
      currency: "usd",
      payment_method_types: ["card"],
    });
    return { clientSecret: paymentIntent.client_secret };
  } else {
    throw new Error("Salary amount mismatch");
  }
};

const getAllTransactions = async (paginationOptions) => {
  const transactions = getCollection("Transactions");
  const { item, page } = paginationOptions;

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

  return {
    transactions: result,
    totalItems,
  };
};

const createTransaction = async (transactionData) => {
  const transactions = getCollection("Transactions");
  const result = await transactions.insertOne(transactionData);
  return result;
};

const getAllContacts = async (paginationOptions) => {
  const contacts = getCollection("Contacts");
  const { item, page } = paginationOptions;

  const itemsPerPage = parseInt(item);
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const totalItems = await contacts.countDocuments();
  const result = await contacts
    .find()
    .skip(skip)
    .limit(itemsPerPage)
    .toArray();

  return {
    messages: result,
    totalItems,
  };
};

const createContact = async (contactData) => {
  const contacts = getCollection("Contacts");
  const result = await contacts.insertOne(contactData);
  return result;
};

const updateUser = async (id, updatedFields) => {
  const userCollection = getCollection("Users");
  const result = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedFields }
  );
  return result;
};

const getAdminDashboardSummary = async () => {
  const payRolls = getCollection("Pay-Rolls");
  const transactions = getCollection("Transactions");

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Step 1: Aggregation on payRolls
  const payrollStats = await payRolls
    .aggregate([
      {
        $facet: {
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

  // Step 2: Aggregation on transactions
  const transactionStats = await transactions
    .aggregate([
      {
        $facet: {
          totalSpent: [
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: "$amount" } },
              },
            },
          ],
          todaySpent: [
            { $match: { paid_at: { $gte: todayStart, $lte: now } } },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: "$amount" } },
              },
            },
          ],
          weekSpent: [
            { $match: { paid_at: { $gte: weekStart, $lte: now } } },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: "$amount" } },
              },
            },
          ],
          monthSpent: [
            { $match: { paid_at: { $gte: monthStart, $lte: now } } },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: "$amount" } },
              },
            },
          ],
          yearSpent: [
            { $match: { paid_at: { $gte: yearStart, $lte: now } } },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: "$amount" } },
              },
            },
          ],
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

  return {
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
  };
};

export const AdminService = {
  getPayRolls,
  getPayRollById,
  updatePayRollStatus,
  deletePayRoll,
  createPaymentIntent,
  getAllTransactions,
  createTransaction,
  getAllContacts,
  createContact,
  updateUser,
  getAdminDashboardSummary,
};
