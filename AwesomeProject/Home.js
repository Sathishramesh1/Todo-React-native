import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View,FlatList,TouchableOpacity } from 'react-native';

export default function Home() {
   const [todo,setTodo]=useState('');
   const [allTodo,setAllTodo]=useState([]);
   const [editIndex,setEditIndex]=useState(-1);

   const handleAdd = () => {
    if(todo){
        if(editIndex!==-1){
          const updatedTodo=allTodo.map((ele)=>{
            if(editIndex==ele.id){
              ele.title=todo
            }
            return ele
          });
          setAllTodo([...updatedTodo]);
          setTodo('');
          setEditIndex(-1);
         return
        }
         
    const newTodo = { id: Date.now().toString(), title: todo,completed:false }; 
    setAllTodo([...allTodo, newTodo]);
    setTodo('');
        } 
  };


  //to handle the completion status
  const toggleCompletion = (id) => {
    setAllTodo(allTodo.map(todo => 
      todo.id === id ? { ...todo, completed:true } : todo
    ));
  };

  //to handle edit todo name
  const handleEdit=(id)=>{
    setEditIndex(id);
    const task=allTodo.find((ele)=>ele.id==id);
    setTodo(task.title);


  }


  const Item = ({ title,id ,completed}) => {
   
   return  <View style={[styles.item,
   completed && styles.completedItem 
   ]
   }>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={()=>handleEdit(id)}>
          <Text>
          
          Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>toggleCompletion(id)}>
        <Text style={[styles.todoStatus,completed&&styles.completedtodoStatus]}>{completed ? "Completed" : "Incomplete"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Todo App</Text>
      <TextInput 
      onChangeText={(text)=>setTodo(text)} 
      placeholder='Create Todo' 
      value={todo}
       style={styles.input}/>
      <TouchableOpacity
      style={styles.addButton}
      onPress={handleAdd}
      >
      <Text style={styles.addButtonText}>
        {editIndex!==-1?"Update" :"Create"}
      </Text>

      </TouchableOpacity>
      <FlatList
      
        data={allTodo}
        renderItem={({ item }) => <Item title={item.title} id={item.id} completed={item.completed} />}
        keyExtractor={item => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
   padding:40,
   marginTop:40,


  },
  appTitle:{
    fontSize: 32,
    fontWeight:"bold",
    textAlign:'center'
  },
  item: {
     flexDirection:'row',
     justifyContent:'space-between',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius:10
    
  },
  completedItem:{
    flexDirection:'row',
    justifyContent:'space-between',
   backgroundColor: '#50C878',
   padding: 20,
   marginVertical: 8,
   marginHorizontal: 16,
   borderRadius:10,
  },
  
  addButton:{
    backgroundColor:'dodgerblue',
    padding:10,
    borderRadius:5,
    margin:10,
    
  },
  input: {
    borderWidth: 3,
    borderColor: '#777',
    padding: 10,
    margin: 10,
    borderRadius:10,
    fontSize:18,
    
  },
  addButtonText:{
    color:"white",
    fontWeight:'bold',
    textAlign:'center',
    fontSize:18
  },
  actions:{
  flexDirection:'column',
 alignItems:'flex-start'
  },
  todoStatus:{
   
    fontWeight:'bold',
    color:'red',
    marginTop:10,
  },
 completedtodoStatus:{
   
    fontWeight:'bold',
    color:'white',
    marginTop:10,
  }

});
