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
      console.log(Object.keys(item));
      const { name, prediction } = item;
      const predictionDetails = prediction || {
        team: '',
        weighting: '',
        correct: ''
      };
      return (
        <TouchableHighlight onPress={this._onPress} underlayColor="#dddddd">
          <View>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {name} {predictionDetails.weighting}
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
  prediction: 'With Prediction',
  noPrediction: 'Without Prediction'
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

  statusBar = () => {
    const { scores, tournament } = this.props.navigation.state.params;
    const {
      correctPredictions,
      pointsScored,
      pointsUsed,
      totalPredictions,
      weightingsRemaining
    } = scores;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    const totalRemaining = weightingsRemaining.reduce(reducer);

    const gamesRemaining = tournament.events - tournament.eventsComplete;

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text>{gamesRemaining} games remaining</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            {correctPredictions} / {totalPredictions} correct
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            {pointsScored} / {pointsUsed} points
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{totalRemaining} points left</Text>
        </View>
      </View>
    );
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

      const { data } = await axios({
        method: 'get',
        baseURL: fixtures.baseUrl,
        url: `games?${query}`,
        headers: { Authorization: token }
      });
      // data = game documents

      // get prediction info for games
      await Promise.all(
        data.map(async game => {
          game.prediction = await this.getPredictionInfo(game._id);
        })
      );

      // set state for games retrieved, with prediction info
      this.setState(() => ({ games: data }));
    } catch (e) {
      console.log(e);
    }
  };

  getPredictionInfo = async game => {
    const { token } = this.props.navigation.state.params;
    const { data } = await axios({
      method: 'get',
      baseURL: fixtures.baseUrl,
      url: `prediction/${game}`,
      headers: { Authorization: token }
    });
    const { team, weighting, correct } = data;
    return { team, weighting, correct };
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
    const filters = Object.keys(filterStrings);
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
          ListHeaderComponent={this.statusBar}
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
