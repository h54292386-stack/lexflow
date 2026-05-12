import Client from "./client.model.js";

export const createClient = async (data) => {
  return await Client.create(data);
};

export const findClientByEmail = (email) => {
  return Client.findOne({ email });
};

export const findClientByEmailForLogin = (email) => {
  return Client.findOne({ email }).select("+password +refreshToken");
};