import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import JournalStack from "../journal/JournalStack";
import { Icon, useTheme } from "react-native-paper";
import Support from "../../screens/support/Support";

export type AppDrawerParamList = {
  Journal: undefined;
  Support: undefined;
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
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen
        name="Journal"
        component={JournalStack}
        options={{
          drawerIcon: ({ size, color, focused }) => (
            <Icon
              source="notebook"
              size={size}
              color={focused ? useTheme().colors.primary : color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          drawerIcon: ({ size, color, focused }) => (
            <Icon
              source="account-tie-voice-outline"
              size={size}
              color={focused ? useTheme().colors.primary : color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
