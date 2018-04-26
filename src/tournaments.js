import axios from 'axios';
import queryString from 'querystring';
import React, { Component, PureComponent } from 'react';
import {
  FlatList,
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
  };

  render() {
    const { item } = this.props;
    if (item) {
      const { name } = item;
      // const price = item.price_formatted;
      // const image = item.img_url;
      return (
        <TouchableHighlight onPress={this._onPress} underlayColor="#dddddd">
          <View>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
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
    const { token } = this.props.navigation.state.params;
    this.state = { token, player: {}, tournaments: [] };
  }

  componentDidMount() {
    this.getPlayerData();
    this.getTournamentData();
  }

  getPlayerData = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: 'player',
        headers: { Authorization: this.state.token }
      });
      this.setState(() => ({
        player: data
      }));
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Load all active tournaments
   */
  getTournamentData = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: 'tournaments',
        headers: { Authorization: this.state.token }
      });
      this.setState(() => ({
        tournaments: data
      }));
    } catch (e) {
      console.log(e);
    }
  };

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => (
    <ListItem item={item} index={index} onPressItem={this._onPressItem} />
  );

  _onPressItem = async (item, index) => {
    // get or create scores for player in selected tournament
    const query = queryString.stringify({ tournamentId: item._id });
    const { data } = await axios({
      method: 'get',
      baseURL: fixtures.baseUrl,
      url: `enter?${query}`,
      headers: { Authorization: this.state.token }
    });
    console.log(data);
    // TODO navigate to next screen
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
