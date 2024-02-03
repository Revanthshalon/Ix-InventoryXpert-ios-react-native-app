import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JournalOverviewScreen from "../../screens/journal/JournalOverviewScreen";
import CompanyForm from "../../screens/company/CompanyForm";
import PaymentForm from "../../screens/payments/PaymentForm";

export type JournalStackParamList = {
  Overview: undefined;
  CompanyForm: { formType: "add" } | { formType: "edit"; companyId: number };
  PaymentForm: { formType: "add" } | { formType: "edit"; paymentId: number };
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
      <Stack.Screen name="PaymentForm" component={PaymentForm} />
    </Stack.Navigator>
  );
};

export default JournalStack;
