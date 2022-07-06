// react native libraries:
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// important firebase libraries/functions:
import firebase from "firebase";

// important expo libraries:
import AppLoading from "expo-app-loading";
import { loadAsync } from "expo-font";

// story card component:
import StoryCard from "./StoryCard";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

let stories = require("./temp_stories.json");

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lightTheme: true,
      stories: []
    };
  }

  getUserTheme = () => {
    let theme;
    const userUid = firebase.auth().currentUser.uid;
    const userThemeRef = firebase.database().ref(`/users/${userUid}/current_theme`);
    userThemeRef.on('value', data => {
      theme = data.val();
      this.setState({ lightTheme: theme === "light" });
    })
  };

  async loadFonts() {
    await loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
    this.getUserTheme();
    this.fetchStories();
  }

  fetchStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on("value", data => {
        let stories = [];
        let valOfData = data.val();
        if (valOfData) {
          let storyDataKeys = Object.keys(data.val());
          storyDataKeys.forEach(function (key) {
            stories.push({
              key: key,
              value: valOfData[key]
            });
          });
        }
        this.setState({ stories: stories });
        this.props.setUpdateToFalse();
      },
        function (error) {
          console.log(`Loading all stories failed. Please try again. Error code: ${error.code}`);
        }
      );
  };

  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={
          this.state.lightTheme ? styles.containerLight : styles.container
        }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={
                this.state.lightTheme ? styles.appTitleTextLight : styles.appTitleText
              }>
                Storytelling App
              </Text>
            </View>
          </View>
          {!this.state.stories[0] ? (
            <View style={styles.noStories}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }
              >
                No Stories Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.stories}
                renderItem={this.renderItem}
              />
            </View>
          )}
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  }
});
