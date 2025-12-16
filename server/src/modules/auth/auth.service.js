import { getCollection } from "../../config/db.js";

const registerUser = async (profileInfo) => {
  const userCollection = getCollection("Users");
  const email = profileInfo?.email;

  if (!email) {
    throw new Error("Email is required");
  }

  // Check if user already exists
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return { message: "User already exists", exists: true };
  }

  // Insert new user
  const result = await userCollection.insertOne(profileInfo);
  return result;
};

const getUserProfile = async (email) => {
  const userCollection = getCollection("Users");
  const query = { email };
  const result = await userCollection.findOne(query);
  return result;
};

const getUserStatus = async (email) => {
  const userCollection = getCollection("Users");
  const result = await userCollection.findOne({ email });
  return { status: result?.status };
};

const updateUserLogin = async (email, lastSignInTime) => {
  const userCollection = getCollection("Users");
  const filter = { email: email };
  const updateDoc = {
    $set: {
      lastSignInTime: lastSignInTime,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  return result;
};

export const AuthService = {
  registerUser,
  getUserProfile,
  getUserStatus,
  updateUserLogin,
};
