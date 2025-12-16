import { AdminService } from "./admin.service.js";

const getPayRolls = async (req, res) => {
  try {
    const { status, employeeEmail, item, page, hrEmail } = req.query;
    const result = await AdminService.getPayRolls(
      { status, employeeEmail, hrEmail },
      { item, page }
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getPayRoll = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await AdminService.getPayRollById(id);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const updatePayRoll = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const result = await AdminService.updatePayRollStatus(id, status);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const deletePayRoll = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await AdminService.deletePayRoll(id);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const paymentIntent = async (req, res) => {
  try {
    const { payRollId, amount } = req.body;
    const result = await AdminService.createPaymentIntent(payRollId, amount);
    res.send(result);
  } catch (error) {
    console.error(error);
    if (error.message === "PayRoll not found") {
      return res.status(404).send({ message: "PayRoll not found" });
    }
    if (error.message === "Salary amount mismatch") {
      return res.status(400).send({ message: "Salary amount mismatch" });
    }
    res.status(500).send({ message: "Server error" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { item, page } = req.query;
    const result = await AdminService.getAllTransactions({ item, page });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const result = await AdminService.createTransaction(transactionData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getContacts = async (req, res) => {
  try {
    const { item, page } = req.query;
    const result = await AdminService.getAllContacts({ item, page });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const createContact = async (req, res) => {
  try {
    const contactData = req.body;
    const result = await AdminService.createContact(contactData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;
    const result = await AdminService.updateUser(id, updatedFields);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const result = await AdminService.getAdminDashboardSummary();
    res.send(result);
  } catch (error) {
    console.error("Error in /adminDashboardSummary:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

export const AdminController = {
  getPayRolls,
  getPayRoll,
  updatePayRoll,
  deletePayRoll,
  paymentIntent,
  getTransactions,
  createTransaction,
  getContacts,
  createContact,
  updateUser,
  getDashboardSummary,
};
