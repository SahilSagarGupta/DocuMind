// This is the main chat area in the middle, showing messages and the input box

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { askQuestion } from "../api";

function ChatWindow({
  messages,
  setMessages,
  sessionId,
  setSessionId,
  setActiveSourcePages,
  onNewMessageSent,
  onSelectSnippet,
}) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (inputText.trim() === "") {
      return;
    }

    const questionText = inputText;

    // Add the user's message to the chat immediately
    const newUserMessage = { role: "user", text: questionText };
    setMessages([...messages, newUserMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Call the real backend
      const result = await askQuestion(questionText, sessionId);

      // Save the session id, so the next question continues this same conversation
      setSessionId(result.sessionId);

      // Add the assistant's real answer to the chat
      const newAssistantMessage = {
        role: "assistant",
        text: result.answer,
        sourcePages: result.sourcePages,
        sourceSnippets: result.sourceSnippets,
      };

      setMessages(function (previousMessages) {
        return [...previousMessages, newAssistantMessage];
      });

      // Update the source panel with this answer's citations
      setActiveSourcePages(result.sourcePages);
      // Tell the sidebar to refresh its session list, in case this was a new session
      onNewMessageSent();
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages(function (previousMessages) {
        return [...previousMessages, errorMessage];
      });
    }

    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen min-w-0">
      <div className="border-b border-fog px-6 py-4">
        <p className="text-sm text-slate">
          Ask a question about your uploaded documents
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate text-center mt-10">
            Ask your first question to get started
          </p>
        )}

        {messages.map(function (message, index) {
          return (
            <MessageBubble
              key={index}
              role={message.role}
              text={message.text}
              sourcePages={message.sourcePages}
              sourceSnippets={message.sourceSnippets}
              onSelectSnippet={onSelectSnippet}
            />
          );
        })}

        {isLoading && <p className="text-sm text-slate">Thinking...</p>}
      </div>

      <div className="border-t border-fog px-6 py-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={function (event) {
            setInputText(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className="flex-1 border border-fog rounded-lg px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
        <button
          onClick={handleSend}
          className="bg-ink text-paper text-sm rounded-lg px-5 py-3 cursor-pointer hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
