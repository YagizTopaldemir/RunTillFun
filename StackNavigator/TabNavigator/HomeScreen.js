import { StatusBar } from 'expo-status-bar';
import React, { use, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, ImageBackground, Image, TouchableOpacity } from 'react-native';
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

import * as Notifications from 'expo-notifications';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const[distance,setDistance] = useState(null);
    const[distances,setDistances] = useState(0.5322142413532513);
  const[step,setStep] = useState(null);
  const[walktime,setWalktime] = useState(null);
  const[cal,setCal] = useState(null);
  const navigates = useNavigation()

 
const DATE_KEY = "daily_reset_date";


 const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

 const sendTestNotification = async () => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hey!',
    },
    trigger: { seconds: 60, repeats: true },
  });
  await Notifications.cancelScheduledNotificationAsync(identifier);
 
};

  useFocusEffect(
  useCallback(() => {
    const getUserdatas = async () => {
        const today = new Date().toISOString().split("T")[0];

 
  const savedDate = await AsyncStorage.getItem(DATE_KEY);
  const aitoken = await AsyncStorage.getItem("aitoken");

  if (!savedDate) {
    await AsyncStorage.setItem(DATE_KEY, today);
    return;
  }

  if(aitoken == 0){
    console.log("test")
    if(savedDate !== today) {
      await AsyncStorage.setItem("aitoken", "2");
    }
     const aitokens = await AsyncStorage.getItem("aitoken");
    console.log(aitokens)
  }
      
if (savedDate !== today) {
    console.log("Yeni gün! Günlük veriler sıfırlanıyor...");

    await AsyncStorage.setItem("userDistance", "0");
    await AsyncStorage.setItem("userStep", "0");  
    await AsyncStorage.setItem("walktime", "0");
    await AsyncStorage.setItem("cal", "0");

    await AsyncStorage.setItem(DATE_KEY, today);
}

 
   

      const userdistance = await AsyncStorage.getItem("userDistance");

      setDistance(userdistance == null || userdistance == "0"  ? "0.00" : userdistance)
        const userStep = await AsyncStorage.getItem("userStep");
      setStep(userStep == null ? "0" : userStep)
         const walktime = await AsyncStorage.getItem("walktime");
       
      setWalktime(walktime == null || walktime == "0"  ? "0" : walktime)

      const usercal = await AsyncStorage.getItem("cal");
             
      setCal(usercal == null  ? "0" : usercal)
  
    }


    getUserdatas()
  }, [])
);
useEffect(() => {
 const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Bildirim izni verilmedi!');
  }
};

  requestPermissions();
  
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.navbarcont}>
        <View style={styles.navbartext}>
          <Text style={styles.navbartextt}>RunTillFun</Text>
        </View>
        <View style={styles.navbarnoti}>
      <Text ><Ionicons name="notifications" size={24} color="white" /></Text>
        </View>
      </View>

      <View style={styles.homecont}>
        <View style={styles.homeparag}><Text style={styles.homeparagtext}>Bugün kendine dikkat et,yagiz</Text></View>
        <View style={styles.homeh1text}><Text style={styles.homeh1texttex}>Daha iyi bir sağlık için koş</Text></View>
        <TouchableOpacity style={styles.homedistance}>
          <View style={styles.homedistanceleft}>
            <View style={styles.homedistanceleftop}>
              <View style={styles.hdltlogo}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color="#fff" />
              </View>
              <Text style={styles.hdlttitle}>Koştuğun mesafe</Text>
            </View>
            <View style={styles.hdltdistance}>
              <Text style={styles.hdltdistancetextkm}>
                  {distance ? Number(distance).toFixed(2) : "0.00"}

                </Text><Text style={styles.hdltdistancetextkk}>km</Text>
            </View>
            <View style={styles.advice}>
              <Text style={styles.advicetext}>2 kilometre daha koş</Text>
            </View>
          </View>
          <View style={styles.homedistanceright}>
            <Image  style={styles.homedistanceimage} source={require("../assets/rundis.png")} />
            <View style={styles.homedistanceview}></View>
          </View>
        </TouchableOpacity>
          <View style={styles.homesra}>
             
                <TouchableOpacity style={styles.homerateviv}>
                  <View style={styles.homeminleft}>
                    <View style={styles.homeminlogo}>
                      <Ionicons name="timer-outline" size={24} color="red" />
                    </View>
                   
                  </View>
                   <View style={styles.homemintext}>
                      <Text style={styles.homemintexttitle}>Koştuğun süre</Text>
                      <Text style={styles.homemintexttmin}>{formatTime(walktime)} dk</Text>
                    </View>
          
                </TouchableOpacity>
          </View>
            <TouchableOpacity style={styles.homeburntviv}  onPress={sendTestNotification}>
              <View style={styles.homeburncontainer}>
                <View style={styles.homeburnnav}>
                  <View style={styles.homeburnlogo}>
