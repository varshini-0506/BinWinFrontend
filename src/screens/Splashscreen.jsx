import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Update loading dots animation every 500ms
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."; // Reset after 3 dots
        return prev + "."; // Add one more dot
      });
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@UserStore:data");
        let role = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          role = parsedData.role;
          console.log("User Role:", role);
        }

        setTimeout(() => {
          if (role === "Public") {
            navigation.navigate("Homepage");
          } else {
            navigation.navigate("CompanyHomepage");
          }
        }, 5000);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    checkUserRole();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* App Logo & Name (Centered) */}
      <Image
        source={{
          uri: "https://ik.imagekit.io/varsh0506/binwin_mascot-removebg-preview.png?updatedAt=1740992271926",
        }}
        style={styles.image}
      />
      <Text style={styles.text}>BinWin</Text>

      {/* Cute Loading Box Positioned Lower */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Loading{dots}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DFFFD6",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  text: {
    marginTop: 10,
    fontSize: 42,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#58CC02",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    width: "100%",
  },
  loadingBox: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#379237",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F4A900",
  },
});
