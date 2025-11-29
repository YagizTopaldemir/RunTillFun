import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, ActivityIndicator, Dimensions, TouchableOpacity, Image } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import haversine from "haversine-distance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { saveRunToFirebase } from "./saveRunToFirebase";
import { auth, db } from "../firebase";

const { width, height } = Dimensions.get("window");

export default function RunScreen() {
  const [region, setRegion] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
   const [steps, setSteps] = useState(0);
   const [cal, setCal] = useState(0);
   const [weight,setWeight] = useState(0);
   const [height,setHeight] = useState(0);
   


  const [startTime, setStartTime] = useState(null);
  const [pauseOffset, setPauseOffset] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const watchRef = useRef(null);
  const mapRef = useRef(null);

  const startRun = async () => {
    if (!region) return;

    setRunning(true);
    setPaused(false);
    setRoute([]);
    setDistance(0);

  
    setPauseOffset(0);
    setStartTime(Date.now());
    setSeconds(0);

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => {
        setRoute((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const newDist = haversine(
              { latitude: last.latitude, longitude: last.longitude },
              { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
            );
            setDistance((d) => d + newDist / 1000);
          }
          return [...prev, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }];
        });

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }
      }
    );
  };

  const pauseRun = () => {
    setPaused(true);

    if (watchRef.current) watchRef.current.remove();

   
    if (startTime) {
      setPauseOffset((prev) => prev + (Date.now() - startTime));
    }

    setStartTime(null);
  };

  const resumeRun = async () => {
    setPaused(false);

  
    setStartTime(Date.now());

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => {
        setRoute((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const newDist = haversine(
              { latitude: last.latitude, longitude: last.longitude },
              { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
            );
            setDistance((d) => d + newDist / 1000);
          }
          return [...prev, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }];
        });
      }
    );
  };

  useEffect(() => {
  let sub = Pedometer.watchStepCount((result) => {
    setSteps(result.steps);

  });


  return () => sub && sub.remove();
}, []);



  const stopRun = async () => {
       
    setRunning(false);
    setPaused(false);
    

    // user distance 
    const userOlddistance = await AsyncStorage.getItem("userDistance")
   const oldValue = userOlddistance ? Number(userOlddistance) : 0;
    const newValue = oldValue + Number(distance);
   await AsyncStorage.setItem("userDistance", String(newValue));

    // user step
   const userOldStep = await AsyncStorage.getItem("userPace");
   const oldstepvalue = userOldStep ? Number(userOldStep) : 0;
    const newstep = oldstepvalue + Number(steps);
   await AsyncStorage.setItem("userStep", String(newstep));

   // user walktime
     const useroldwalktime = await AsyncStorage.getItem("walktime");
   const olduserwalktime = useroldwalktime ? Number(useroldwalktime) : 0;

    const newwalktime = olduserwalktime + Number(seconds);
   await AsyncStorage.setItem("walktime", String(newwalktime));

   // user cal
     const useroldcal = await AsyncStorage.getItem("cal");
   const oldusercal = useroldcal ? Number(useroldcal) : 0;
    const newcal = oldusercal + Number(cal);
   await AsyncStorage.setItem("cal", String(newcal)); 


   const paces = distance > 0 ? (seconds / 60 / distance).toFixed(2) : "0.00"

   // run history
   const historyvalue = {
    uid: auth.currentUser.uid,
     id: Date.now(),
    distancecount: distance,
    pace:paces,
    secondscount: seconds,
    calcounts: cal,
    date: new Date().toISOString().split("T")[0]

   }
   const existingHistory = await AsyncStorage.getItem("history");
let historyArray = [];

if (existingHistory) {
  historyArray = JSON.parse(existingHistory); 
}



historyArray.push(historyvalue);

await saveRunToFirebase(historyvalue);

await AsyncStorage.setItem("history", JSON.stringify(historyArray));

    if (watchRef.current) watchRef.current.remove();

    setStartTime(null);
    setPauseOffset(0);
    setSeconds(0);
    setDistance(0);
    setRoute([]);
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;

    if (running && !paused) {
      interval = setInterval(() => {
        if (startTime) {
          const now = Date.now();
          const diff = Math.floor((pauseOffset + (now - startTime)) / 1000);
          setSeconds(diff);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, paused, startTime, pauseOffset]);

  useEffect(() => {
    const getWeight = async () => {
      const weightuser = await AsyncStorage.getItem("userweight")
      const testweight = weightuser ? weightuser : 70;
      setWeight(testweight);
    }



    const getLocation = async () => {
      try {
        const isServiceEnabled = await Location.hasServicesEnabledAsync();
        if (!isServiceEnabled) {
          Alert.alert("Konum kapalı", "Lütfen cihaz ayarlarından konumu aç.");
          return;
        }

        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
          status = newStatus;
        }

        if (status !== "granted") {
          Alert.alert("İzin yok", "Konum izni verilmedi.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        Alert.alert("Hata", "Konum alınamadı: " + error.message);
      }
    };

    getLocation();
    getWeight();
  }, []);

  return (
    <View style={styles.container}>
      {!region ? (
        <View style={styles.info}>
          <ActivityIndicator size="large" color="#49BD13" />
          <Text style={{ color: "white" }}>Konum yükleniyor</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="dark"
            showsMyLocationButton={true}
          >
            {route.length > 1 && <Polyline coordinates={route} strokeWidth={5} strokeColor="#49BD13" />}
          </MapView>

          <View style={styles.mapcontainer}>
            <View style={styles.mapview}>
              <View style={styles.mapviewtop}>

                <Text style={styles.maptext}>GPS Durumu</Text>

              <View style={styles.runcontainer}>
                <View style={styles.runinfo}>
                  <Text style={styles.runinfotext}>{distance.toFixed(2)} km</Text>
                  <Text style={styles.runsecinfotext}>Mesafe</Text>
                </View>
                     <View style={styles.runinfo}>
                    <Ionicons name="footsteps-sharp" size={24} color="white" />
                </View>


                <View style={styles.runinfo}>
                  <Text style={styles.runinfotext}>{formatTime(seconds)}</Text>
                  <Text style={styles.runsecinfotext}>Süre</Text>
                </View>

               
              </View>
              <View style={styles.runcontainer}>
              <View style={styles.runinfo}>
                  <Text style={styles.runinfotext}>
                    {distance > 0 ? (seconds / weight ? weight : 60 / distance).toFixed(2) : "0.00"}
                  </Text>
                  <Text style={styles.runsecinfotext}>Ortalama tempo</Text>
                </View>

                 <View style={styles.runinfo}>
                        <MaterialCommunityIcons name="map-marker-distance" size={24} color="#fff" />

                </View>

                <View style={styles.runinfo}>
                  <Text style={styles.runinfotext}>
                  { distance > 0 ? (seconds / weight ? weight : 60 / distance).toFixed(2) : "0.00"}
                  </Text>
                  <Text style={styles.runsecinfotext}>Yakılan kalori</Text>
                </View>
              </View>
              </View>

              {!running ? (
                <TouchableOpacity style={styles.runstartbut} onPress={startRun}>
                  <Text style={styles.runstartbuttext}>Koşuyu Başlat</Text>
                </TouchableOpacity>
              ) : paused ? (
                <View style={styles.runstartbutcont}>
                  <TouchableOpacity style={styles.runstartbut2} onPress={resumeRun}>
                    <Text style={styles.runstartbuttext}>Devam Et</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.runstartbut2} onPress={stopRun}>
                    <Text style={styles.runstartbuttext}>Koşuyu Bitir</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.runstartbutcont}>
                  <TouchableOpacity style={styles.runstartbut2} onPress={pauseRun}>
                    <Text style={styles.runstartbuttext}>Duraklat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.runstartbut2} onPress={stopRun}>
                    <Text style={styles.runstartbuttext}>Koşuyu Bitir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  info: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  mapviewtop: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    gap:10

  },
  mapcontainer: {
    width: width,
    minHeight: height * 0.3,
    backgroundColor: "#111",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  mapview: {
    width: width * 0.9,
   Height: "90%",
    justifyContent: "space-between",
  
    alignItems: "center",
  },
  maptext: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  runcontainer: {
    width: width * 0.85,
    minHeight: "25%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  runinfo: {
    width: "30%",
    alignItems: "center",
  },
  runinfotext: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  runsecinfotext: {
    color: "#49BD13",
    fontWeight: "700",
    textAlign:'center'
  },
  runstartbut: {
    width: width * 0.8,
    height: height * 0.05,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  runstartbut2: {
    width: width * 0.4,
    height: height * 0.05,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  runstartbuttext: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  runstartbutcont: {
    flexDirection: "row",
    gap: 10,
  },
});
