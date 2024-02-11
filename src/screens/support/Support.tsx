import { Linking, StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Card, Text, useTheme } from "react-native-paper";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppDrawerParamList } from "../../routes/app/AppDrawer";
import { useNavigation } from "@react-navigation/native";

type AppNavigationProp = DrawerNavigationProp<AppDrawerParamList, "Support">;

const Support = () => {
  const AppDrawerNav = useNavigation<AppNavigationProp>();
  return (
    <View style={{ flex: 1, backgroundColor: useTheme().colors.background }}>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Ix" titleStyle={{ fontSize: 30 }} />
        <Appbar.Action
          icon="menu"
          onPress={() => {
            AppDrawerNav.openDrawer();
          }}
        />
      </Appbar.Header>
      <View style={{ margin: 10 }}>
        <Card>
          <Card.Title title="Need Help?" />
          <Card.Content>
            <View>
              <Card.Cover
                source={{
                  uri: "https://picsum.photos/700",
                }}
              />
            </View>
            <Text
              style={{ paddingVertical: 10, paddingHorizontal: 3 }}
              variant="titleMedium"
            >
              If you need help with the app, please reach out to us at{" "}
              <Text
                variant="titleMedium"
                onPress={() => {
                  Linking.openURL("mailto:rapiddev.inc@gmail.com");
                }}
              >
                rapiddev.inc@gmail.com
              </Text>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({});
