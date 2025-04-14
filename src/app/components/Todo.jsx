import {
  Box,
} from "@mui/material";
import React from "react";
import TodoForm from "./TodoForm";
import { getTodo } from "../actions/todo";
import Todos from "./Todos";

export default async function Todo() {
  const todos = await getTodo();

  return (
    <Box sx={{ width: "100%", mx: "auto", padding: 2 }}>
      {/* Todo Form */}
      <TodoForm />

      {/* Display Todos */}
      <Todos todos={todos} />
    </Box>
  );
}
