import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  Alert
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Portal,
  Dialog,
  Title,
  DefaultTheme,
  Provider as PaperProvider
} from "react-native-paper";
import { useAsync } from "react-async";
import { validate as validateEmail } from "email-validator";
import AuthService from "../services/AuthService";
import { BAR_HEIGHT } from "../theme";
import { ThemeColors } from "react-navigation";

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
    try {
      const user = await AuthService.signIn(email, password);
      if (!user) {
        console.log("Test2");
        Alert.alert("Error", "User does not exist");
      }
    } catch (error) {
      Alert.alert("Error", "Username or password is incorrect");
    }
  }

  if (operation == REGISTER) {
    try {
      const user = await AuthService.createUser(email, password);
      if (!user) {
        Alert.alert("Error", "User does not exist");
      }
    } catch (error) {
      Alert.alert("Error", "Could not create user");
    }
  }

  return true;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // "Sign In" and "Register" are valid values.
  const [operation, setOperation] = useState(SIGN_IN);

  const { isPending, run } = useAsync({ deferFn: signInOrSignUp });
  const isValidEmail = validateEmail(email);

  return (
    // Reset theme to follow something easier to work with for this screen
    <PaperProvider theme={loginTheme}>
      <StatusBar
        backgroundColor={loginTheme.colors.statusBar}
        barStyle="light-content"
      />

      {/* This dialog shows up after the user clicks the login/register button */}
      <Portal>
        <Dialog visible={isPending}>
          <Dialog.Content>
            <ActivityIndicator animating={isPending} size="large" />
          </Dialog.Content>
        </Dialog>
      </Portal>

      <SafeAreaView>
        <View style={styles.root}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require("../../assets/images/logo.png")}
          />
          <Title style={styles.title}>{operation}</Title>

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
              {operation === SIGN_IN ? "Create account" : "I have an account"}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const loginTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: "#113654",
    secondary: "#F3613D",
    statusBar: "#10253B"
  }
};

const styles = StyleSheet.create({
  root: {
    marginTop: 16,
    marginHorizontal: 16
  },

  image: {
    height: "40%",
    width: "100%",
    alignContent: "center"
  },

  title: {
    fontFamily: "Cornerstone",
    fontSize: 48,
    color: loginTheme.colors.primary,
    paddingTop: 26
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

export default Login;
