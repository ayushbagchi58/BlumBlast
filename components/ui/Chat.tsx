"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import Button from "./Button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "lead";
  timestamp: Date;
}

interface ChatProps {
  leadId: string;
  leadName: string;
  onSendMessage?: (message: string) => void;
}

export function Chat({ leadId, leadName, onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`blum-blast-chat-${leadId}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, [leadId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Save to localStorage
    localStorage.setItem(`blum-blast-chat-${leadId}`, JSON.stringify(updatedMessages));

    // Update last activity time for the lead
    const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
    if (importedLeadsData) {
      const leads = JSON.parse(importedLeadsData);
      const updatedLeads = leads.map((l: any) => {
        if (l.id === leadId) {
          return { ...l, lastActivityAt: new Date().toISOString() };
        }
        return l;
      });
      localStorage.setItem("blum-blast-imported-leads", JSON.stringify(updatedLeads));
    }

    // Call callback
    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 rounded-t-lg">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
          {leadName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{leadName}</h3>
          <p className="text-xs text-gray-500">
            {messages.length > 0 ? `${messages.length} messages` : "Start a conversation"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-3">
              <Send className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">No messages yet</p>
            <p className="text-xs text-gray-500 mt-1">Start chatting with {leadName}</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
                    message.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    leadName.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
