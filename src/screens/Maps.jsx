import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Maps = ({navigation}) => {
  const [companyLocation, setCompanyLocation] = useState(null);
  const [userMarkers, setUserMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // 👉 Fetch company location
  const fetchCompanyLocation = async () => {
    try {
      const response = await fetch(
        "https://binwinbackend.onrender.com/displaycompany?user_id=3"
      );
      const data = await response.json();

      if (response.ok) {
        setCompanyLocation({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          companyName: data.company_name || "Company HQ",
        });
      } else {
        Alert.alert("Failed to load company data");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      Alert.alert("Error fetching company data");
    }
  };

  // 👉 Fetch user profiles
  const fetchUserProfiles = async () => {
    try {
      const response = await fetch(
        "https://binwinbackend.onrender.com/getalluserprofile"
      );
      const data = await response.json();

      if (response.ok) {
        const markers = data.locations.map((user) => ({
          latitude: parseFloat(user.latitude),
          longitude: parseFloat(user.longitude),
          user_name: user.name,
          bio: user.bio || "User Location",
        }));
        setUserMarkers(markers);
      } else {
        Alert.alert("Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error fetching user data");
    }
  };

  // 👉 Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchCompanyLocation();
      await fetchUserProfiles();
      setLoading(false);
    };

    loadData();
  }, []);

  // 👉 Show loader until company location is fetched
  if (loading || !companyLocation) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: companyLocation.latitude,
          longitude: companyLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* 🔴 Red Marker - Company Location */}
        <Marker
          coordinate={{
            latitude: companyLocation.latitude,
            longitude: companyLocation.longitude,
          }}
          title={companyLocation.companyName}
          description="Company Headquarters"
          pinColor="red"
        />

        {/* 🟢 Green Markers - User Locations */}
        {userMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={`User: ${marker.user_name}`}
            description={marker.bio}
            pinColor="green"
            onPress={() => navigation.navigate("ScheduleProfile", { user_id: marker.user_id })}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Maps;