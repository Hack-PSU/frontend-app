import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { AppLoading } from "expo";
import { MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import ProfileModal from "../modals/ProfileModal";

import HomeRoute from "../routes/HomeRoute";
import EventsRoute from "../routes/EventsRoute";
import WorkshopsRoute from "../routes/WorkshopsRoute";
import MapRoute from "../routes/MapRoute";

/**
 * TO ADD A ROUTE OR MODAL:
 *
 * import the component above, then add to either the 'const routes'
 * or 'const modals' above.
 */
const routes = {
  Home: createTabEntry(HomeRoute, "home"),
  Events: createTabEntry(EventsRoute, "event"),
  Workshops: createTabEntry(WorkshopsRoute, "group-work"),
  Map: createTabEntry(MapRoute, "map")
};

// https://github.com/react-navigation/material-bottom-tabs/blob/master/example/src/shared/tabBarIcon.tsx#L5
function createTabBarIcon(name: string) {
  return ({ tintColor }: { tintColor: string }) => (
    <MaterialIcons name={name} color={tintColor} size={24} />
  );
}

function createTabEntry(component, icon) {
  return {
    screen: component,
    // https://github.com/react-navigation/material-bottom-tabs/blob/master/src/types.tsx#L20
    navigationOptions: {
      tabBarIcon: createTabBarIcon(icon),
      activeColor: "white",
      inactiveColor: "rgba(255,255,255,0.6)"
    }
  };
}

const BottomTabsNavigator = createAppContainer(
  createMaterialBottomTabNavigator(routes, {
    initialRouteName: "Home"
  })
);

const styles = StyleSheet.create({
  homeModal: {
    flex: 1,
    backgroundColor: "white"
  }
});

const modals = {
  Home: {
    screen: BottomTabsNavigator,
    // This turns off the stack's header so we can use the
    // bottom tab one.
    navigationOptions: {
      header: null
    }
  },
  Profile: {
    screen: ProfileModal
  }
};

const StackNavigator = createAppContainer(createStackNavigator(modals, {}));

const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6A85B9",
    accent: "#F3613D",
    background: "#113654",
    text: "#FFFFFF"
  }
};

/**
 * `App` sets up the Material theme, fonts, system borders,
 * and acts as the primary navigation for the app.
 *
 * 1) Stack navigation: i.e. popup windows
 * 2) Bottom navigation bar
 * 3) Pane switching within bottom nav bar.
 */
const App: React.FC = () => {
  /**
   * Hi Rahul! ---> What this does:
   * 
   * 1) React has a thing called state where a component can hold certain data values.
   * Here, we're making a state variable that represents if the fonts are loaded.
   * The first variable is the actual value of the state, and the second variable
   * is the function to set it.
   *
   * 2) useEffect is called when the component renders for the first time.
   *
   * 3) When this happens, we load our custom fonts, and the function returns a Promise.
   * https://developers.google.com/web/fundamentals/primers/promises
   * This means that the operation will take some time and not complete instantly.
   *
   * 4) After that, we *then* set the loaded fonts to true, making the component re-render
   * (since we've changed the state) and our loading screen to disappear.
   */
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync({
      "Plex-Mono": require("../../assets/fonts/IBMPlexMono-Medium.otf"),
      Cornerstone: require("../../assets/fonts/Cornerstone.ttf")
    }).then(() => {
      setFontsLoaded(true);
    });
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <PaperProvider theme={theme}>
      <StackNavigator />
    </PaperProvider>
  );
};

export default App;
