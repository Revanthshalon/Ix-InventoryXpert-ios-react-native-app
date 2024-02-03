import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JournalOverviewScreen from "../../screens/journal/JournalOverviewScreen";

export type JournalStackParamList = {
  Overview: undefined;
};

const JournalStack = () => {
  const Stack = createNativeStackNavigator<JournalStackParamList>();
  return (
    <Stack.Navigator initialRouteName="Overview">
      <Stack.Screen name="Overview" component={JournalOverviewScreen} />
    </Stack.Navigator>
  );
};

export default JournalStack;
