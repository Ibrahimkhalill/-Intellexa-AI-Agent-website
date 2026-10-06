import { useState, useEffect, useCallback } from "react";
import { Mail, Search, LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../../components/axiosinstance";

// Gmail returns base64url-encoded UTF-8; atob alone garbles non-ASCII text
const decodeBase64Url = (data) => {
  const binary = atob(data.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
};

// Find the first part with this mime type, searching nested multiparts
// (emails with attachments wrap the text in multipart/mixed > multipart/alternative)
const findPart = (part, mimeType) => {
  if (!part) return null;
  if (part.mimeType === mimeType && part.body?.data) return part;
  for (const child of part.parts || []) {
    const found = findPart(child, mimeType);
    if (found) return found;
  }
  return null;
};

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const htmlToPlainText = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style, script, noscript").forEach((el) => el.remove());
  const text = doc.body.textContent || "";
  return text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "").trim();
};

const EmailAutomation = () => {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("gmail_access_token")
  );
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [bodyLoading, setBodyLoading] = useState(false);
  const [bodyError, setBodyError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [pageTokens, setPageTokens] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversation, setConversation] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const tags = ["Booking", "Finding", "Inquiries"];

  // Gmail access tokens expire after ~1 hour - ask the user to sync again
  const handleGmailAuthError = useCallback((err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("gmail_access_token");
      setAccessToken(null);
      setApiError("Your Gmail session expired. Please sync Gmail again.");
      return true;
    }
    return false;
  }, []);

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify",
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem("gmail_access_token", token);
      setApiError(null);
      setAccessToken(token); // the search effect below loads the inbox
    },
    onError: () => {
      setApiError("Google Login Failed");
    },
  });

  const fetchEmails = useCallback(async (token, pageToken = "", query = "") => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axios.get(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages",
        {
          params: { maxResults: 10, pageToken, q: query },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const messages = res.data.messages || [];
      setNextPageToken(res.data.nextPageToken || null);

      const detailedEmails = await Promise.all(
        messages.map(async (msg) => {
          const msgRes = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              params: { format: "metadata" },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const headers = msgRes.data.payload.headers || [];
          const subject =
            headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
          const from = headers.find((h) => h.name === "From")?.value || "";
          const snippet = msgRes.data.snippet || "";
          const date = headers.find((h) => h.name === "Date")?.value || "";
          const labels = msgRes.data.labelIds || [];

          return {
            id: msg.id,
            sender: from,
            subject,
            preview: snippet,
            time: date
              ? new Date(date).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown",
            isUnread: labels.includes("UNREAD"),
          };
        })
      );

      setEmails(detailedEmails);
      setSelectedEmail(detailedEmails.length > 0 ? detailedEmails[0].id : null);
    } catch (err) {
      console.error("Email fetch failed:", err.response?.data || err);
      if (!handleGmailAuthError(err)) {
        setApiError(
          err.response?.data?.error?.message || "Failed to fetch emails."
        );
      }
    }
    setLoading(false);
  }, [handleGmailAuthError]);

  const fetchEmailBody = async (emailId, token) => {
    setBodyLoading(true);
    setBodyError(null);
    setEmailBody("");
    try {
      const msgRes = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload = msgRes.data.payload;
      const htmlPart = findPart(payload, "text/html");
      const textPart = findPart(payload, "text/plain");

      let body = "";
      if (htmlPart) {
        body = decodeBase64Url(htmlPart.body.data);
      } else if (textPart) {
        // Keep line breaks of plain-text emails inside the iframe
        body = `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(
          decodeBase64Url(textPart.body.data)
        )}</pre>`;
      }
      setEmailBody(body);
    } catch (err) {
      console.error("Email body fetch failed:", err);
      if (!handleGmailAuthError(err)) {
        setBodyError(
          err.response?.data?.error?.message || "Failed to fetch email body."
        );
      }
    }
    setBodyLoading(false);
  };

  const sendToAI = async () => {
    if (!message.trim() || !selectedEmail || !accessToken || isTyping) return;
    setIsTyping(true);
    const emailId = selectedEmail;
    const userMessage = message.trim();
    const history = [
      ...(conversation[emailId] || []),
      { type: "user", message: userMessage, timestamp: new Date().toISOString() },
    ];

    setConversation((prev) => ({ ...prev, [emailId]: history }));
    setMessage("");
    setBodyError(null);

    try {
      // The backend calls the AI model with the email as context
      const res = await axiosInstance.post("api/chatbot/ai-chat/", {
        context: htmlToPlainText(emailBody),
        messages: history
          .filter((msg) => !msg.isError)
          .map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.message,
          })),
      });

      setConversation((prev) => ({
        ...prev,
        [emailId]: [
          ...(prev[emailId] || []),
          {
            type: "ai",
            message: res.data.reply,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } catch (err) {
      console.error("AI request failed:", err);
      setBodyError(err.response?.data?.error || "Failed to get AI response.");
    } finally {
      setIsTyping(false);
    }
  };

  // Load the inbox when the token is available and whenever the search changes
  useEffect(() => {
    if (!accessToken) return;
    const handler = setTimeout(() => {
      setPageTokens([""]);
      setNextPageToken(null);
      fetchEmails(accessToken, "", searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [accessToken, searchQuery, fetchEmails]);

  useEffect(() => {
    if (selectedEmail && accessToken) {
      fetchEmailBody(selectedEmail, accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail, accessToken]);

  function extractName(fullSender) {
    const match = fullSender.match(/^(.*?)\s*</);
    return match ? match[1] : fullSender;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F3] flex flex-col md:flex-row p-4 md:p-10 overflow-hidden">
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-3 rounded-2xl md:rounded-l-2xl md:h-[90vh] flex-shrink-0 flex flex-col">
        <div className="sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mail"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                Clear
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center mt-4 flex-1 text-gray-500">
            <p>Loading...</p>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center mt-4 flex-1 text-red-500">
            <Mail className="w-10 h-10 text-red-500 mb-4" />
            <p>{apiError}</p>
          </div>
        ) : !accessToken ? (
          <div className="flex flex-col items-center justify-center mt-4 flex-1">
            <Mail className="w-10 h-10 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-4">
              Please log in to view your Gmail inbox.
            </p>
            <button
              onClick={() => login()}
              className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
              <div className="flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Sync Gmail
              </div>
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto mt-4 flex-1">
              {emails.length > 0 ? (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-3 border-b mb-2 cursor-pointer hover:bg-gray-50 rounded-xl border-l-4 ${
                      selectedEmail === email.id
                        ? "border-blue-500 bg-blue-50"
                        : email.isUnread
                        ? "border-[#C4E8DA]"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      console.log("Selected email:", email.id);
                      setSelectedEmail(email.id);
                    }}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-left text-gray-900 truncate w-[50%]">
                        {extractName(email.sender)}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {email.time}
                      </span>
                    </div>
                    <div
                      className={`text-sm line-clamp-1 whitespace-pre-line mb-1 ${
                        email.isUnread
                          ? "font-medium text-gray-900"
                          : "text-gray-600"
                      }`}>
                      {email.subject}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1 whitespace-pre-line">
                      {email.preview}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center mt-4 flex-1 text-gray-500">
                  <Mail className="w-10 h-10 text-gray-500 mb-4" />
                  <p>No emails found.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => {
                  const lastPageToken = pageTokens[pageTokens.length - 2];
                  if (lastPageToken !== undefined) {
                    setPageTokens((prev) => prev.slice(0, -1));
                    fetchEmails(accessToken, lastPageToken, searchQuery);
                  }
                }}
                disabled={pageTokens.length <= 1}>
                Previous
              </button>
              <button
                className="px-4 py-1 bg-[#1B4635] text-white rounded hover:bg-green-800 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  if (nextPageToken) {
                    setPageTokens((prev) => [...prev, nextPageToken]);
                    fetchEmails(accessToken, nextPageToken, searchQuery);
                  }
                }}
                disabled={!nextPageToken}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex-1 flex flex-col mt-6 md:mt-0 md:ml-6 bg-white rounded-2xl overflow-hidden">
        {selectedEmail ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {emails.find((e) => e.id === selectedEmail)?.subject}
              </h3>
            </div>
            <div
              className="flex flex-col overflow-y-auto space-y-4 p-6 bg-gray-50"
              style={{ height: "600px" }}>
              <iframe
                srcDoc={bodyLoading ? "<p style=\"font-family:sans-serif;color:#6b7280\">Loading email...</p>" : emailBody}
                sandbox=""
                style={{ width: "100%", height: "100%", border: "none" }}
              />
              <div className="flex flex-col space-y-4">
                {(conversation[selectedEmail] || []).map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`p-4 rounded-2xl max-w-xl shadow-sm ${
                        msg.type === "user"
                          ? "bg-green-100 self-end rounded-br-none"
                          : "bg-gray-200 text-gray-900 self-start rounded-bl-none"
                      }`}>
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                      <p className="text-xs mt-1 text-right select-none">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in mt-2">
                    <div className="flex max-w-4xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 mr-4 flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-black" />
                      </div>
                      <div className="px-6 py-4 rounded-2xl bg-gray-100 border border-gray-700/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}></div>
                            <div
                              className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-gray-400 text-sm">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="m-2 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-3 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendToAI();
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  {tags.map((tag) => (
                    <button
                      onClick={() => setMessage(tag)}
                      key={tag}
                      className="px-3 py-2 bg-gray-100 text-gray-900 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  onClick={sendToAI}
                  className="px-6 py-2 bg-[#1B4635] text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium mt-2 md:mt-0">
                  Send
                </button>
              </div>
              {bodyError && (
                <p className="mt-2 text-red-600 text-sm">{bodyError}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow text-gray-400 text-lg font-medium">
            Please select an email from the left.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAutomation;
