import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, Image, TextInput, TouchableOpacity, Alert } from 'react-native';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";
import { updateProfile } from "firebase/auth";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
   const [email, setEmail] = useState("");
   const [name, setname] = useState("");
   const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const navigate = useNavigation();



    const handleregister = async () => {
      if(!email || !password) {
        Alert.alert("Hata","E-posta ve şifre girin")
        return;
      }

      setLoading(true)
      try{
       const userCredential = await createUserWithEmailAndPassword(auth,email,password);
          Alert.alert("Başarılı 🎉", "Kayıt başarılı! Artık giriş yapabilirsiniz.");
         await updateProfile(userCredential.user, {
          displayName: name,
          }); 

          setEmail("");
      setPassword("");
         navigate.navigate("Login"); 
      }
      catch (error){
       console.log(error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Hata", "Bu e-posta zaten kayıtlı.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Hata", "Geçersiz e-posta formatı.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Hata", "Şifre en az 6 karakter olmalı.");
      } else {
        Alert.alert("Hata", error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.iamgecontainer}>
          <Image
           source={require("../images/footrunimg.jpeg")}
        imageStyle={{ resizeMode: "cover" }} 
        style={styles.imgcontainer} />
      </View>
       <View style={styles.logincontainer}>
        <View style={styles.logincont}>
       <Image style={{width:33,height:33}} source={require("../images/ff6600.png")} />
       
           <Text style={styles.logintext}>Kayıt ol</Text>
          <View style={styles.loginnametextinput}>
              
            <Text style={styles.loginnameform}>
              isim
            </Text>
            <TextInput
                placeholder="İsim"
        value={name}
        onChangeText={setname}
        autoCapitalize="none"
            style={styles.logininputform}   />
           </View>
             <View style={styles.loginnametextinput}>
              
            <Text style={styles.loginnameform}>
              Email
            </Text>
            <TextInput
                placeholder="E-posta"
        value={email}
        onChangeText={setEmail}

        keyboardType="email-address"
        autoCapitalize="none"
            style={styles.logininputform}   />
           </View>
             <View style={styles.loginnametextinput}>
            <Text style={styles.loginnameform}>
              Şifre
            </Text>
            <TextInput
               placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
    
        secureTextEntry
            style={styles.logininputform}   />
           </View>
           <TouchableOpacity style={styles.loginbut}><Text style={{color:'white',fontSize:18,fontWeight:600}} onPress={handleregister}>{loading ? "Kaydediliyor..." : "Kayıt Ol"}</Text></TouchableOpacity>
       <Text style={styles.forgettext}  onPress={() => navigate.navigate("Login")}>Zaten hesabın var mı ? <Text style={styles.forgettextreg}>Giriş yap.</Text></Text>
       <Text style={styles.forgettext}>---- ya da google ile kayıt ol ----</Text>
       <TouchableOpacity style={styles.googlebut}>
        <Image style={styles.googlebuticon} source={require("../images/googleicon.png")} />
        <Text style={styles.googlebuttext}>Google</Text>
       </TouchableOpacity>
        </View>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   backgroundColor:'#49BD13',
    gap: 15,
    paddingVertical: 50,
  },
  iamgecontainer: {
    width:width,
    height: height * 0.25,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
    
  },
  logincontainer: {
    width: width ,
    height: height * 0.95,
    backgroundColor:"#121212ff",
 
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderTopEndRadius:40,
    borderTopLeftRadius:40
  },
  logincont: {
    width:"100%",
    height:"90%",
     display:'flex',
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  logintext: {
    color:'#fff',
    fontSize:25,
    fontWeight:700
  },
  loginnametextinput: {
    width:"85%",
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection:'column',
    gap:10,
    marginTop:20
  },
  loginnameform: {
    color:'white'
  },
  logininputform: {
    backgroundColor:'#fff',
    width:'100%',
    borderRadius:10,
    color:'#000',
    paddingLeft:10
    
  },
  loginbut: {
    width:"85%",
    height:40,
    backgroundColor:'#49BD13',
    marginTop:20,
    borderRadius:10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  
  },
  imgcontainer: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',

  },
  forgettext:{
    color:'#b6b6b6ff',
    marginTop:20,
    fontSize:16,
  },
  googlebut:{
    width:width * 0.85,
    height: height * 0.05,
    borderWidth:2,
    borderColor:"white",
    borderRadius:10,
    marginTop:10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:5
  },
  googlebuttext: {
    color:'white',
    fontSize:18,
    fontWeight:600
  },
  googlebuticon:{
    width:width * 0.07,
    height:width * 0.07
  },
    forgettextreg: {
  color:'#4fa5efff',
    marginTop:20,
    fontSize:16,
  },
});
