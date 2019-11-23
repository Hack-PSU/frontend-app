import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { useAsync } from "react-async";
import { observer } from "mobx-react";

import Scaffold from "../components/Scaffold";

import { RegistrationApiResponse } from "../models/registration";

import AuthService from "../services/AuthService";
import DataService from "../services/DataService";

async function getRegistrationStatus({
  currentUser
}: {
  currentUser: firebase.User;
}): Promise<RegistrationApiResponse> {
  return DataService.getRegistrationStatus(currentUser);
}

const HomeRoute: React.FC = observer(() => {
  const { data: registration, isPending } = useAsync({
    promiseFn: getRegistrationStatus,
    currentUser: AuthService.currentUser
  });

  return (
    <Scaffold title="Home">
      <ActivityIndicator animating={isPending} />
      {!isPending && (
        <Text style={{ color: "white", fontSize: 36 }}>
          My pin is... {registration.pin}
        </Text>
      )}
    </Scaffold>
  );
});

export default HomeRoute;
