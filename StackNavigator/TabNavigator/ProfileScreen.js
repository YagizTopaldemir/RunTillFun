import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [userkg,setUserkg] = useState("");
 
useFocusEffect(
  useCallback(() => {
  const loadUserInfo = async () => {
    try {
      const userinfoString = await AsyncStorage.getItem('user');
      const userkg = await AsyncStorage.getItem("userweight")
      if (userinfoString) {
        const userinfo = JSON.parse(userinfoString);
        const { name, email } = userinfo;
        setUserInfo({ name, email });
      }
      if(userkg) {
        setUserkg(userkg)
      }

    } catch (e) {
      console.log('Error loading user info: ', e);
    }

  
  };


 
  loadUserInfo();
}, [])
)

  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedin', 'notlogged');
    navigation.replace('Login'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
       <View style={styles.profilecontainertop}>
        <View style={styles.profilelefts}></View>
        <View style={styles.profilecontainertitle}><Text style={styles.profiletitletext}>Profil</Text></View>
        <View style={styles.profilecontainerlogout}>
          <TouchableOpacity style={styles.profilelogoutbut} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="red" />
          </TouchableOpacity>
        </View>
       </View>
       <View style={styles.profileinfo}>
        <View style={styles.profilepic}>
          <MaterialCommunityIcons name="face-woman-outline" size={54} color="black" />
        </View>
        <View style={styles.profilename}><Text style={{color:'white',fontSize:20,
          fontWeight:600
        }}>{userInfo.name}</Text></View>
        <View style={styles.profileemail}><Text style={{color:'#bcbcbcff',fontSize:14,fontWeight:400}}>{userInfo.email}</Text></View>
       </View>
       <View style={styles.profilesettingcont}>
        <View style={styles.profilesettiing}>
          <TouchableOpacity style={styles.profilesettingname}>
            <View style={styles.profilesettingnamepic}>
              <MaterialCommunityIcons name="face-man" size={44} color="green" />
            </View>
            <TouchableOpacity style={styles.profilechangeinfonametext} onPress={() => navigation.navigate("Nmaecahnge")}>
              <Text style={{color:'#fff',fontSize:17,fontWeight:700}}>Kullanıcı adı</Text>
              <Text style={{color:'#9b9b9bff',fontSize:14,fontWeight:600}}>{userInfo?.name}</Text>
            </TouchableOpacity>
            
            <View>
              <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
            </View>
          </TouchableOpacity>

           <TouchableOpacity style={[styles.profilesettingname,{borderTopLeftRadius:0,borderTopRightRadius:0}]}>
            <View style={styles.profilesettingnamepic}>
              <MaterialCommunityIcons name="weight-kilogram" size={44} color="green" />
            </View>
            <TouchableOpacity style={styles.profilechangeinfonametext} onPress={() => navigation.navigate("Kgchange")}>
              <Text style={{color:'#fff',fontSize:17,fontWeight:700}}>Kullanıcı kilosu</Text>
              <Text style={{color:'#9b9b9bff',fontSize:14,fontWeight:600}}>{userkg ? userkg : "60"}Kg</Text>
            </TouchableOpacity>
            
            <View>
              <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
            </View>
          </TouchableOpacity>


        </View>
       </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: '#111',
    gap: 15,
    paddingVertical: 40,
  },
  profilecontainer: {
    width: width * 0.9,
    height: height * 0.9,
    justifyContent:'start',
    alignItems:'center',

  },
  profilecontainertop: {
    width: width * 0.9,
    height: height * 0.08,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row'
   
  },
  profilecontainertitle: {
    color:'white',
    fontSize:18,
    fontWeight:600
  },
  profiletitletext: {
    color:'white',
    fontSize:22,
    fontWeight:700
  },
  profilecontainerlogout: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  profilelogoutbut: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor:'white',
    borderRadius:"50%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  profilelefts: {
    width:width * 0.1,
    height: width * 0.1
  },
  profileinfo: {
    width:width * 0.9,
    height: height * 0.2,
   
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  profilesettingcont: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor:'#232323ff',
    borderRadius:20,
      display:'flex',

    alignItems:'center',
    
  },
  profilesettiing: {
    
   display:'flex',
   justifyContent:'center',
   alignItems:'start',
   flexDirection:'column'
   
  },
  profilesettingname: {
     width:"100%",
    height:height * 0.12,
    borderTopRightRadius:20,
      borderTopLeftRadius:20,
    borderBottomWidth:2,
    backgroundColor:'#80808062',
     display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    padding:20
  },
  profilesettingnamepic: {
    width:width * 0.15,
    height: width * 0.15,
    borderRadius:'50%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffffffff',
  },
  profilechangeinfonametext: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'start'
  },
  profilepic: {
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor:"#ffffffcb",
    borderRadius:"50%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }

});
