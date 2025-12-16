import { getCollection } from "../../config/db.js";
import { ObjectId } from "mongodb";

const createWorkSheet = async (sheetData) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const result = await employeeWorkSheets.insertOne(sheetData);
  return result;
};

const getMyWorkSheets = async (email, paginationOptions) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const query = { employee_email: email };
  const { item, page } = paginationOptions;

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

  return {
    myEntries: result,
    totalItems,
  };
};

const deleteWorkSheet = async (id) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const query = { _id: new ObjectId(id) };
  const result = await employeeWorkSheets.deleteOne(query);
  return result;
};

const updateWorkSheet = async (id, updateData) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const result = await employeeWorkSheets.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  return result;
};

const getDashboardData = async (email) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const transactions = getCollection("Transactions");

  // Part 1: Aggregate employeeWorkSheets
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

  const totalHours = workAggregation.reduce(
    (acc, item) => acc + item.totalHours,
    0
  );

  // Part 2: Aggregate Transactions
  const transactionsData = await transactions
    .find({ employeeEmail: email })
    .sort({ paid_at: -1 })
    .toArray();

  const totalPaid = transactionsData.reduce(
    (acc, tx) => acc + Number(tx.amount),
    0
  );
  const lastPaidDate =
    transactionsData.length > 0 ? transactionsData[0].paid_at : null;

  const recentPayments = transactionsData.slice(0, 5).map((tx) => ({
    amount: Number(tx.amount),
    pay_for_month: tx.pay_for_month,
    pay_for_year: tx.pay_for_year,
    paid_at: tx.paid_at,
  }));

  return {
    totalHours,
    workByTask: workAggregation.map((item) => ({
      task: item._id,
      totalHours: item.totalHours,
    })),
    totalPaid,
    lastPaidDate,
    payments: recentPayments,
  };
};

const getEmployeeTransactions = async (email, paginationOptions) => {
  const transactions = getCollection("Transactions");
  const query = { employeeEmail: email };
  const { item, page } = paginationOptions;

  const itemsPerPage = parseInt(item);
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;

  const totalItems = await transactions.countDocuments(query);
  const result = await transactions
    .find(query)
    .skip(skip)
    .limit(itemsPerPage)
    .sort({ paid_at: -1 })
    .toArray();

  return {
    transactions: result,
    totalItems,
  };
};

const requestPayRoll = async (payRollData) => {
  const payRolls = getCollection("Pay-Rolls");
  const result = await payRolls.insertOne(payRollData);
  return result;
};

export const EmployeeService = {
  createWorkSheet,
  getMyWorkSheets,
  deleteWorkSheet,
  updateWorkSheet,
  getDashboardData,
  getEmployeeTransactions,
  requestPayRoll,
};
