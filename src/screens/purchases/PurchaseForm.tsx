import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
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
import { Appbar, TextInput, useTheme } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { DatePickerInput } from "react-native-paper-dates";
import { addNewPurchase } from "../../redux/purchase/PurchaseSlice";

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

  const [purchaseDetails, setPurchaseDetails] = React.useState<
    Purchase | undefined
  >(undefined);
  const [showDropDown, setShowDropDown] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const purchasesData = useSelector((state: RootState) => state.purchase);
  const companiesData = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  const companiesList = companiesData.companies.map((company) => ({
    label: company.name,
    value: company.id,
  }));

  if (purchaseId!) {
    const purchase = purchasesData.purchases.find((p) => p.id === purchaseId);
    if (purchase) {
      setPurchaseDetails(purchase);
    }
  }

  const goBackHandler = () => {
    setPurchaseDetails(undefined);
    JournalNav.goBack();
  };

  const savePurchaseHandler = async () => {
    if (formType === "edit") {
    }
    if (formType === "add") {
      dispatch(addNewPurchase({ db: db!, purchase: purchaseDetails! }));
      purchasesData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      purchasesData.status = "idle";
    }
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
          <Appbar.Content title="Add Purchase" />
          <Appbar.Action icon="content-save" onPress={savePurchaseHandler} />
        </Appbar.Header>
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
            value={purchaseDetails?.amount?.toString()}
            onBlur={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPurchaseDetails({
                ...purchaseDetails!,
                amount: parseFloat(e.nativeEvent.text),
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
});
