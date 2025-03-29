import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Animated, Alert } from "react-native";
import { Home, User, Trophy, Gamepad, ArrowLeft } from "lucide-react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY = "AIzaSyBIhcR9zftIUImxYcgVGx6ZJWLlZABnfF8"; // Replace with actual API key

export default function QuizComponent({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for questions

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const fetchQuizQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Generate 5 multiple-choice quiz questions on waste segregation and recycling in JSON format. Each question should have a 'question', 'options' (array), and 'answer' (string)." }] }]
          }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch quiz questions");
  
      const data = await response.json();
      //console.log("Raw API Response:", JSON.stringify(data, null, 2));
  
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiResponse) throw new Error("No response from AI");
  
      try {
        const cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
        const parsedQuestions = JSON.parse(cleanedResponse);

        if (!Array.isArray(parsedQuestions)) throw new Error("Invalid question format");
  
        setQuestions(parsedQuestions);
        setIndex(0);
        setScore(0);
        setQuizCompleted(false);
      } catch (jsonError) {
        //console.error("Error parsing JSON:", jsonError, "Raw Response:", aiResponse);
        throw new Error("Failed to parse AI response JSON");
      }
    } catch (error) {
      //console.error("Error fetching quiz questions:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAnswer = async (option) => {
    if (selected !== null) return;
    setSelected(option);

    const isCorrect = option === questions[index].answer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(async () => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        setQuizCompleted(true);

        // Call the API to save the quiz score
        try {
          const userData = await AsyncStorage.getItem('@UserStore:data');
          const user = JSON.parse(userData);
          const response = await fetch("https://binwinbackend.onrender.com/quiz_scores", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.user_id, // Replace with the actual user ID
              score: score, // Replace with the actual score
            }),
          });

          const data = await response.json();
        } catch (error) {
          console.error("Error saving quiz score:", error);
        }
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Homepage")} style={styles.backButton}>
          <ArrowLeft size={28} color="#379237" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>BinWin</Text>
          <Image source={{ uri: "https://ik.imagekit.io/varsh0506/binwin_mascot-removebg-preview.png" }} style={styles.mascotImage} />
        </View>
      </View>

      {/* Quiz Content */}
      <View style={styles.quizContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#379237" />
        ) : quizCompleted ? (
          <View style={styles.quizCompleted}>
            <Text style={styles.congratulationsText}>
              {score >= 4 ? "🎉 Congratulations! 🎉" : "Quiz Completed!"}
            </Text>
            <Text style={styles.scoreText}>
              Your Score: {score} / {questions.length}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchQuizQuestions}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backToHomeButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.backToHomeText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          questions.length > 0 && questions[index] ? (
            <Animated.View style={[{ opacity: fadeAnim }, styles.questionContainer]}>
              <Text style={styles.questionText}>{questions[index].question}</Text>
              {questions[index].options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.optionButton,
                    selected === option
                      ? option === questions[index].answer
                        ? styles.correctOption
                        : styles.incorrectOption
                      : styles.defaultOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={[styles.optionText, selected === option ? styles.selectedText : styles.defaultText]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ) : (
            <Text style={styles.noQuestionsText}>No questions available.</Text>
          )
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFD6',
    padding: 20,
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#379237',
    fontFamily: 'monospace',
  },
  mascotImage: {
    width: 50,
    height: 50,
    marginLeft: 8,
  },
  quizContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizCompleted: {
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    fontFamily: 'monospace',
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 24,
  },
  retryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  backToHomeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 16,
  },
  backToHomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  questionContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#379237',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultOption: {
    backgroundColor: '#f0f0f0',
  },
  correctOption: {
    backgroundColor: '#34C759',
    transform: [{ scale: 1.05 }],
  },
  incorrectOption: {
    backgroundColor: '#ff3737',
    transform: [{ scale: 0.95 }],
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  selectedText: {
    color: 'white',
  },
  defaultText: {
    color: '#444',
  },
  noQuestionsText: {
    fontSize: 18,
    color: '#ff3737',
    fontFamily: 'monospace',
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
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
    fontFamily: 'monospace',
  },
  activeNavText: {
    fontSize: 12,
    color: '#58CC02',
    fontFamily: 'monospace',
  },
});