"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { addTodo } from "../actions/todo";

const TodoForm = () => {
  const [title, setTitle] = useState("");
  const [taskItems, setTaskItems] = useState([{ text: "" }]);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleChange = (index, value) => {
    const updated = [...taskItems];
    updated[index].text = value;
    setTaskItems(updated);
  };

  const handleAdd = () => {
    if (taskItems[taskItems.length - 1].text.trim() === "") {
      alert("Please fill out the current task item before adding another.");
      return;
    }
    setTaskItems([...taskItems, { text: "" }]);
  };

  const handleRemove = (index) => {
    const updated = taskItems.filter((_, i) => i !== index);
    setTaskItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object and append data
    const formData = new FormData();
    formData.append("title", title);
    taskItems.forEach((item, index) => {
      formData.append("taskItems", item.text);
    });

    try {
      // Call the addTodo function with the form data
      await addTodo(formData);

      // Reset the form after successful submission
      setTitle("");
      setTaskItems([{ text: "" }])
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to save todo task. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          mx: "auto",
          mt: 4,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: "70vw",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Create New Todo Task
        </Typography>

        <TextField
          fullWidth
          label="Todo Title"
          name="title"
          required={true}
          value={title}
          onChange={handleTitleChange}
          sx={{
            mb: 3,
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
        />

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Add Task Items
        </Typography>
        {taskItems.map((taskItem, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
              borderRadius: 1,
              padding: 2,
              boxShadow: 1,
            }}
          >
            <TextField
              fullWidth
              label={`Task Item ${index + 1}`}
              name="taskItems"
              value={taskItem.text}
              onChange={(e) => handleChange(index, e.target.value)}
              sx={{ borderRadius: 1 }}
              required={true}
            />
            <IconButton
              onClick={() => handleRemove(index)}
              disabled={taskItems.length === 1}
              color="error"
              sx={{
                borderRadius: 1,
                "&:hover": { backgroundColor: "#f44336" },
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleAdd}
            startIcon={<Add />}
            variant="outlined"
            sx={{ flex: 1 }}
          >
            Add Task Item
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TodoForm;
