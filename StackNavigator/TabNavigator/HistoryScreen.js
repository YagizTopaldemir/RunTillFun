import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRuns } from './GetuserScreen';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

export default function HistoryScreen() {
  const [historydata, setHistorydata] = useState([]);



useFocusEffect(
  useCallback (() => {

  const fetchRuns = async () => {
     
    const data = await getUserRuns();
    
    console.log("Kullanıcının koşuları:", data);
  
    setHistorydata(data)
  };

  fetchRuns();
}, [])
)



const formatDate = (dateString) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
      year: "numeric",
  }).format(date);
};
const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.historycontainer} showsVerticalScrollIndicator={false}>
        <View style={styles.historytitle}>         <MaterialIcons name="history" size={24} color="white" /><Text style={styles.historytitletext}>Koşu Geçmişi</Text></View>
         <View style={styles.historydatacontainer}>
          {historydata?.slice().reverse().map((item, index) => {
  return (
    <TouchableOpacity key={item.id} style={styles.historymapcontainer}>
         <View style={styles.historymapcontainerbottom}>
        <Text style={styles.historymapdatetext}>{formatDate(item.date)}</Text>
       </View>
      <View style={styles.historymapcontainertop}>
        <View style={styles.historymapact}>
           <MaterialCommunityIcons name="map-marker-distance" size={20} color="#fff" />
          <Text style={styles.historymapacttitle}>Mesafe</Text>
          <Text style={styles.historymapactvalue}>{item.distancecount.toFixed(2)}km</Text>
        </View>
         <View style={styles.historymapact}>
            <Ionicons name="fitness" size={24} color="blue" />
          <Text style={styles.historymapacttitle}>pace</Text>
          <Text style={styles.historymapactvalue}>{item.pace}p</Text>
        </View>
         <View style={styles.historymapact}>
              <Ionicons name="timer-outline" size={24} color="red" />
          <Text style={styles.historymapacttitle}>Süre</Text>
          <Text style={styles.historymapactvalue}>{formatTime(item.secondscount)}Dk</Text>
        </View>
         <View style={styles.historymapact}>
           <Ionicons name="scale" size={24} color="orange" />
          <Text style={styles.historymapacttitle}>Kalori</Text>
          <Text style={styles.historymapactvalue}>{item.calcounts.toFixed(0)}cal</Text>
        </View>
      </View>
    
    </TouchableOpacity>
  );
})}

         </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    gap: 15,
    paddingVertical: 50,
  },
  historycontainer: {
    width: width * 0.9,
    height: height * 0.9,
    display:'flex',
     flexDirection:'column',
  
  },
  historytitle: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:10
  },
  historytitletext: {
    color:'#8b8b8bff',
    fontSize:20,
    fontWeight:600
  },
  historymapcontainer: {
    width:width * 0.9,
    height:height * 0.15,
    backgroundColor:'#323232ff',
    borderRadius:20,
        flexDirection:'column',
    justifyContent:"center",
    alignItems:'center'
  },
  historydatacontainer:{
    display:'flex',
    gap:15,
    marginTop:20,
    paddingBottom:30,

  },
  historymapcontainertop: {
    display:"flex",
    width:"90%",
    height:"70%",
        justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:20
    


  },
  historymapcontainerbottom: {
    width:"90%",
    display:'flex',
    height:"20%",
    justifyContent:'center',
    alignItems:'center',
    

  },
  historymapdatetext: {
   color:'#ffffffff',
   fontWeight:700,
   fontSize:16
  },
  historymapacttitle: {
    color:'#fff',
    fontSize:18,
    fontWeight:600

  },
  historymapactvalue: {
  color:'#8b8b8bff',
  
  },
  historymapact: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }
});
