import React, { Component } from "react";
import { Button, View, YellowBox } from "react-native";
import axios from "axios";
import t from "tcomb-form-native";
import styles from "./style";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

const { Form } = t.form;

const User = t.struct({
  email: t.String,
  password: t.String
});

const options = {
  fields: {
    password: {
      secureTextEntry: true
    }
  }
};

export default class Login extends Component<> {
  static navigationOptions = {
    title: "Login"
  };

  onSubmitPressed = async () => {
    try {
      const response = await axios.post("http://10.0.3.2:3000", this.state);
      if (response.data.success) {
        this.props.navigation.navigate("homepage", {
          token: response.data.token
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onChange = value => this.setState(value);

  register = () => this.props.navigation.navigate("register");

  render() {
    return (
      <View style={styles.container}>
        <Form
          type={User}
          options={options}
          value={this.state}
          onChange={this.onChange}
        />
        <View style={styles.nestedContainer}>
          <Button title="Login" onPress={this.onSubmitPressed} />
        </View>
        <View style={styles.nestedContainer}>
          <Button title="Register" onPress={this.register} />
        </View>
      </View>
    );
  }
}