<Ionicons name="scale" size={24} color="orange" />
                  </View>
                 
                </View>
                <View>
                   <Text style={styles.homeburncaltext}>Yaktığın kalori</Text>
                  <Text style={styles.homeburncal}>{Number(cal)} kalori</Text>
                </View>
              </View>
            </TouchableOpacity>
                  <TouchableOpacity style={styles.homeburntviv} onPress={() => navigates.navigate("RTFai")}>
                    <View style={styles.homeburntcontainer} >
                      <MaterialCommunityIcons name="robot-excited" size={30} color="white" />
                      <Text style={styles.homebctext}>RTF AI'ı kullanarak spor aktivitelerini düzenle</Text>
                    </View>
                  </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: '#111',
    gap: 15,
    paddingVertical: 25,
    flexDirection:'column'

  },
  navbarcont: {
    width: width *0.9,
    height:height * 0.05,
    display:"flex",
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:"row"
  },
   
  navbartextt: {
    color:'white',
    fontSize:20,
    fontWeight:600
  },
  navbarnoti: {
    backgroundColor:'#323232ff',
    width:height * 0.04,
    height:height * 0.04,
    borderRadius:'50%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  homeparag: {
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width:'90%'
  },
  homeparagtext: {
    color:"gray",
    fontSize:16,
    fontWeight:600,
    paddingTop:10
  },
  homecont: {
    width:width,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    gap:5

  },
  homeh1texttex:{
    color:'white',
    fontSize:40,
    fontWeight:600
  },
  homeh1text: {
      display:'flex',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width:'90%'
  },
  homedistance: {
    width:width *0.9,
    height:height * 0.23,
    backgroundColor:'#49BD13',
    borderRadius:20,
    marginTop:10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  homesra: {
    width:width * 0.9,
   
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center,',
    flexDirection:'row',marginTop:15
  },
  homestepsviv: {
    width: "48%",
    height: height * 0.1,
    backgroundColor:'#323232ff',
    borderRadius:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:10
  },
  homerateviv: {
       width: width * 0.9,
    height: height * 0.1,
    backgroundColor:'#323232ff',
    borderRadius:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:10
  },
  homeburntviv: {
    width:width * 0.9,
    height:height * 0.11,
    backgroundColor:'#323232ff',
    marginTop:15,
    borderRadius:20,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  homedistanceleft: {
    width:"49%",
    minHeight:height * 0.2,
    display:'flex',
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:'column',
    borderRadius:20,
        overflow:'hidden',
    
  },
  homedistanceright: {
      width:"50%",
    height:height * 0.23,
    display:'flex',
    justifyContent:"center",
    alignItems:'center',

      borderRadius:20,
      overflow:'hidden',
  },
  homedistanceleftop: {
    width:"97%",
    padding:5,
    minHeight:10,
      borderRadius:20,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      gap:4
  },
  hdltdistance: {
    width:"100%",

    minHeight:10,
      borderRadius:20,
      flexDirection:'row',
      display:'flex',
      justifyContent:'center',
      alignItems:'flex-end'
  },
  hdltdistancetextkm: {
    fontSize:45,
    fontWeight:700,
    color:'white'

  },
  hdltdistancetextkk: {
    fontSize:14,
      color:'white',
      fontWeight:600
   
  },
  hdltlogo: {
    width: width * 0.08,
    height:width * 0.08,
    backgroundColor: "#e6e5e577",
    borderRadius:"50%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  hdlttitle: {
    color:'white',
    fontSize:15,
    fontWeight:600
  },
  homedistanceimage: {
    width:'95%',
    height:'95%',
    resizeMode:'contain',
    position:'absolute',
    zIndex:99
  },
  homedistanceview: {
    width:height * 0.15,
    height:height * 0.15,
    backgroundColor:'#3c9115ff',
    borderRadius:'50%'
  },
  advicetext: {
    color:'#ffffffb8',
    fontWeight:600
  },
  homestepleft: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  homesteplogo: {
    width:width * 0.11,
    height: width * 0.11,
       backgroundColor: "#00000077",
    borderRadius:"50%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  homesteptext: {
    display:'flex',
    justifyContent:'center',
    alignItems:'start'
  },
  homesteptexttitle: {
    color:'white'
  },
  homestepstep: {
    color:'white',
    fontSize:19,
    fontWeight:700
  },
  homeminleft: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  homeminlogo: {
    width:width * 0.11,
    height: width * 0.11,
       backgroundColor: "#00000077",
    borderRadius:"50%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  homemintext: {
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'start'
  },
  homemintexttitle: {
    color:'white'
  },
  homemintexttmin: {
    color:'white',
    fontSize:19,
    fontWeight:700
  },
  homeburncontainer: {
    width:"90%",
    height:"90%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    gap:10,
    flexDirection:'row'
  },
  homeburnlogo: {
       width:width *0.11,
    height:width *0.11,
        backgroundColor: "#00000077",
        borderRadius:"50%",
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
  },
  homeburnnav: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  homeburncal: {
    color:'white',
    fontSize:19,
    fontWeight:700
  },
  homeburncaltext: {
    color:'white'
  },
  homeburntcontainer: {
    width:"100%",
    height:'100%',
    backgroundColor:'black',
    borderRadius:20,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  
  },
  homebctext: {
    color:'white',
    fontWeight:600
  }
});
