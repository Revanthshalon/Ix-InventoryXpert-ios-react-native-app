import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useContext } from "react";
import {
  Appbar,
  FAB,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DbContext from "../../context/DbContext";
import { Payment } from "../../db/paymentSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import DropDown from "react-native-paper-dropdown";
import { DatePickerInput } from "react-native-paper-dates";
import { addNewPayment } from "../../redux/payment/paymentSlice";
import { fetchUpcomingPayments } from "../../redux/journal/JournalSlice";
import { fetchAllCompanies } from "../../redux/company/CompanySlice";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "PaymentForm"
>;
type JournalRouteProp = RouteProp<JournalStackParamList, "PaymentForm">;

const PaymentForm = () => {
  const db = useContext(DbContext);

  const JournalNav = useNavigation<JournalNavigationProp>();
  const JournalRoute = useRoute<JournalRouteProp>();

  const formType = JournalRoute.params.formType;
  const paymentId =
    formType === "edit" ? JournalRoute.params.paymentId : undefined;

  const paymentsData = useSelector((state: RootState) => state.payment);
  const companiesData = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  const [paymentDetails, setPaymentDetails] = React.useState<
    Payment | undefined
  >(paymentsData.payments.find((p) => p.id === paymentId));
  console.log(paymentDetails);
  const [showDropDown, setShowDropDown] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [companiesList, setCompaniesList] = React.useState<
    { label: string; value: number }[]
  >(
    companiesData.companies.map((company) => ({
      label: company.name,
      value: company.id,
    }))
  );

  const goBackHandler = () => {
    setPaymentDetails(undefined);
    JournalNav.goBack();
  };

  const savePaymentHandler = async () => {
    if (formType === "edit") {
    }
    if (formType === "add") {
      console.log(paymentDetails!);
      dispatch(addNewPayment({ db: db!, payment: paymentDetails! }));
      paymentsData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      paymentsData.status = "idle";
      dispatch(fetchUpcomingPayments(db!));
      dispatch(fetchAllCompanies(db!));
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
          <Appbar.Content
            title={`${formType === "add" ? "Add" : "Edit"} Payment`}
          />
          {formType === "edit" && (
            <Appbar.Action
              icon="trash-can"
              color={useTheme().colors.error}
              onPress={() => {}}
              loading={loading}
            />
          )}
        </Appbar.Header>
        <View style={[styles.formContainer]}>
          <DropDown
            mode="outlined"
            label={"Company"}
            visible={showDropDown}
            showDropDown={() => {
              setShowDropDown(true);
            }}
            onDismiss={() => setShowDropDown(false)}
            value={paymentDetails?.companyId}
            setValue={(value) => {
              setPaymentDetails({ ...paymentDetails!, companyId: value });
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
            value={paymentDetails?.amount?.toString()}
            onBlur={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPaymentDetails({
                ...paymentDetails!,
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
                paymentDetails?.date!
                  ? new Date(paymentDetails?.date!)
                  : undefined
              }
              onChange={(d) => {
                setPaymentDetails({
                  ...paymentDetails!,
                  date: d!.toISOString(),
                });
              }}
              inputMode="start"
            />
          </View>
          <TextInput
            label="Remarks"
            mode="outlined"
            multiline
            value={paymentDetails?.remarks?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setPaymentDetails({
                ...paymentDetails!,
                remarks: e.nativeEvent.text,
              });
            }}
          />
          <View
            style={[
              {
                flexDirection: "row",
                marginVertical: 20,
                marginHorizontal: 10,
                alignItems: "center",
                columnGap: 10,
              },
            ]}
          >
            <Text variant="titleSmall">Payment Status </Text>
            <Switch
              value={paymentDetails?.paymentStatus === "paid" ? true : false}
              onValueChange={(value) => {
                console.log(value);
                setPaymentDetails({
                  ...paymentDetails!,
                  paymentStatus: value ? "paid" : "pending",
                });
              }}
            />
          </View>
        </View>
        <FAB
          icon="content-save"
          style={[styles.fab]}
          onPress={savePaymentHandler}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PaymentForm;

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
