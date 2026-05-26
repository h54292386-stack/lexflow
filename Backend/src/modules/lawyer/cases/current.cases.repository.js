import Case from "../../client/caseRegisterForm/case.model.js";

export const getLawyerCasesRepository = async (lawyerId) => {

    return await Case.find({
        assignedLawyer: lawyerId
    })
        .populate("clientId", "name email profileImage")
        .sort({ createdAt: -1 });

};

export const getSingleCaseRepository = async (
    caseId,
    lawyerId
) => {

    return await Case.findOne({
        _id: caseId,
        assignedLawyer: lawyerId
    })
        .populate("clientId", "name email phone profileImage")
        .populate("assignedLawyer", "name email specialization");

};