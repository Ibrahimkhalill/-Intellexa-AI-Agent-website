"use client";

import { useState, useRef, useEffect } from "react";
import { User, Bot, Sparkles, Zap, Star } from "lucide-react";
import { HiOutlineMicrophone } from "react-icons/hi";
import { FaRegCircleStop } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [spaServices, setSpaServices] = useState([]);
  const [plainMessages, setPlainMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const { title } = useParams();
  const resultsRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom when new data is added
  const scrollToBottom = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [spaServices, plainMessages]);

  // Initialize speech recognition
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
      setSearchText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      setError("Speech recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (searchText.trim()) {
        handleExplore();
      }
    };

    recognitionRef.current = recognition;
  }, [searchText]);

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
        setError("Failed to start speech recognition.");
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleExplore = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchText.trim()) {
      setError("Please enter a search query.");
      return;
    }

    // Add user message to UI immediately
    setPlainMessages((prev) => [
      ...prev,
      { type: "user", content: searchText },
    ]);

    setLoading(true);
    setIsTyping(true);
    setError(null);
    const userMessage = searchText;
    setSearchText(""); // Clear input immediately after submission

    try {
      const payload = {
        message: userMessage,
        agent_type: title || "SpaBooking",
        ...(sessionId && { session_id: sessionId }),
      };

      const response = await axios.post(
        "https://wbsl64n9-8005.inc1.devtunnels.ms/chat",
        payload
      );

      const data = response.data;

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Process response
      if (data.response && data.response.includes("*")) {
        const newServices = data.response
          .split("\n\n")
          .filter((item) => item.startsWith("*"))
          .map((item) => {
            const [name, ...descriptionParts] = item
              .replace(/^\*\s*/, "")
              .split(": ");
            const description = descriptionParts.join(": ").trim();
            const sourceMatch = description.match(
              /Source: (https?:\/\/[^\s]+)/
            );
            const source = sourceMatch ? sourceMatch[1] : null;
            const cleanDescription = source
              ? description.replace(/Source: https?:\/\/[^\s]+/, "").trim()
              : description;
            return { name, description: cleanDescription, source };
          });
        setSpaServices((prev) => [...prev, ...newServices]);
      } else {
        const newMessage =
          data.response || "No detailed information available.";
        setPlainMessages((prev) => [
          ...prev,
          { type: "ai", content: newMessage },
        ]);
      }
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error(err);
      setPlainMessages((prev) => [
        ...prev,
        { type: "ai", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
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
      {/* Animated Background */}
      <div className="fixed bg-white"></div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <FloatingParticles />

        {/* Header */}
        <div className="bg-white px-6 py-4 relative border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black flex items-center">
                <Bot className="w-6 h-6 mr-2 text-blue-400" />
                {title || "Spa"} Assistant
              </h2>
              <p className="text-gray-600 text-sm">
                Ready to help with {title || "spa"} services
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          {spaServices.length === 0 && plainMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
                <div className="relative">
                  <div className="text-8xl mb-6 animate-bounce">🤖</div>
                  <h2 className="text-3xl font-bold bg-black bg-clip-text text-transparent mb-4">
                    Welcome to {title || "Spa"}
                  </h2>
                  <p className="text-gray-500 text-lg mb-8">
                    Discover {title || "spa"} services with AI
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {plainMessages.map((message, index) => (
                <div
                  key={`message-${index}`}
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
              ))}
              {spaServices.map((service, index) => (
                <div
                  key={`service-${index}`}
                  className="flex justify-start animate-fade-in">
                  <div className="flex max-w-4xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 mr-4 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gray-100 text-black relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <h3 className="font-semibold text-lg mb-1">
                          {service.name}
                        </h3>
                        <ReactMarkdown>{service.description}</ReactMarkdown>
                        {service.source && (
                          <a
                            href={service.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm">
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
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
          <div ref={resultsRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-6 relative border-t border-gray-200">
          <div className="flex items-center space-x-4 relative">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={searchText}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleExplore(e)}
                placeholder={`Ask about ${title || "spa"} services... ✨`}
                className="w-full px-6 py-4 pr-14 bg-white rounded-2xl outline-none text-black border border-gray-300 shadow-md transition-all duration-300 placeholder-gray-400 text-sm"
                disabled={loading}
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
              onClick={handleExplore}
              disabled={loading || !searchText.trim()}
              className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform cursor-pointer flex items-center space-x-2">
              <span>Explore</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      </div>

      {/* Custom Styles */}
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

        /* Custom scrollbar */
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
}
