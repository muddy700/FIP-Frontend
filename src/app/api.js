import baseLink from './base'
import  axios from 'axios'

// User APIs
export async function createUser(payload) {
    const response = await baseLink.post("register/", payload )
    return response.data
}

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

export async function getUserProfileByUserId(userId, config) {
    const response = await baseLink.get(`filter/user/${userId}/profile/`, config)
    return response.data
}

export async function editUserProfile(profileId, payload, config) {
    const response = await baseLink.put(`users_profiles/${profileId}/`, payload, config)
    return response.data
}

export async function createUserProfile(payload, config) {
    const response = await baseLink.post('users_profiles/', payload, config)
    return response.data
}

export async function logoutUser(config) {
    const response = await baseLink.post("logoutall/", config)
    return response
}

// Posts APIs
export async function getSingleInternshipPost(postId, config) {
    const response = await baseLink.get(`internship_posts/${postId}/`, config)
    return response.data
}

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

export async function fetchAllProjects(config) {
    const response = await baseLink.get('projects_members/', config)
    return response.data
}

export async function fetchAllRatings(config) {
    const response = await baseLink.get('alumni_ratings', config)
    return response.data
}

export async function fetchAllAlumniSkills(config) {
    const response = await baseLink.get('alumni_professions/', config)
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

export async function PullProjectsWithoutMembers(config) {
    const response = await baseLink.get('projects/', config)
    return response.data
}

export async function recommendProject(projectId, payload, config) {
    const response = await baseLink.put(`projects/${projectId}/`, payload, config)
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

export async function fetchAllAnnouncements(config) {
    const response = await baseLink.get('announcements/', config)
    return response.data
}

export async function AddAnnouncement(payload, config) {
    const response = await baseLink.post('announcements/', payload, config)
    return response.data
}

export async function DeleteSingleAnnouncement(itemId, config) {
    const response = await baseLink.delete(`announcements/${itemId}/`, config)
    return response.data
}

export async function getAlumniProfile(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/profile`, config)
    return response.data
}

export async function getStaffProfile(staffId, config) {
    const response = await baseLink.get(`filter/staff/${staffId}/profile`, config)
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

export async function getAllAlumni(config) {
    const response = await baseLink.get('alumni_profiles/', config)
    return response.data
}

export async function getInterviewQuestions(professionId, config) {
    const response = await baseLink.get(`filter/profession/${professionId}/questions/`, config)
    return response.data
}

export async function fetchPublishedAlumni(config) {
    const response = await baseLink.get('filter/published_alumni/', config)
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

export async function getOrganizationFieldPosts(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/field_posts/`, config)
    return response.data
}

export async function getFieldPostProfessions(config) {
    const response = await baseLink.get('field_post_professions/', config)
    return response.data
}

export async function getFieldPostPrograms(config) {
    const response = await baseLink.get('field_post_programs/', config)
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

export async function getPrograms(config) {
    const response = await baseLink.get("programs/", config)
    return response.data
}

export async function createOrganizationProfile(payload, config) {
    const response = await baseLink.post("organization_profile/", payload, config)
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

export async function addJobInvitation(payload, config) {
    const response = await baseLink.post("job_invitations/", payload, config)
    return response.data
}

export async function editJobInvitation(payload, config) {
    const response = await baseLink.put(`job_invitations/${payload.id}/`, payload, config)
    return response.data
}

export async function fetchOrganizationInvitations(organizationId, config) {
    const response = await baseLink.get(`filter/organization/${organizationId}/invitations/`, config)
    return response.data
}

export async function fetchAlumniInvitations(alumniId, config) {
    const response = await baseLink.get(`filter/alumni/${alumniId}/invitations/`, config)
    return response.data
}

export async function getAllFieldPosts(config) {
    const response = await baseLink.get("field_posts/", config)
    return response.data
}

export async function pushFieldPost(payload, config) {
    const response = await baseLink.post("field_posts/", payload, config)
    return response.data
}

export async function deleteFieldPost(postId, config) {
    const response = await baseLink.delete(`field_posts/${postId}/`, config)
    return response.data
}

export async function editFieldPost(payload, config) {
    const response = await baseLink.put(`field_posts/${payload.id}/`, payload, config)
    return response.data
}

export async function SendFieldPostProgram(payload, config) {
    const response = await baseLink.post("field_post_programs/", payload, config)
    return response.data
}

export async function SendFieldPostProfession(payload, config) {
    const response = await baseLink.post("field_post_professions/", payload, config)
    return response.data
}

export async function getStudentProfileInfo(studentId, config) {
    const response = await baseLink.get(`filter/student/${studentId}/profile_info/`, config)
    return response.data
}

export async function editStudentProfileInfo(payload, config) {
    const response = await baseLink.put(`students_profiles/${payload.id}/`, payload, config)
    return response.data
}

export async function sendFieldReport(profileId, payload, config) {
    const response = await baseLink.put(`students_profiles/${profileId}/`, payload, config)
    return response.data
}

export async function SendFieldApplication(payload, config) {
    const response = await baseLink.post("field_applications/", payload, config)
    return response.data
}

export async function editFieldApplication(payload, config) {
    const response = await baseLink.put(`field_applications/${payload.id}/`, payload, config)
    return response.data
}

export async function deleteFieldApplication(applicationId, config) {
    const response = await baseLink.delete(`field_applications/${applicationId}/`, config)
    return response.data
}

export async function getFieldApplicationsByStudentId(studentId, config) {
    const response = await baseLink.get(`filter/student/${studentId}/field_applications/`, config)
    return response.data
}

export async function getFieldApplicationsByPostId(postId, config) {
    const response = await baseLink.get(`filter/field_post/${postId}/applications/`, config)
    return response.data
}

export async function getAllReportedStudents(config) {
    const response = await baseLink.get(`filter/reported_students/`, config)
    return response.data
}

export async function getAllReportedStudentsProfiles(config) {
    const response = await baseLink.get(`filter/reported_students_profiles/`, config)
    return response.data
}

export async function getProgramsByDepartmentId(departmentId, config) {
    const response = await baseLink.get(`filter/department/${departmentId}/programs/`, config)
    return response.data
}

export async function getUsersProfilesByDesignationId(designationId, config) {
    const response = await baseLink.get(`filter/designation/${designationId}/users_profiles/`, config)
    return response.data
}

export async function getStudentsByAcademicSupervisor(supervisorId, config) {
    const response = await baseLink.get(`filter/academic_supervisor/${supervisorId}/students/`, config)
    return response.data
}

export async function getAllStudents(config) {
    const response = await baseLink.get('students_profiles/', config)
    return response.data
}

export async function addQuestion(payload, config) {
    const response = await baseLink.post('questions/', payload, config)
    return response.data
}

export async function editMultipleStudentsProfiles(payloads, config){
    const requests = payloads.map((item) => baseLink.put(`students_profiles/${item.id}/`, item, config))
    const  responseArray = await axios.all([...requests])
    return responseArray
}

export async function addMultipleChoices(payloads, config){
    const requests = payloads.map((item) => baseLink.post('multiplechoices/', item, config))
    const  responseArray = await axios.all([...requests])
    return responseArray
}

export async function getAllRoles(config) {
    const response = await baseLink.get('designations/', config)
    return response.data
}

export async function getAllStaffsProfiles(config) {
    const response = await baseLink.get('staffs_profiles/', config)
    return response.data
}

export async function createNotification(payload, config) {
    const response = await baseLink.post('notifications/', payload, config)
    return response.data
}

export async function getAllNotifications(config) {
    const response = await baseLink.get('notifications/', config)
    return response.data
}

export async function deleteNotification(itemId, config) {
    const response = await baseLink.delete(`notifications/${itemId}/`, config)
    return response.data
}

export async function getAllNotificationsViews(config) {
    const response = await baseLink.get('notifications_views/', config)
    return response.data
}

export async function createNotificationView(payload, config) {
    const response = await baseLink.post('notifications_views/', payload,  config)
    return response.data
}