import { StyleSheet } from "react-native";

export default StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#656565"
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
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch"
  },
  input: {
    borderWidth: 1,
    borderColor: "#48BBEC",
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
    borderColor: "#48BBEC",
    borderRadius: 8,
    color: "#48BBEC"
  },
  image: {
    width: 217,
    height: 138
  }
});
