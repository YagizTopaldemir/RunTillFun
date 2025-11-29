import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  ActivityIndicator, 
  ImageBackground, 
  Dimensions, 
  TouchableOpacity, 
  Image,
  ScrollView,
  TextInput
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRunAdvice } from './Openaiapi';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("window");

export default function RTFaiScreen() {
  const [results,setResult] = useState("")
  const [message,setMessage] = useState("")
  const [lasttext,setLasttext] = useState("");
    const navigation = useNavigation();
 
  const dailytoken = async () => {
    const token = await AsyncStorage.getItem("aitoken");
     
    if(token >0) {
            handleGetAdvice();
              console.log(token);

      const tokenminus = int(token) -1;
               console.log(tokenminus);
      await AsyncStorage.setItem("aitoken",String(tokenminus));
    } else {
      Alert.alert("Günlük hakkın doldu","Günlük rtf ai kullanım hakkınız doldu")
    }

   
  }

  const handleGetAdvice = async () => {
   
    const result = await getRunAdvice({
      messageuser:  message
    });
    setMessage("")
   setResult(result) 
    await AsyncStorage.setItem("lasttext",results);
   const textailast =   await AsyncStorage.getItem("lasttext");
    setLasttext(textailast)
 
  };
 
  

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.aicontainer}>
        <View style={styles.aicontainernavbar}>
          <TouchableOpacity style={styles.gobackbutnavbar} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={33} color="black" />
          </TouchableOpacity>
       
          <View style={styles.navbartext}>
            <Text style={{color:'white',fontSize:18,fontWeight:700}}>RTF AI</Text>
          </View>
          <View style={styles.gobackbutnavbar}>
               <MaterialCommunityIcons name="robot-excited" size={30} color="black" />
          </View>
        </View>
        <View style={styles.aicontainerchat}>
          <ScrollView style={styles.aicchataitextpart}>
               {lasttext ? 
          (
             <View style={styles.airesponsecont}>
               <Text style={styles.airesponsetext}>
              {lasttext ? lasttext : "RTF AI"}
            </Text>
            </View>
          )
           :
            (
              <></>
            ) }
            <View style={styles.airesponsecont}>
               <Text style={styles.airesponsetext}>
              {results ? results : "RTF AI"}
            </Text>
            </View>
          </ScrollView>
          <View style={styles.aicchattextbar}>
            <TextInput
            value={message}
            onChangeText={setMessage}
    keyboardType="default" 
  inputMode="text"
            style={styles.chattextbar} placeholderTextColor="#616161ff" placeholder='Hemen mesaj gönder...'></TextInput>
            <TouchableOpacity style={styles.sendbut} onPress={dailytoken}>
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
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:'column'
  },
  aicchataitextpart: {
    width:"100%",
    height: "75%",
    paddingTop:20,
    display:'flex',
    gap:20

  },
  aicchattextbar: {
    width:"100%",
    height:"15%",
    display:'flex',
    justifyContent:"flex-end",
    alignItems:'center',
    flexDirection:'row',
    gap:10
  },
  chattextbar: {
    width:"80%",
    height: height * 0.06,
    backgroundColor:'#232323ff',
    borderRadius:10,
    color:'white',
    paddingLeft:20
  },
  sendbut: {
    width:"15%",
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
minHeight:height * 0.05,
marginTop:10
  }
});
