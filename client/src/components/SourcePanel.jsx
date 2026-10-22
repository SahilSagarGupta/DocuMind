// This shows which pages were cited, and the actual highlighted source text when clicked

function SourcePanel({ activeSourcePages, activeSnippet, width }) {
    return (
            <div style={{ width: width }} className="bg-white h-screen p-4 overflow-y-auto flex-shrink-0">
            <div className="text-xs text-slate uppercase tracking-wide mb-2">
                Source
            </div>

            {!activeSnippet && (!activeSourcePages || activeSourcePages.length === 0) && (
                <div className="text-sm text-slate">
                    No citation selected yet
                </div>
            )}

            {!activeSnippet && activeSourcePages && activeSourcePages.length > 0 && (
                <div className="text-sm text-slate">
                    Click a citation tag on an answer to see the exact source text here.
                </div>
            )}

            {activeSnippet && (
                <div>
                    <div className="font-mono text-xs bg-highlight/20 inline-block px-2 py-1 rounded mb-3">
                        Page {activeSnippet.page_number}
                    </div>
                    <div className="text-sm text-ink leading-relaxed bg-highlight/10 p-3 rounded-lg border-l-4 border-highlight">
                        {activeSnippet.text}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SourcePanel