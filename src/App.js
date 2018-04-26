/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { StackNavigator } from 'react-navigation';

import login from './login';
import register from './register';
import tournaments from './tournaments';

const app = StackNavigator({
  login,
  register,
  tournaments
});

export default app;
