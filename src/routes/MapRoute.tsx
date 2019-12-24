import React from "react";
import { View, Image, StyleSheet } from "react-native";

import Scaffold from "../components/Scaffold";

const MapRoute: React.FC = () => {
  return (
    <Scaffold title="Map">
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={require("../../assets/images/BuildingMap.png")}
        />
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
