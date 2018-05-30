import { createStackNavigator } from 'react-navigation';

import login from './login';
import register from './register';
import tournaments from './tournaments';
import games from './games';
import prediction from './prediction';

const app = createStackNavigator({
  login,
  register,
  tournaments,
  games,
  prediction
});

export default app;
