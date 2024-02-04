import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DbContext from "../../context/DbContext";
import { Purchase } from "../../db/purchaseSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  Appbar,
  Button,
  Dialog,
  FAB,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { DatePickerInput } from "react-native-paper-dates";
import {
  addNewPurchase,
  deletePurchaseById,
  updatePurchaseById,
} from "../../redux/purchase/PurchaseSlice";
import { fetchAllCompanies } from "../../redux/company/CompanySlice";
import { fetchRelatedPurchases } from "../../redux/company/RelatedPurchasesSlice";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "PurchaseForm"
>;
type JournalRouterProp = RouteProp<JournalStackParamList, "PurchaseForm">;

const PurchaseForm = () => {
  const db = useContext(DbContext);

  const JournalNav = useNavigation<JournalNavigationProp>();
  const JournalRoute = useRoute<JournalRouterProp>();

  const formType = JournalRoute.params.formType;
  const purchaseId =
    formType === "edit" ? JournalRoute.params.purchaseId : undefined;

  const purchasesData = useSelector((state: RootState) => state.purchase);
  const companiesData = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  const [purchaseDetails, setPurchaseDetails] = React.useState<
    Purchase | undefined
  >(purchasesData.purchases.find((p) => p.id === purchaseId));
  const [showDropDown, setShowDropDown] = React.useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [purchaseAmount, setPurchaseAmount] = React.useState<
    string | undefined
  >(purchaseDetails?.amount?.toString());
  const [companiesList, setCompaniesList] = React.useState<
    { label: string; value: number }[]
  >(
    companiesData.companies.map((company) => ({
      label: company.name,
      value: company.id,
    }))
  );

  const goBackHandler = () => {
    setPurchaseDetails(undefined);
    JournalNav.goBack();
  };

  const savePurchaseHandler = async () => {
    if (formType === "edit") {
      dispatch(
        updatePurchaseById({
          db: db!,
          id: purchaseDetails!.id,
          purchase: purchaseDetails!,
        })
      );
      purchasesData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      purchasesData.status = "idle";
      dispatch(fetchAllCompanies(db!));
      dispatch(
        fetchRelatedPurchases({
          db: db!,
          companyId: purchaseDetails!.companyId!,
        })
      );
    }
    if (formType === "add") {
      dispatch(addNewPurchase({ db: db!, purchase: purchaseDetails! }));
      purchasesData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      purchasesData.status = "idle";
      dispatch(fetchAllCompanies(db!));
    }
  };

  const deleteHandler = () => {
    dispatch(deletePurchaseById({ db: db!, id: purchaseDetails!.id }));
    dispatch(
      fetchRelatedPurchases({ db: db!, companyId: purchaseDetails!.companyId! })
    );
    closeDeleteAlert();
    JournalNav.goBack();
  };

  const closeDeleteAlert = () => {
    setShowDeleteAlert(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          { backgroundColor: useTheme().colors.background },
        ]}
      >
        <Appbar.Header mode="small" elevated>
          <Appbar.BackAction onPress={goBackHandler} />
          <Appbar.Content
            title={`${formType === "add" ? "Add" : "Edit"} Purchase`}
          />
          {formType === "edit" && (
            <Appbar.Action
              icon="trash-can"
              color={useTheme().colors.error}
              onPress={() => {
                setShowDeleteAlert(true);
              }}
            />
          )}
        </Appbar.Header>
        <Portal>
          <Dialog visible={showDeleteAlert}>
            <Dialog.Title>Warning</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to delete purchase details?
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
        <View style={styles.formContainer}>
          <DropDown
            mode="outlined"
            label={"Company"}
            visible={showDropDown}
            showDropDown={() => {
              setShowDropDown(true);
            }}
            onDismiss={() => setShowDropDown(false)}
            value={purchaseDetails?.companyId}
            setValue={(value) => {
              setPurchaseDetails({ ...purchaseDetails!, companyId: value });
            }}
            list={companiesList}
            dropDownItemTextStyle={{
              color: useTheme().colors.onBackground,
            }}
          />
          <TextInput
            mode="outlined"
            label="Amount"
            placeholder="Enter Amount"
            value={purchaseAmount}
            onChangeText={setPurchaseAmount}
            onBlur={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPurchaseDetails({
                ...purchaseDetails!,
                amount: parseFloat(purchaseAmount!),
              });
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <DatePickerInput
              mode="outlined"
              locale="en-GB"
              label="Payment Date"
              value={
                purchaseDetails?.date!
                  ? new Date(purchaseDetails?.date!)
                  : undefined
              }
              onChange={(d) => {
                setPurchaseDetails({
                  ...purchaseDetails!,
                  date: d!.toISOString(),
                });
              }}
              inputMode="start"
            />
          </View>
          <TextInput
            mode="outlined"
            label="Bill no."
            placeholder="Enter Bill No."
            value={purchaseDetails?.billNo?.toString()}
            onBlur={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPurchaseDetails({
                ...purchaseDetails!,
                billNo: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            label="Remarks"
            mode="outlined"
            multiline
            value={purchaseDetails?.remarks?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPurchaseDetails({
                ...purchaseDetails!,
                remarks: e.nativeEvent.text,
              });
            }}
          />
        </View>
        <FAB
          icon="content-save"
          style={[styles.fab]}
          onPress={savePurchaseHandler}
          loading={loading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PurchaseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 10,
    rowGap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    columnGap: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 20,
  },
});
