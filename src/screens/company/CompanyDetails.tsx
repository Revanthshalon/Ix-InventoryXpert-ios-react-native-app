import { StyleSheet, View } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import CompanyInfoCard from "./components/CompanyInfoCard";

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

  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);

  const deleteHandler = () => {
    // Delete the company and related purchase and payment details
    console.log("Delete the company and related purchase and payment details");
    closeDeleteAlert();
    JournalNav.goBack();
  };

  const closeDeleteAlert = () => {
    setShowDeleteAlert(false);
  };

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
      <CompanyInfoCard companyDetails={companyDetails!} />
    </View>
  );
};

export default CompanyDetails;

const styles = StyleSheet.create({});
