import React from "react";
import { Text as MainText, View, StyleSheet, Button } from "react-native"

export const API_KEY = "d3969d86f91ed3e314b5ff75bf99a11c";

export const Text = props => <MainText {...props} style={[{fontSize: 25}, props.style]}>{props.children}</MainText>