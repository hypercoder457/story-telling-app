import React from "react";
import { Alert, Platform } from "react-native";

import firebase from "firebase/app";
import "firebase/auth";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Alert.alert('Logging out', "Are you sure you want to logout",
                [{ text: "Yes, I want to logout", onPress: () => firebase.auth().signOut() },
                { text: "Cancel", onPress: () => this.props.navigation.goBack() }],
            );
        } else {
            firebase.auth().signOut();
        }
    }

    render() {
        return null;
    }
}