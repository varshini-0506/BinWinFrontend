import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated, ScrollView, StyleSheet } from "react-native";
import { Home, User, Trophy, Gamepad, Menu, LogOut, PlayCircle, UserPlus, Flag, HeartHandshake } from "lucide-react-native";
import EducationalVideo from "./EducationalVideo";

export default function HomePage({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textAnimation = new Animated.Value(0);
  const bounceAnimation = new Animated.Value(0);
 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [navigation]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={() => setSidebarOpen(!sidebarOpen)}
          style={styles.menuButton}
        >
          <Menu size={28} color="#379237" />
        </TouchableOpacity>

        <Text style={styles.titleText}>
          BinWin
        </Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          Welcome to BinWin!
        </Text>
        <Text style={styles.welcomeDescription}>
          BinWin is your interactive learning hub for <Text style={styles.boldText}>smart recycling</Text>! 
          Watch educational videos, test your knowledge with quizzes, and climb the leaderboard 
          to become a <Text style={styles.boldText}>waste warrior</Text>. 🌱♻️
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Educational Video Card */}
        <View style={styles.videoCard}>
          <Text style={styles.videoTitle}>
          Meet Binwin:Smarter Waste!
          </Text>
          <View style={styles.videoContainer}>
            <EducationalVideo />
          </View>
        </View>

        {/* Start Quiz Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Quiz")}
          style={styles.startQuizButton}
        >
          <PlayCircle size={26} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.startQuizText}>
            Start Quiz
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {sidebarOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => setSidebarOpen(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              ✖ Close
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate("UserSchedule")}>
            <UserPlus size={26} color="#379237" />
            <Text style={styles.sidebarText}>
              Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate("Milestone")}>
            <Flag size={26} color="#379237" />
            <Text style={styles.sidebarText}>
              Milestone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate("Charity")}>
            <HeartHandshake size={26} color="#379237" />
            <Text style={styles.sidebarText}>
              Charity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate("Login")}>
            <LogOut size={26} color="red" />
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chatbot Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Chatbot")}
        style={styles.chatbotButton}
      >
        {/* Speech Bubble */}
        <View style={styles.speechBubble}>
          <Animated.Text
            style={[styles.speechText, { opacity: textAnimation }]}
          >
            Talk with Binnie
          </Animated.Text>
          {/* Arrow */}
          <View style={styles.arrow} />
        </View>

        {/* Mascot Image */}
        <Animated.View style={{ transform: [{ translateY: bounceAnimation }] }}>
          <Image
            source={{
              uri: "https://ik.imagekit.io/varsh0506/binwin_mascot-removebg-preview.png",
            }}
            style={styles.mascotImage}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Displayprofile")}>
          <User size={26} color="gray" />
          <Text style={styles.navText}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Homepage")}>
          <Home size={26} color="#58CC02" />
          <Text style={styles.activeNavText}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Leaderboard")}>
          <Trophy size={26} color="#F4A900" />
          <Text style={styles.navText}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Gamified")}>
          <Gamepad size={26} color="#379237" />
          <Text style={styles.navText}>
            Game
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFD6',
    position: 'relative',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuButton: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#379237',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#379237',
    fontFamily: 'monospace',
  },
  welcomeDescription: {
    color: '#444',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  boldText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  videoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#ddd',
  },
  startQuizButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startQuizText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Fredoka',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 240,
    height: '100%',
    backgroundColor: '#DFFFD6',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    borderRadius: 24,
    borderRightWidth: 4,
    borderRightColor: '#379237',
  },
  closeButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#379237',
    fontFamily: 'monospace',
  },
  sidebarItem: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sidebarText: {
    fontSize: 18,
    color: '#379237',
    fontWeight: '600',
    fontFamily: 'monospace',
    marginLeft: 12,
  },
  logoutText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '600',
    fontFamily: 'monospace',
    marginLeft: 12,
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
  },
  speechText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Fredoka',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -8 }, { translateX: 8 }],
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#ccc',
    transform: [{ rotate: '45deg' }],
  },
  mascotImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderColor: '#58CC02',
    borderWidth: 4,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Fredoka',
  },
  activeNavText: {
    fontSize: 12,
    color: '#58CC02',
    fontFamily: 'Fredoka',
  },
});