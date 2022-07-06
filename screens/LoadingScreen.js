import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import firebase from "firebase";

export default function LoadingScreen(props) {
  useEffect(() => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if(user) {
          props.navigation.navigate("DashboardScreen");
        } else {
          props.navigation.navigate("LoginScreen");
        }
      })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
