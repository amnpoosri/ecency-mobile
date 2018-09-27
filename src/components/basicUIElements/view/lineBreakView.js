import React from "react";
import { View } from "react-native";
import styles from "./lineBreakStyles";

const LineBreak = ({ color, children, height }) => (
  <View style={[styles.lineBreak, { height: height, color: color }]}>
    {children}
  </View>
);

export default LineBreak;
