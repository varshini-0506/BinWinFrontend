import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Milestone = () => {
  const [contribution, setContribution] = useState(1000);
  const [showMessage, setShowMessage] = useState(true);
  const [showTreasure, setShowTreasure] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [cashReward, setCashReward] = useState(false);
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [showBinny, setShowBinny] = useState(false);

  // Floating animations for multiple bins & leaves (continuous animation)
  const fallingAnim1 = new Animated.Value(0);
  const fallingAnim2 = new Animated.Value(0);

  useEffect(() => {
    // Transition from "Top Contributor" to "Binny" image after 1.5 seconds
    setTimeout(() => {
      setShowBinny(true);
    }, 1500);

    
    // Show treasure after message disappears
    setTimeout(() => {
      setShowMessage(false);
      setShowTreasure(true);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Floating bins & leaves animation */}
      {[...Array(5)].map((_, index) => (
        <Animated.Image
          key={index}
          source={{uri:"https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.14.23%20PM.jpeg?updatedAt=1741891589842"}}
        />
      ))}

      {/* Display Top Contributor first, then switch to Binny */}
      <Image
        source={{
            uri: showBinny
              ? "https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.12.32%20PM.jpeg?updatedAt=1741891589899"
              : "https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.15.42%20PM.jpeg?updatedAt=1741891589901",
          }}
        style={styles.tree}
      />

      {showMessage && (
        <Text style={styles.message}>
          🎉 You have made the **highest contribution** in your region!  
          🎖️ **You have earned the reward!**
        </Text>
      )}

      {showTreasure && !badgeEarned && (
        <TouchableOpacity onPress={() => setTreasureOpened(true)} style={styles.centeredContent}>
          <Image
            source={{
              uri: treasureOpened
                ? "https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.18.42%20PM.jpeg?updatedAt=1741891589897"
                : "https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.19.13%20PM.jpeg?updatedAt=1741891589848",
            }}
            style={styles.treasure}
          />
          <Text style={styles.openText}>{treasureOpened ? "🎊 Treasure Opened!" : "Tap to open the treasure!"}</Text>
        </TouchableOpacity>
      )}

      {treasureOpened && !badgeEarned && (
        <TouchableOpacity onPress={() => setBadgeEarned(true)} style={styles.claimBadge}>
          <Text style={styles.claimBadgeText}>Claim Your Badge 🎖️</Text>
        </TouchableOpacity>
      )}

      {badgeEarned && (
        <>
          <Text style={styles.badgeText}>🏅 **You have earned the badge: "Savior of the Nation"!**</Text>
          <TouchableOpacity style={styles.rewardButton} onPress={() => setCashReward(true)}>
            <Text style={styles.rewardText}>💰 Earn Cash Reward for Milestone</Text>
          </TouchableOpacity>
        </>
      )}

      {cashReward && (
        <View style={styles.rewardContainer}>
          <Text style={styles.cashText}>🎉 You have earned **₹1000**!</Text>
          <Text style={styles.nextMilestone}>🚀 Earn **₹2000** by reaching the next milestone and earning the **"Warrior"** badge!</Text>
          
          {/* Warrior Badge Image */}
          <Image
            source={{uri:"https://ik.imagekit.io/varsh0506/Bin%20Win/WhatsApp%20Image%202025-03-13%20at%2011.16.51%20PM.jpeg?updatedAt=1741891589856"}}
            style={styles.warriorBadge}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D4EDDA",
    padding: 20,
  },
  tree: {
    width: 200,
    height: 250,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#155724",
    marginBottom: 20,
  },
  treasure: {
    width: 120,
    height: 120,
  },
  openText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8C00",
    marginTop: 10,
  },
  claimBadge: {
    marginTop: 10,
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
  },
  claimBadgeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    textAlign: "center",
    marginTop: 20,
  },
  rewardButton: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  rewardContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  cashText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  nextMilestone: {
    fontSize: 16,
    color: "#FF4500",
    textAlign: "center",
    marginTop: 10,
  },
  warriorBadge: {
    width: 100,
    height: 100,
    marginTop: 15,
  },
  floatingObject: {
    position: "absolute",
    width: 40,
    height: 40,
    opacity: 0.7,
  },
  centeredContent: {
    alignItems: "center",
  },
});

export default Milestone;