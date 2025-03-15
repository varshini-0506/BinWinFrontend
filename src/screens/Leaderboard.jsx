import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { Home, User, Trophy, Gamepad } from "lucide-react-native";

// Sample leaderboard data
const leaderboardData = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Player ${i + 1}`,
  score: Math.floor(Math.random() * 5000) + 500,
  streak: Math.floor(Math.random() * 50),
  avatar: `https://i.pravatar.cc/100?img=${i + 1}`,
}));

const Leaderboard = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(leaderboardData.sort((a, b) => b.score - a.score));

  const getBadge = (index) => {
    if (index === 0) return "🥇"; // Gold
    if (index === 1) return "🥈"; // Silver
    if (index === 2) return "🥉"; // Bronze
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>🏆 Leaderboard</Text>

      {/* Scrollable List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item, index) => (
          <TouchableOpacity key={item.id} onPress={() => alert(`Clicked on ${item.name}`)} activeOpacity={0.7}>
            <View style={[styles.listItem, index < 3 ? styles.topRanks[index] : styles.defaultItem]}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rank, index < 3 && styles.rankTop]}>{index + 1}</Text>
                {index < 3 && <Text style={styles.badge}>{getBadge(index)}</Text>}
              </View>
              <Avatar.Image source={{ uri: item.avatar }} size={50} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.score}>{item.score} pts</Text>
              </View>
              <Text style={styles.streak}>🔥 {item.streak} days</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Displayprofile")}>
          <User size={26} color="gray" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Homepage")}>
          <Home size={26} color="#58CC02" />
          <Text style={styles.navText}>Home</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#58CC02",
    textAlign: "center",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  topRanks: [
    { backgroundColor: "#FFD700" }, // Gold
    { backgroundColor: "#C0C0C0" }, // Silver
    { backgroundColor: "#CD7F32" }, // Bronze
  ],
  defaultItem: {
    backgroundColor: "#DFFFD6",
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#379237",
  },
  rankTop: {
    color: "white",
  },
  badge: {
    fontSize: 18,
    marginLeft: 5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#379237",
  },
  score: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3498DB",
  },
  streak: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4A900",
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
});

export default Leaderboard;