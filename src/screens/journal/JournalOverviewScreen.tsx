import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FAB, Portal, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { useNavigation } from "@react-navigation/native";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "Overview"
>;

const JournalOverviewScreen = () => {
  const JournalNav = useNavigation<JournalNavigationProp>();

  // Action Button Control
  const [open, setOpen] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: useTheme().colors.background },
      ]}
    >
      <FAB.Group
        style={{ position: "absolute", bottom: 16, right: 16 }}
        open={open}
        visible
        icon={open ? "close" : "plus"}
        actions={[
          {
            icon: "office-building",
            label: "Add Company",
            onPress: () => {
              JournalNav.push("CompanyForm", { formType: "add" });
            },
          },
          {
            icon: "credit-card",
            label: "Add Payment",
            onPress: () => console.log("Pressed email"),
          },
          {
            icon: "cart",
            label: "Add Purchase",
            onPress: () => console.log("Pressed notifications"),
          },
        ]}
        onStateChange={({ open }) => setOpen(open)}
      />
    </View>
  );
};

export default JournalOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
