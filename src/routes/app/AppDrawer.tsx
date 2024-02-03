import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import JournalStack from "../journal/JournalStack";

export type AppDrawerParamList = {
  Journal: undefined;
  Settings: undefined;
};

const AppDrawer = () => {
  const Drawer = createDrawerNavigator<AppDrawerParamList>();
  return (
    <Drawer.Navigator initialRouteName="Journal">
      <Drawer.Screen name="Journal" component={JournalStack} />
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
};

export default AppDrawer;
