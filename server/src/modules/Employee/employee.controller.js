import { EmployeeService } from "./employee.service.js";

const createWorkSheet = async (req, res) => {
  try {
    const sheetData = req.body;
    const result = await EmployeeService.createWorkSheet(sheetData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getMyWorkSheets = async (req, res) => {
  try {
    const email = req.params.email;
    const { item, page } = req.query;
    const result = await EmployeeService.getMyWorkSheets(email, { item, page });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const deleteWorkSheet = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await EmployeeService.deleteWorkSheet(id);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const updateWorkSheet = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const result = await EmployeeService.updateWorkSheet(id, update);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await EmployeeService.getDashboardData(email);
    res.send(result);
  } catch (error) {
    console.error("Error in /dashboard-employee:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

const getTransactions = async (req, res) => {
  try {
    const email = req.params.email;
    const { item, page } = req.query;
    const result = await EmployeeService.getEmployeeTransactions(email, { item, page });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const requestPayRoll = async (req, res) => {
  try {
    const payRollData = req.body;
    const result = await EmployeeService.requestPayRoll(payRollData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

export const EmployeeController = {
  createWorkSheet,
  getMyWorkSheets,
  deleteWorkSheet,
  updateWorkSheet,
  getDashboardData,
  getTransactions,
  requestPayRoll,
};
