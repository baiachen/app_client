import axios from 'axios';
import queryString from 'querystring';
import React, { Component, PureComponent } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  View,
  YellowBox
} from 'react-native';
import fixtures from './fixtures.json';
import styles from './style';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
]);

class ListItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item, this.props.index);
    // item = tournament
  };

  render() {
    const { item } = this.props;
    if (item) {
      // item = tournament
      const { name, logoUrl } = item;
      return (
        <TouchableHighlight onPress={this._onPress} underlayColor="#dddddd">
          <View>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={{ uri: logoUrl }}
                />
                <Text style={styles.title} numberOfLines={1}>
                  {name}
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }
    return null;
  }
}

export default class Tournaments extends Component<> {
  static navigationOptions = {
    title: 'Tournaments'
  };

  constructor(props) {
    super(props);
    this.state = { tournaments: [] };
  }

  componentDidMount = async () => {
    await this.getTournamentData();
  };

  /**
   * Load all active tournaments
   */
  getTournamentData = async () => {
    try {
      const { token, player } = this.props.navigation.state.params;
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: 'tournaments',
        headers: { Authorization: token }
      });

      this.setState(() => ({
        tournaments: data
      }));

      // if only one tournament navigate to next screen
      if (data.length === 1) {
        await this._skipScreen(token, player, data[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  _skipScreen = async (token, player, tournament) => {
    await this._navigate(token, player, tournament);
  };

  getScoreData = async (token, tournamentId) => {
    // get or create scores for player in selected tournament
    try {
      const query = queryString.stringify({ tournamentId });
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: `enter?${query}`,
        headers: { Authorization: token }
      });
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  _navigate = async (token, player, tournament) => {
    // navigate to next screen
    const scores = await this.getScoreData(token, tournament._id);
    this.props.navigation.navigate('games', {
      token,
      player,
      tournament,
      scores
    });
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item, index }) => (
    <ListItem item={item} index={index} onPressItem={this._onPressItem} />
  );

  _onPressItem = async tournament => {
    // get or create scores for player in selected tournament
    const { token, player } = this.props.navigation.state.params;
    await this._navigate(token, player, tournament);
  };

  render() {
    return (
      <FlatList
        data={this.state.tournaments}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
