/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { StackNavigator } from "react-navigation";

import login from "./login";
import register from "./register";
import homepage from "./homepage";

const app = StackNavigator({
  login,
  register,
  homepage
});

export default app;
