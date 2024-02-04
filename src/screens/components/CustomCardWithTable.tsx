import {
  FlatList,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { Button, DataTable, Surface, Text, useTheme } from "react-native-paper";
import { sortByProperty } from "../../utils/Utility";

type DataMapping = { column: string; key: string; customStyling?: string }[];

type CustomCardProps = {
  cardTitle: string;
  cardSubtitle?: string;
  containerStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  buttonContainer?: ViewStyle;
  buttonStyle?: ViewStyle;
  dataMapping: DataMapping;
  buttonAction?: () => void;
  rowOnPress?: (id: number) => void;
  data: any[];
  setDefaultSortColumn?: string;
  setDefaultSortDirection?: "ascending" | "descending";
};

const CustomCardWithTable = ({
  containerStyle,
  cardTitle,
  cardSubtitle,
  labelContainerStyle,
  dataMapping,
  buttonStyle,
  data,
  buttonAction,
  rowOnPress,
  setDefaultSortColumn,
  setDefaultSortDirection,
}: CustomCardProps) => {
  // Screen Dimensions
  const { width, height } = useWindowDimensions();

  // Sort State
  const [sortColumn, setSortColumn] = React.useState<string>(
    setDefaultSortColumn || "id"
  );
  const [sortDirection, setSortDirection] = React.useState<
    "ascending" | "descending"
  >(setDefaultSortDirection || "ascending");

  const sortedData = sortByProperty(
    data,
    sortColumn,
    sortDirection === "ascending"
  );

  return (
    <Surface
      style={[
        styles.containerStyle,
        containerStyle,
        {
          backgroundColor: useTheme().colors.background,
          borderColor: useTheme().colors.outline,
          width: width - 20,
        },
      ]}
    >
      <View style={[styles.labelContainer, labelContainerStyle]}>
        <Text variant="headlineMedium">{cardTitle}</Text>
        {cardSubtitle && <Text variant="titleSmall">{cardSubtitle}</Text>}
      </View>
      <DataTable>
        <DataTable.Header>
          {dataMapping.map((mapping, index) => {
            return (
              <DataTable.Title
                key={index}
                sortDirection={
                  mapping.key === sortColumn ? sortDirection : undefined
                }
                onPress={() => {
                  if (mapping.key === sortColumn) {
                    setSortDirection(
                      sortDirection === "ascending" ? "descending" : "ascending"
                    );
                  } else {
                    setSortColumn(mapping.key);
                    setSortDirection("descending");
                  }
                }}
              >
                {mapping.column}
              </DataTable.Title>
            );
          })}
        </DataTable.Header>
        <FlatList
          style={{ height: 200, marginVertical: 5 }}
          data={sortedData}
          renderItem={({ item }) => {
            return (
              <DataTable.Row
                onPress={() => {
                  rowOnPress ? rowOnPress(item?.id) : null;
                }}
              >
                {dataMapping.map((mapping, index) => {
                  return (
                    <DataTable.Cell key={index}>
                      {mapping.customStyling === "currency"
                        ? parseFloat(item[mapping.key]).toLocaleString(
                            "en-IN",
                            { style: mapping.customStyling, currency: "INR" }
                          )
                        : mapping.customStyling === "date"
                        ? new Date(item[mapping.key]).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )
                        : item[mapping.key]}
                    </DataTable.Cell>
                  );
                })}
              </DataTable.Row>
            );
          }}
        />
      </DataTable>
      {/* <View style={[styles.buttonContainer]}>
        <Button
          style={[styles.buttonStyle, buttonStyle]}
          mode="outlined"
          onPress={buttonAction}
        >
          View All
        </Button>
      </View> */}
    </Surface>
  );
};

export default CustomCardWithTable;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    margin: 10,
    maxHeight: 400,
    paddingBottom: 10,
  },
  labelContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonStyle: {
    marginHorizontal: 5,
  },
});
