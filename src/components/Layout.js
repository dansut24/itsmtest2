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
  Slide
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

    const newUserMsg = { role: "user", text: input };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);

    let botResponse = "I'm here to help.";
    if (input.toLowerCase().includes("raise") && input.toLowerCase().includes("incident")) {
      botResponse = "Sure, opening the new incident form for you.";
      setTimeout(() => navigate("/new-incident"), 1000);
    }

    setMessages([...newMessages, { role: "bot", text: botResponse }]);
    setInput("");
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}
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
        PaperProps={{
          sx: {
            height: "75vh",
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          AI Assistant
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, overflowY: "auto", px: 2 }}>
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
                    maxWidth: "70%",
                    bgcolor: msg.role === "user" ? "primary.light" : "grey.200",
                    color: "text.primary",
                    px: 2,
                    py: 1,
                    borderRadius: 2
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
            placeholder="Ask a question..."
            variant="outlined"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
};

export default AIChat;
