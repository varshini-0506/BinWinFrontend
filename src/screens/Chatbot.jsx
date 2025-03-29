import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { getGeminiResponse } from "./chat2";
import TTS from "react-native-tts";
import { Home, User, Trophy, Gamepad } from "lucide-react-native";

export default function Chatbot({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const aiResponse = await getGeminiResponse(input);
      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
      TTS.speak(aiResponse);
    } catch (error) {
      Alert.alert("Error", "Sorry, I couldn't process your request.");	
      //console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.role === "user" ? styles.userMessage : styles.assistantMessage]}>
              {item.role === "assistant" && (
                <Image
                  source={{ uri: "https://ik.imagekit.io/varsh0506/binwin_mascot-removebg-preview.png?updatedAt=1740992271926" }}
                  style={styles.avatar}
                />
              )}
              <View style={[styles.messageBubble, item.role === "user" ? styles.userBubble : styles.assistantBubble]}>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
              {item.role === "user" && (
                <Image
                  source={{ uri: "https://ik.imagekit.io/mino2112/green%20image.jpg?updatedAt=1741093414994" }}
                  style={styles.avatar}
                />
              )}
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  assistantMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#58CC02",
  },
  assistantBubble: {
    backgroundColor: "#379237",
  },
  messageText: {
    color: "white",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "gray",
    backgroundColor: "#DFFFD6",
    borderRadius: 8,
    marginBottom: 50,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  sendButton: {
    padding: 12,
    marginLeft: 8,
    backgroundColor: "#F4A900",
    borderRadius: 8,
  },
  sendText: {
    fontWeight: "bold",
    color: "white",
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
