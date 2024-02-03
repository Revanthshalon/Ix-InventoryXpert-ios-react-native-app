import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootLayout from "./src/layouts/RootLayout";
import DbContext from "./src/context/DbContext";
import { openDatabaseSync } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";

/**
 * The main component of the application.
 * It initializes the database and provides the database context to the child components.
 */
const App = () => {
  /**
   * The database context.
   */
  const expoDb = openDatabaseSync("inventoryXpert.db");
  const db = drizzle(expoDb);
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <DbContext.Provider value={db}>
            <RootLayout />
          </DbContext.Provider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
