import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes/RootStack";
import { Button, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const OnboardingScreen = () => {
  // Navigation
  const RootStackNav = useNavigation<OnboardingNavigationProp>();

  const getStartedHandler = async () => {
    await AsyncStorage.setItem("IxOnboardingToken", "onboardingComplete");
    RootStackNav.replace("AppDrawer");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: useTheme().colors.background },
      ]}
    >
      <Button onPress={getStartedHandler}>Go to App</Button>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
