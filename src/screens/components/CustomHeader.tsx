import { StyleSheet, View } from "react-native";
import React from "react";
import { IconButton, Text, useTheme } from "react-native-paper";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { AppDrawerParamList } from "../../routes/app/AppDrawer";

// Setting up the navigation prop type
type AppDrawerNavigationProps = DrawerNavigationProp<
  AppDrawerParamList,
  "Journal"
>;

const CustomHeader = () => {
  // Navigation Hook
  const AppDrawerNav = useNavigation<AppDrawerNavigationProps>();

  // Action Handlers
  const openDrawer = () => {
    AppDrawerNav.openDrawer();
  };
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: useTheme().colors.inverseOnSurface },
      ]}
    >
      <Text variant="headlineMedium" style={{ paddingBottom: 10 }}>
        Ix
      </Text>
      <IconButton
        icon="menu"
        size={30}
        style={{ margin: 0 }}
        onPress={openDrawer}
        iconColor={useTheme().colors.onBackground}
      />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
});
