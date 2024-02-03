import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useContext } from "react";
import { Appbar, useTheme } from "react-native-paper";
import { JournalStackParamList } from "../../routes/journal/JournalStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DbContext from "../../context/DbContext";
import { Payment, getPaymentById } from "../../db/paymentSchema";

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

  const [paymentDetails, setPaymentDetails] = React.useState<
    Payment | undefined
  >(undefined);

  React.useEffect(() => {
    const getPaymentDetails = async () => {
      if (paymentId) {
        const response = await getPaymentById(db!, paymentId);
        setPaymentDetails(response);
      }
    };
    getPaymentDetails();
  }, []);

  const goBackHandler = () => {
    setPaymentDetails(undefined);
    JournalNav.goBack();
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
          <Appbar.Content title="Payment Form" />
          <Appbar.Action icon="content-save" onPress={() => {}} />
        </Appbar.Header>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PaymentForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
