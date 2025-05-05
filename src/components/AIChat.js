// src/components/AIChat.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Button
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

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input },
      {
        role: "bot",
        text: input.toLowerCase().includes("incident")
          ? "I'll help you raise a new incident!"
          : "I'm here to assist you with ITSM queries."
      }
    ];

    setMessages(newMessages);
    setInput("");

    if (input.toLowerCase().includes("incident")) {
      setTimeout(() => navigate("/new-incident"), 1200);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1500 }}
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
        PaperProps={{ sx: { height: "80vh", display: "flex", flexDirection: "column" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          AI Assistant
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                }}
              >
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor: msg.role === "user" ? "primary.light" : "grey.300",
                    color: "text.primary",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%"
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Ask me something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIChat;
