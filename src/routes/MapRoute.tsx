import React from "react";
import { View, Image, StyleSheet, Platform, Linking } from "react-native";
import { Button } from "react-native-paper";

import Scaffold from "../components/Scaffold";

const MapRoute: React.FC = () => {
  const openMaps = () => {
    let scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    Linking.openURL(scheme + "40.803983,-77.865197?q=Business Building");
  };

  return (
    <Scaffold title="Map">
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={require("../../assets/images/BuildingMap.png")}
        />
        <Button icon="map" onPress={openMaps}>
          Open Maps
        </Button>
      </View>
    </Scaffold>
  );
};

const styles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 80,
    paddingHorizontal: 10,
    alignContent: "center"
  },

  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain"
  }
});

export default MapRoute;
