// react native imports:
import React from "react"; // this always has to be included here, if not app would fail to load
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // icons library
import { RFValue } from "react-native-responsive-fontsize"; // responsive font size

// other important libraries:
import AppLoading from "expo-app-loading"; // easy loading screen if app is loading phase
import { loadAsync } from "expo-font"; // expo font library

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      storyData: this.props.story.value
    };
  }

  async loadFonts() {
    await loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  render() {
    let story = this.state.storyData;
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let previewImages = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      };
      return (
        <>
          <SafeAreaView style={styles.droidSafeArea} />
          <TouchableOpacity
            style={styles.container}
            onPress={() => this.props.navigation.navigate("Story Screen", {
              story: this.props.story
            })}
          >
            <View style={styles.cardContainer}>
              <Image
                source={previewImages[story.preview_image]}
                style={styles.storyImage}
              ></Image>

              <View style={styles.titleContainer}>
                <Text style={styles.storyTitleText}>
                  {story.title}
                </Text>
                <Text style={styles.storyAuthorText}>
                  {story.author}
                </Text>
                <Text style={styles.descriptionText}>
                  {story.description}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons
                    name="heart"
                    size={RFValue(30)}
                    color="white"
                  />
                  <Text style={styles.likeText}>12k</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  droidSafeArea: {
    margin: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },
  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  }
});
