import { useState, useEffect, useRef, useCallback } from "react";
import { FAB } from '@rneui/themed';
import {
  Platform,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from "react-native-user-avatar";

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  const initialRender = useRef(false)

  const getUsers = useCallback(()=> {
    fetch(
        `https://random-data-api.com/api/v2/users?size=10`
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        return response.json()
        })
        .then((data) => {
          setUsers(data)
        })
      .catch((e) => {
        console.error("Error fetching data: ", e);
      });
  },[])

  const getUser = useCallback(()=> {
    fetch(
        `https://random-data-api.com/api/v2/users`
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unsuccessful fetch")
        }
        return response.json()
        })
        .then((data) => {
          setUsers(oldArray => [...oldArray,data] )
        })
      .catch((e) => {
        console.error("Error fetching data: ", e);
      });
  },[])

  const handleReflesh = () => {
    setRefreshing(true)
    getUsers()
    setRefreshing(false)
  }


  useEffect(() => {
    getUsers();
  }, []) 

  useEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
      return;
    }
    getUser()
  }, [getUser]);

  const renderItem = ({ item }) => (
    <View
      style={
        Platform.OS === "android"
          ? {
              flex: 1,
              flexDirection: "row",
              padding: 16,
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }
          : {
              flex: 1,
              flexDirection: "row-reverse",
              padding: 16,
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }
      }
    >
      <UserAvatar
        style={styles.avatar}
        size={50}
        name={item.first_name}
        src={item.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.first}>{item.first_name}</Text>
        <Text style={styles.last}>{item.last_name}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshing={refreshing}
          onRefresh={handleReflesh}
        />
        <FAB
        icon={{ name: 'add', color: 'white' }}
        color="green"
        size="large"
        placement="right"
        onPress={getUser}
      />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  first: {
    fontSize: 16,
  },
  last: {
    fontSize: 14,
    color: "#355",
  },
});