import { Text, View } from "react-native";
import React, { useContext } from "react";
import DbContext from "../context/DbContext";
import migrations from "../../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import useOnboarding from "../hooks/useOnboarding";
import * as SplashScreen from "expo-splash-screen";
import RootStack from "../routes/RootStack";
import LoadingScreen from "../screens/loading/LoadingScreen";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const db = useContext(DbContext);

  // State Variables
  const { success, error } = useMigrations(db!, migrations);
  const [onboardingStatus, loadingStatus] = useOnboarding();
  const [appReady, setAppReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    /**
     * Prepares the app by setting the app readiness state and hiding the splash screen.
     * If there is an error, the app readiness state is set to false.
     */
    const prepareApp = async () => {
      if (success && !loadingStatus) {
        setAppReady(true);
        await SplashScreen.hideAsync();
      } else if (error) {
        throw new Error(error.message);
      }
    };
    prepareApp();
  }, [loadingStatus, success, error]);

  if (!success && error !== undefined) {
    return <LoadingScreen />;
  }

  if (!appReady) {
    return null;
  }

  return <RootStack onboardingStatus={onboardingStatus} />;
};

export default RootLayout;
