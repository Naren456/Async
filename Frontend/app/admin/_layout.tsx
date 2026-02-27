import { Stack } from "expo-router";
import React from "react";

export default function AdminAppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="assignments" />
      <Stack.Screen name="subjects" />
      <Stack.Screen name="users" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="subjectForm" />
      <Stack.Screen name="assignmentForm" /> 
      <Stack.Screen name="uploadNotes" />
    </Stack>
  );
}