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
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

import firebase from "firebase";

// other expo libraries:
import AppLoading from "expo-app-loading";
import { loadAsync } from "expo-font";

let fontsToLoad = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class CreateStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 40,
      lightTheme: true
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
  }

  async addStory() {
    if (
      this.state.title &&
      this.state.description &&
      this.state.story &&
      this.state.moral
    ) {
      let storyData = {
        preview_image: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0
      };
      const randomUid = Math.random().toString(36).slice(2);
      await firebase
        .database()
        .ref(
          `/posts/${randomUid}`
        )
        .set(storyData)
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed");
    } else {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Alert.alert(
          "Error",
          "All fields are required!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      } else {
        alert('Error! ALL fields are required!');
      }
    }
  }

  async loadFonts() {
    await loadAsync(fontsToLoad);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
    this.getUserTheme();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      const dropDownItems = [
        { label: "Image 1", value: "image_1" },
        { label: "Image 2", value: "image_2" },
        { label: "Image 3", value: "image_3" },
        { label: "Image 4", value: "image_4" },
        { label: "Image 5", value: "image_5" }
      ];

      let previewImages = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      };
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
                New Story
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={previewImages[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={dropDownItems}
                  defaultValue={this.state.previewImage}
                  containerStyle={styles.dropDownContainer}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{ backgroundColor: "transparent" }}
                  itemStyle={{
                    justifyContent: "flex-start"
                  }}
                  dropDownStyle={{
                    backgroundColor: this.state.lightTheme ? "#eee" : "#2f345d"
                  }}
                  labelStyle={
                    this.state.lightTheme
                      ? styles.dropdownLabelLight
                      : styles.dropdownLabel
                  }
                  arrowStyle={
                    this.state.lightTheme
                      ? styles.dropdownLabelLight
                      : styles.dropdownLabel
                  }
                  onChangeItem={item =>
                    this.setState({
                      previewImage: item.value
                    })
                  }
                />
              </View>

              <TextInput
                style={
                  this.state.lightTheme ? styles.inputFontLight : styles.inputFont
                }
                onChangeText={title => this.setState({ title })}
                placeholder="Title"
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
              />

              <TextInput
                style={[
                  this.state.lightTheme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig
                ]}
                onChangeText={description => this.setState({ description })}
                placeholder="Description"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
              />
              <TextInput
                style={[
                  this.state.lightTheme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig
                ]}
                onChangeText={story => this.setState({ story })}
                placeholder="Story"
                multiline={true}
                numberOfLines={20}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
              />

              <TextInput
                style={[
                  this.state.lightTheme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig
                ]}
                onChangeText={moral => this.setState({ moral })}
                placeholder="Moral of the story"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
              />

              <TouchableOpacity
                onPress={() => this.addStory()}
                style={styles.submitButton}>
                <Text style={{ color: "white", fontFamily: "CedarvilleCursive" }}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
    resizeMode: "contain"
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
  fieldsContainer: {
    flex: 0.85
  },
  dropDownContainer: {
    height: 40,
    borderRadius: RFValue(20),
    marginBottom: RFValue(20),
    marginHorizontal: RFValue(10)
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain"
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "white",
    fontFamily: "Bubblegum-Sans"
  },
  inputFontLight: {
    height: RFValue(40),
    borderColor: "black",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "black",
    fontFamily: "Bubblegum-Sans"
  },
  inputFontExtra: {
    marginTop: RFValue(15)
  },
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5)
  },
  dropdownLabel: {
    color: "white",
    fontFamily: "Bubblegum-Sans"
  },
  dropdownLabelLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans"
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center"
  }
});
