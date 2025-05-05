// src/components/AiChat.js

import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const AiChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pendingIncident, setPendingIncident] = useState(null);

  const toggleChat = () => setOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    processInput(input);
    setInput("");
  };

  const processInput = (text) => {
    if (text.toLowerCase().includes("vpn")) {
      const draft = {
        title: "VPN connectivity issue",
        description: "User reported: " + text,
      };
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `It looks like you're having VPN issues. Shall I raise an incident titled \"${draft.title}\"?`,
        },
      ]);
      setPendingIncident(draft);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I’m here to help. Please describe your issue." },
      ]);
    }
  };

  const confirmRaiseIncident = () => {
    // In a real app, replace with API call
    console.log("Incident created:", pendingIncident);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: `Incident \"${pendingIncident.title}\" has been raised.` },
    ]);
    setPendingIncident(null);
  };

  return (
    <>
      <IconButton
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, bgcolor: "background.paper" }}
        onClick={toggleChat}
      >
        <ChatIcon />
      </IconButton>

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 24,
            width: 320,
            maxHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1">AI Assistant</Typography>
            <IconButton size="small" onClick={toggleChat}><CloseIcon fontSize="small" /></IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
            {messages.map((msg, i) => (
              <Typography key={i} variant="body2" color={msg.sender === "user" ? "text.primary" : "text.secondary"}>
                <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
              </Typography>
            ))}
          </Box>
          <Divider />
          <Box sx={{ p: 1, display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton onClick={handleSend}><SendIcon /></IconButton>
          </Box>
        </Paper>
      )}

      <Dialog open={!!pendingIncident} onClose={() => setPendingIncident(null)}>
        <DialogTitle>Confirm Incident</DialogTitle>
        <DialogContent>
          <Typography>Title: {pendingIncident?.title}</Typography>
          <Typography>Description: {pendingIncident?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingIncident(null)}>Cancel</Button>
          <Button variant="contained" onClick={confirmRaiseIncident}>Raise Incident</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AiChat;
