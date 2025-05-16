// Dashboard.js — Clean incident list inside 'table' widget

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Stack,
  Paper,
  FormControlLabel,
  Switch,
  Chip
} from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip as RechartTooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

const initialWidgets = [
  { id: "1", type: "pie", title: "Incidents by Status" },
  { id: "2", type: "bar", title: "Monthly Requests" },
  { id: "3", type: "line", title: "Changes Over Time" },
  { id: "4", type: "pie", title: "Ticket Priorities" },
  { id: "5", type: "bar", title: "Team Performance" },
  { id: "6", type: "line", title: "Weekly Volume" },
  { id: "7", type: "pie", title: "Issue Types" },
  { id: "8", type: "bar", title: "Resolution Times" },
  { id: "9", type: "line", title: "Escalation Trends" },
  { id: "10", type: "table", title: "Latest Incidents" }
];

const samplePieData = [
  { name: "Open", value: 8 },
  { name: "Closed", value: 12 },
  { name: "Pending", value: 5 },
];

const sampleBarData = [
  { name: "Jan", Requests: 5 },
  { name: "Feb", Requests: 9 },
  { name: "Mar", Requests: 7 },
  { name: "Apr", Requests: 12 },
];

const sampleLineData = [
  { name: "Week 1", Changes: 3 },
  { name: "Week 2", Changes: 5 },
  { name: "Week 3", Changes: 2 },
  { name: "Week 4", Changes: 7 },
];

const COLORS = ["#ff6f61", "#6a67ce", "#6fcf97", "#56ccf2", "#f2994a"];

const Dashboard = () => {
  const theme = useTheme();
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("dashboardWidgets");
    return saved ? JSON.parse(saved) : initialWidgets;
  });
  const [editMode, setEditMode] = useState(false);
  const [newWidgetOpen, setNewWidgetOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState("pie");
  const [newWidgetTitle, setNewWidgetTitle] = useState("");
  const [useGradient, setUseGradient] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboardWidgets", JSON.stringify(widgets));
  }, [widgets]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setWidgets(reordered);
  };

  const addWidget = () => {
    const newId = Date.now().toString();
    setWidgets([...widgets, { id: newId, type: newWidgetType, title: newWidgetTitle || "Untitled" }]);
    setNewWidgetOpen(false);
    setNewWidgetType("pie");
    setNewWidgetTitle("");
  };

  const deleteWidget = (id) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const resetLayout = () => {
    localStorage.removeItem("dashboardWidgets");
    setWidgets(initialWidgets);
  };

  const updateWidgetTitle = (id, newTitle) => {
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, title: newTitle } : w)));
  };

  const renderWidget = (widget) => {
    if (widget.type === "table") {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflowY: 'auto', height: '100%', p: 1 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Paper
              key={i}
              sx={{
                background: "#f5f8fe",
                borderLeft: "5px solid #295cb3",
                p: 2,
                borderRadius: 1.5,
                boxShadow: "0 1px 6px rgba(20,40,80,0.03)",
              }}
            >
              <Typography sx={{ fontSize: "0.95rem", color: "#456", mb: 1 }}>
                <strong>#{i + 1}</strong> • Incident #{i + 1}
                <Chip
                  label={i % 3 === 0 ? "Open" : i % 3 === 1 ? "Closed" : "Pending"}
                  sx={{
                    ml: 1,
                    bgcolor: "#e2e8f0",
                    color: "#2b5ca4",
                    fontSize: "0.85em",
                    height: "20px",
                    fontWeight: 500,
                    borderRadius: "10px",
                  }}
                />
              </Typography>
              <Typography variant="body2">
                Example description for Incident #{i + 1}.
              </Typography>
              <Typography sx={{ fontSize: "0.92em", color: "#789", mt: 1 }}>
                Created: {new Date().toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      );
    }

    const ChartWrapper = ({ children }) => (
      <Box sx={{ width: '100%', height: 240, overflow: 'hidden', display: 'flex' }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    );

    if (widget.type === "pie") {
      return (
        <ChartWrapper>
          <PieChart>
            <Pie data={samplePieData} cx="50%" cy="50%" outerRadius="100%" dataKey="value">
              {samplePieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartTooltip />
          </PieChart>
        </ChartWrapper>
      );
    }
    if (widget.type === "bar") {
      return (
        <ChartWrapper>
          <BarChart data={sampleBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="Requests" fill={theme.palette.primary.main} />
            <RechartTooltip />
          </BarChart>
        </ChartWrapper>
      );
    }
    if (widget.type === "line") {
      return (
        <ChartWrapper>
          <LineChart data={sampleLineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Line type="monotone" dataKey="Changes" stroke={useGradient ? '#ffffff' : theme.palette.primary.main} />
            <RechartTooltip />
          </LineChart>
        </ChartWrapper>
      );
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: theme.palette.background.default, width: '100%' }}>
      {/* ...rest of your unchanged header and dashboard layout... */}
      {/* Keep your existing layout */}
      {/* Just replaced the 'table' widget rendering as shown above */}
    </Box>
  );
};

export default Dashboard;
