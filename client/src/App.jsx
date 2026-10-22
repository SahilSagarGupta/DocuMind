import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import SourcePanel from "./components/SourcePanel"
import LoginPage from "./components/LoginPage"
import { getSessionMessages } from "./api"
import Resizer from "./components/Resizer"

function App() {
    const [currentUser, setCurrentUser] = useState(function () {
        const savedToken = localStorage.getItem("documind_token")
        return savedToken ? { loggedIn: true } : null
    })

    const [messages, setMessages] = useState([])
    const [sessionId, setSessionId] = useState(null)
    const [activeSourcePages, setActiveSourcePages] = useState([])
    const [activeSnippet, setActiveSnippet] = useState(null)
    const [sidebarWidth, setSidebarWidth] = useState(224)
    const [sourceWidth, setSourceWidth] = useState(256)

    // This changes every time we want the sidebar to refresh its session list
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    function handleLoginSuccess(user) {
        setCurrentUser(user)
    }

    function handleLogout() {
        localStorage.removeItem("documind_token")
        setCurrentUser(null)
        setMessages([])
        setSessionId(null)
        setActiveSourcePages([])
    }

    // This runs after a document is uploaded. The document may have created a new chat.
    function handleUploaded(uploadedSessionId) {
        setSessionId(uploadedSessionId)
        setRefreshTrigger(refreshTrigger + 1)
    }

    // This runs when the user clicks a past session, or "+ New chat" (which passes null)
    async function handleSelectSession(selectedSessionId) {
        if (selectedSessionId === null) {
            // Starting a fresh, new conversation
            setSessionId(null)
            setMessages([])
            setActiveSourcePages([])
            setActiveSnippet(null)
            return
        }

        try {
            const oldMessages = await getSessionMessages(selectedSessionId)

            // Convert the backend's message format into what MessageBubble expects
            const formattedMessages = oldMessages.map(function (message) {
                return {
                    role: message.role,
                    text: message.content,
                    sourcePages: message.sourcePages,
                    sourceSnippets: message.sourceSnippets
                }
            })

            setSessionId(selectedSessionId)
            setMessages(formattedMessages)
            setActiveSourcePages([])
            setActiveSnippet(null)
        } catch (error) {
            console.log("Could not load session:", error.message)
        }
    }

        function handleSidebarResize(delta) {
        setSidebarWidth(function (previousWidth) {
            const newWidth = previousWidth + delta
            // Keep the sidebar between 180px and 400px, so it can't disappear or take over the screen
            if (newWidth < 180) return 180
            if (newWidth > 400) return 400
            return newWidth
        })
    }

    function handleSourceResize(delta) {
        setSourceWidth(function (previousWidth) {
            const newWidth = previousWidth + delta
            if (newWidth < 200) return 200
            if (newWidth > 500) return 500
            return newWidth
        })
    }

    if (!currentUser) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />
    }

        return (
        <div className="flex bg-paper">
            <Sidebar
                onLogout={handleLogout}
                onUploaded={handleUploaded}
                onSelectSession={handleSelectSession}
                refreshTrigger={refreshTrigger}
                width={sidebarWidth}
                currentSessionId={sessionId}
                onCurrentSessionDeleted={function () { handleSelectSession(null) }}
            />
            <Resizer onResize={handleSidebarResize} side="right" />
            <ChatWindow
                messages={messages}
                setMessages={setMessages}
                sessionId={sessionId}
                setSessionId={setSessionId}
                setActiveSourcePages={setActiveSourcePages}
                onNewMessageSent={function () { setRefreshTrigger(refreshTrigger + 1) }}
                onSelectSnippet={setActiveSnippet}
            />
            <Resizer onResize={handleSourceResize} side="left" />
            <SourcePanel activeSourcePages={activeSourcePages} activeSnippet={activeSnippet} width={sourceWidth} />
        </div>
    )

}

export default App