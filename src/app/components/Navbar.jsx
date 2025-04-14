"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import React from "react";
import { useThemeMode } from "./ThemeProvider";

export default function Navbar() {
  const { toggleTheme, mode } = useThemeMode();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 2,
        px: 4,
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Todo App</Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

        <SignedOut>
          <Button variant="outlined">
            <SignInButton mode="modal" />
          </Button>
          <Button variant="contained">
            <SignUpButton mode="modal" />
          </Button>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </Box>
    </Box>
  );
}
