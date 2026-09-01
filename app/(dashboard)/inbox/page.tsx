"use client";

import { useState, useMemo } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { 
  mockConversations, 
  getMessagesByConversationId,
  getTotalUnreadCount,
  getConversationsNeedingReply 
} from "@/lib/mockConversations";
import type { Conversation, ConversationFilter } from "@/lib/types";
import {
  Inbox as InboxIcon,
  Send,
  Search,
  Mail,
  MessageSquare,
  MessagesSquare,
  Phone,
  MessageCircle,
  Share2,
  Globe,
  CheckCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getChannelIcon(channel: string) {
  switch (channel) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "facebook":
      return <MessagesSquare className="h-4 w-4" />;
    case "instagram":
      return <Share2 className="h-4 w-4" />;
    case "whatsapp":
      return <Phone className="h-4 w-4" />;
    case "webchat":
      return <Globe className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
}

function getChannelColor(channel: string) {
  switch (channel) {
    case "email":
      return "text-blue-600 bg-blue-100";
    case "sms":
      return "text-green-600 bg-green-100";
    case "facebook":
      return "text-indigo-600 bg-indigo-100";
    case "instagram":
      return "text-pink-600 bg-pink-100";
    case "whatsapp":
      return "text-emerald-600 bg-emerald-100";
    case "webchat":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const [filter, setFilter] = useState<ConversationFilter>({
    status: "all",
    channel: "all",
    unreadOnly: false,
    needsReply: false,
  });

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    let results = [...mockConversations];

    // Status filter
    if (filter.status && filter.status !== "all") {
      results = results.filter((conv) => conv.status === filter.status);
    }

    // Channel filter
    if (filter.channel && filter.channel !== "all") {
      results = results.filter((conv) => conv.channel === filter.channel);
    }

    // Unread only filter
    if (filter.unreadOnly) {
      results = results.filter((conv) => conv.unreadCount > 0);
    }

    // Needs reply filter
    if (filter.needsReply) {
      const needsReply = getConversationsNeedingReply();
      results = results.filter((conv) => needsReply.some((nr) => nr.id === conv.id));
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (conv) =>
          conv.leadName.toLowerCase().includes(query) ||
          conv.leadEmail.toLowerCase().includes(query) ||
          conv.lastMessagePreview.toLowerCase().includes(query)
      );
    }

    // Sort by last message time (most recent first)
    results.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    return results;
  }, [mockConversations, filter, searchQuery]);

  // Get messages for selected conversation
  const selectedMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return getMessagesByConversationId(selectedConversation.id);
  }, [selectedConversation]);

  const totalUnread = getTotalUnreadCount();
  const needsReplyCount = getConversationsNeedingReply().length;

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    // In production, this would call an API
    console.log("Sending reply:", replyText, "to", selectedConversation.leadName);
    setReplyText("");
    
    // Show success message
    alert(`Reply sent to ${selectedConversation.leadName}!`);
  };

  const handleViewInLeadDetail = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <InboxIcon className="h-8 w-8 text-blue-600" />
            Inbox
            {totalUnread > 0 && (
              <Badge variant="error" className="text-sm">
                {totalUnread} unread
              </Badge>
            )}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            {filteredConversations.length} conversations
            {needsReplyCount > 0 && ` • ${needsReplyCount} need reply`}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              leftIcon={<Search className="h-4 w-4" />}
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter.status === "open" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, status: filter.status === "open" ? "all" : "open" })}
            >
              Open
            </Button>
            <Button
              variant={filter.unreadOnly ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, unreadOnly: !filter.unreadOnly })}
            >
              Unread ({totalUnread})
            </Button>
            <Button
              variant={filter.needsReply ? "primary" : "outline"}
              size="sm"
              leftIcon={<AlertCircle className="h-4 w-4" />}
              onClick={() => setFilter({ ...filter, needsReply: !filter.needsReply })}
            >
              Needs Reply ({needsReplyCount})
            </Button>

            {/* Channel Filter Dropdown */}
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter.channel || "all"}
              onChange={(e) => setFilter({ ...filter, channel: e.target.value as any })}
            >
              <option value="all">All Channels</option>
              <option value="email">📧 Email</option>
              <option value="sms">📱 SMS</option>
              <option value="facebook">💬 Facebook</option>
              <option value="instagram">📷 Instagram</option>
              <option value="whatsapp">💚 WhatsApp</option>
              <option value="webchat">🌐 Web Chat</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Content: Conversation List + Message View */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation List */}
        <Card className="lg:col-span-1 p-0 max-h-[calc(100vh-280px)] overflow-hidden">
          <div className="overflow-y-auto h-full">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <InboxIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                    } ${conversation.unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                          {conversation.leadName.charAt(0).toUpperCase()}
                        </div>
                        {/* Unread indicator */}
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-semibold text-gray-900 truncate ${conversation.unreadCount > 0 ? "font-bold" : ""}`}>
                            {conversation.leadName}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTimeAgo(conversation.lastMessageAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          {/* Channel Icon */}
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getChannelColor(conversation.channel)}`}>
                            {getChannelIcon(conversation.channel)}
                            {conversation.channel}
                          </span>

                          {/* Temperature Badge */}
                          {conversation.leadTemperature === "hot" && (
                            <Badge variant="error" className="text-xs">🔥 Hot</Badge>
                          )}
                        </div>

                        <p className={`text-sm text-gray-600 truncate ${conversation.unreadCount > 0 ? "font-medium" : ""}`}>
                          {conversation.lastMessagePreview}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2 p-0 flex flex-col max-h-[calc(100vh-280px)]">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Select a conversation</p>
                <p className="text-sm text-gray-600">Choose a conversation from the list to view messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Message Header */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                      {selectedConversation.leadName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.leadName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`flex items-center gap-1 ${getChannelColor(selectedConversation.channel)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {getChannelIcon(selectedConversation.channel)}
                          {selectedConversation.channel}
                        </span>
                        <span>•</span>
                        <span>{selectedConversation.leadEmail}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewInLeadDetail(selectedConversation.leadId)}
                  >
                    View Lead Profile →
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.sender === "agent" ? "order-2" : "order-1"}`}>
                      {/* Message Header */}
                      <div className={`flex items-center gap-2 mb-1 text-xs text-gray-600 ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
                        {message.sender === "lead" && (
                          <span className="font-medium">{selectedConversation.leadName}</span>
                        )}
                        {message.sender === "agent" && message.automationTriggered && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <Sparkles className="h-3 w-3" />
                            Automated
                          </span>
                        )}
                        <span>{formatTimeAgo(message.sentAt)}</span>
                        {message.readAt && message.sender === "agent" && (
                          <CheckCheck className="h-3 w-3 text-blue-600" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "agent"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        {message.subject && (
                          <p className="font-semibold mb-1">{message.subject}</p>
                        )}
                        <p className="text-sm whitespace-pre-line">{message.body}</p>
                      </div>

                      {/* AI Sentiment Badge */}
                      {message.sentiment && message.sender === "lead" && (
                        <div className="mt-1 flex justify-start">
                          <Badge
                            variant={
                              message.sentiment === "positive"
                                ? "success"
                                : message.sentiment === "negative"
                                ? "error"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {message.sentiment === "positive" && "😊 Positive"}
                            {message.sentiment === "neutral" && "😐 Neutral"}
                            {message.sentiment === "negative" && "😞 Negative"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedConversation.leadName}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    leftIcon={<Send className="h-4 w-4" />}
                    className="self-end"
                  >
                    Send
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
