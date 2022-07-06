// react native libraries:
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Platform,
  Image,
  StatusBar
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// firebase libraries:
import firebase from "firebase";

// very important library that allows me to google sign-in with minimal code:
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// other libraries:
import * as Font from "expo-font";
import AppLoading from 'expo-app-loading';

let customFonts = {
  "Bubblegum-Sans": require('../assets/fonts/BubblegumSans-Regular.ttf')
}

export default function LoginScreen() {
  if (Platform.OS === "android") {
    useEffect(() => {
      WebBrowser.warmUpAsync();
      return () => WebBrowser.coolDownAsync();
    }, [])
  }

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }, [])

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      webClientId: '261093756231-4ji08q7to03qp6p16btk8r16etcqan8l.apps.googleusercontent.com',
      expoClientId: '261093756231-eo6v6c5vcpe7gl4fparhq0ioksm2atkt.apps.googleusercontent.com',
      androidClientId: '261093756231-l731ot4blda2eh28upprs6fqoo4c9sth.apps.googleusercontent.com'
    },
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = provider.credential(id_token);
      // Sign in with credential from the Google user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          if (result.additionalUserInfo.isNewUser) {
            firebase
              .database()
              .ref(`/users/${result.user.uid}`).set({
                current_theme: "dark"
              })
          }
        })
    }
  }, [response])

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.droidSafeArea} />
      <View style={styles.appTitle}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.appIcon}
        ></Image>
        <Text style={styles.appTitleText}>
          {`Storytelling\nApp`}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          disabled={!request}
          onPress={() => promptAsync({
            redirectUri: AuthSession.makeRedirectUri({
              native: 'com.whitehatcoder.storytellingapp:/oauthredirect'
            })
          })}
        >
          <Image
            source={require("../assets/google_icon.png")}
            style={styles.googleIcon}
          ></Image>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cloudContainer}>
        <Image
          source={require("../assets/cloud.png")}
          style={styles.cloudImage}
        ></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white",
    marginTop: RFValue(50)
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  cloudContainer: {
    flex: 0.3
  },
  cloudImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "contain",
    bottom: RFValue(-5)
  }
});
