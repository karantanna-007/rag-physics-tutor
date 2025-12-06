// src/components/layout/Sidebar.jsx
import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import TuneIcon from "@mui/icons-material/Tune";

import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Tutor",
    to: "/",
    icon: <ChatIcon />,
    description: "Ask questions & see answers",
  },
  {
    label: "My Files",
    to: "/files",
    icon: <DescriptionIcon />,
    description: "Upload PDFs / notes",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: <TuneIcon />,
    description: "Difficulty & preferences",
  },
];

const Sidebar = ({ isCollapsed = false, onLinkClick }) => {
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? 72 : 240,
        flexShrink: 0,
        transition: "width 0.2s ease",
        borderRight: "1px solid rgba(30,41,59,0.9)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,1), rgba(15,23,42,0.98))",
        display: { xs: isCollapsed ? "none" : "block", md: "block" },
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: "1px solid rgba(30,41,59,0.9)" }}>
        {!isCollapsed && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.7, textTransform: "uppercase" }}
            >
              Navigation
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.6, display: "block", mt: 0.5 }}
            >
              Quickly switch between tutor, files, and settings.
            </Typography>
          </>
        )}
      </Box>

      <List sx={{ py: 0.5 }}>
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={onLinkClick}
              sx={{
                my: 0.25,
                borderRadius: 2,
                mx: 1,
                "&.active": {},
                backgroundColor: isActive
                  ? "rgba(37,99,235,0.18)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(37,99,235,0.22)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? "primary.main" : "rgba(148,163,184,0.9)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: isActive ? 600 : 500,
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    sx: { opacity: 0.6 },
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5, mx: 1 }} />

      {!isCollapsed && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Tip: Upload your class notes in{" "}
            <strong>My Files</strong> so the tutor can give answers from your
            exact syllabus instead of generic internet content.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
