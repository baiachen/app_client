import React, { Component } from 'react';
import { Button, View } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import styles from './style';
import fixtures from './fixtures.json';

const { Form } = t.form;

const User = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  password: t.String
});

const options = {
  auto: 'placeholders',
  fields: {
    password: {
      secureTextEntry: true
    }
  }
};

export default class Register extends Component<> {
  static navigationOptions = {
    title: 'Register'
  };

  onSubmitPressed = async () => {
    try {
      const { data } = await axios({
        method: 'post',
        baseURL: fixtures.baseUrl,
        url: 'players',
        data: this.state
      });
      if (data.success) {
        this.props.navigation.navigate('tournaments', {
          token: data.token
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onChange = value => this.setState(value);

  login = () => this.props.navigation.navigate('login');

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
          <Button title="Register" onPress={this.onSubmitPressed} />
        </View>
        <View style={styles.nestedContainer}>
          <Button title="Login" onPress={this.login} />
        </View>
      </View>
    );
  }
}
