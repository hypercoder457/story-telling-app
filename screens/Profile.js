// react native imports:
import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

// firebase libraries:
import firebase from 'firebase';

// other important libraries:
import AppLoading from 'expo-app-loading';
import { loadAsync } from 'expo-font';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf')
};

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      lightTheme: true,
      fontsLoaded: false
    }
  }

  getUser = () => {
    return firebase.auth().currentUser;
  }

  async loadFonts() {
    await loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
    this.getUserTheme();
  }

  toggleTheme = () => {
    const userUid = this.getUser().uid;
    const usersRef = firebase.database().ref(`/users/${userUid}`);
    if (!this.state.lightTheme) {
      usersRef.set({
        current_theme: "light"
      })
    } else {
      usersRef.set({
        current_theme: "dark"
      })
    }
  }

  getUserTheme = () => {
    const userUid = this.getUser().uid;
    const userThemeRef = firebase.database().ref(`/users/${userUid}/current_theme`);
    userThemeRef.on('value', data => {
      let theme = data.val();
      this.setState({ lightTheme: theme === "light" });
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    };
    return (
      <View style={
        this.state.lightTheme ? styles.profileContainerLight : styles.profileContainer
      }>
        <Image
          source={{ uri: this.getUser().photoURL }}
          style={styles.userPhoto}
        >
        </Image>
        <Text style={
          this.state.lightTheme ? styles.userInfoLight : styles.userInfo
        }
        >
          {this.getUser().displayName}
        </Text>
        <Text style={
          this.state.lightTheme ? styles.userInfoLight : styles.userInfo
        }>Email: {this.getUser().email}</Text>
        <Text style={
          this.state.lightTheme ? styles.userInfoLight : styles.userInfo
        }>Your current theme is set to: {this.state.lightTheme ? "light" : "dark"}</Text>
        <TouchableOpacity
          style={styles.themeToggleButton}
          onPress={() => this.toggleTheme()}
        >
          <Text style={styles.toggleText}>Toggle theme</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },
  profileContainerLight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  userInfo: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20,
    color: "white"
  },
  userInfoLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20
  },
  userPhoto: {
    resizeMode: "contain",
    width: "20%",
    height: "20%",
    marginBottom: RFValue(20)
  },
  themeToggleButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "white",
    marginTop: RFValue(10),
    width: RFValue(100)
  },
  toggleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20
  }
})
