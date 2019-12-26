import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  StatusBar,
  Image
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  DefaultTheme,
  Provider as PaperProvider
} from "react-native-paper";
import { useAsync } from "react-async";
import { validate as validateEmail } from "email-validator";
import AuthService from "../services/AuthService";
import { BAR_HEIGHT, TEXT } from "../theme";

const SIGN_IN = "Login";
const REGISTER = "Register";

/**
 * Due to how react-async works, [email, password, operation] are
 * passed from running:
 *
 * run(email, password, operation)
 */
async function signInOrSignUp([email, password, operation]: [
  string,
  string,
  string
]) {
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
    <PaperProvider theme={loginTheme}>
      <StatusBar backgroundColor="#10253B" barStyle="light-content" />
      <Appbar.Header statusBarHeight={BAR_HEIGHT} style={{ shadowRadius: 10 }}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require("../../assets/images/Hacky.png")}
        />
        <Appbar.Content title="Login" />
      </Appbar.Header>

      <SafeAreaView>
        <View style={styles.root}>
          <TextInput
            label="Email"
            mode="flat"
            style={styles.textInput}
            autoCompleteType="email"
            textContentType="emailAddress"
            value={email}
            error={email !== "" && !isValidEmail}
            onChangeText={setEmail}
          />
          <TextInput
            label="Password"
            mode="flat"
            style={styles.textInput}
            autoCompleteType="password"
            textContentType="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            mode="contained"
            icon="send"
            style={styles.loginButton}
            onPress={() => run(email, password, operation)}
            disabled={!email || !isValidEmail || !password}
          >
            {operation}
          </Button>

          <View style={styles.bottomButtonsContainer}>
            <Button compact={true} uppercase={false}>
              Forgot password?
            </Button>
            <Button
              onPress={() =>
                setOperation(operation === SIGN_IN ? REGISTER : SIGN_IN)
              }
              compact={true}
              uppercase={false}
            >
              {operation === SIGN_IN
                ? "Create account"
                : "Log in with existing account"}
            </Button>
          </View>
          <ActivityIndicator animating={isPending} />
          {error && <Text>Incorrect username and pass.</Text>}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 16,
    marginHorizontal: 16
  },

  image: {
    height: "80%",
    width: "10%",
    alignContent: "center",
    marginLeft: 10
  },

  textInput: {
    marginTop: 10
  },

  loginButton: {
    marginTop: 16,
    paddingVertical: 5
  },

  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },

  bottomButtons: {
    fontSize: 5
  }
});

const loginTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: "#113654"
  }
};

export default Login;
