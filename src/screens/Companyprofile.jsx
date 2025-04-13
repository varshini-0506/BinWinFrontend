import React, { useEffect, useState } from "react"; 
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Companyprofile = ({navigation}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
      const fetchUserid = async () => {
        try {
          const storedData = await AsyncStorage.getItem("@UserStore:data");
          //console.log("Raw Stored Data:", storedData);
          
          if (!storedData) {
            Alert.alert("No user data found in AsyncStorage.");
            //console.warn("No user data found in AsyncStorage.");
            return;
          }
    
          const parsedData = JSON.parse(storedData);
          //console.log("Parsed User ID:", parsedData.user_id);
          setUserId(parsedData.user_id);
        } catch (error) {
          Alert.alert("Failed to fetch user ID");
          //console.error("Error fetching user ID:", error);
        }
      };
    
      fetchUserid();
    }, []);    
    
    useEffect(() => {
      if (!userId) {
        Alert.alert("User ID is null, skipping API call...");
        //console.log("User ID is still null, skipping API call...");
        return;
      }
    
      const fetchProfile = async () => {
        try {
          //console.log("Fetching profile for user ID:", userId);
          const response = await fetch(`https://binwinbackend.onrender.com/displaycompanyprofile?user_id=${userId}`);
          const data = await response.json();
          //console.log("Fetched Data:", data.profile);
    
          if (data.profile) {
            setProfileData(data.profile);
          } else {
            setError("Failed to load profile");
          }
        } catch (error) {
          Alert.alert("Failed to load profile");
          //console.error("Error fetching profile:", error);
          setError("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };
   fetchProfile();
    }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#166534" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const { company_name, location, contact_number, price, profile_image, visits , building_images} = profileData || {};

  if (!profileData) {
    return <Text style={styles.errorText}>Loading profile data...</Text>;
  }  

  return (
    <ScrollView style={styles.container}>
      {/* Header with Edit Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.editButton} onPress={()=>navigation.navigate("AddCompanyprofile")}>
          <Text style={styles.editButtonText} >✏ Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image Section */}
      <Text style={styles.sectionTitle}>🏢 Company Profile</Text>
      <View style={styles.header}>
        <Image
          source={{ uri: profile_image || "https://www.w3schools.com/w3images/avatar2.png" }}
          style={styles.profileImage}
        />
        <Text style={styles.companyName}>{company_name || "Not Set"}</Text>
        <Text style={styles.username}>@{company_name?.toLowerCase().replace(/\s+/g, "") || "company"}</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        <Text style={styles.detailText}>📍 Location: {location || "Not Set"}</Text>
        <Text style={styles.detailText}>📞 Contact: {contact_number || "Not Set"}</Text>
        <Text style={styles.detailText}>💰 Price: {price ? `$${price}` : "$10"}</Text>
        <Text style={styles.detailText}>👀 Visits: {visits || 0}</Text>
      </View>

      {/* Company Building Images Section */}
      <Text style={styles.sectionTitle}>🏢 Company Images</Text>
      {building_images ? (
  <View style={styles.buildingContainer}>
    {building_images
      .replace("{", "") // Remove '{'
      .replace("}", "") // Remove '}'
      .split(",") // Split into an array
      .map((img, index) => (
        <Image 
          key={index} 
          source={{ uri: img.trim() }} // Trim spaces from URLs
          style={styles.buildingImage} 
        />
      ))}
  </View>
) : (
  <Text style={styles.noImageText}>No Building Images Available</Text>
)}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 18,
    marginTop: 20,
  },
  headerContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#166534",
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 12,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90, // Fully rounded
    borderWidth: 4,
    borderColor: "#166534",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginTop: 16,
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
  },
  profileDetails: {
    backgroundColor: "#bbf7d0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailText: {
    fontSize: 18,
    color: "#166534",
    marginBottom: 8,
  },
  buildingContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  buildingImage: {
    width: 200,
    height: 200,
    //borderRadius: 90, // Fully rounded
    borderWidth: 4,
    borderColor: "#166534",
    marginBottom: 15,
  },
  noImageText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 10,
  },
});

export default Companyprofile;