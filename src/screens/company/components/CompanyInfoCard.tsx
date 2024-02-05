import { StyleSheet, View, Linking } from "react-native";
import React, { useContext } from "react";
import { Company } from "../../../db/companySchema";
import { IconButton, Surface, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../../routes/journal/JournalStack";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchCompanyById } from "../../../redux/company/CompanyDetailsSlice";
import DbContext from "../../../context/DbContext";

type CompanyInfoProps = {
  companyDetails: Company;
};

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "CompanyDetails"
>;

const CompanyInfoCard = ({ companyDetails }: CompanyInfoProps) => {
  const JournalNav = useNavigation<JournalNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const db = useContext(DbContext);

  const editCompanyDetails = () => {
    dispatch(fetchCompanyById({ db: db!, id: companyDetails.id! }));
    JournalNav.push("CompanyForm", {
      formType: "edit",
      companyId: companyDetails.id,
    });
  };

  const emailToCompany = () => {
    Linking.openURL(`mailto:${companyDetails.email}`);
  };

  const callCompany = () => {
    Linking.openURL(`tel:${companyDetails.phone}`);
  };

  const chatWithCompany = () => {
    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${companyDetails.phone}`
    );
  };

  return (
    <Surface elevation={3} style={[styles.container]}>
      <View style={[styles.bodyContainer]}>
        <Text variant="headlineMedium" style={[styles.header]}>
          {companyDetails?.name}
        </Text>
        {companyDetails?.phone && (
          <Text variant="titleMedium">Contact: {companyDetails.phone}</Text>
        )}
        {companyDetails?.gstNo && (
          <Text variant="titleMedium">GST No: {companyDetails.gstNo}</Text>
        )}
        <Text variant="titleMedium">
          Pending Balance:{" "}
          {companyDetails?.existingBalance.toLocaleString("en-In", {
            style: "currency",
            currency: "INR",
          })}
        </Text>
        <View style={[styles.buttonContainer]}>
          <View>
            <IconButton icon="pencil" onPress={editCompanyDetails} />
          </View>
          <View style={[styles.actionContainer]}>
            {companyDetails?.email && (
              <IconButton icon="email" onPress={emailToCompany} />
            )}
            {companyDetails?.phone && (
              <IconButton icon="phone" onPress={callCompany} />
            )}
            {companyDetails?.phone && (
              <IconButton icon="chat" onPress={chatWithCompany} />
            )}
          </View>
        </View>
      </View>
    </Surface>
  );
};

export default CompanyInfoCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    maxHeight: 300,
    borderRadius: 10,
  },
  bodyContainer: {
    margin: 10,
    rowGap: 10,
  },
  header: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
