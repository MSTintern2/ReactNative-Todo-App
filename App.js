import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';

const App = () => {
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [inputTask, setInputTask] = useState("")
  const [list, setList] = useState("")
  const [selectedTaskIndex, setSelectedTaskIndex] = useState("");
  //add data
  const addData = async () => {
    try {
      if (inputTask.length > 0) {
        const index = list.length;
        const responce = await database().ref(`todo/${index}`).set({
          value: inputTask
        });
      } else {
        alert("Please enter some value. Try Again")
      }
    } catch (err) {
      console.log(err)
    }
    setInputTask("")
    setShow(false)
  }
  //clear data
  const clearData = () => {
    setInputTask("")
  }
  //get data
  useEffect(() => {
    getData();
  }, [])
  const getData = async () => {
    try {
      const taskdata = database().ref('todo').on('value', (tempData) => {
        // setList(tempData.val());
        if (tempData.val() !== null) {
          setList(tempData.val());
        } else {
          setList([]); // Set an empty list if the data is null
        }
      });
    } catch (err) {
      console.log(err)
    }
  }
  //update data
  const updateData = async () => {
    try {
      if (inputTask.length > 0) {
        await database().ref(`todo/${selectedTaskIndex}`).update({
          value: inputTask
        })
      } else {
        alert("Please enter some value. Try Again")
      }
    } catch (err) {
      console.log(err)
    }
    setInputTask("")
    setShow1(false)
  }
  const handlePressTask = async (taskIndex, taskValue) => {
    try {
      setSelectedTaskIndex(taskIndex)
      setInputTask(taskValue)
    } catch (err) {
      console.log(err)
    }
  }
  //remove data
  const handlePressDelete = async (taskIndex, taskValue) => {
    try {
      Alert.alert("Delete Alert", `Do you want to delete ${taskValue} ?`, [
        {
          text: "Yes",
          onPress: async () => {
            await database().ref(`todo/${taskIndex}`).remove();
          }
        },
        {
          text: "No",
          onPress: () => { }
        },
      ]);
    } catch (err) {
      console.log(err)
    }
  }
  //alert
  const myAlert = () => {
    Alert.alert(
      "ToDo App Info. 🧾",
      "Powered by React Native and Firebase, this app empowers users to seamlessly manage and maintain data through comprehensive CRUD operations.",
      [
        {
          text: "Good work 👍",
          onPress: async () => { }
        },
      ]);
  }

  return (
    <View style={{ backgroundColor: '#151515', flex: 1 }}>
      {/* status bar */}
      <StatusBar
        backgroundColor="#0AB6AB"
        barStyle="dark-content"
      ></StatusBar>
      {/* header */}
      <View style={{ backgroundColor: '#0AB6AB', paddingBottom: 30, paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
        <Text style={{ color: '#000', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
          ToDo App
        </Text>
        <TouchableOpacity
          onPress={() => myAlert()}>
          <Image
            source={require("./assets/EventsMoreIcon.png")}
          />
        </TouchableOpacity>
      </View>
      {/* add button */}
      <View style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 1 }}>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: "#0AB6AB", alignSelf: 'flex-end', borderRadius: 50, marginBottom: 10, marginRight: 10, }}
          onPress={() => setShow(true)}>
          <Image
            source={require("./assets/ic_round-plus.png")}
          />
        </TouchableOpacity>
      </View>
      {/* add card modal */}
      <Modal transparent={true} visible={show} animationType='slide'>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#0AB6AB', marginHorizontal: 25, borderRadius: 14, elevation: 5, padding: 20, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                Add Task
              </Text>
              <TouchableOpacity
                onPress={() => setShow(false)}>
                <Image
                  source={require("./assets/ic_round-cross.png")}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{ borderColor: '#7D7878', borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 10, fontSize: 18, }}
              placeholder='Enter new task'
              placeholderTextColor='#636e72'
              value={inputTask}
              onChangeText={(text) => setInputTask(text)}
            />
            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: 'flex-end', gap: 10, }}>
              <TouchableOpacity
                style={{ backgroundColor: '#7D7878', paddingVertical: 8, alignSelf: 'flex-end', paddingHorizontal: 16, borderRadius: 8, }}
                onPress={() => clearData()}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#0984e3', paddingVertical: 8, alignSelf: 'flex-end', paddingHorizontal: 16, borderRadius: 8, }}
                onPress={() => addData()}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* task list heading */}
      <View style={{ marginLeft: 25, marginTop: 16, marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '500', }}>
          Tasks List
        </Text>
      </View>
      {/* task list */}
      <FlatList
        data={list}
        renderItem={item => {
          const taskIndex = item.index;
          if (item.item !== null) {
            return (
              <View style={{ backgroundColor: '#2d3436', paddingVertical: 18, marginHorizontal: 25, paddingHorizontal: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '400', flex: 1 }}>
                  {item.item.value}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => handlePressTask(taskIndex, item.item.value)}
                    onPressIn={() => setShow1(true)}>
                    <Image
                      style={{ height: 26, width: 26 }}
                      source={require("./assets/edit.png")}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePressDelete(taskIndex, item.item.value)}>
                    <Image
                      style={{ height: 26, width: 26 }}
                      source={require("./assets/DEleteIcon.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        }}
      />
      {/* update modal */}
      <Modal transparent={true} visible={show1} animationType='slide'>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#0AB6AB', marginHorizontal: 25, borderRadius: 14, elevation: 5, padding: 20, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                Update Task
              </Text>
              <TouchableOpacity
                onPress={() => setShow1(false)}>
                <Image
                  source={require("./assets/ic_round-cross.png")}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{ borderColor: '#7D7878', borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 10, fontSize: 18, }}
              placeholder='Enter new task'
              placeholderTextColor='#636e72'
              value={inputTask}
              onChangeText={(text) => setInputTask(text)}
            />
            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: 'flex-end', gap: 10, }}>
              <TouchableOpacity
                style={{ backgroundColor: '#7D7878', paddingVertical: 8, alignSelf: 'flex-end', paddingHorizontal: 16, borderRadius: 8, }}
                onPress={() => clearData()}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#0984e3', paddingVertical: 8, alignSelf: 'flex-end', paddingHorizontal: 16, borderRadius: 8, }}
                onPress={() => updateData()}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Raleway', fontWeight: '600', }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})