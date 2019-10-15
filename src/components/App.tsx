import React from "react";
import { StyleSheet, View } from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import { MaterialIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

import HomeRoute from "../routes/HomeRoute"
import EventsRoute from "../routes/EventsRoute"
import WorkshopsRoute from "../routes/WorkshopsRoute"
import MapRoute from "../routes/MapRoute"

function createTabEntry(component, icon) {
  const tabBarIcon = <MaterialIcons name={icon} color="white" size={24} />

  return {
    screen: component,
    navigationOptions: {
      tabBarIcon
    }
  }
}

const BottomTabsNavigator = createAppContainer(
  createMaterialBottomTabNavigator(
    {
      Home: createTabEntry(HomeRoute, "home"),
      Events: createTabEntry(EventsRoute, "event"),
      Workshops: createTabEntry(WorkshopsRoute, "share"),
      Map: createTabEntry(MapRoute, "map")
    },
    {
      initialRouteName: "Home"
    }
  )
);

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "white"
  }
});

/**
 * Technically, what we consider the bottom navigation bar &
 * home screen are a modal that doesn't move.
 */
const HomeModal: React.FC = () => {
  return (
    <View style={styles.home}>
      <BottomTabsNavigator />
    </View>
  );
};

const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: HomeModal,
        // This turns off the stack's header so we can use the
        // bottom tab one.
        navigationOptions: {
          header: null
        }
      }
    },
    {}
  )
);

/**
 * `App` sets up the Material theme, system borders,
 * and acts as the primary navigation for the app.
 *
 * 1) Stack navigation: i.e. popup windows
 * 2) Bottom navigation bar
 * 3) Pane switching within bottom nav bar.
 */
const App: React.FC = () => {
  return (
    <PaperProvider>
      <StackNavigator />
    </PaperProvider>
  );
};

export default App;
