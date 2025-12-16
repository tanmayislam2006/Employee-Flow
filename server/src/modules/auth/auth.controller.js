import { AuthService } from "./auth.service.js";

const register = async (req, res) => {
  try {
    const { profileInfo } = req.body;
    const result = await AuthService.registerUser(profileInfo);
    // If it exists but we returned a message object
    if (result.exists) {
        return res.status(200).send({ message: result.message });
    }
    res.send(result);
  } catch (error) {
    console.error(error);
    if (error.message === "Email is required") {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await AuthService.getUserProfile(email);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getStatus = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await AuthService.getUserStatus(email);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const loginUpdate = async (req, res) => {
  try {
    const { email, lastSignInTime } = req.body;
    const result = await AuthService.updateUserLogin(email, lastSignInTime);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

export const AuthController = {
  register,
  getUser,
  getStatus,
  loginUpdate,
};
