import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./style";

export default class Homepage extends Component<> {
  static navigationOptions = {
    title: "Homepage"
  };

  constructor(props) {
    super(props);
    const { token } = this.props.navigation.state.params;
    this.state = token;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state}</Text>
      </View>
    );
  }
}
