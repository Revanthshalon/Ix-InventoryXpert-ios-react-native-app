/**
 * Custom hook for managing onboarding status.
 * This hook checks if the user has completed the onboarding process
 * by retrieving the onboarding token from AsyncStorage.
 * It returns the onboarding status and loading status as a tuple.
 *
 * @returns A tuple containing the onboarding status and loading status.
 */
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useOnboarding = () => {
  const [onboardingStatus, setOnboardingStatus] =
    React.useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = React.useState<boolean>(true);

  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingToken = await AsyncStorage.getItem("IxOnboardingToken");
        if (onboardingToken === "onboardingComplete") {
          setOnboardingStatus(true);
        } else {
          setOnboardingStatus(false);
        }
      } catch (error) {
        console.log("User not onboarded yet");
      } finally {
        setLoadingStatus(false);
      }
    };
    checkOnboarding();
  }, []);

  return [onboardingStatus, loadingStatus] as const;
};

export default useOnboarding;
