/**
 * A context for managing the database connection in the application.
 * The context provides access to the ExpoSQLiteDatabase instance.
 */
import React from "react";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

const DbContext = React.createContext<
  ExpoSQLiteDatabase<Record<string, never>> | undefined
>(undefined);

export default DbContext;
