import React, { useEffect } from "react";
import { StyleSheet, View, Linking, RefreshControl } from "react-native";
import { Text, Title, Button } from "react-native-paper";

import { observer } from "mobx-react";
import HomeListItem from "../components/HomeListItem";
import HomeListItemSecondary from "../components/HomeListItemSecondary";
import DateCountDown from "../components/DateCountDown";
import { TEXT_LIGHT } from "../theme";

import Scaffold from "../components/Scaffold";

import AuthService from "../services/AuthService";
import DataService from "../services/DataService";
import { ScrollView } from "react-native-gesture-handler";
import ErrorCard from "../components/ErrorCard";

const REGISTER_URL = "https://app.hackpsu.org/register";

const SLACK_URL =
  "https://join.slack.com/t/hackpsu-group/shared_invite/enQtODE3Mzc5NDI1NjQ4LTJmMDkzYmQ0ODRmNGNjOTE0MzkyMGY0Y2ZiODJjYmQwNDM5MzFiODc2MTY5YzdjYWJiN2FlZmM4MTNhMzU0YmU";

const HomeRoute: React.FC = observer(() => {
  const { currentUser } = AuthService;
  const { registrationStatus } = DataService;

  useEffect(() => {
    DataService.fetchRegistrationStatus(currentUser);
  }, [currentUser]);

  return (
    <Scaffold title="Home">
      <ScrollView>
        <RefreshControl
          refreshing={registrationStatus.loading}
          onRefresh={() => DataService.fetchRegistrationStatus(currentUser, true)}
          tintColor="white"
          title="Fetching data"
          titleColor="white"
        />

        <Title style={styles.title}>HOME</Title>

        <DateCountDown />

        {registrationStatus.error && (
          <ErrorCard
            error={registrationStatus.error.message || registrationStatus.error}
          />
        )}

        {!registrationStatus.error && (registrationStatus.loading || registrationStatus.data) && (
          <HomeListItem
            description="My PIN Number"
            info={
              registrationStatus.loading
                ? "..."
                : registrationStatus.data.pin.toString()
            }
          />
        )}

        {!registrationStatus.error && !registrationStatus.data && (
          <HomeListItem description="My PIN Number" onPress={() => Linking.openURL(REGISTER_URL)}>
            <View style={styles.buttonContainer}><Button mode="contained" dark>Register</Button></View>
          </HomeListItem>
        )}

        <View style={styles.horizontalCardView}>
          <HomeListItemSecondary description="Wi-Fi">
            <Text style={styles.horizontalCardText}>Username: hackpsu</Text>
            <Text style={styles.horizontalCardText}>Password: plz</Text>
          </HomeListItemSecondary>
          <HomeListItemSecondary
            description="Slack"
            onPress={() => Linking.openURL(SLACK_URL)}
          >
            <Text style={styles.horizontalCardText}>
              Request an invite by clicking here!
            </Text>
            <View style={styles.buttonContainer}><Button mode="contained" dark>Open</Button></View>
          </HomeListItemSecondary>
        </View>
      </ScrollView>
    </Scaffold>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: "Cornerstone",
    color: TEXT_LIGHT,
    fontSize: 48,
    paddingTop: 44,
    paddingBottom: 16,
    paddingLeft: 16
  },

  buttonContainer: {
    paddingTop: 10,
    width: '100%',
    alignItems: 'flex-start',
  },

  horizontalCardView: {
    flexDirection: "row"
  },

  horizontalCardText: {
    color: "gray"
  }
});

export default HomeRoute;
