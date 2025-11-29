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
  Image
} from 'react-native';
import * as Location from "expo-location";

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';


const { width, height } = Dimensions.get("window");

export default function OnBoarding() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePermissions = async () => {
    setLoading(true);

    setTimeout(() => {
        navigation.navigate("Login");
           setLoading(false);
    }, 3000);
};

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
    <SafeAreaView style={styles.container}>
        
      <ImageBackground
        source={require("../images/manrun.jpeg")}
        style={styles.obimg}
        imageStyle={{ resizeMode: "cover" }}
      >
       
        <View style={styles.overlay} />
    <Text style={styles.toptittle}>
      
     <Text> Run Till Fun</Text>
     <Image style={{width:25,height:25}} source={require("../images/ff6600.png")} />
     </Text>
   
        <View style={styles.textContainer}>
          <Text style={styles.title}>Run Till Fun</Text>
          <Text style={styles.subtitle}>Şimdi sonsuza koşmaya başla</Text>
          <Text style={styles.subtitle2}>Sağlıklı bir yaşama giden ilk adımı bizle at, yeni bir hayat sitili ve sağlıklı yaşama hoş geldin.</Text>
          <TouchableOpacity 
            style={styles.button}
         onPress={handlePermissions}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}  >Başla</Text>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <StatusBar style="light" />
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
  obimg: {
    
    width:width ,
  
    height: height,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textContainer: {
    padding: 30,
   
  },
  title: {
    color: '#49BD13',
    fontSize: 38,
    fontWeight: 'bold',
 
    
  },
  toptittle: {
    position:'absolute',
    top:height * 0.03,
    left:width * 0.03,
 
    fontSize:16,
    fontWeight:600,
    color:'#49BD13',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle2: {
    color:'#ddd',
    fontSize: 14,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#49BD13',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
