import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import JournalStack from "../journal/JournalStack";
import { useTheme } from "react-native-paper";
import OnboardingScreen from "../../screens/onboarding/OnboardingScreen";

export type AppDrawerParamList = {
  Journal: undefined;
  Settings: undefined;
};

const AppDrawer = () => {
  const Drawer = createDrawerNavigator<AppDrawerParamList>();
  return (
    <Drawer.Navigator
      initialRouteName="Journal"
      screenOptions={{
        drawerPosition: "right",
        drawerType: "front",
        headerShown: false,
        drawerContentStyle: {
          backgroundColor: useTheme().colors.background,
        },
        drawerActiveTintColor: useTheme().colors.primary,
        drawerInactiveTintColor: useTheme().colors.onBackground,
      }}
    >
      <Drawer.Screen name="Journal" component={JournalStack} />
      <Drawer.Screen name="Settings" component={OnboardingScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
