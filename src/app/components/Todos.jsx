"use client";

import React, { useEffect, useState } from "react";
import updateTaskStatus, { deleteTodo, getTodo } from "../actions/todo"; // assumed update API
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ArrowDropDown, Delete } from "@mui/icons-material";

export default function Todos({ todos }) {
  const handleToggleStatus = async (todoId, itemIndex) => {
    await updateTaskStatus(todoId, itemIndex);
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", padding: 2 }}>
      {todos && todos.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Your Todos
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: 3,
              justifyContent: "center",
              mx: "auto",
            }}
          >
            {todos.map((todo) => (
              <Box
                key={todo._id}
                sx={{
                  padding: 2,
                  borderRadius: 1,
                  boxShadow: 2,
                  mb: 3,
                  // backgroundColor: "#f9f9f9",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">{todo.title}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "gray", fontSize: 13 }}
                    >
                      Created on:{" "}
                      {new Date(todo.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() => deleteTodo(todo._id)}
                    sx={{
                      color: "red",
                      transition: "0.2s ease",
                      "&:hover": {
                        color: "#b30000",
                      },
                    }}
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <List sx={{ padding: 0 }}>
                  {todo.taskItems.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: "1px solid #e0e0e0",
                        paddingLeft: 0,
                        paddingRight: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <ListItemText
                        sx={{
                          flex: 1,
                          "& .MuiTypography-root": {
                            overflow: "auto",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            maxHeight: "4.5em",
                            lineHeight: "1.5em",
                          },
                        }}
                        primary={`${index + 1}) ${item.text}`}
                      />

                      <Select
                        value={item.completed ? "completed" : "pending"}
                        onChange={() => handleToggleStatus(todo._id, index)}
                        size="small"
                        variant="outlined"
                        sx={{
                          minWidth: 120,
                          fontSize: 14,
                          borderRadius: 1,
                          color: item.completed ? "green" : "red",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: item.completed ? "green" : "red",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: item.completed
                              ? "darkgreen"
                              : "darkred",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: item.completed ? "green" : "red",
                          },
                        }}
                      >
                        <MenuItem sx={{ color: "red" }} value="pending">
                          Pending
                        </MenuItem>
                        <MenuItem sx={{ color: "green" }} value="completed">
                          Completed
                        </MenuItem>
                      </Select>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
          No todos found.
        </Typography>
      )}
    </Box>
  );
}
