// src/components/layout/Header.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

  const open = Boolean(anchorEl);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid rgba(148,163,184,0.35)",
        background:
          "linear-gradient(90deg, rgba(15,23,42,0.98), rgba(30,64,175,0.9))",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: logo + title + mobile menu button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={onToggleSidebar}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              mr: 0.5,
            }}
          >
            <MenuIcon sx={{ color: "#e5e7eb" }} />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "12px",
                background:
                  "radial-gradient(circle at 30% 20%, #f97316, #22c55e, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(59,130,246,0.7)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 22, color: "#0f172a" }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                RAG Physics Tutor
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, display: { xs: "none", sm: "block" } }}
              >
                Groq + LangChain • PDFs • Web • Physics DB
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: theme toggle + user */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ThemeToggle />

          {user && (
            <>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexDirection: "column",
                  alignItems: "flex-end",
                  mr: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, lineHeight: 1.2 }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.75, lineHeight: 1.2 }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Tooltip title="Account menu">
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "rgba(15,23,42,0.9)",
                      border: "1px solid rgba(148,163,184,0.8)",
                      fontSize: 14,
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 200,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.75, wordBreak: "break-all" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
