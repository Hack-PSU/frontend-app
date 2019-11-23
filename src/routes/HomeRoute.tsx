import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator } from "react-native";
import { observer } from "mobx-react";

import Scaffold from "../components/Scaffold";
import useAsyncEffect from "../components/useAsyncEffect";

import { RegistrationApiResponse } from "../models/registration";

import AuthService from "../services/AuthService";
import DataService from "../services/DataService";

const HomeRoute: React.FC = observer(() => {
  const [registration, loading, error] = useAsyncEffect<RegistrationApiResponse>(() => {
    if (!AuthService.isLoggedIn) {
      return null;
    }

    return DataService.getRegistrationStatus(AuthService.currentUser);
  }, [AuthService.currentUser]);

  return (
    <Scaffold title="Home">
      <ActivityIndicator animating={loading} />
      {!loading && (<Text>{registration.pin}</Text>)}
    </Scaffold>
  );
});

export default HomeRoute;
