import React, { useEffect, useState } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import Logout from "../screens/Logout";
import CustomSidebarMenu from "../screens/CustomSidebarMenu";

import firebase from "firebase/app";
import "firebase/database";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [lightTheme, setLightTheme] = useState(true);
  useEffect(() => {
    let theme;
    firebase
      .database()
      .ref(`/users/${firebase.auth().currentUser.uid}/current_theme`)
      .on("value", data => {
        theme = data.val();
        setLightTheme(theme === "light" ? true : false);
      });
  }, [])

  return (
    <Drawer.Navigator
      screenOptions={{
        activeTintColor: "#e91e63",
        inactiveTintColor: lightTheme ? "black" : "white",
        itemStyle: { marginVertical: 5 }
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="Home" component={StackNavigator} options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="Logout" component={Logout} options={{ unmountOnBlur: true }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
