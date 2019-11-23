import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
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

import SegmentedControl from "../components/SegmentedControl";

import AuthService from "../services/AuthService";

import { BAR_HEIGHT, TEXT } from "../theme";

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    height: "100%"
  },
  input: {
    color: TEXT
  }
});

const SIGN_IN = "Sign In";
const REGISTER = "Register";

/**
 * Due to how react-async works, [email, password, operation] are
 * passed from running:
 * 
 * run(email, password, operation)
 */
async function signInOrSignUp([email, password, operation]: [string, string, string]) {
  if (!validateEmail(email)) {
    return;
  }

  if (operation == SIGN_IN) {
    const user = await AuthService.signIn(email, password);
    if (!user) {
      throw new Error("user was null");
    }
  }

  if (operation == REGISTER) {
    const user = await AuthService.createUser(email, password);
    if (!user) {
      throw new Error("user was null after creation");
    }
  }

  return true;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // "Sign In" and "Register" are valid values.
  const [operation, setOperation] = useState(SIGN_IN); 

  const { isPending, error, run } = useAsync({ deferFn: signInOrSignUp });

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
          <SegmentedControl
            values={[SIGN_IN, REGISTER]}
            value={operation}
            onChange={newValue => setOperation(newValue)}
          />
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
            onPress={() => run(email, password, operation)}
            disabled={!email || !isValidEmail || !password}
          >
            {operation}
          </Button>
          <ActivityIndicator animating={isPending} />
          {error && <Text>Incorrect username and pass.</Text>}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;
