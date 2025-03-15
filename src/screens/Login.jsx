import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Public", value: "Public" },
    { label: "Recycling Center", value: "Recycling Center" },
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email && password) {
      setError(null);
    }
  }, [email, password]);

  const handleLogin = async () => {
    try {
      console.log("Logging in...");
      const response = await fetch("https://binwinbackend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful!", data);
          try {
            const userData =  JSON.stringify({
              user_id: data.user.user_id,
              role: role
            });
            await AsyncStorage.setItem('@UserStore:data', userData);
            console.log('User data saved successfully',userData);
          } catch (error) {
            console.error('Error saving user data:', error);
          }
        navigation.navigate("Splashscreen");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/6/63/Duolingo_logo.png" }}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back!</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#379237"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#379237"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <DropDownPicker
        open={open}
        value={role}
        items={items}
        setOpen={setOpen}
        setValue={setRole}
        setItems={setItems}
        placeholder="Select Role"
        containerStyle={{ width: "100%" }}
        style={styles.dropdown}
        textStyle={{ color: "#379237" }}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#58CC02",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#DFFFD6",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#58CC02",
    borderWidth: 2,
    color: "#379237",
  },
  dropdown: {
    backgroundColor: "#DFFFD6",
    borderWidth: 0,
    width: "100%",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#58CC02",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 20,
    color: "#58CC02",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpText: {
    marginTop: 20,
    color: "#379237",
    fontSize: 16,
  },
  signUpLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;