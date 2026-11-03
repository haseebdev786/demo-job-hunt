export const companyApplicants = [];
export function getCompanyApplicantById(id) {
  return companyApplicants.find((applicant) => applicant.id === id) || null;
}
