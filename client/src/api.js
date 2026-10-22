// This file handles all communication with our Node backend

const API_BASE_URL = "http://localhost:5000"

// This function sends a question to the backend and returns the answer
async function askQuestion(question, sessionId) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            question: question,
            sessionId: sessionId
        })
    })

    if (!response.ok) {
        throw new Error("Something went wrong while getting the answer.")
    }

    const data = await response.json()
    return data
}

// This function uploads a file into a chat. If sessionId is empty, a new chat is created.
async function uploadFile(file, sessionId) {
    const token = localStorage.getItem("documind_token")

    const formData = new FormData()

    if (sessionId) {
        formData.append("sessionId", sessionId)
    }
    formData.append("file", file)

    const response = await fetch(API_BASE_URL + "/api/documents", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })

    if (!response.ok) {
        throw new Error("Something went wrong while uploading the file.")
    }

    const data = await response.json()
    return data
}

// This function fetches the documents that belong to one chat
async function getSessionDocuments(sessionId) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/documents?sessionId=" + sessionId, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!response.ok) {
        throw new Error("Could not load documents.")
    }

    const data = await response.json()
    return data.documents
}

// This function logs a user in and returns the token + user info
async function loginUser(email, password) {
    const response = await fetch(API_BASE_URL + "/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Login failed.")
    }

    return data
}

// This function registers a new user
async function registerUser(name, email, password) {
    const response = await fetch(API_BASE_URL + "/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name, email: email, password: password })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Registration failed.")
    }

    return data
}

// This function renames a chat session
async function renameSession(sessionId, newTitle) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/sessions/" + sessionId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title: newTitle })
    })

    if (!response.ok) {
        throw new Error("Could not rename this chat.")
    }

    const data = await response.json()
    return data
}

// This function deletes a chat session
async function deleteSession(sessionId) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/sessions/" + sessionId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!response.ok) {
        throw new Error("Could not delete this chat.")
    }

    const data = await response.json()
    return data
}

// This function toggles whether a chat session is pinned
async function togglePinSession(sessionId) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/sessions/" + sessionId + "/pin", {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!response.ok) {
        throw new Error("Could not update the pin.")
    }

    const data = await response.json()
    return data
}

// This function fetches all of the user's past chat sessions
async function getSessions() {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/sessions", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!response.ok) {
        throw new Error("Could not load chat history.")
    }

    const data = await response.json()
    return data.sessions
}

// This function fetches all messages for one specific session
async function getSessionMessages(sessionId) {
    const token = localStorage.getItem("documind_token")

    const response = await fetch(API_BASE_URL + "/api/chat/sessions/" + sessionId + "/messages", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    if (!response.ok) {
        throw new Error("Could not load this conversation.")
    }

    const data = await response.json()
    return data.messages
}

export { askQuestion, uploadFile, loginUser, registerUser, getSessions, getSessionMessages, getSessionDocuments,renameSession, deleteSession, togglePinSession }