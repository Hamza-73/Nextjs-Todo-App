"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Welcome() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 4, sm: 6 },
          borderRadius: 4,
          maxWidth: 600,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#2c3e50",
            mb: 3,
            fontSize: { xs: 32, sm: 40 },
          }}
        >
          Welcome to Todo App
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            color: "#555",
          }}
        >
          Your personal productivity hub. Add, track, and manage your tasks with ease and never miss a thing again.
        </Typography>
      </Paper>
    </Box>
  );
}
