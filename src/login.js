import React, { Component } from 'react';
import { Button, ToastAndroid, View, YellowBox } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import fixtures from './fixtures.json';
import styles from './style';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
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
    title: 'Login'
  };

  // TEMPORARY
  componentDidMount() {
    this.setState({
      email: 'homer@simpson.com',
      password: 'password'
    });
  }

  onSubmitPressed = async () => {
    try {
      const {
        data,
        status,
        statusText,
        headers,
        config,
        request
      } = await axios({
        method: 'post',
        baseURL: fixtures.baseUrl,
        data: this.state
      });
      const { token, player } = data;
      console.log(token);
      if (status === 200) {
        this.props.navigation.navigate('tournaments', {
          token,
          player
        });
      } else {
        ToastAndroid.show('error', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  onChange = value => this.setState(value);

  register = () => this.props.navigation.navigate('register');

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
