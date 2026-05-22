import Client from "../auth/client.model.js";

export const getClientProfileRepo = async (clientId) => {
  return await Client.findById(clientId);
};

export const updateClientProfileRepo = async (
  clientId,
  updateData
) => {
  return await Client.findByIdAndUpdate(
    clientId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const getClientWithPasswordRepo = async (clientId) => {
  return await Client.findById(clientId).select("+password");
};