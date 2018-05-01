import axios from 'axios';
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

export default class Games extends Component<> {
  static navigationOptions = {
    title: 'Games'
  };

  constructor(props) {
    super(props);
    this.state = { games: [] };
  }

  componentDidMount() {
    this.getGameData();
  }

  getGameData = async () => {
    try {
      const { token } = this.props.navigation.state.params;
      console.log(token);
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: 'games',
        headers: { Authorization: token }
      });
      this.setState(() => ({
        games: data
      }));
    } catch (e) {
      console.log(e);
    }
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item, index }) => (
    <ListItem item={item} index={index} onPressItem={this._onPressItem} />
  );
  _onPressItem = (item, index) => {
    const {
      token,
      player,
      tournament,
      scores
    } = this.props.navigation.state.params;
    this.props.navigation.navigate('prediction', {
      item,
      index,
      token,
      player,
      tournament,
      scores,
      games: this.state.games
    });
  };

  render() {
    return (
      <FlatList
        data={this.state.games}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
