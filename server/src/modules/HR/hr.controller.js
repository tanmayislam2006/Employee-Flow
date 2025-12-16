import { HRService } from "./hr.service.js";

const getWorkSheets = async (req, res) => {
  try {
    const { employee, search, month, year } = req.query;
    const result = await HRService.getAllWorkSheets({ employee, search, month, year });
    res.send(result);
  } catch (error) {
    console.error("Error in /workSheets:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const { isVerified, item, page } = req.query;
    const result = await HRService.getAllUsers({ isVerified }, { item, page });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { isVerified } = req.body;
    const result = await HRService.verifyUser(id, isVerified);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const hrEmail = req.params.hrEmail;
    const result = await HRService.getHrDashboardSummary(hrEmail);
    res.send(result);
  } catch (error) {
    if (error.message === "hrEmail is required") {
        return res.status(400).send({ message: error.message });
    }
    console.error("Error in /hrDashboardSummary:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

export const HRController = {
  getWorkSheets,
  getUsers,
  verifyUser,
  getDashboardSummary,
};
