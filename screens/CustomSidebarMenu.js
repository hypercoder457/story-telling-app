import React from "react";
import { SafeAreaView, View, StyleSheet, Image, Platform, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

import {
    DrawerContentScrollView,
    DrawerItemList
} from "@react-navigation/drawer";

export default class CustomSidebarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lightTheme: true
        };
    }

    componentDidMount() {
        let theme;
        firebase
            .database()
            .ref(`/users/${firebase.auth().currentUser.uid}/current_theme`)
            .on("value", data => {
                theme = data.val();
                this.setState({ lightTheme: theme === "light" });
            });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: this.state.lightTheme ? "white" : "#15193c"
                }}
            >
                <SafeAreaView style={styles.droidSafeArea} />
                <Image
                    source={require("../assets/logo.png")}
                    style={styles.sideMenuProfileIcon}
                ></Image>
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        width: RFValue(140),
        height: RFValue(140),
        borderRadius: RFValue(70),
        alignSelf: "center",
        marginTop: RFValue(60),
        resizeMode: "contain"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    }
});