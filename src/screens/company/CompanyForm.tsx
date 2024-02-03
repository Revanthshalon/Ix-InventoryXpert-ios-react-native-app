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
import { Appbar, TextInput, useTheme } from "react-native-paper";
import { Company, getCompanyById, insertCompany } from "../../db/companySchema";
import DbContext from "../../context/DbContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addNewCompany } from "../../redux/company/CompanySlice";

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

  const [companyDetails, setCompanyDetails] = React.useState<
    Company | undefined
  >(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  const companiesData = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  if (companyId!) {
    const company = companiesData.companies.find((c) => c.id === companyId);
    if (company) {
      setCompanyDetails(company);
    }
  }

  const goBackHandler = () => {
    setCompanyDetails(undefined);
    JournalNav.goBack();
  };

  const saveCompanyHandler = async () => {
    if (formType === "edit") {
    }
    if (formType === "add") {
      dispatch(addNewCompany({ db: db!, company: companyDetails! }));
      companiesData.status === "loading" ? setLoading(true) : setLoading(false);
      goBackHandler();
      console.log(companiesData.companies);
      console.log(companiesData.status);
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
          <Appbar.Action
            icon="content-save"
            onPress={saveCompanyHandler}
            loading={loading}
          />
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
            label="Existing Balance"
            placeholder="Enter Existing Balance"
            value={companyDetails?.existingBalance?.toString()}
            onBlur={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              setCompanyDetails({
                ...companyDetails!,
                existingBalance: parseFloat(
                  e.nativeEvent.text === "" ? "0" : e.nativeEvent.text
                ),
              });
            }}
          />
        </View>
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
});
