import React, { useEffect, useState } from "react";
import { Alert, View, StatusBar, FlatList } from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
import firestore, { firebase } from '@react-native-firebase/firestore';

export default function App() {
  const [data, setData] = useState([]);

  const submitHandler = (value, date) => {
    const getdate=date.getDate() + "-"+ parseInt(date.getMonth()+1) +"-"+parseInt(date.getFullYear()+543);
    
    firebase.firestore()
      .collection('todotask')
      .add({
        value: value,
        date: getdate,
        // date: date.toISOString().slice(0, 10),
        key: Math.random().toString()
      }).then(() => {
        console.log('Compelete!!')
      });


    // setData((prevTodo) => {
    //   return [
    //     {
    //       value: value,
    //       date: date.toISOString().slice(0, 10),
    //       key: Math.random().toString(),
    //     },
    //     ...prevTodo,
    //   ];
    // });
  };
  useEffect(() => {
    const showtask = firestore()
      .collection('todotask')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            value: '',
            date: '',
            ...documentSnapshot.data()
          };
        });
        setData(data);

      });
    return () => showtask();
  }, []
  );



  const deleteItem = (key) => {
    Alert.alert(
      'Delete Task in Calenda',
      'Are you sure?',
      [
        {
          text: 'Yes', onPress: () => {
            firebase.firestore().collection('todotask').doc(key).delete();
            console.log('Deleted ', key)
          }

        },
        { text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel' },
      ],
      {
        cancelable: true
      }
    );

    // setData((prevTodo) => {
    //   return prevTodo.filter((todo) => todo.key != key);
    // });
  };



  const searchItem = (keyword) => {

  }

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="midnightblue" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header searchItem={searchItem} />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TodoList item={item} deleteItem={deleteItem} />
          )}
        />
        <View>
          <AddInput
            submitHandler={submitHandler}
          />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: midnightblue;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;