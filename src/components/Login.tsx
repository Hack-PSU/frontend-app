import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, ScrollView, Platform, ActivityIndicator } from "react-native";
import { Appbar, TextInput, Button, Provider as PaperProvider } from "react-native-paper";

import { validate as validateEmail } from "email-validator";

import useAsyncEffect from "./useAsyncEffect";

import AuthService from "../services/AuthService";

const IS_ANDROID = Platform.OS !== "ios";

// If undefined just use system value.
const BAR_HEIGHT = IS_ANDROID ? 0 : undefined;

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    height: "100%",
  },
  input: {
    color: "#0d0d0d"
  }
});

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  async function login() {
    if (loading) {
      return;
    }

    setLoading(true);
    setIncorrect(false);
    let errored = false;
    try {
      const user = await AuthService.signIn(email, password);
      errored = !user;
    } catch(e) {
      console.error(e);
      errored = true;
    }

    if (errored) {
      setIncorrect(true);
      setLoading(false);
    }
  }

  const isValidEmail = validateEmail(email);

  return (
    <>
      <Appbar.Header statusBarHeight={BAR_HEIGHT}>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <SafeAreaView>
        <ScrollView style={styles.scroll}>
          <Text>Rahul making this look nice is all you buddy!</Text>
          {/* This resets default theme for inputs. */}
          <PaperProvider>
            <TextInput
              label="Email"
              mode="outlined"
              style={styles.input}
              selectionColor="#0d0d0d"
              autoCompleteType="email"
              textContentType="emailAddress"
              value={email}
              error={!isValidEmail}
              onChangeText={setEmail}
            />
            <TextInput
              label="Password"
              mode="outlined"
              style={styles.input}
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </PaperProvider>
          <Button icon="send" mode="contained" onPress={login} disabled={!email || !isValidEmail || !password}>Checks out (login).</Button>
          <ActivityIndicator animating={loading} />
          {incorrect && (<Text>Incorrect username and pass.</Text>)}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;