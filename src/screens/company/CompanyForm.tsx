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
import { Appbar, FAB, TextInput, useTheme } from "react-native-paper";
import { Company } from "../../db/companySchema";
import DbContext from "../../context/DbContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  addNewCompany,
  fetchAllCompanies,
  updateCompanyById,
} from "../../redux/company/CompanySlice";
import { fetchCompanyById } from "../../redux/company/CompanyDetailsSlice";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "CompanyForm"
>;
type JournalRouterProp = RouteProp<JournalStackParamList, "CompanyForm">;

const CompanyForm = () => {
  const db = useContext(DbContext);

  const JournalRoute = useRoute<JournalRouterProp>();
  const JournalNav = useNavigation<JournalNavigationProp>();

  const formType = JournalRoute.params.formType;
  const companyId =
    formType === "edit" ? JournalRoute.params.companyId : undefined;

  const companyInfo = useSelector(
    (state: RootState) => state.companyDetails.company
  );
  const companiesData = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  const [companyDetails, setCompanyDetails] = React.useState<
    Company | undefined
  >(formType === "edit" ? companyInfo : undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<string>(
    companyInfo.existingBalance?.toString()!
  );

  const goBackHandler = () => {
    setCompanyDetails(undefined);
    JournalNav.goBack();
  };

  const saveCompanyHandler = async () => {
    if (formType === "edit") {
      dispatch(
        updateCompanyById({
          db: db!,
          id: companyDetails?.id!,
          company: companyDetails!,
        })
      );
      dispatch(fetchAllCompanies(db!));
      goBackHandler();
    }
    if (formType === "add") {
      dispatch(addNewCompany({ db: db!, company: companyDetails! }));
      companiesData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      companiesData.status = "idle";
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: useTheme().colors.background },
        ]}
      >
        <Appbar.Header mode="small" elevated>
          <Appbar.BackAction onPress={goBackHandler} />
          <Appbar.Content title="Company Form" />
        </Appbar.Header>
        <View style={[styles.formContainer]}>
          <TextInput
            mode="outlined"
            label="Company Name"
            placeholder="Enter Company Name"
            value={companyDetails?.name}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                name: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            label="GST Number"
            placeholder="Enter GST Number"
            value={companyDetails?.gstNo?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                gstNo: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            label="Address"
            placeholder="Enter Company Address"
            value={companyDetails?.address?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                address: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Contact Number"
            placeholder="Enter Contact Number"
            value={companyDetails?.phone?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                phone: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            label="Email ID"
            placeholder="Enter Email ID"
            value={companyDetails?.email?.toString()}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                email: e.nativeEvent.text,
              });
            }}
          />
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            label="Initial Balance"
            placeholder="Enter Initial Balance"
            value={amount}
            onChangeText={setAmount}
            onBlur={() => {
              setCompanyDetails({
                ...companyDetails!,
                existingBalance: parseFloat(amount),
              });
            }}
          />
        </View>
        <FAB
          icon="content-save"
          style={[styles.fab]}
          onPress={saveCompanyHandler}
          loading={loading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CompanyForm;

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
