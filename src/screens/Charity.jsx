import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const Charity = () => {
  const [donated, setDonated] = useState(false);
  const [donationType, setDonationType] = useState(""); // Track whether full or half donation

  const handleDonation = (type) => {
    setDonated(true);
    setDonationType(type);
  };

  return (
    <View style={styles.container}>
      {/* Superhero Image */}
      <Image 
        source={{uri:"https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.25.16%20PM.jpeg?updatedAt=1741891589852"}} // Replace with your actual image path
        style={styles.heroImage} 
      />

      {/* Title */}
      <Text style={styles.title}>🦸‍♂️ Become a Superhero! 🦸‍♀️</Text>

      {/* Donation Buttons */}
      {!donated ? (
        <View>
          <TouchableOpacity style={styles.button} onPress={() => handleDonation("full")}>
            <Text style={styles.buttonText}>💚 Donate Your Reimbursement Money for Charity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonHalf} onPress={() => handleDonation("half")}>
            <Text style={styles.buttonText}>💛 Donate Half of Your Reimbursement Money</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.thankYou}>
          🎉 Thanks for Donating! {donationType === "full" ? "You have a wholesome heart,you have donated everything, god bless you!!, You are the real super hero!" : "It takes a great heart to donate half! "} 🦸‍♂️🦸‍♀️
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D4EDDA", // Duolingo green
    padding: 20,
  },
  heroImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A40", // Dark green for contrast
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#58CC02", // Duolingo Green
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // Android shadow effect
  },
  buttonHalf: {
    backgroundColor: "#58CC02", // Duolingo Yellow for half donation
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  thankYou: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3A5A40",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Charity;