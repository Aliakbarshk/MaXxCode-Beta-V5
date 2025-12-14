import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  Sparkles,
  Languages,
  Lock,
  Key,
  Shield,
  UserCheck,
} from "lucide-react";
import { getGeminiHelp } from "../services/geminiService";
import { ChatMessage, AppLanguage } from "../types";
import { Button } from "./UIComponents";
import { clsx } from "clsx";
import { playSound } from "../utils/audio";

const SYSTEM_API_KEY = "AIzaSyACytzzLB8dfuowpIdhhcyPd0jS0RXKwmo";

interface AIChatProps {
  currentCode: string;
  lessonContext: string;
  appLanguage: AppLanguage;
  apiKey: string | null;
  isDevMode: boolean;
  onTranslateReq?: () => void;
  onUnlockDevMode: () => void;
  onSetApiKey: (key: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  currentCode,
  lessonContext,
  appLanguage,
  apiKey,
  isDevMode,
  onTranslateReq,
  onUnlockDevMode,
  onSetApiKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState("");
  const [authType, setAuthType] = useState<"developer" | "tester" | "apikey">(
    "developer"
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: "Hi! I'm Max! Stuck? Ask me anything! 🚀" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOpenRequest = () => {
    playSound("click");
    // If we have a key (either dev default or user provided), open chat
    if (apiKey) {
      setIsOpen(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = () => {
    if (authType === "developer") {
      if (authInput === "hc1") {
        onUnlockDevMode(); // Unlocks App Admin/Dev features
        onSetApiKey(SYSTEM_API_KEY); // Sets the hardcoded system key
        setIsOpen(true);
        setShowAuthModal(false);
        playSound("success");
      } else {
        playSound("error");
        alert("Incorrect Developer Password");
      }
    } else if (authType === "tester") {
      if (authInput === "horizoncorp32") {
        // Only sets the key, does not unlock Admin features
        onSetApiKey(SYSTEM_API_KEY);
        setIsOpen(true);
        setShowAuthModal(false);
        playSound("success");
      } else {
        playSound("error");
        alert("Incorrect Tester Password");
      }
    } else {
      // Custom User API Key
      if (authInput.trim().length > 10) {
        onSetApiKey(authInput.trim());
        setIsOpen(true);
        setShowAuthModal(false);
        playSound("success");
      } else {
        playSound("error");
        alert("Invalid API Key format");
      }
    }
    setAuthInput("");
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    playSound("click");

    const responseText = await getGeminiHelp(
      currentCode,
      userMsg.text,
      lessonContext,
      appLanguage,
      apiKey
    );

    setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    setLoading(false);
    playSound("pop");
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleOpenRequest}
          className="fixed bottom-24 right-6 z-40 bg-white p-3 rounded-full shadow-xl border-4 border-[#5A9CB5] hover:scale-110 transition-transform group"
        >
          <Bot
            size={32}
            className="text-[#5A9CB5] group-hover:rotate-12 transition-transform"
          />
          <div className="absolute -top-2 -right-2 bg-[#FA6868] text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
            AI
          </div>
        </button>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden animate-pop">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5A9CB5]">
                <Lock size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-800">
                Unlock Max Helper
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Select your access mode to continue.
              </p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                className={clsx(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1",
                  authType === "developer"
                    ? "bg-white shadow text-[#5A9CB5]"
                    : "text-gray-500"
                )}
                onClick={() => setAuthType("developer")}
              >
                <Shield size={12} /> Dev
              </button>
              <button
                className={clsx(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1",
                  authType === "tester"
                    ? "bg-white shadow text-[#5A9CB5]"
                    : "text-gray-500"
                )}
                onClick={() => setAuthType("tester")}
              >
                <UserCheck size={12} /> Tester
              </button>
              <button
                className={clsx(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1",
                  authType === "apikey"
                    ? "bg-white shadow text-[#5A9CB5]"
                    : "text-gray-500"
                )}
                onClick={() => setAuthType("apikey")}
              >
                <Key size={12} /> Custom
              </button>
            </div>

            <input
              type={authType === "apikey" ? "text" : "password"}
              placeholder={
                authType === "developer"
                  ? "Enter Developer Password..."
                  : authType === "tester"
                  ? "Enter Tester Password..."
                  : "Enter your API Key..."
              }
              className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-[#5A9CB5] focus:outline-none"
              value={authInput}
              onChange={(e) => setAuthInput(e.target.value)}
            />

            <Button fullWidth onClick={handleAuthSubmit}>
              Unlock
            </Button>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white w-full sm:w-[400px] h-[80vh] sm:h-[600px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border-2 border-[#E5E7EB]">
            {/* Header */}
            <div className="bg-[#5A9CB5] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot className="animate-pulse" />
                <span className="font-bold text-lg">Max Helper</span>
              </div>
              <div className="flex gap-2">
                {onTranslateReq && (
                  <button
                    onClick={onTranslateReq}
                    className="hover:bg-white/20 p-1 rounded-full text-xs flex items-center gap-1"
                    title="Translate Lesson"
                  >
                    <Languages size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={clsx(
                      "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-[#FACE68] text-[#727D73] rounded-tr-none"
                        : "bg-white border-2 border-[#E5E7EB] text-gray-700 rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-[#E5E7EB] p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Sparkles
                      size={16}
                      className="text-[#FACE68] animate-spin"
                    />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9CB5]"
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={loading}
                  className="!px-3 !py-2"
                >
                  <Send size={18} />
                </Button>
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                {["Explain code", "Hint please", "Fix error"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        handleSend();
                      }}
                      className="text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#E5E7EB] text-gray-500"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
