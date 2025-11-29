import React, { useState } from "react";
import { View, TextInput, Button, Text, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { updateUserName } from "./TabNavigator/updateusernamescreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");

export default function Changeusername({ navigation }) {
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState("");

  const handleChangeName = async () => {
    const result = await updateUserName(newName);
    const json = await AsyncStorage.getItem("user")

    let user = JSON.parse(json);

       user.name = newName;
    
    await AsyncStorage.setItem("user", JSON.stringify(user));

    if (result.success) {
      setStatus("İsim güncellendi!");
    } else {
      setStatus("Hata: " + result.message);
    }
  };

  return (
      <SafeAreaView style={styles.container}>
             <View style={styles.aicontainer}>
              <View style={styles.aicontainernavbar}>
                <TouchableOpacity style={styles.gobackbutnavbar} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={33} color="black" />
                </TouchableOpacity>
                <View style={styles.navbartext}>
                  <Text style={{color:'white',fontSize:18,fontWeight:700}}>Kullanıcı adını değiştir</Text>
                </View>
                <View style={styles.gobackbutnavbar}>
                </View>
              </View>
              <View style={styles.aicontainerchat}>
       
                <View style={styles.aicchattextbar}>
                  <TextInput
            value={newName}
            onChangeText={setNewName}
          keyboardType="default" 
        inputMode="text"
                  style={styles.chattextbar} placeholderTextColor="#616161ff" placeholder='Kullanıcı adını değiştir'></TextInput>
                  <TouchableOpacity style={styles.sendbut} onPress={handleChangeName} >
                      <Ionicons name="chevron-back" size={33} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
             </View>
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#111',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  aicontainer: {
    width: width * 0.9,
    height: height * 0.9,
     display:'flex',
    justifyContent:'start',
    alignItems:'center',
   
  },
  aicontainernavbar: {
    width:"100%" ,
    minHeight: height * 0.06,

    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row'
  },
  gobackbutnavbar: {
    width:width * 0.1,
    height: width * 0.1,
    backgroundColor:'white',
    borderRadius:10,
        display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  aicontainerchat: {
      width:"100%" ,
    minHeight: height * 0.85,

    display:'flex',
    justifyContent:"center",
    alignItems:'center',
    flexDirection:'column'
  },
  aicchataitextpart: {
    width:"100%",
    height: "75%",
    paddingTop:20

  },
  aicchattextbar: {
    width:"100%",
    height:"15%",
    display:'flex',
    justifyContent:"center",
    alignItems:'center',
    flexDirection:'column',
    gap:20
  },
  chattextbar: {
    width:"90%",
    height: height * 0.06,
    backgroundColor:'#232323ff',
    borderRadius:10,
    color:'white',
    paddingLeft:20
  },
  sendbut: {
    width:"90%",
       height: height * 0.055,
    backgroundColor:'#b9b9b9ff',
      borderRadius:10,
        display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  airesponsetext: {
    color:'white',
   
  },
  airesponsecont: {
backgroundColor:'#232323ff',
padding:10,
borderRadius:10,
minWidth:"50%",
minHeight:height * 0.05
  }
});
