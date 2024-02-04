import { StyleSheet, View } from "react-native";
import React from "react";
import { Company } from "../../../db/companySchema";
import { IconButton, Surface, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JournalStackParamList } from "../../../routes/journal/JournalStack";
import { useNavigation } from "@react-navigation/native";

type CompanyInfoProps = {
  companyDetails: Company;
};

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "CompanyDetails"
>;

const CompanyInfoCard = ({ companyDetails }: CompanyInfoProps) => {
  const JournalNav = useNavigation<JournalNavigationProp>();

  const editCompanyDetails = () => {
    JournalNav.push("CompanyForm", {
      formType: "edit",
      companyId: companyDetails.id,
    });
  };
  return (
    <Surface elevation={3} style={[styles.container]}>
      <View style={[styles.bodyContainer]}>
        <Text variant="headlineMedium" style={[styles.header]}>
          {companyDetails.name}
        </Text>
        {companyDetails.phone && (
          <Text variant="titleMedium">Contact:{companyDetails.phone}</Text>
        )}
        {companyDetails.gstNo && (
          <Text variant="titleMedium">GST No.{companyDetails.gstNo}</Text>
        )}
        <Text variant="titleMedium">
          Pending Balance:
          {companyDetails.existingBalance.toLocaleString("en-In", {
            style: "currency",
            currency: "INR",
          })}
        </Text>
        <View style={[styles.buttonContainer]}>
          <View>
            <IconButton icon="pencil" onPress={editCompanyDetails} />
          </View>
          <View style={[styles.actionContainer]}>
            {companyDetails.email && (
              <IconButton icon="email" onPress={() => {}} />
            )}
            {companyDetails.phone && (
              <IconButton icon="phone" onPress={() => {}} />
            )}
            {companyDetails.phone && (
              <IconButton icon="chat" onPress={() => {}} />
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
