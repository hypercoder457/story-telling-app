import React from "react";
import { View } from "react-native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";

import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";

import firebase from "firebase";

const Drawer = createDrawerNavigator();

function AppDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View>
        <DrawerItem
          label="Log out"
          onPress={() => firebase.auth().signOut()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={
        props => <AppDrawerContent {...props} />
      }
    >
      <Drawer.Screen name="Home" component={StackNavigator} options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ unmountOnBlur: true }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
