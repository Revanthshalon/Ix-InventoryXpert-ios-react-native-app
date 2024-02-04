import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type JournalNavigationProp = NativeStackNavigationProp<
  JournalStackParamList,
  "CompanyDetails"
>;
type JournalRouteProp = RouteProp<JournalStackParamList, "CompanyDetails">;

const CompanyDetails = () => {
  const JournalNav = useNavigation<JournalNavigationProp>();
  const JournalRoute = useRoute<JournalRouteProp>();

  const companyId = JournalRoute.params.companyId;
  const companyDetails = useSelector((state: RootState) =>
    state.company.companies.find((c) => c.id === companyId)
  );

  return (
    <View>
      <Text>{companyDetails?.name}</Text>
    </View>
  );
};

export default CompanyDetails;

const styles = StyleSheet.create({});
