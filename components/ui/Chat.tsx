"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  Share2,
  Phone,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Button from "./Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageSender = "user" | "lead";

/** Channel the message came from (stored alongside each message) */
type MessageChannel =
  | "email"
  | "sms"
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "whatsapp"
  | "webchat"
  | "agent"; // outbound agent reply

interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  /** Which channel this message arrived on (populated for lead messages) */
  channel?: MessageChannel | string;
  timestamp: Date | string; // allow both Date and ISO string from localStorage
}

interface ChatProps {
  leadId: string;
  leadName: string;
  /** Source channel of the lead — used to label the first inbound message */
  leadSource?: string;
  /**
   * The lead's original captured message.
   * If no chat history exists yet (e.g. mock/imported leads), this is used to
   * auto-seed the first inbound bubble so the conversation always starts with
   * what the lead said — exactly like HubSpot / Salesforce.
   */
  initialMessage?: string;
  /** Timestamp of the original message (lead.createdAt) */
  initialMessageTimestamp?: Date | string;
  /** Lead status (optional) for badge display */
  leadStatus?: string;
  /** Lead's last activity timestamp for online/offline status */
  lastActivityAt?: Date | string;
  onSendMessage?: (message: string) => void;
}

// ─── Channel helpers ──────────────────────────────────────────────────────────

/** Returns a small icon for the channel */
function ChannelIcon({ channel, className = "h-3 w-3" }: { channel?: string; className?: string }) {
  switch (channel) {
    case "email":
      return <Mail className={className} />;
    case "sms":
      return <MessageSquare className={className} />;
    case "whatsapp":
      return <Phone className={className} />;
    case "facebook":
    case "instagram":
    case "twitter":
    case "linkedin":
      return <Share2 className={className} />;
    case "webchat":
      return <Globe className={className} />;
    default:
      return <Mail className={className} />;
  }
}

/** Human-readable channel label */
function channelLabel(channel?: string): string {
  const labels: Record<string, string> = {
    email: "Email",
    sms: "SMS",
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    webchat: "Web Chat",
    agent: "Agent",
  };
  return channel ? (labels[channel] ?? channel) : "Inbound";
}

