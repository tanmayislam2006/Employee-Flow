import { getCollection } from "../../config/db.js";
import { ObjectId } from "mongodb";

const getAllWorkSheets = async (filters) => {
  const employeeWorkSheets = getCollection("Work-Sheets");
  const { employee, search, month, year } = filters;

  const matchStage = {};

  if (employee) {
    matchStage.employee_name = employee;
  }

  if (search) {
    matchStage.$or = [
      { employee_name: { $regex: search, $options: "i" } },
      { employee_email: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [
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
    {
      $match: {
        ...matchStage,
        ...(month ? { month: parseInt(month) } : {}),
        ...(year ? { year: parseInt(year) } : {}),
      },
    },
    {
      $project: {
        parsedDate: 0,
        month: 0,
        year: 0,
      },
    },
  ];

  const results = await employeeWorkSheets.aggregate(pipeline).toArray();
  return results;
};

const getAllUsers = async (filters, paginationOptions) => {
  const userCollection = getCollection("Users");
  const { isVerified } = filters;
  const { item, page } = paginationOptions;
  const query = {};

  if (isVerified) {
    query.isVerified = isVerified === "true";
  }

  const itemsPerPage = parseInt(item);
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const totalItems = await userCollection.countDocuments(query);
  const result = await userCollection
    .find(query)
    .skip(skip)
    .limit(itemsPerPage)
    .toArray();

  return {
    employees: result,
    totalItems,
  };
};

const verifyUser = async (id, isVerified) => {
  const userCollection = getCollection("Users");
  const result = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isVerified } }
  );
  return result;
};

const getHrDashboardSummary = async (hrEmail) => {
  const payRolls = getCollection("Pay-Rolls");
  
  if (!hrEmail) {
    throw new Error("hrEmail is required");
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
    return {
      totalRequests: 0,
      totalPaid: 0,
      totalPending: 0,
      paidTotalSalary: 0,
      todayRequests: 0,
      weeklyRequests: 0,
      yearlyRequests: 0,
      monthlyRequests: 0,
      latestRequests: [],
    };
  }

  const data = result[0];

  // Parse total status counts
  let totalPaid = 0;
  let totalPending = 0;
  data.totalCounts.forEach((item) => {
    if (item._id === "paid") totalPaid = item.count;
    if (item._id === "pending") totalPending = item.count;
  });

  return {
    totalRequests: totalPaid + totalPending,
    totalPaid,
    totalPending,
    paidTotalSalary: data.paidTotalSalary[0]?.totalSalary || 0,
    todayRequests: data.todayRequests[0]?.count || 0,
    weeklyRequests: data.weeklyRequests[0]?.count || 0,
    yearlyRequests: data.yearlyRequests[0]?.count || 0,
    monthlyRequests: data.monthlyRequests[0]?.count || 0,
    latestRequests: data.latestRequests,
  };
};

export const HRService = {
  getAllWorkSheets,
  getAllUsers,
  verifyUser,
  getHrDashboardSummary,
};
