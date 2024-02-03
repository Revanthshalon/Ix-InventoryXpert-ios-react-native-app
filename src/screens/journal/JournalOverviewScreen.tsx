import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { FAB, Portal, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchAllCompanies } from "../../redux/company/CompanySlice";
import DbContext from "../../context/DbContext";
import { fetchAllPayments } from "../../redux/payment/paymentSlice";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "Overview"
>;

const JournalOverviewScreen = () => {
  const db = useContext(DbContext);

  const JournalNav = useNavigation<JournalNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();

  // Action Button Control
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchAllCompanies(db!));
    dispatch(fetchAllPayments(db!));
  }, []);

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
            onPress: () => {
              JournalNav.push("PaymentForm", { formType: "add" });
            },
          },
          {
            icon: "cart",
            label: "Add Purchase",
            onPress: () => {
              JournalNav.push("PurchaseForm", { formType: "add" });
            },
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