/** Background colour for the channel pill on inbound messages */
function channelPillClass(channel?: string): string {
  switch (channel) {
    case "email":
      return "bg-blue-100 text-blue-700";
    case "sms":
      return "bg-green-100 text-green-700";
    case "whatsapp":
      return "bg-emerald-100 text-emerald-700";
    case "facebook":
      return "bg-indigo-100 text-indigo-700";
    case "instagram":
      return "bg-pink-100 text-pink-700";
    case "twitter":
      return "bg-sky-100 text-sky-700";
    case "linkedin":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Chat({ 
  leadId, 
  leadName, 
  leadSource, 
  initialMessage, 
  initialMessageTimestamp, 
  leadStatus,
  lastActivityAt,
  onSendMessage 
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate if lead is online (active within last 5 minutes)
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const isOnline = lastActivityAt 
    ? (currentTime - new Date(lastActivityAt).getTime()) < 5 * 60 * 1000
    : false;

  // Format last seen time
  const formatLastSeen = (timestamp?: Date | string): string => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const diff = currentTime - date.getTime();
    
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Load messages from localStorage on mount.
  // If no history exists yet but an initialMessage is provided (e.g. mock leads
  // or leads imported before the chat-seeding fix), auto-seed the first inbound
  // bubble so the Chat tab always starts with what the lead said.
  useEffect(() => {
    const savedMessages = localStorage.getItem(`blum-blast-chat-${leadId}`);
    if (savedMessages) {
      try {
        const parsed: Message[] = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch {
        setMessages([]);
      }
    } else if (initialMessage?.trim()) {
      // No chat history — seed from the captured message
      const seeded: Message[] = [
        {
          id: `msg-seed-${leadId}`,
          text: initialMessage.trim(),
          sender: "lead",
          channel: (leadSource as MessageChannel) ?? undefined,
          timestamp: initialMessageTimestamp
            ? new Date(initialMessageTimestamp as string).toISOString()
            : new Date().toISOString(),
        },
      ];
      setMessages(seeded);
      // Persist so it only seeds once
      localStorage.setItem(`blum-blast-chat-${leadId}`, JSON.stringify(seeded));
    }
  }, [leadId, initialMessage, initialMessageTimestamp, leadSource]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      sender: "user",
      channel: "agent",
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Persist to localStorage
    localStorage.setItem(`blum-blast-chat-${leadId}`, JSON.stringify(updatedMessages));

    // Update last activity time for the lead
    const importedLeadsData = localStorage.getItem("blum-blast-imported-leads");
    if (importedLeadsData) {
      try {
        const leads = JSON.parse(importedLeadsData);
        const updatedLeads = leads.map((l: { id: string }) =>
          l.id === leadId ? { ...l, lastActivityAt: new Date().toISOString() } : l
        );
        localStorage.setItem("blum-blast-imported-leads", JSON.stringify(updatedLeads));
      } catch {
        // ignore parse errors
      }
    }

    if (onSendMessage) {
      onSendMessage(newMessage.trim());
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /** Formats a timestamp (Date or ISO string) to HH:MM */
  const formatTime = (ts: Date | string): string => {
    const d = ts instanceof Date ? ts : new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /** Formats a timestamp to a short date when messages span multiple days */
  const formatDate = (ts: Date | string): string => {
    const d = ts instanceof Date ? ts : new Date(ts);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const inboundCount = messages.filter((m) => m.sender === "lead").length;
  const outboundCount = messages.filter((m) => m.sender === "user").length;

  return (
    <div className="flex flex-col h-[540px] bg-white rounded-lg border border-gray-200">

      {/* ── Chat Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 rounded-t-lg">
        <div className="flex items-center gap-3">
          {/* Lead avatar with online indicator */}
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold flex-shrink-0">
              {leadName.charAt(0).toUpperCase()}
            </div>
            {/* Online/Offline indicator */}
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{leadName}</h3>
              {/* Status badge */}
              {leadStatus && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  leadStatus === 'new' ? 'bg-blue-100 text-blue-700' :
                  leadStatus === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                  leadStatus === 'qualified' ? 'bg-green-100 text-green-700' :
                  leadStatus === 'unqualified' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {leadStatus}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {/* Online status or last seen */}
              {isOnline ? (
                <span className="text-green-600 font-medium">● Online</span>
              ) : (
                <span>Last seen {formatLastSeen(lastActivityAt)}</span>
              )}
              
              {/* Source channel pill */}
              {leadSource && (
                <>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${channelPillClass(leadSource)}`}>
                    <ChannelIcon channel={leadSource} className="h-3 w-3" />
                    {channelLabel(leadSource)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message count summary */}
        {messages.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="h-3 w-3 text-blue-500" />
              {inboundCount} inbound
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              {outboundCount} sent
            </span>
          </div>
        )}
      </div>

      {/* ── Messages Area ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-3">
              <Send className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">No messages yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Capture an inquiry to see the lead&apos;s original message here,
              <br />or send a reply below.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isLead = message.sender === "lead";
              const isUser = message.sender === "user";

              // Show a date divider when the day changes between messages
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const prevDate = prevMessage ? formatDate(prevMessage.timestamp) : null;
              const thisDate = formatDate(message.timestamp);
              const showDateDivider = prevDate !== thisDate;

              return (
                <div key={message.id}>
                  {/* Date divider */}
                  {showDateDivider && (
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 px-2 whitespace-nowrap">{thisDate}</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}

                  <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>

                    {/* ── Avatar ─────────────────────────────────────────── */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 text-white text-xs font-semibold ${
                        isUser ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-4 w-4" />
                      ) : (
                        leadName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* ── Bubble + metadata ──────────────────────────────── */}
                    <div
                      className={`flex flex-col max-w-[72%] ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Sender label row */}
                      <div
                        className={`flex items-center gap-1.5 mb-1 ${
                          isUser ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-600">
                          {isUser ? "You" : leadName.split(" ")[0]}
                        </span>

                        {/* Channel pill — shown on inbound lead messages */}
                        {isLead && message.channel && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${channelPillClass(message.channel)}`}
                          >
                            <ChannelIcon channel={message.channel} className="h-2.5 w-2.5" />
                            {channelLabel(message.channel)}
                          </span>
                        )}

                        {/* Inbound indicator badge on the very first lead message */}
                        {isLead && index === 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-1.5 py-0.5 text-xs font-medium">
                            <ArrowDownLeft className="h-2.5 w-2.5" />
                            Original Inquiry
                          </span>
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isUser
                            ? "bg-green-600 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-900 border border-gray-200 rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.text}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Reply legend ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-2 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
          Lead inbound
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" />
          Your reply
        </span>
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Reply to ${leadName.split(" ")[0]}…`}
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
        <p className="text-xs text-gray-400 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
