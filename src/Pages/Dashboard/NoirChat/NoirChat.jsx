import { useState, useRef, useEffect } from "react";
import { User, Bot, Sparkles, Star, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { HiOutlineMicrophone } from "react-icons/hi";
import { FaRegCircleStop } from "react-icons/fa6";

const NoirChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      input.focus();
    }
  }, [messages]);

  useEffect(() => {
    // Load messages from sessionStorage on mount
    const savedMessages = sessionStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Save messages to sessionStorage whenever they change
    if (messages.length > 0) {
      sessionStorage.setItem("chatHistory", JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (inputValue.trim()) {
        handleSubmit();
      }
    };

    recognitionRef.current = recognition;
  }, [inputValue]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Speech recognition start error:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    setIsTyping(true);
    setIsLoading(true);

    try {
      const allMessages = [...messages, { type: "user", content: userMessage }];

      const parts = allMessages.map((msg) => ({
        text: msg.content,
      }));

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_GEMNI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: parts,
              },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch Gemini API");

      const data = await res.json();

      const aiResponseObject = data?.candidates?.[0]?.content;
      const aiResponseText =
        aiResponseObject?.parts?.map((part) => part.text).join(" ") ||
        "No response";

      if (inputRef.current) {
        const input = inputRef.current;
        input.focus();
      }

      setMessages((prev) => [...prev, { type: "ai", content: aiResponseText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: "Sorry, something went wrong." },
      ]);
    }

    setIsTyping(false);
    setIsLoading(false);
  };

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="fixed bg-white"></div>

      <div className="flex-1 flex flex-col relative">
        <FloatingParticles />

        <div className="bg-white px-6 py-4 relative border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black flex items-center">
                <Bot className="w-6 h-6 mr-2 text-blue-400" />
                AI Assistant
              </h2>
              <p className="text-gray-600 text-sm">
                Ready to help with anything
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 text-sm">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
                <div className="relative">
                  <div className="text-8xl mb-6 animate-bounce">🤖</div>
                  <h2 className="text-3xl font-bold bg-black bg-clip-text text-transparent mb-4">
                    Welcome to Noir AI Chat
                  </h2>
                  <p className="text-gray-500 text-lg mb-8">
                    Unleash the power of AI conversation
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-700 text-sm">
                        Instant Responses
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 text-green-400" />
                      <span className="text-gray-700 text-sm">
                        Smart Analysis
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}>
                <div
                  className={`flex max-w-4xl ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  } group`}>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gray-300 text-black ml-4"
                        : "bg-gradient-to-r from-gray-700 to-gray-800 mr-4"
                    }`}>
                    {message.type === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg relative overflow-hidden ${
                      message.type === "user"
                        ? "bg-gray-200 text-black"
                        : "bg-gray-100 text-black"
                    }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex max-w-4xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 mr-4 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div className="px-6 py-4 rounded-2xl bg-gray-100 border-gray-700/50 backdrop-blur-sm">
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
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-6 relative border-t border-gray-200">
          <div className="absolute inset-0 bg-wh"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="flex-1 relative group">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                placeholder="Ask anything... ✨"
                className="w-full px-6 py-4 pr-14 bg-white rounded-2xl outline-none text-black border border-gray-300 shadow-md transition-all duration-300 placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={toggleRecording}
                className="absolute cursor-pointer right-7 top-1/2 transform -translate-y-1/2 text-gray-700 transition-colors duration-300 hover:scale-110">
                {isRecording ? (
                  <FaRegCircleStop
                    title="Stop"
                    className="w-5 h-5 text-red-600"
                  />
                ) : (
                  <HiOutlineMicrophone title="Mic" className="w-6 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="bg-teal-600 text-white md:px-8 px-2 py-4 rounded-2xl font-semibold transition-all duration-300 transform cursor-pointer flex items-center space-x-2">
              <span>Send</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default NoirChat;
