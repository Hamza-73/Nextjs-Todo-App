"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Select,
  MenuItem,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import {
  Delete,
  Edit,
  Check,
  Close,
  Add as AddIcon,
} from "@mui/icons-material";
import updateTaskStatus, {
  deleteTodo,
  updateTaskText,
  deleteTaskItem,
  addTaskItem,
} from "../actions/todo";

export default function Todos({ todos }) {
  const [editing, setEditing] = useState({ todoId: null, itemIndex: null });
  const [editedText, setEditedText] = useState("");
  const [newItemText, setNewItemText] = useState({});
  const [addingItemId, setAddingItemId] = useState(null);

  const isEditing = (todoId, index) =>
    editing.todoId === todoId && editing.itemIndex === index;

  const handleEditClick = (todoId, index, currentText) => {
    setEditing({ todoId, itemIndex: index });
    setEditedText(currentText);
  };

  const handleCancelEdit = () => {
    setEditing({ todoId: null, itemIndex: null });
    setEditedText("");
  };

  const handleConfirmEdit = async () => {
    if (editedText.trim() === "") return;
    await updateTaskText(editing.todoId, editing.itemIndex, editedText.trim());
    handleCancelEdit();
  };

  const handleStatusChange = async (todoId, itemIndex, newStatus) => {
    await updateTaskStatus(todoId, itemIndex, newStatus);
  };

  const handleAddTaskItem = async (todoId) => {
    const text = newItemText[todoId]?.trim();
    if (!text) return;

    await addTaskItem(todoId, text);
    setNewItemText((prev) => ({ ...prev, [todoId]: "" }));
    setAddingItemId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "red";
      case "In Progress":
        return "orange";
      case "Completed":
        return "green";
      default:
        return "black";
    }
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
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "#f9f9f9",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": {
                    cursor: "pointer",
                    boxShadow: 6,
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
                      "&:hover": {
                        color: "#b30000",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <List sx={{ padding: 0 }}>
                    {todo.taskItems.map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderBottom: "1px solid #e0e0e0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          {isEditing(todo._id, index) ? (
                            <Stack direction="row" spacing={1}>
                              <TextField
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                size="small"
                                fullWidth
                                autoFocus
                              />
                              <IconButton
                                onClick={handleConfirmEdit}
                                color="success"
                              >
                                <Check />
                              </IconButton>
                              <IconButton
                                onClick={handleCancelEdit}
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                "&:hover .edit-icon": { opacity: 1 },
                              }}
                            >
                              <Typography
                                onClick={() =>
                                  handleEditClick(todo._id, index, item.text)
                                }
                                sx={{
                                  flex: 1,
                                  cursor: "pointer",
                                  transition: "color 0.2s ease",
                                }}
                              >
                                {index + 1}) {item.text}
                              </Typography>
                              <IconButton
                                className="edit-icon"
                                sx={{ opacity: 0, ml: 1 }}
                                onClick={() =>
                                  handleEditClick(todo._id, index, item.text)
                                }
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        <Select
                          value={item.status || "Pending"} // Added default fallback
                          onChange={(e) =>
                            handleStatusChange(todo._id, index, e.target.value)
                          }
                          size="small"
                          variant="outlined" // Use outlined variant for better border styling
                          sx={{
                            minWidth: 120,
                            fontSize: 14,
                            borderRadius: 1,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: getStatusColor(item.status, true), // Darker border color
                            },
                            color: getStatusColor(item.status), // Apply text color based on status
                          }}
                        >
                          <MenuItem value="Pending" style={{ color: "red" }}>
                            Pending
                          </MenuItem>
                          <MenuItem
                            value="In Progress"
                            style={{ color: "orange" }}
                          >
                            In Progress
                          </MenuItem>
                          <MenuItem
                            value="Completed"
                            style={{ color: "green" }}
                          >
                            Completed
                          </MenuItem>
                        </Select>

                        <IconButton
                          onClick={() => deleteTaskItem(todo._id, index)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {addingItemId === todo._id ? (
                  <Stack direction="row" spacing={1} mt={2}>
                    <TextField
                      placeholder="New Task"
                      size="small"
                      value={newItemText[todo._id] || ""}
                      onChange={(e) =>
                        setNewItemText((prev) => ({
                          ...prev,
                          [todo._id]: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleAddTaskItem(todo._id)}
                      color="success"
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      onClick={() => setAddingItemId(null)}
                      color="error"
                    >
                      <Close />
                    </IconButton>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setAddingItemId(todo._id)}
                    sx={{ mt: 2 }}
                  >
                    Add Task Item
                  </Button>
                )}
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
