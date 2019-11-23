import React from "react";
import { observer } from "mobx-react";

import Login from "./Login";

import AuthService from "../services/AuthService";

interface Props {
  children: React.ReactNode;
}

/**
 * LoginGuard checks if the user is logged in, and shows different content accordingly.
 *
 * If false --> shows login screen
 * If true  --> shows children
 *
 * Technical notes:
 * observer() is what allows our component to re-render every time the user changes.
 */
const LoginGuard: React.FC<Props> = observer(({ children }: Props) => {
  if (!AuthService.isLoggedIn) {
    return <Login />;
  }

  return <>{children}</>;
});

export default LoginGuard;
