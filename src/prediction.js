import React, { Component, PureComponent } from 'react';
import {
  FlatList,
  Picker,
  Text,
  TouchableHighlight,
  View,
  ViewPagerAndroid
} from 'react-native';
import styles from './style';

class ListItem extends PureComponent {
  _onPress = () => {};

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

export default class Prediction extends Component {
  static navigationOptions = {
    title: 'Prediction'
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item, index }) => <ListItem item={item} index={index} />;

  render() {
    let { index } = this.props.navigation.state.params;
    const { games, scores } = this.props.navigation.state.params;
    const items = [];
    for (let i = 0; i < games.length; i += 1) {
      if (games[i]) {
        const currentTime = new Date();
        if (currentTime < games[i].startTime) {
          // prediction available
        } else if (
          games[i].startTime < currentTime &&
          currentTime < games[i].finishTime
        ) {
          // prediction closed
        } else {
          // prediction closed
          // display winner
        }

        const pickTeams = games[i].teams.map((item, key) => (
          <Picker.Item key={key} value={item.name} label={item.name} />
        ));

        const pickWeightings = scores.weightingsRemaining.map((item, key) => {
          const label = item.toString();
          return <Picker.Item key={key} value={item} label={label} />;
        });

        const teamPicker = (
          <Picker style={{ height: 50, width: 100 }}>{pickTeams}</Picker>
        );
        const weightingPicker = (
          <Picker style={{ height: 50, width: 100 }}>{pickWeightings}</Picker>
        );

        const gameDetails = (
          <View key={i}>
            <Text style={styles.heading}>{games[i].name}</Text>
            <Text style={styles.heading}>{games[i].startTime}</Text>
            {teamPicker}
            {weightingPicker}

            <FlatList
              data={games[i].teams}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </View>
        );

        items.push(gameDetails);
      } else {
        index -= 1;
      }
    }

    return (
      <ViewPagerAndroid style={styles.viewPager} initialPage={index}>
        {items}
      </ViewPagerAndroid>
    );
  }
}
