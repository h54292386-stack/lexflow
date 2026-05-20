export const getUserId = (participant) => {
  if (!participant) return null;

  // CASE 1
  if (typeof participant === "string") {
    return participant;
  }

  // CASE 2
  if (participant.userId) {
    return (
      participant.userId._id ||
      participant.userId.id ||
      participant.userId
    );
  }

  // CASE 3
  return participant._id || participant.id || null;
};