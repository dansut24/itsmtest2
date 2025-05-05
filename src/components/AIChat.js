// src/components/AIChat.js

import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  TextField,
  Typography,
  Divider,
  Fab,
  CircularProgress
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { type: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    setTimeout(() => {
      const botReply = `You said: "${input}"`;
      setMessages([...newMessages, { type: "bot", text: botReply }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={toggleDrawer}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1500 }}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 320,
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
        }}
      >
        <Typography variant="h6" mb={1}>AI Assistant</Typography>
        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: "auto", my: 2 }}>
          {messages.map((msg, idx) => (
            <Typography
              key={idx}
              align={msg.type === "user" ? "right" : "left"}
              sx={{ mb: 1, p: 1, bgcolor: msg.type === "user" ? "primary.light" : "grey.100", borderRadius: 2 }}
            >
              {msg.text}
            </Typography>
          ))}
          {loading && (
            <Box display="flex" justifyContent="center" mt={1}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="small"
            fullWidth
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <IconButton color="primary" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChat;
