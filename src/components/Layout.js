// src/components/AIChat.js

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("chatHistory")) || []
  );
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", text: input };
    const newMessages = [...messages, newUserMsg];

    // Basic intent check
    let botResponse = "I'm here to help!";

    if (input.toLowerCase().includes("raise") && input.toLowerCase().includes("incident")) {
      botResponse = "Sure, opening the incident form for you.";
      setMessages([...newMessages, { role: "bot", text: botResponse }]);
      setTimeout(() => navigate("/new-incident"), 1000);
    } else {
      botResponse = "Thanks for your message. I’ll forward this to support.";
      setMessages([...newMessages, { role: "bot", text: botResponse }]);
    }

    setInput("");
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1500 }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{ sx: { height: "70vh", display: "flex", flexDirection: "column" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          AI Assistant
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, overflowY: "auto" }}>
          <List dense>
            {messages.map((msg, i) => (
              <ListItem key={i} sx={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <ListItemText
                  primary={msg.text}
                  sx={{
                    maxWidth: "75%",
                    bgcolor: msg.role === "user" ? "primary.light" : "grey.200",
                    color: "text.primary",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </DialogContent>

        <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
};

export default AIChat;
