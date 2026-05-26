import {
    getLawyerCasesRepository,
    getSingleCaseRepository
} from "./current.cases.repository.js";

export const getLawyerCasesService = async (
    lawyerId
) => {

    const cases = await getLawyerCasesRepository(
        lawyerId
    );

    return cases;
};

export const getSingleCaseService = async (
    caseId,
    lawyerId
) => {

    const caseData = await getSingleCaseRepository(
        caseId,
        lawyerId
    );

    if (!caseData) {
        throw new Error("Case not found");
    }

    return caseData;
};