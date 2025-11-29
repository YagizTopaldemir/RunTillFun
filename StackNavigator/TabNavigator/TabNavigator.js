import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import RunScreen from './RunScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';


const { width, height } = Dimensions.get("window");

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
       tabBarStyle: {
      backgroundColor: '#111', 
      height: height * 0.08, 
      borderTopWidth: 0, 
      elevation: 0,
      justifyContent:'center',
      alignItems:'center',
      display:'flex',
       paddingTop: 10,
      paddingBottom: 10
    }, tabBarActiveTintColor: '#49BD13', 
    tabBarInactiveTintClor: '#ccc', 
    tabBarShowLabel: false

  
    }}
    >
        <Tab.Screen name='Home' component={HomeScreen} options={{headerShown:false, tabBarIcon: ({ color, size }) => (
      <Entypo name="home" size={size} color={color} />
    ),
  }} />
        <Tab.Screen name='Run' component={RunScreen} options={{headerShown:false, tabBarIcon: ({color,size}) => (
          <FontAwesome5 name="running" size={size} color={color} />
        ) }} />
        <Tab.Screen name='History' component={HistoryScreen} options={{headerShown:false, tabBarIcon: ({color,size}) => (
         <MaterialIcons name="history" size={size} color={color} />
        )}} />
        <Tab.Screen name='Profil' component={ProfileScreen} options={{headerShown:false, tabBarIcon: ({color,size}) => (
<MaterialCommunityIcons name="account-circle" size={size} color={color} />
        )}} />
       
    </Tab.Navigator>
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
