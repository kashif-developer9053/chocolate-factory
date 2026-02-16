"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import knowledgeBase from "../../components/knowledgeBase.json";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hey there! Welcome to The Chocolates Factory. I’m your chocolate-loving chatbot. 😋 Ask me about our policies, delivery, or just chat about chocolate!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConsent = () => {
    setHasConsented(true);
    setMessages((prev) => [
      ...prev,
      {
        text: "Sweet! You’re good to go. Ask away about our chocolates, shipping, or just vibe with me!",
        sender: "bot",
      },
    ]);
  };

  const casualResponses = [
    "Mmm, I’m dreaming of chocolate rivers! What’s your fave chocolate treat? 🍫",
    "Just chilling in a chocolate swirl! Got any fun chocolate stories? 😋",
    "I’m all about that cocoa life! What’s making your day sweeter? 🌟",
    "Chocolate makes everything better, right? What’s on your mind? 🍬",
    "I’d share my chocolate stash with you, but I’m a bot! 😅 What’s up?",
    "Swirling in a sea of cocoa! What’s the sweetest thing you’ve done today? 😊",
    "Just melted a bit thinking about truffles! What’s your chocolate vibe? 🍫",
  ];

  const findKnowledgeBaseResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    for (const entry of knowledgeBase) {
      for (const keyword of entry.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return entry.response;
        }
      }
    }
    return null;
  };

  const getCasualResponse = () => {
    return casualResponses[Math.floor(Math.random() * casualResponses.length)];
  };

  const getAIResponse = async (userInput) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("AI response error:", data.error);
        return getCasualResponse();
      }
      return data.reply;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return getCasualResponse();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !hasConsented) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const knowledgeResponse = findKnowledgeBaseResponse(input);
    if (knowledgeResponse) {
      setMessages((prev) => [...prev, { text: knowledgeResponse, sender: "bot" }]);
    } else {
      const aiResponse = await getAIResponse(input);
      setMessages((prev) => [...prev, { text: aiResponse, sender: "bot" }]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) handleSend();
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={toggleChat}
            className="rounded-full bg-[#D2691E] text-white hover:bg-[#8B4513] w-14 h-14 flex items-center justify-center shadow-lg font-poppins"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-80 sm:w-96 h-[500px] bg-card/90 backdrop-blur-sm rounded-xl shadow-xl border-none flex flex-col font-poppins"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-[#D2691E] text-white rounded-t-xl">
              <h3 className="text-lg font-semibold font-poppins">Chocolate Chatbot</h3>
              <Button
                variant="ghost"
                onClick={toggleChat}
                className="text-white hover:text-[#8B4513] font-poppins"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm font-poppins ${
                      msg.sender === "user"
                        ? "bg-[#D2691E] text-white"
                        : "bg-[#8B4513]/10 text-[#8B4513]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[70%] p-3 rounded-lg text-sm font-poppins bg-[#8B4513]/10 text-[#8B4513]">
                    Thinking... 🍫
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Consent Notice */}
            {!hasConsented && (
              <div className="p-4 border-t border-[#D2691E]/20 bg-background/50">
                <p className="text-sm text-muted-foreground font-poppins mb-2">
                  By chatting with me, you agree to our{" "}
                  <a href="/privacy-policy" className="text-[#D2691E] hover:underline">
                    Privacy Policy
                  </a>
                  . We may collect your messages to make my answers even sweeter!
                </p>
                <Button
                  onClick={handleConsent}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513] font-poppins flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> I’m Cool With That
                </Button>
              </div>
            )}

            {/* Input */}
            {hasConsented && (
              <div className="p-4 border-t border-[#D2691E]/20 bg-background/50 flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-background/50 border-[#D2691E]/20 focus:border-[#D2691E] font-poppins"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  className="bg-[#D2691E] text-white hover:bg-[#8B4513] font-poppins"
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}