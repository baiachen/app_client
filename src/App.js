/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { StackNavigator } from 'react-navigation';

import login from './login';
import register from './register';
import tournaments from './tournaments';
import games from './games';
import prediction from './prediction';

const app = StackNavigator({
  login,
  register,
  tournaments,
  games,
  prediction
});

export default app;
