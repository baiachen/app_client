import axios from 'axios/index';
import queryString from 'querystring';
import React, { Component, PureComponent } from 'react';
import {
  // Button,
  FlatList,
  // Picker,
  Text,
  // ToastAndroid,
  TouchableHighlight,
  View,
  YellowBox
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import fixtures from './fixtures.json';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
]);

class ListItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item, this.props.index);
  };

  render() {
    // item = game
    const { item } = this.props;
    if (item) {
      // if item has prediction, display info
      // flag ,  weight, correct
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

const filterStrings = {
  all: 'All',
  past: 'Past',
  inPlay: 'In Play',
  future: 'Future',
  withPrediction: 'With Prediction',
  withoutPrediction: 'Without Prediction'
};

export default class Games extends Component<> {
  static navigationOptions = ({ navigation }) => ({
    title: `Games ${
      navigation.getParam('titleFilter')
        ? `(${navigation.getParam('titleFilter')})`
        : ''
    }`
  });

  constructor(props) {
    super(props);
    this.state = { games: [], filter: 'all' };
  }

  componentDidMount = async () => {
    await this.getGameData(this.state.filter);
  };

  getGameData = async filter => {
    this.setState(() => ({ filter }));
    this.props.navigation.setParams({ titleFilter: filterStrings[filter] });
    const { token, tournament } = this.props.navigation.state.params;
    try {
      const query = queryString.stringify({
        tournament: tournament._id,
        filter
      });
      console.log(query);
      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: `games?${query}`,
        headers: { Authorization: token }
      });
      this.setState(() => ({ games: data }));
    } catch (e) {
      console.log(e);
    }
    console.log(`Games: ${this.state.games.length}`);
    await this.getPredictionInfo();
  };

  getPredictionInfo = async games => {
    // make API calls for predictions
    // for game, for player
    // update game state
    // for this.state.games
    // iterate through 1 predictions (shorter), 2 games
    // if game id = prediction.game
    // game.prediction = { flag weight correct}
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
      index,
      token,
      player,
      tournament,
      scores,
      games: this.state.games
    });
  };

  render() {
    const filters = [
      'all',
      'past',
      'inPlay',
      'future',
      'withPrediction',
      'withoutPrediction'
    ];
    const actionButtonItems = filters.map(filter => (
      <ActionButton.Item
        buttonColor="#9b59b6"
        key={filter}
        title={filterStrings[filter]}
        onPress={() => this.getGameData(filter)}
      >
        <Icon name="filter-list" style={styles.actionButtonIcon} />
      </ActionButton.Item>
    ));

    return (
      <View style={styles.rowContainer}>
        <FlatList
          data={this.state.games}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={() => <Text>No games!</Text>}
        />
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          renderIcon={active =>
            active ? (
              <Icon name={'filter-list'} />
            ) : (
              <Icon name={'filter-list'} />
            )
          }
          onPress={() => {
            console.log('hi');
          }}
          style={styles.actionButton}
          verticalOrientation="up"
        >
          {actionButtonItems}
        </ActionButton>
      </View>
    );
  }
}
