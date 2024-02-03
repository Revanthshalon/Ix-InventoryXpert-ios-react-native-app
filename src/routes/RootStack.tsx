import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import AppDrawer from "./app/AppDrawer";

export type RootStackParamList = {
  Onboarding: undefined;
  AppDrawer: undefined;
};

type Props = {
  onboardingStatus: boolean;
};

const RootStack = (props: Props) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator
      initialRouteName={props.onboardingStatus ? "AppDrawer" : "Onboarding"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
    </Stack.Navigator>
  );
};

export default RootStack;
