import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { FAB, Portal, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchAllCompanies } from "../../redux/company/CompanySlice";
import DbContext from "../../context/DbContext";
import { fetchAllPayments } from "../../redux/payment/paymentSlice";
import { fetchAllPurchases } from "../../redux/purchase/PurchaseSlice";
import CustomHeader from "../components/CustomHeader";
import CustomCardWithTable from "../components/CustomCardWithTable";
import { fetchUpcomingPayments } from "../../redux/journal/JournalSlice";

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
    dispatch(fetchAllPurchases(db!));
    dispatch(fetchUpcomingPayments(db!));
  }, []);

  const journalUpcomingPayments = useSelector(
    (state: RootState) => state.journal.upcomingPayments
  );
  const companiesData = useSelector(
    (state: RootState) => state.company.companies
  );
  const purchasesData = useSelector(
    (state: RootState) => state.purchase.purchases
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: useTheme().colors.background },
      ]}
    >
      <CustomHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginBottom: 40 }}
      >
        <ScrollView horizontal>
          <CustomCardWithTable
            cardTitle="Companies"
            setDefaultSortColumn="date"
            setDefaultSortDirection="ascending"
            dataMapping={[
              { column: "Company", key: "name" },
              {
                column: "Pending Amount",
                key: "existingBalance",
                customStyling: "currency",
              },
            ]}
            data={companiesData!}
            rowOnPress={(id: number) => {
              JournalNav.push("CompanyDetails", { companyId: id });
            }}
          />
        </ScrollView>
        <ScrollView horizontal>
          <CustomCardWithTable
            cardTitle="Upcoming Payments"
            cardSubtitle="this week"
            setDefaultSortColumn="date"
            setDefaultSortDirection="ascending"
            dataMapping={[
              { column: "Company", key: "name" },
              { column: "Due Date", key: "date", customStyling: "date" },
              { column: "Amount", key: "amount", customStyling: "currency" },
            ]}
            data={journalUpcomingPayments!}
            rowOnPress={(id: number) => {
              JournalNav.push("PaymentForm", {
                formType: "edit",
                paymentId: id,
              });
            }}
          />
        </ScrollView>
      </ScrollView>
      <FAB.Group
        style={{ position: "absolute" }}
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
