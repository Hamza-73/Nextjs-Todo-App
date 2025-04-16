"use server";

import { revalidatePath } from "next/cache";
import { getCollection } from "../lib/db";
import { ObjectId } from "mongodb";
import { currentUser } from "@clerk/nextjs/server";

// Get all todos for current user
export async function getTodo() {
  const user = await currentUser();
  if (!user) {
    console.error("Authentication required");
    return [];
  }

  const todoCollection = await getCollection("todos");
  if (!todoCollection) {
    console.error("Todo collection not found");
    return [];
  }

  const todos = await todoCollection
    .find({ userId: user.id })
    .sort({ $natural: -1 })
    .toArray();

  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    createdAt: todo.createdAt?.toISOString?.() || null,
    updatedAt: todo.updatedAt?.toISOString?.() || null,
  }));
}

// Add a todo for current user
export async function addTodo(formData) {
  const user = await currentUser();
  if (!user) {
    console.error("Authentication required");
    return;
  }

  const title = formData.get("title");
  const taskItems = formData.getAll("taskItems").map((text) => ({
    text,
    status: "Pending", // default to Pending
  }));

  if (!title || title.trim() === "") throw new Error("Title is required");
  if (taskItems.length === 0 || taskItems.some((item) => !item.text.trim())) {
    throw new Error("All task items must be filled.");
  }

  const todo = {
    title,
    taskItems,
    userId: user.id,
    createdAt: new Date(),
  };

  const todoCollection = await getCollection("todos");
  await todoCollection.insertOne(todo);

  revalidatePath("/");
}

// Delete a todo by id if it belongs to current user
export async function deleteTodo(todoId) {
  const user = await currentUser();
  if (!user) {
    console.error("Authentication required");
    return;
  }

  const todoCollection = await getCollection("todos");
  if (!todoCollection) {
    console.error("Todo collection not found");
    return;
  }

  const todo = await todoCollection.findOne({
    _id: ObjectId.createFromHexString(todoId),
  });

  if (!todo || todo.userId !== user.id) {
    console.error("Todo not found or unauthorized");
    return;
  }

  await todoCollection.deleteOne({ _id: todo._id });

  revalidatePath("/");
}

// Update a task status in a todo
export default async function updateTaskStatus(todoId, itemIndex, newStatus) {
  console.log("start")
  const user = await currentUser();
  if (!user) {
    console.error("Authentication required");
    return { success: false };
  }

  const todoCollection = await getCollection("todos");
  const todo = await todoCollection.findOne({
    _id: ObjectId.createFromHexString(todoId),
  });

  if (!todo || todo.userId !== user.id) {
    console.error("Unauthorized access or todo not found");
    return { success: false };
  }

  const updatedTaskItems = todo.taskItems.map((item, index) => {
    if (index === itemIndex) {
      return {
        ...item,
        status: newStatus || "Pending",
      };
    }
    return item;
  });

  try {
    await todoCollection.updateOne(
      { _id: todo._id },
      { $set: { taskItems: updatedTaskItems } }
    );

    revalidatePath("/");
    return { success: true, updatedTaskItems };
  } catch (error) {
    console.error("Error updating todo:", error);
    return { success: false, error: "Failed to update todo" };
  }
}

export async function updateTaskText(todoId, itemIndex, newText) {
  const user = await currentUser();
  if (!user) {
    console.error("Authentication required");
    return { success: false };
  }

  const todoCollection = await getCollection("todos");
  const todo = await todoCollection.findOne({
    _id: ObjectId.createFromHexString(todoId),
  });

  if (!todo || todo.userId !== user.id) {
    console.error("Unauthorized or todo not found");
    return { success: false };
  }

  todo.taskItems[itemIndex].text = newText;

  try {
    await todoCollection.updateOne(
      { _id: todo._id },
      { $set: { taskItems: todo.taskItems } }
    );
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error updating task text:", err);
    return { success: false };
  }
}

export async function deleteTaskItem(todoId, itemIndex) {
  const user = await currentUser();
  const collection = await getCollection("todos");

  const todo = await collection.findOne({
    _id: ObjectId.createFromHexString(todoId),
  });

  if (todo?.userId !== user.id) return;

  todo.taskItems.splice(itemIndex, 1);

  await collection.updateOne(
    { _id: todo._id },
    { $set: { taskItems: todo.taskItems } }
  );

  revalidatePath("/");
}

export async function addTaskItem(todoId, text) {
  const user = await currentUser();
  const collection = await getCollection("todos");

  const todo = await collection.findOne({
    _id: ObjectId.createFromHexString(todoId),
  });

  if (todo?.userId !== user.id) return;

  todo.taskItems.push({ text, status: "Pending" });

  await collection.updateOne(
    { _id: todo._id },
    { $set: { taskItems: todo.taskItems } }
  );

  revalidatePath("/");
}
