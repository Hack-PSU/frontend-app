import React, { useEffect } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Text, Title } from "react-native-paper";
import Animated from "react-native-reanimated";
import { observer } from "mobx-react";

import HomeListItem from "../components/HomeListItem";
import HomeListItemSecondary from "../components/HomeListItemSecondary";
import DateCountDown from "../components/DateCountDown";
import Scaffold, { LOGO_SAFE_PADDING } from "../components/Scaffold";
import ErrorCard from "../components/ErrorCard";

import useScrollY from "../useScrollY";
import { TEXT_LIGHT } from "../theme";

import AuthService from "../services/AuthService";
import DataService from "../services/DataService";

const HomeRoute: React.FC = observer(() => {
  const { currentUser } = AuthService;
  const { registrationStatus } = DataService;

  const { scrollY, onScroll } = useScrollY();

  useEffect(() => {
    DataService.fetchRegistrationStatus(currentUser);
  }, [currentUser]);

  const slackInviteUrl =
    "https://join.slack.com/t/hackpsu-group/shared_invite/enQtODE3Mzc5NDI1NjQ4LTJmMDkzYmQ0ODRmNGNjOTE0MzkyMGY0Y2ZiODJjYmQwNDM5MzFiODc2MTY5YzdjYWJiN2FlZmM4MTNhMzU0YmU";

  return (
    <Scaffold scrollY={scrollY}>
      <Animated.ScrollView scrollEventThrottle={1} onScroll={onScroll}>
        <Title style={styles.title}>HOME</Title>

        <DateCountDown />

        {registrationStatus.error && (
          <ErrorCard
            error={registrationStatus.error.message || registrationStatus.error}
          />
        )}

        {!registrationStatus.error && (
          <HomeListItem
            description="My PIN Number"
            info={
              registrationStatus.loading || !registrationStatus.data
                ? "..."
                : registrationStatus.data.pin.toString()
            }
          />
        )}

        <View style={styles.horizontalCardView}>
          <HomeListItemSecondary description="Wi-Fi">
            <Text style={styles.horizontalCardText}>Username: hackpsu</Text>
            <Text style={styles.horizontalCardText}>Password: plz</Text>
          </HomeListItemSecondary>
          <HomeListItemSecondary
            description="Slack"
            onPress={() => Linking.openURL(slackInviteUrl)}
          >
            <Text style={styles.horizontalCardText}>
              Request an invite by clicking here!
            </Text>
          </HomeListItemSecondary>
        </View>
      </Animated.ScrollView>
    </Scaffold>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: "Cornerstone",
    color: TEXT_LIGHT,
    fontSize: 48,
    paddingTop: 44 + LOGO_SAFE_PADDING,
    paddingBottom: 16,
    paddingLeft: 16
  },

  horizontalCardView: {
    flexDirection: "row"
  },

  horizontalCardText: {
    color: "gray"
  }
});

export default HomeRoute;
