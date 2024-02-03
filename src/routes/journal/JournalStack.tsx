import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JournalOverviewScreen from "../../screens/journal/JournalOverviewScreen";
import CompanyForm from "../../screens/company/CompanyForm";

export type JournalStackParamList = {
  Overview: undefined;
  CompanyForm: { formType: "edit" | "add" };
};

const JournalStack = () => {
  const Stack = createNativeStackNavigator<JournalStackParamList>();
  return (
    <Stack.Navigator
      initialRouteName="Overview"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Overview" component={JournalOverviewScreen} />
      <Stack.Screen name="CompanyForm" component={CompanyForm} />
    </Stack.Navigator>
  );
};

export default JournalStack;
