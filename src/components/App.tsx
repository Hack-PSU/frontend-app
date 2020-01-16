import React, { useEffect } from "react";
import { YellowBox, StatusBar } from "react-native";

import { observer } from "mobx-react";

import { AppLoading } from "expo";
import { MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";

import { createAppContainer } from "react-navigation";
import { enableScreens } from "react-native-screens";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import createNativeStackNavigator from "react-native-screens/createNativeStackNavigator";

import { Provider as PaperProvider } from "react-native-paper";

import LoginGuard from "./LoginGuard";

import HomeRoute from "../routes/HomeRoute";
import EventsRoute from "../routes/EventsRoute";
import WorkshopsRoute from "../routes/WorkshopsRoute";
import MapRoute from "../routes/MapRoute";

import ProfileModal from "../routes/modals/ProfileModal";

import { fetchAsyncData, useAsyncData } from "../AsyncData";
import { THEME } from "../theme";
import initServices from "../initServices";

// This is a fix for react-native-safe-view, which many libraries use
// but has a warning with React 16.9 (since, in the future, it won't work with React 17).
//
// Basically disables the warning.
YellowBox.ignoreWarnings(["Warning: componentWillReceiveProps", "Warning: componentWillMount"]);

// Faster stacks, according to here:
// https://reactnavigation.org/docs/en/react-native-screens.html
enableScreens();

initServices();

async function loadFonts() {
  await Font.loadAsync({
    "Plex-Mono": require("../../assets/fonts/IBMPlexMono-Medium.otf"),
    Cornerstone: require("../../assets/fonts/Cornerstone.ttf")
  });

  return true;
}

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

const StackNavigator = createAppContainer(
  createNativeStackNavigator(modals, {})
);

/**
 * `App` sets up the Material theme, fonts, system borders,
 * and acts as the primary navigation for the app.
 *
 * 1) Stack navigation: i.e. popup windows
 * 2) Bottom navigation bar
 * 3) Pane switching within bottom nav bar.
 */
const App: React.FC = observer(() => {
  const fonts = useAsyncData<boolean>();
  useEffect(() => {
    fetchAsyncData(fonts, loadFonts);
  }, []);

  if (fonts.error) {
    console.warn(fonts.error);
  }

  if (fonts.loading || fonts.data !== true) {
    return <AppLoading />;
  }

  return (
    <PaperProvider theme={THEME}>
      <LoginGuard>
        {/* This is for iOS, for Android see app.json in root of project. */}
        <StatusBar barStyle="dark-content" />
        <StackNavigator />
      </LoginGuard>
    </PaperProvider>
  );
});

export default App;
