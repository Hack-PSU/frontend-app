import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  Modal
} from "react-native";
import { Button } from "react-native-paper";
// https://github.com/ascoders/react-native-image-viewer
import ImageViewer from "react-native-image-zoom-viewer";

import Scaffold from "../components/Scaffold";

const MapRoute: React.FC = () => {
  const businessBuildingImagePath = "../../assets/images/BuildingMap.png";
  // The modal is used for the image zoom viewer
  const [isModalVisible, changeIsModalVisible] = useState(false);

  // Opens phone's default map app with the address for the Business Building
  const openMaps = () => {
    let scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    Linking.openURL(scheme + "40.803983,-77.865197?q=Business Building");
  };

  // This is needed for image zoom viewer
  const image = [
    {
      url: "",
      props: {
        source: require(businessBuildingImagePath)
      }
    }
  ];

  return (
    <Scaffold title="Map">
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => changeIsModalVisible(false)}
      >
        <ImageViewer
          imageUrls={image}
          onClick={() => changeIsModalVisible(false)}
          enableSwipeDown={true}
          onCancel={() => changeIsModalVisible(false)}
        />
      </Modal>

      <View style={styles.root}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => changeIsModalVisible(true)}
        >
          <Image
            style={styles.image}
            source={require(businessBuildingImagePath)}
          />
        </TouchableOpacity>

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

  touchable: {
    flex: 1,
    width: "100%"
  },

  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain"
  }
});

export default MapRoute;
