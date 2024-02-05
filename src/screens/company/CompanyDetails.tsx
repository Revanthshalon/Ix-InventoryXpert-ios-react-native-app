import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import CompanyInfoCard from "./components/CompanyInfoCard";
import CustomCardWithTable from "../components/CustomCardWithTable";
import { fetchRelatedPurchases } from "../../redux/company/RelatedPurchasesSlice";
import DbContext from "../../context/DbContext";
import { fetchRelatedPayments } from "../../redux/company/RelatedPaymentSlice";
import {
  deleteCompanyById,
  fetchAllCompanies,
} from "../../redux/company/CompanySlice";
import { fetchUpcomingPayments } from "../../redux/journal/JournalSlice";
import { fetchCompanyById } from "../../redux/company/CompanyDetailsSlice";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "CompanyDetails"
>;
type JournalRouteProp = RouteProp<JournalStackParamList, "CompanyDetails">;

const CompanyDetails = () => {
  const db = useContext(DbContext);

  const JournalNav = useNavigation<JournalNavigationProp>();
  const JournalRoute = useRoute<JournalRouteProp>();

  const companyId = JournalRoute.params.companyId;
  const companyDetails = useSelector((state: RootState) =>
    state.company.companies.find((c) => c.id === companyId)
  );

  const companyRelatedPurchases = useSelector(
    (state: RootState) => state.relatedPurchases.relatedPurchases
  );
  const companyRelatedPayments = useSelector(
    (state: RootState) => state.relatedPayments.relatedPayments
  );
  const dispatch = useDispatch<AppDispatch>();

  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);

  const deleteHandler = () => {
    // Delete the company and related purchase and payment details
    console.log("Delete the company and related purchase and payment details");
    dispatch(deleteCompanyById({ db: db!, id: companyId! }));
    dispatch(fetchAllCompanies(db!));
    dispatch(fetchUpcomingPayments(db!));
    closeDeleteAlert();
    JournalNav.goBack();
  };

  const closeDeleteAlert = () => {
    setShowDeleteAlert(false);
  };

  React.useEffect(() => {
    dispatch(fetchRelatedPurchases({ db: db!, companyId }));
    dispatch(fetchRelatedPayments({ db: db!, companyId }));
    dispatch(fetchCompanyById({ db: db!, id: companyId }));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: useTheme().colors.background }}>
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={() => JournalNav.goBack()} />
        <Appbar.Content title="Company Details" />
        <Appbar.Action
          icon="trash-can"
          onPress={() => {
            setShowDeleteAlert(true);
          }}
          iconColor={useTheme().colors.error}
        />
      </Appbar.Header>
      <Portal>
        <Dialog visible={showDeleteAlert}>
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete the company and related purchase
              and payment details?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDeleteAlert}>Cancel</Button>
            <Button mode="contained" onPress={deleteHandler}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView
        style={[{ marginBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <CompanyInfoCard companyDetails={companyDetails!} />
        <ScrollView horizontal>
          <CustomCardWithTable
            cardTitle="Related Purchases"
            data={companyRelatedPurchases}
            dataMapping={[
              { column: "Date", key: "date", customStyling: "date" },
              {
                column: "Amount",
                key: "amount",
                customStyling: "currency",
              },
            ]}
            rowOnPress={(id: number) => {
              JournalNav.push("PurchaseForm", {
                formType: "edit",
                purchaseId: id,
              });
            }}
          />
        </ScrollView>
        <ScrollView horizontal>
          <CustomCardWithTable
            cardTitle="Related Payments"
            data={companyRelatedPayments}
            dataMapping={[
              { column: "Date", key: "date", customStyling: "date" },
              {
                column: "Amount",
                key: "amount",
                customStyling: "currency",
              },
              {
                column: "Status",
                key: "paymentStatus",
              },
            ]}
            rowOnPress={(id: number) => {
              JournalNav.push("PaymentForm", {
                formType: "edit",
                paymentId: id,
              });
            }}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default CompanyDetails;

const styles = StyleSheet.create({});
