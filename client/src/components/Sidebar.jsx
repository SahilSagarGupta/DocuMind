// This shows the chat list (rename/delete/pin), the documents of the current chat,
// the upload button, and logout

import { useRef, useState, useEffect } from "react"
import {
    uploadFile,
    getSessions,
    getSessionDocuments,
    renameSession,
    deleteSession,
    togglePinSession
} from "../api"

function Sidebar({ onLogout, onSelectSession, refreshTrigger, width, currentSessionId, onCurrentSessionDeleted, onUploaded }) {
    const fileInputRef = useRef(null)
    const [uploadStatus, setUploadStatus] = useState("")
    const [sessions, setSessions] = useState([])
    const [sessionDocuments, setSessionDocuments] = useState([])

    const [editingSessionId, setEditingSessionId] = useState(null)
    const [editingTitle, setEditingTitle] = useState("")

    // Load the chat list when the sidebar opens and whenever refreshTrigger changes
    useEffect(function () {
        loadSessions()
    }, [refreshTrigger])

    // Load the documents of the current chat when the chat changes
    useEffect(function () {
        loadSessionDocuments()
    }, [currentSessionId, refreshTrigger])

    // While any document is still "processing", check again every 2 seconds
    useEffect(function () {
        const stillProcessing = sessionDocuments.some(function (doc) {
            return doc.status === "processing"
        })

        if (!stillProcessing) {
            return
        }

        const timer = setTimeout(loadSessionDocuments, 2000)

        return function () {
            clearTimeout(timer)
        }
    }, [sessionDocuments, currentSessionId])

    async function loadSessions() {
        try {
            const result = await getSessions()
            setSessions(result)
        } catch (error) {
            console.log("Could not load sessions:", error.message)
        }
    }

    async function loadSessionDocuments() {
        // A brand new chat has no documents yet
        if (!currentSessionId) {
            setSessionDocuments([])
            return
        }

        try {
            const result = await getSessionDocuments(currentSessionId)
            setSessionDocuments(result)
        } catch (error) {
            console.log("Could not load documents:", error.message)
        }
    }

    function getStatusText(status) {
        if (status === "indexed") {
            return "Ready"
        }
        if (status === "failed") {
            return "Failed"
        }
        return "Processing..."
    }

    function handleUploadClick() {
        fileInputRef.current.click()
    }

    async function handleFileSelected(event) {
        const selectedFile = event.target.files[0]

        if (!selectedFile) {
            return
        }

        setUploadStatus("Uploading " + selectedFile.name + "...")

        try {
            // The document goes into the current chat (or a new chat if none is open)
            const result = await uploadFile(selectedFile, currentSessionId)
            setUploadStatus("")
            onUploaded(result.sessionId)
        } catch (error) {
            setUploadStatus("Upload failed. Please try again.")
        }

        event.target.value = ""
    }

    function startRenaming(session, event) {
        event.stopPropagation()
        setEditingSessionId(session._id)
        setEditingTitle(session.title)
    }

    async function confirmRename(sessionId) {
        if (editingTitle.trim() === "") {
            setEditingSessionId(null)
            return
        }

        try {
            await renameSession(sessionId, editingTitle.trim())
            await loadSessions()
        } catch (error) {
            console.log("Rename failed:", error.message)
        }

        setEditingSessionId(null)
    }

    function handleRenameKeyDown(event, sessionId) {
        if (event.key === "Enter") {
            confirmRename(sessionId)
        }
        if (event.key === "Escape") {
            setEditingSessionId(null)
        }
    }

    async function handleDelete(session, event) {
        event.stopPropagation()

        const confirmed = window.confirm("Delete \"" + session.title + "\" and its documents? This cannot be undone.")
        if (!confirmed) {
            return
        }

        try {
            await deleteSession(session._id)
            await loadSessions()

            if (session._id === currentSessionId) {
                onCurrentSessionDeleted()
            }
        } catch (error) {
            console.log("Delete failed:", error.message)
        }
    }

    async function handlePinToggle(session, event) {
        event.stopPropagation()

        try {
            await togglePinSession(session._id)
            await loadSessions()
        } catch (error) {
            console.log("Pin update failed:", error.message)
        }
    }

    return (
        <div style={{ width: width }} className="bg-white h-screen flex flex-col p-4 flex-shrink-0">
            <h1 className="font-display font-semibold text-lg text-ink mb-6">
                DocuMind
            </h1>

            <button
                onClick={function () { onSelectSession(null) }}
                className="bg-ink text-paper text-sm rounded-lg py-2 mb-3 cursor-pointer hover:opacity-90"
            >
                + New chat
            </button>

            <button
                onClick={handleUploadClick}
                className="border border-fog text-ink text-sm rounded-lg py-2 mb-2 cursor-pointer hover:bg-paper"
            >
                Upload document
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                accept=".pdf,.docx,.txt"
                className="hidden"
            />

            {uploadStatus && (
                <p className="text-xs text-slate mb-2">{uploadStatus}</p>
            )}

            <div className="mb-4">
                <div className="text-xs text-slate uppercase tracking-wide mb-1">
                    Documents in this chat
                </div>

                {sessionDocuments.length === 0 && (
                    <p className="text-xs text-slate">
                        None yet. Upload a document to ask questions about it.
                    </p>
                )}

                {sessionDocuments.map(function (doc) {
                    return (
                        <div key={doc._id} className="text-xs text-ink flex justify-between gap-2 py-0.5">
                            <span className="truncate">{doc.fileName}</span>
                            <span className="text-slate flex-shrink-0">{getStatusText(doc.status)}</span>
                        </div>
                    )
                })}
            </div>

            <div className="text-xs text-slate uppercase tracking-wide mb-2">
                Recent chats
            </div>

            <div className="flex-1 overflow-y-auto">
                {sessions.length === 0 && (
                    <div className="text-sm text-slate">No chats yet</div>
                )}

                {sessions.map(function (session) {
                    const isEditing = editingSessionId === session._id

                    return (
                        <div
                            key={session._id}
                            onClick={function () { if (!isEditing) onSelectSession(session._id) }}
                            className={
                                "group flex items-center justify-between py-2 px-2 rounded cursor-pointer hover:bg-paper " +
                                (session._id === currentSessionId ? "bg-paper" : "")
                            }
                        >
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={function (event) { setEditingTitle(event.target.value) }}
                                    onKeyDown={function (event) { handleRenameKeyDown(event, session._id) }}
                                    onBlur={function () { confirmRename(session._id) }}
                                    autoFocus
                                    className="text-sm border border-ink rounded px-1 py-0.5 flex-1 min-w-0 outline-none"
                                />
                            ) : (
                                <span className="text-sm text-ink truncate flex-1 min-w-0">
                                    {session.pinned && <span className="mr-1">📌</span>}
                                    {session.title}
                                </span>
                            )}

                            {!isEditing && (
                                <div className="hidden group-hover:flex items-center gap-1 ml-1 flex-shrink-0">
                                    <span
                                        onClick={function (event) { handlePinToggle(session, event) }}
                                        className="cursor-pointer text-xs px-1"
                                        title={session.pinned ? "Unpin" : "Pin"}
                                    >
                                        📌
                                    </span>
                                    <span
                                        onClick={function (event) { startRenaming(session, event) }}
                                        className="cursor-pointer text-xs px-1"
                                        title="Rename"
                                    >
                                        ✏️
                                    </span>
                                    <span
                                        onClick={function (event) { handleDelete(session, event) }}
                                        className="cursor-pointer text-xs px-1"
                                        title="Delete"
                                    >
                                        🗑️
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <button
                onClick={onLogout}
                className="text-sm text-slate border-t border-fog pt-4 cursor-pointer hover:text-ink"
            >
                Log out
            </button>
        </div>
    )
}

export default Sidebar