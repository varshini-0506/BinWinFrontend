import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import { Home, User, Trophy, Gamepad } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getTreeImage = (visits) => {
  if (visits >= 20) {
    return "https://ik.imagekit.io/varsh0506/Bin%20Win/forest.png";
  } else if (visits >= 10) {
    return "https://ik.imagekit.io/varsh0506/Bin%20Win/plant-pot.png";
  } else if (visits >= 5) {
    return "https://ik.imagekit.io/varsh0506/Bin%20Win/nature.png";
  } else {
    return "https://ik.imagekit.io/varsh0506/Bin%20Win/seed.png";
  }
};

const Displayprofile = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserid = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@UserStore:user_id");
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setUserId(parsedData.user_id); // ✅ Set userId state
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserid();
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait for userId to be set

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `https://binwinbackend.onrender.com/displayprofile?user_id=${userId}`
        );
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]); 

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#379237" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profile?.profile_image || "https://www.w3schools.com/w3images/avatar2.png" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profile?.name || "Not Set"}</Text>
          <Text style={styles.username}>@{profile?.name?.toLowerCase().replace(/\s+/g, "") || "username"}</Text>
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.profileText}>🎂 Age: {profile?.age || "Not Set"}</Text>
          <Text style={styles.profileText}>📍 Location: {profile?.location || "Not Set"}</Text>
          <Text style={styles.profileText}>📜 Bio: {profile?.bio || "Not Set"}</Text>
        </View>

        <Text style={styles.sectionTitle}>🌱 Your Green Impact</Text>
        <View style={styles.treeContainer}>
          <Image source={{ uri: getTreeImage(profile?.visit || 0) }} style={styles.treeImage} />
          <Text style={styles.visitsText}>Recycling Center Visits: {profile?.visit || 0}</Text>
        </View>

        <Text style={styles.sectionTitle}>📊 App Usage (Past Week)</Text>
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: profile?.usageData || [1, 2, 7, 3, 4, 0, 5] }],
          }}
          width={Dimensions.get("window").width - 10}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#f0fdf4",
            backgroundGradientTo: "#f0fdf4",
            color: (opacity = 1) => `rgba(55, 146, 55, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 146, 55, ${opacity})`,
          }}
          style={{ borderRadius: 10 }}
        />
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Displayprofile")}>
          <User size={26} color="gray" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Homepage")}>
          <Home size={26} color="#58CC02" />
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Leaderboard")}>
          <Trophy size={26} color="#F4A900" />
          <Text style={styles.navText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Gamified")}>
          <Gamepad size={26} color="#379237" />
          <Text style={styles.navText}>Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 70,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F9F9F9",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "gray",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "gray",
    fontSize: 12,
  },
  activeNavText: { fontSize: 12, color: "#58CC02" },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: "#379237",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#379237",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: "gray",
  },
  profileDetails: {
    backgroundColor: "#f0fdf4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    color: "#379237",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#379237",
    marginBottom: 10,
  },
  treeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  treeImage: {
    width: 160,
    height: 160,
  },
  visitsText: {
    fontSize: 16,
    color: "#379237",
    marginTop: 5,
  },
});

export default Displayprofile;