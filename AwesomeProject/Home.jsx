import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { Alert } from 'react-native'

export default function Home() {
  const [todo, setTodo] = useState('')
  const [allTodo, setAllTodo] = useState([])
  const [editIndex, setEditIndex] = useState(-1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken')
        const response = await axios.get(
          'https://13.234.238.94:3000/api/todo/v1/getall',
          {
            headers: {
              'x-auth-token': token,
            },
          },
        )
        setAllTodo([...response.data])
      } catch (error) {
        console.error(
          'fetch failed:',
          error.response ? error.response.data : error.message,
        )
      }
    }
    fetchData()
  }, [allTodo])

  const handleCreate = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await axios.post(
        'https://13.234.238.94:3000/api/todo/v1/create',
        { title: todo },
        {
          headers: {
            'x-auth-token': token,
          },
        },
      )
      // console.log(response)
    } catch (error) {
      console.error(
        'unable to create todo:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const handleAdd = async () => {
    if (todo) {
      if (editIndex !== -1) {
        const updatedTodo = allTodo.map((ele) => {
          if (editIndex == ele._id) {
            ele.title = todo
          }
          return ele
        })

        await handleTitleUpdate(editIndex)
        setAllTodo([...updatedTodo])

        setTodo('')
        setEditIndex(-1)
        return
      }

      await handleCreate()
      setTodo('')
    }
  }

  const handleUpdate = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await axios.patch(
        `https://13.234.238.94:3000/api/todo/v1/mark/${id}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        },
      )
      // console.log(response)
    } catch (error) {
      console.error(
        'unable to update:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const handleTitleUpdate = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      const response = await axios.post(
        `https://13.234.238.94:3000/api/todo/v1/update/${id}`,
        { title: todo },
        {
          headers: {
            'x-auth-token': token,
          },
        },
      )
      // console.log(response)
    } catch (error) {
      console.log(error)
      console.error(
        'unable to update:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  //to handle the completion status
  const toggleCompletion = async (id) => {
    await handleUpdate(id)
    setAllTodo(
      allTodo.map((todo) =>
        todo._id === id ? { ...todo, completed: true } : todo,
      ),
    )
  }

  //to handle edit todo name
  const handleEdit = async (id) => {
    setEditIndex(id)
    const task = allTodo.find((ele) => ele._id === id)
    setTodo(task.title)
  }

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('userToken')
      await axios.delete(
        `https://13.234.238.94:3000/api/todo/v1/remove/${id}`,
        {
          headers: {
            'x-auth-token': token,
          },
        },
      )
      setAllTodo(allTodo.filter((todo) => todo._id !== id))
      console.log('Todo deleted successfully')
    } catch (error) {
      console.error(
        'Unable to delete todo:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const Item = ({ title, id, completed, onDelete }) => {
    const confirmDelete = () => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this todo?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => onDelete(id) },
        ],
      )
    }

    return (
      <TouchableOpacity>
        <View style={[styles.item, completed && styles.completedItem]}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleEdit(id)}
              style={styles.edit}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDelete()}
              style={styles.delete}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleCompletion(id)}>
              <Text
                style={[
                  styles.todoStatus,
                  completed && styles.completedtodoStatus,
                ]}
              >
                {completed ? 'Completed' : 'Incomplete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Todo App</Text>
      <TextInput
        onChangeText={(text) => setTodo(text)}
        placeholder="Create Todo"
        value={todo}
        style={styles.input}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? 'Update' : 'Create'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={allTodo}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            id={item._id}
            completed={item.completed}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
    marginTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  completedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#50C878',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },

  addButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  input: {
    borderWidth: 3,
    borderColor: '#777',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  todoStatus: {
    fontWeight: 'bold',
    color: 'red',
    marginTop: 10,
  },
  completedtodoStatus: {
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  edit: {
    padding: 5,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  delete: {
    marginTop: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
})
