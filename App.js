import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './StackNavigator/LoginScreen';
import RegisterScreen from './StackNavigator/RegisterScreen';
import TabNavigator from './StackNavigator/TabNavigator/TabNavigator';
import OnBoarding from './StackNavigator/OnBoarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RTFaiScreen from './StackNavigator/RtfaiScreen';
import Changeusername from './StackNavigator/Changeunscreen';
import * as Notifications from 'expo-notifications';
import Changeuserkg from './StackNavigator/changeuserkg';
import constants from "expo-constants";


const Stack = createNativeStackNavigator();

export default function App() {
  console.log(constants.expoConfig.extra.apiKey)
    const [loading, setLoading] = useState(true);
   const [initialRoute, setInitialRoute] = useState('OnBoarding');
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('loggedin');
        console.log(value)
        if (value === 'logged') {
          setInitialRoute('TabNav'); 
        } else if (value === 'notlogged') {
          setInitialRoute('Login'); 
        } else {
          setInitialRoute('OnBoarding'); 
        }
      } catch (e) {
        console.log('AsyncStorage error: ', e);
        setInitialRoute('OnBoarding');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const scheduleDailyNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Günlük Hatırlatma",
      body: "Bugünkü mesajınızı unutmayın!",
    },
    trigger: {
      hour: 9,     
      minute: 36,   
      repeats: true 
    },
  });
};


useEffect(() => {
  scheduleDailyNotification();
}, []);

  if (loading) {

    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center',backgroundColor:'black' }}>
        <ActivityIndicator size="large" color="#49BD13" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name='OnBoarding' component={OnBoarding} options={{headerShown:false}} />
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}} />
        <Stack.Screen name='TabNav' component={TabNavigator} options={{headerShown:false}} />
        <Stack.Screen name='RTFai' component={RTFaiScreen} options={{headerShown:false}} />
        <Stack.Screen name='Nmaecahnge' component={Changeusername} options={{headerShown:false}} />
 <Stack.Screen name='Kgchange' component={Changeuserkg} options={{headerShown:false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 15,
    paddingVertical: 50,
  }
});

