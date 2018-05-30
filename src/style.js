import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  actionButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 35
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 60
  },
  nestedContainer: {
    padding: 20,
    marginTop: 30,
    marginBottom: 30
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  input: {
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    padding: 8
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  subheading: {
    fontSize: 15,
    color: '#6c7ba2',
    marginLeft: 30,
    marginRight: 30
  },

  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20
  }
});
