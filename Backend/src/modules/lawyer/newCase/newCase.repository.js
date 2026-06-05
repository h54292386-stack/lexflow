import Case from "../../client/caseRegisterForm/case.model.js";

export const findRequestedCasesForLawyer = async (
  lawyerId
) => {
  const cases = await Case.find({
    "requestedLawyers.lawyerId": lawyerId,
  })
    .populate(
      "clientId",
      "name email profileImage"
    )
    .sort({ createdAt: -1 });

  return cases.map((c) => {
    const request =
      c.requestedLawyers.find(
        (r) =>
          r.lawyerId.toString() ===
          lawyerId.toString()
      );
      console.log(request);

   return {
  ...c.toObject(),
  lawyerStatus:
    request?.status === "pending"
      ? "new"
      : request?.status || "new",
};
  });
};