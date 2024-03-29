import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Modal,
  AntDesign,
  Dimensions
} from "react-native";
import Colors from "../../Colors";
import ToDoModal from "./ToDoModal";

import * as Font from "expo-font";
import DAO from "../../Database/DAO";
import { db } from "../../Database/Connection";

export default class TaskItem extends React.Component {
  state = {
    showListVisible: false,
    taskInformations: this.props.RenderItems,
    listTodos: [],
    showTask: null,
    whenTaskShow: {},
    modalHeight: Dimensions.get("window").height * 0.8
  };
  showAlert(deleteTask) {
    Alert.alert(
      "Delete to do item",
      `Do you want to delete "${deleteTask.title}" ?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.props.deleteTasks(this.state.taskInformations.id)
        }
      ],
      { cancelable: false }
    );
  }
  ShowListModal() {
    DAO(db)
      .getTodoByTasksID(this.state.taskInformations.id)
      .then((data) => {
        this.state.listTodos = [];
        data.forEach((element) => {
          //element.remind = this.convertTimeToDate(element.remind); // Convert 24-hour string time to Date object
          this.state.listTodos.push(element);
          //console.log(element, "get Task");
        });
        this.state.showTask = this.taskitem();
        this.state.whenTaskShow = { backgroundColor: Colors.black };
        this.setState({ showListVisible: !this.state.showListVisible });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  convertTimeToDate(customTime) {
    // create a new date object
    let date = new Date();
    let timeArray = customTime.split(":");

    // set the hour to 10
    date.setHours(parseInt(timeArray[0]));

    // set the minutes to 30
    date.setMinutes(parseInt(timeArray[1]));

    return date;
  }
  CloseListModal() {
    this.state.listTodos = [];
    this.state.showTask = null;
    this.state.whenTaskShow = {};
    this.setState({ showListVisible: !this.state.showListVisible });
  }

  taskitem() {
    return (
      <ToDoModal
        name={this.state.taskInformations.name}
        TaskItem={this.state.listTodos}
        TaskID={this.state.taskInformations.id}
        closeModal={() => this.CloseListModal()}
        color={this.state.taskInformations.color}
        modalHeight={this.state.modalHeight}
      />
    );
  }

  async loadFonts() {
    await Font.loadAsync({
      Rubik: require("../../assets/fonts/static/Rubik-Light.ttf")
    });
  }

  render() {
    const list = this.state.taskInformations;
    //console.log(list, "inviews");
    return (
      <View style={[styles.container, this.state.whenTaskShow]}>
        <Modal
          animationType="slide"
          visible={this.state.showListVisible}
          onRequestClose={() => this.CloseListModal()}
        >
          {this.state.showTask}
        </Modal>
        <TouchableOpacity onPress={() => this.ShowListModal()}>
          <View style={[styles.listContainer, { backgroundColor: list.color }]}>
            <View>
              <TouchableOpacity
                onPress={() => this.showAlert(this.state.taskInformations)}
              >
                <Text
                  style={{
                    paddingVertical: 10,
                    textAlignVertical: "center",
                    fontSize: 20,
                    paddingRight: 20
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.elementContainer}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {list.name}
              </Text>
              <View style={{ marginRight: 25 }}>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.subTitle}>Total Task</Text>
                  <Text style={styles.count}>{list.total}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    zIndex: 1
  },
  listContainer: {
    width: "90%",
    height: 150,
    marginBottom: 60,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderRadius: 6,
    margin: 20,
    alignItems: "flex-end"
  },
  listTitle: {
    fontSize: 28,
    paddingHorizontal: 20,
    fontWeight: "500",
    color: Colors.white,
    fontFamily: "Rubik"
  },
  elementContainer: {
    backgroundColor: "#1C204B",
    width: "100%",
    height: "100%",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  count: {
    fontSize: 49,
    fontWeight: "700",
    fontFamily: "Rubik",
    color: Colors.white
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Rubik",
    color: Colors.white
  }
});
