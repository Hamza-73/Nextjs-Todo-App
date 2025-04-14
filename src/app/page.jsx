import { Box } from "@mui/material";
import React from "react";
import Welcone from "./components/Welcone";
import { currentUser } from "@clerk/nextjs/server";
import Todo from "./components/Todo";

export default async function Home() {
  const user = await currentUser();
  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {user ? <Todo /> : <Welcone />}
      </Box>
    </Box>
  );
}
