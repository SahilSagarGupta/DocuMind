// This shows a single message, either from the user or from the assistant

function MessageBubble({ role, text, sourcePages, sourceSnippets, onSelectSnippet }) {
    const isUser = role === "user"

    // This runs when the user clicks a citation chip like "p.2"
    function handleCitationClick(pageNumber) {
        if (!sourceSnippets) {
            return
        }

        // Find the snippet that matches this page number
        const matchingSnippet = sourceSnippets.find(function (snippet) {
            return snippet.page_number === pageNumber
        })

        if (matchingSnippet) {
            onSelectSnippet(matchingSnippet)
        }
    }

    return (
        <div className={"flex mb-3 " + (isUser ? "justify-end" : "justify-start")}>
            <div
                className={
                    "max-w-[75%] px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap " +
                    (isUser
                        ? "bg-ink text-paper rounded-2xl rounded-br-sm"
                        : "bg-white border border-fog text-ink rounded-2xl rounded-bl-sm")
                }
            >
                {text}

                {sourcePages && sourcePages.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                        {sourcePages.map(function (page, index) {
                            return (
                                <span
                                    key={index}
                                    onClick={function () { handleCitationClick(page) }}
                                    className="font-mono text-xs bg-highlight/20 text-ink px-2 py-1 rounded cursor-pointer hover:bg-highlight/40"
                                >
                                    p.{page}
                                </span>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBubble