// src/components/layout/MainLayout.jsx
import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [sidebarOpenMobile, setSidebarOpenMobile] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpenMobile((prev) => !prev);
  };

  const handleCloseSidebarMobile = () => {
    setSidebarOpenMobile(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%)",
      }}
    >
      {/* Header */}
      <Header onToggleSidebar={handleToggleSidebar} />

      {/* Layout: sidebar + main content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        {/* Sidebar: desktop always visible; mobile toggle */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Sidebar />
        </Box>

        {/* Mobile overlay sidebar */}
        {sidebarOpenMobile && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1200,
              display: { xs: "block", md: "none" },
            }}
            onClick={handleCloseSidebarMobile}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.7)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 64,
                bottom: 0,
                left: 0,
                width: 240,
                boxShadow: 6,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar onLinkClick={handleCloseSidebarMobile} />
            </Box>
          </Box>
        )}

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "auto",
              pb: 2,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
