import axios from 'axios';
import React, { Component, PureComponent } from 'react';

import {
  Button,
  FlatList,
  Picker,
  Text,
  TouchableHighlight,
  View,
  ViewPagerAndroid
} from 'react-native';
import fixtures from './fixtures.json';

import styles from './style';

class ListItem extends PureComponent {
  _onPress = () => {};

  render() {
    const { item } = this.props;
    if (item) {
      const { name, shortName } = item;
      return (
        <TouchableHighlight onPress={this._onPress} underlayColor="#dddddd">
          <View>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {shortName}
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

export default class Prediction extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${
      navigation.getParam('title')
        ? `${navigation.getParam('title')}`
        : 'Predictions'
    }`
  });

  constructor(props) {
    super(props);
    const { index } = this.props.navigation.state.params;
    // this.state = { game: '' };
    this._setHeader(index);
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item, index }) => <ListItem item={item} index={index} />;

  _setHeader = index => {
    const { games } = this.props.navigation.state.params;
    this.props.navigation.setParams({ title: games[index].name });
  };

  savePrediction = async () => {
    const { token, tournament } = this.props.navigation.state.params;
    const { game, team, weighting } = this.state;
    console.log(token, game, team, weighting);
    const { data } = await axios({
      method: 'post',
      baseURL: fixtures.baseUrl,
      data: { tournament: tournament._id, game, team, weighting },
      url: 'predictions',
      headers: { Authorization: token }
    });
    console.log(data);
  };

  render() {
    let { index } = this.props.navigation.state.params;
    const { games, scores } = this.props.navigation.state.params;
    const items = [];

    function formatDate(d) {
      const date = new Date(d);
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const hours = date.getHours();
      const day = date.getDate();
      const month = date.getMonth() === 5 ? 'June' : 'July';
      const year = date.getFullYear();
      return `${hours}:${minutes}   ${day} ${month} ${year}`;
    }
    function futureDate(d) {
      return new Date(d) > new Date();
    }

    for (let i = 0; i < games.length; i += 1) {
      if (games[i]) {
        const pickTeams = games[i].teams.map((item, key) => (
          <Picker.Item key={key} value={item._id} label={item.shortName} />
        ));

        const pickWeightings = scores.weightingsRemaining.map((item, key) => {
          const label = item.toString();
          return <Picker.Item key={key} value={item} label={label} />;
        });

        const teamPicker = (
          <Picker
            style={{ height: 50, width: 200 }}
            prompt="Predict Winner"
            selectedValue="Predict Winner" // {this.state && this.state.team}
            onValueChange={value => {
              this.setState({ team: value });
            }}
            enabled={futureDate(games[i].startTime)}
          >
            {pickTeams}
          </Picker>
        );
        const weightingPicker = (
          <Picker
            style={{ height: 50, width: 100 }}
            selectedValue={this.state && this.state.weighting}
            onValueChange={value => {
              this.setState({ weighting: value });
            }}
            enabled={futureDate(games[i].startTime)}
          >
            {pickWeightings}
          </Picker>
        );

        const saveButton = (
          <View style={styles.nestedContainer}>
            <Button title="Save Prediction" onPress={this.savePrediction} />
          </View>
        );

        const teamList = (
          <FlatList
            data={games[i].teams}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        );

        const startTime = <Text>{formatDate(games[i].startTime)}</Text>;

        const gameDetails = (
          <View key={i}>
            {teamList}
            {startTime}
            {teamPicker}
            {weightingPicker}
            {saveButton}
          </View>
        );

        items.push(gameDetails);
      } else {
        index -= 1;
      }
    }

    return (
      <ViewPagerAndroid
        style={styles.viewPager}
        initialPage={index}
        onPageSelected={event => {
          this._setHeader(event.nativeEvent.position);
        }}
      >
        {items}
      </ViewPagerAndroid>
    );
  }
}
