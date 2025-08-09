import { useState, useEffect, useCallback } from "react";
import { Mail, Search, Settings, Plus, LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const EmailAutomation = () => {
  const [accessToken, setAccessToken] = useState(null);
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
  const [conversation, setConversation] = useState({}); // { emailId: [{ type: "user" | "ai", message, timestamp }] }

  const tags = ["Booking", "Finding", "Inquiries"];

  // Google OAuth login
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);
      const token = tokenResponse.access_token;
      setAccessToken(token);
      localStorage.setItem("gmail_access_token", token);
      setApiError(null);
      fetchEmails(token);
    },
    onError: () => {
      setApiError("Google Login Failed");
    },
  });

  // Fetch email list
  const fetchEmails = async (token, pageToken = "", query = "") => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&pageToken=${pageToken}&q=${encodeURIComponent(
          query
        )}`,
        {
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
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const headers = msgRes.data.payload.headers;
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
      if (detailedEmails.length > 0) setSelectedEmail(detailedEmails[0].id);
    } catch (err) {
      console.error("Email fetch failed:", err);
      setApiError(
        err.response?.data?.error?.message || "Failed to fetch emails."
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("gmail_access_token");
        setAccessToken(null);
        window.location.reload();
      }
    }
    setLoading(false);
  };

  // Fetch email body
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
      let body = "";

      if (payload.parts) {
        const textPart = payload.parts.find(
          (part) => part.mimeType === "text/plain"
        );
        const htmlPart = payload.parts.find(
          (part) => part.mimeType === "text/html"
        );
        if (htmlPart) {
          body = atob(htmlPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        } else if (textPart) {
          body = atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        }
      } else if (
        payload.mimeType === "text/plain" ||
        payload.mimeType === "text/html"
      ) {
        body = atob(payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
      }

      setEmailBody(body);
    } catch (err) {
      console.error("Email body fetch failed:", err);

      setBodyError(
        err.response?.data?.error?.message || "Failed to fetch email body."
      );
    }
    setBodyLoading(false);
  };

  // Send message to AI and get response
  const sendToAI = async () => {
    if (!message.trim() || !selectedEmail || !accessToken) return;

    const userMessage = message;
    const timestamp = new Date().toISOString();

    // Add user message to conversation
    setConversation((prev) => ({
      ...prev,
      [selectedEmail]: [
        ...(prev[selectedEmail] || []),
        { type: "user", message: userMessage, timestamp },
      ],
    }));

    setMessage(""); // Clear input
    setBodyError(null);

    // try {
    //   const response = await axiosInstance.post("/api/ai/respond", {
    //     message: userMessage,
    //     context: emailBody, // Send email body as context
    //   });

    //   const aiResponse = response.data.response || "No response from AI.";

    //   // Add AI response to conversation
    //   setConversation((prev) => ({
    //     ...prev,
    //     [selectedEmail]: [
    //       ...(prev[selectedEmail] || []),
    //       {
    //         type: "ai",
    //         message: aiResponse,
    //         timestamp: new Date().toISOString(),
    //       },
    //     ],
    //   }));
    // } catch (err) {
    //   console.error("AI request failed:", err);
    //   setBodyError(err.response?.data?.message || "Failed to get AI response.");
    // }
  };

  // Debounced search
  const debouncedFetchEmails = useCallback(() => {
    if (accessToken) {
      setPageTokens([""]);
      setNextPageToken(null);
      fetchEmails(accessToken, "", searchQuery);
    }
  }, [accessToken, searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedFetchEmails();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, debouncedFetchEmails]);

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("gmail_access_token");
    if (token) {
      setAccessToken(token);
      fetchEmails(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch email body when selectedEmail changes
  useEffect(() => {
    if (selectedEmail && accessToken) {
      fetchEmailBody(selectedEmail, accessToken);
    }
  }, [selectedEmail, accessToken]);

  function extractName(fullSender) {
    const match = fullSender.match(/^(.*?)\s*</);
    return match ? match[1] : fullSender;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F3] flex flex-col md:flex-row p-4 md:p-10 overflow-hidden">
      {/* Email List Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-3 rounded-2xl md:rounded-l-2xl md:h-[90vh] flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mail"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Settings className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
          </div>
        </div>

        {/* Email List */}
        {loading ? (
          <div className="text-center mt-4 text-gray-500">Loading...</div>
        ) : apiError ? (
          <div className="text-center mt-4 text-red-500">{apiError}</div>
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
                    className={`p-3 border-b mb-2 cursor-pointer hover:bg-gray-50 rounded-xl ${
                      selectedEmail === email.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : email.isUnread
                        ? "border-l-4 border-[#C4E8DA]"
                        : ""
                    }`}
                    onClick={() => setSelectedEmail(email.id)}>
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
                <div className="text-center mt-4 text-gray-500">
                  No emails found.
                </div>
              )}
            </div>

            {/* Pagination Buttons */}
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col mt-6 md:mt-0 md:ml-6 bg-white rounded-2xl overflow-hidden">
        {selectedEmail ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {/* {emails.find((e) => e.id === selectedEmail)?.sender} -{" "} */}
                {emails.find((e) => e.id === selectedEmail)?.subject}
              </h3>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-6 bg-gray-50 overflow-auto max-h-[70vh] overflow-y-auto">
              {bodyLoading ? (
                <div className="text-center text-gray-500">
                  Loading email...
                </div>
              ) : bodyError ? (
                <div className="text-center text-red-500">{bodyError}</div>
              ) : emailBody ? (
                <div className="space-y-4">
                  <iframe
                    srcDoc={emailBody}
                    sandbox=""
                    style={{ width: "100%", height: "600px", border: "none" }}
                  />
                  {/* Conversation Messages */}
                  {(conversation[selectedEmail] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      } mt-2`}>
                      <div
                        className={`p-3 rounded-lg max-w-xs border ${
                          msg.type === "user"
                            ? "bg-green-100 text-gray-900 border-green-200"
                            : "bg-gray-100 text-gray-900 border-gray-200"
                        }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Unable to display email content.</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="m-2 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-3 outline-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <div className="bg-[#E2F4EC] p-2 rounded-full">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-2 bg-gray-100 text-gray-900 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={sendToAI}
                  className="px-6 py-2 bg-[#1B4635] text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium mt-2 md:mt-0">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select an email
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Choose an email to read its content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAutomation;
