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
    marginTop: 20,
    marginBottom: 50,
    justifyContent: "center",
    flexDirection: "row"
  },

  image: {
    flex: 1,
    height: "80%",
    resizeMode: "contain"
  }
});

export default MapRoute;
