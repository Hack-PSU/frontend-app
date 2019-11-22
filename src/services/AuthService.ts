import * as Firebase from "firebase";
import { observable, computed } from "mobx";

// I pretty much stole & refactored auth.service.ts from the frontend repo.

// TODO: Sign in with Google, GitHub, and Apple on iOS
export enum AuthProviders {
  GOOGLE_PROVIDER,
  GITHUB_PROVIDER,
  APPLE_PROVIDER
}

export class AuthService {
  @observable currentUser: Firebase.User;

  @computed get isLoggedIn() {
    return this.currentUser != null;
  }

  init() {
    Firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    })

    this.currentUser = Firebase.auth().currentUser;
  }

  signIn(email: string, password: string) {
    return Firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return Firebase.auth().signOut();
  }

  createUser(email: string, password: string) {
    return Firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  // signInWithProvider(provider: AuthProviders): Promise<any> {
  //   let authProvider: firebase.auth.AuthProvider = null;
  //   switch (provider) {
  //     case AuthProviders.GOOGLE_PROVIDER:
  //       authProvider = new firebase.auth.GoogleAuthProvider();
  //       break;
  //     case AuthProviders.GITHUB_PROVIDER:
  //       authProvider = new firebase.auth.GithubAuthProvider();
  //       break;
  //   }
  //   return this.afAuth.auth.signInWithPopup(authProvider);
  // }
}

const singleton = new AuthService();
export default singleton;