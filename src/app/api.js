import baseLink from './base'

// User APIs
export async function createUser(payload) {
    const response = await baseLink.post("register/", payload )
    return response.data
}

export async function authenticateUser(payload, config) {
    const response = await baseLink.post("login/", payload, config )
    return response.data
}

export async function getUserInfo(config) {
    const response = await baseLink.get("auth/user", config)
    return response.data
}

export async function logoutUser(config) {
    const response = await baseLink.post("logout/", config)
    return response
}

// Posts APIs
export async function fetchAllPosts(config) {
    const response = await baseLink.get("posts/")
    return response.data
}

export async function fetchUserPosts(config) {
    const response = await baseLink.get("user/posts/", config)
    return response.data
}

export async function createPost(payload, config) {
    const response = await baseLink.post("posts/", payload)
    return response.data
}

export async function updatePost(postId, payload, config) {
    const response = await baseLink.put(`posts/${postId}/`, payload)
    return response.data
}

export async function getSinglePost(postId, config) {
    const response = await baseLink.get(`posts/${postId}`)
    return response.data
}

export async function deleteSinglePost(id, config) {
    const response = await baseLink.delete(`posts/${id}/`)
    return response.data
}

// Notifications APIs
export async function fetchAllNotifications() {
    const response = await baseLink.get("notifications/")
    return response.data
}

export async function fetchUserNotifications(config) {
    const response = await baseLink.get("user/notifications/", config)
    return response.data
}

export async function deleteSingleNotification(id, config) {
    const response = await baseLink.delete(`notifications/${id}/`)
    return response.data
}

export async function createNotification(payload, config) {
    const response = await baseLink.post("notifications/", payload )
    return response.data
}

// For Post Votes
export async function fetchAllVotes() {
    const response = await baseLink.get("postVotes/")
    return response.data
}
// export async function editUser(id, payload) {
//     const response = await baseLink.put(`users/update/${id}`, payload)
//     return response
// }

// export async function deleteMultpleTodos(payloasds) {
//     const requests = payloasds.map((todo) => baseLink.delete(`todos/delete/${todo}`))
//     const responseArray = await axios.all([...requests])
//     return responseArray
// }
