import baseLink from './base'
import  axios from 'axios'

// User APIs
// export async function createUser(payload) {
//     const response = await baseLink.post("register/", payload )
//     return response.data
// }

export async function authenticateUser(payload) {
    const response = await baseLink.post("login/", payload)
    return response.data
}

export async function getUserInfo(config) {
    const response = await baseLink.get("auth/user", config)
    return response.data
}

export async function changePassword(payload, config) {
    const response = await baseLink.put("change_password/", payload, config)
    return response.data
}

export async function editUserInfo(payload, config) {
    const response = await baseLink.put(`users/${payload.id}/`, payload, config)
    return response.data
}

export async function getUserProfile(config) {
    const response = await baseLink.get("user_profile/", config)
    return response.data
}

export async function editUserProfile(profileId, payload, config) {
    const response = await baseLink.put(`users_profiles/${profileId}/`, payload, config)
    return response.data
}

export async function logoutUser(config) {
    const response = await baseLink.post("logoutall/", config)
    return response
}

// Posts APIs
export async function pullInternshipPosts(config) {
    const response = await baseLink.get("internship_posts/", config)
    return response.data
}

export async function pushInternshipPost(payload, config) {
    const response = await baseLink.post("internship_posts/", payload, config)
    return response.data
}

export async function editInternshipPost(postId, payload, config) {
    const response = await baseLink.put(`internship_posts/${postId}/`, payload, config)
    return response.data
}

export async function getPostSchedule(postId, config) {
    const response = await baseLink.get(`filter/post/${postId}/schedule/`, config)
    return response.data
}

export async function editPostSchedule(scheduleId, payload, config) {
    const response = await baseLink.put(`interview_schedules/${scheduleId}/`, payload, config)
    return response.data
}

export async function createPostSchedule(payload, config) {
    const response = await baseLink.post('interview_schedules/', payload, config)
    return response.data
}

export async function removeInternshipPost(postId, config) {
    const response = await baseLink.delete(`internship_posts/${postId}/`, config)
    return response.data
}

export async function getAlumniApplications(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/internship_applications`, config)
    return response.data
}

export async function fetchAlumniCertificates(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/certificates`, config)
    return response.data
}

export async function sendAlumniCertificate(payload, config) {
    const response = await baseLink.post('certificates/', payload, config)
    return response.data
}

export async function editAlumniCertificate(certificateId, payload, config) {
    const response = await baseLink.put(`certificates/${certificateId}/`, payload, config)
    return response.data
}

export async function fetchalumniProjects(alumniId, config) {
    const response = await baseLink.get(`filter/member/${alumniId}/projects`, config)
    return response.data
}

export async function sendProject(payload, config) {
    const response = await baseLink.post('projects/', payload, config)
    return response.data
}
export async function addProjectMember(payload, config) {
    const response = await baseLink.post('projects_members/', payload, config)
    return response.data
}

export async function fetchDesignationAnnouncements(designationId, config) {
    const response = await baseLink.get(`filter/designation/${designationId}/announcements`, config)
    return response.data
}

export async function getAlumniProfile(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/profile`, config)
    return response.data
}

export async function fetchAlumniSkills(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/professions`, config)
    return response.data
}

export async function addAlumniSkills(payloads, config) {
   const requests = payloads.map(item => baseLink.post('alumni_professions/', item, config))
   const  responseArray = await axios.all([...requests])
   return responseArray
}

export async function dropAlumniSkill(skillId, config) {
    const response = await baseLink.delete(`alumni_professions/${skillId}/`, config)
   return response.data
}

export async function fetchAllSkills(config) {
    const response = await baseLink.get('professions/', config)
    return response.data
}

export async function fetchCvPersonalInfo(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/cv_personal_informations`, config)
    return response.data
}

export async function editCvPersonalInfo(cvInfoId, payload, config) {
    const response = await baseLink.put(`cvs_personal_informations/${cvInfoId}/`, payload, config)
    return response.data
}

export async function sendCvPersonalInfo(payload, config) {
    const response = await baseLink.post('cvs_personal_informations/', payload, config)
    return response.data
}

export async function fetchCvEducationInfo(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/cv_education_informations`, config)
    return response.data
}

export async function editCvEducationInfo(cvEducationId, payload, config) {
    const response = await baseLink.put(`cvs_education_informations/${cvEducationId}/`, payload, config)
    return response.data
}

export async function sendCvEducationInfo(payload, config) {
    const response = await baseLink.post('cvs_education_informations/', payload, config)
    return response.data
}

export async function fetchCvExperienceInfo(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/cv_experience_informations`, config)
    return response.data
}

export async function editCvExperienceInfo(cvExperienceId, payload, config) {
    const response = await baseLink.put(`cvs_experience_informations/${cvExperienceId}/`, payload, config)
    return response.data
}

export async function sendCvExperienceInfo(payload, config) {
    const response = await baseLink.post('cvs_experience_informations/', payload, config)
    return response.data
}

export async function sendAlumniRatings(payload, config) {
    const response = await baseLink.post('alumni_ratings/', payload, config)
    return response.data
}

export async function editAlumniProfile(payload, config) {
    const response = await baseLink.put(`alumni_profiles/${payload.id}/`, payload, config)
    return response.data
}

export async function getInterviewQuestions(professionId, config) {
    const response = await baseLink.get(`filter/profession/${professionId}/questions/`, config)
    return response.data
}

export async function getInterviewQuestionChoices(questionId, config) {
    const response = await baseLink.get(`filter/question/${questionId}/choices/`, config)
    return response.data
}

export async function sendInternshipApplication(payload, config) {
    const response = await baseLink.post("internship_applications/", payload, config)
    return response.data
}

export async function getInternshipApplications(postId, config) {
    const response = await baseLink.get(`filter/internship_post/${postId}/applications`, config)
    return response.data
}
export async function processInternshipApplication(applicationId, payload, config) {
    const response = await baseLink.put(`internship_applications/${applicationId}/`, payload, config)
    return response.data
}

export async function editMultipleApplications(payloads, config){
    const requests = payloads.map((item) => baseLink.put(`internship_applications/${item.id}/`, item, config))
   const  responseArray = await axios.all([...requests])
   return responseArray
}

export async function editSingleApplication(payload, config){
    const response =  await baseLink.put(`internship_applications/${payload.id}/`, payload, config)
    return response.data
}

export async function getOrganizationInternshipPosts(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/internship_posts/`, config)
    return response.data
}

export async function getOrganizationContracts(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/contracts/`, config)
    return response.data
}

export async function sendInternshipContract(payload, config) {
    const response = await baseLink.post("contracts/", payload, config)
    return response.data
}

export async function editInternshipContract(payload, config) {
    const response = await baseLink.put(`contracts/${payload.id}/`, payload, config)
    return response.data
}

export async function getProcessedApplications(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/applications/`, config)
    return response.data
}

export async function getProfessions(config) {
    const response = await baseLink.get("professions/", config)
    return response.data
}

export async function getOrganizationProfiles(config) {
    const response = await baseLink.get("organization_profile/", config)
    return response.data
}

export async function editOrganizationProfile(payload, config) {
    const response = await baseLink.put(`organization_profile/${payload.id}/`, payload, config)
    return response.data
}

export async function getOrganizationProfile(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/profile/`, config)
    return response.data
}
