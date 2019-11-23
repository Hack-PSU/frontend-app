import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Provider as PaperProvider
} from "react-native-paper";
import { useAsync } from "react-async";

import { validate as validateEmail } from "email-validator";

import AuthService from "../services/AuthService";

import { BAR_HEIGHT } from "../theme";

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    height: "100%"
  },
  input: {
    color: "#0d0d0d"
  }
});

async function login([email, password]) {
  if (!validateEmail(email)) {
    return;
  }

  const user = await AuthService.signIn(email, password);
  if (!user) {
    throw new Error("user was null");
  }

  return true;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isPending, error, run } = useAsync({ deferFn: login });
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
          <Button
            icon="send"
            mode="contained"
            onPress={() => run(email, password)}
            disabled={!email || !isValidEmail || !password}
          >
            Checks out (login).
          </Button>
          <ActivityIndicator animating={isPending} />
          {error && <Text>Incorrect username and pass.</Text>}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;
