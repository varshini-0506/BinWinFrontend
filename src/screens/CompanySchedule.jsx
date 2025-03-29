import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform , Alert} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompanySchedule = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [company_id , setCompany_id]=useState(null);
  const location = "Madurai, TamilNadu,India";
  const { user_id } = route.params;
  //console.log("clicked user id", user_id);

  useEffect(() => {
    const checkUserRole = async () => {
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
        setCompany_id(parsedData.user_id);
      } catch (error) {
        Alert.alert("Failed to fetch user ID");
        //console.error("Error fetching user ID:", error);
      }
        }
    checkUserRole();
  }, []);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const onConfirm = () => {
    const formattedDate = date.toISOString().split('T')[0]; // Ensures YYYY-MM-DD format
    const formattedTime = time.toTimeString().split(' ')[0]; // Ensures HH:MM:SS format
  
    Alert.alert(
      "Confirm Schedule",
      `Do you want to confirm pickup for:\nDate: ${formattedDate}\nTime: ${formattedTime}\nLocation: ${location}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            //console.log("Scheduling...");
              const response = await fetch("https://binwinbackend.onrender.com/companySchedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: user_id,
                  company_id: company_id,
                  date: formattedDate,
                  time: formattedTime,
                }),
              });
              const text = await response.text();
              //console.log("Raw Response:", text);
              
              try {
                const data = JSON.parse(text);
                if (response.ok) {
                  Alert.alert("Success", "Pickup Scheduled Successfully!");
                  navigation.navigate("CompanyHomepage");
                } else {
                  Alert.alert("Error", data.error || "Failed to schedule pickup.");
                }
              } catch (error) {
                //console.error("JSON Parse Error:", error);
                Alert.alert("Error", "Unexpected response from the server.");
              }           
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Pickup</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.infoText}>{location}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Date:</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Time:</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}>
          <Text style={styles.dateButtonText}>
            {time.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
  <DateTimePicker
    value={time}
    mode="time"
    is24Hour={false}
    onChange={onTimeChange}
  />
)}
      </View>

      <TouchableOpacity style={styles.button} onPress={onConfirm}>
        <Text style={styles.buttonText}>Confirm Scheduling</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
    },
    infoBox: {
      width: "100%",
      padding: 15,
      backgroundColor: "#e0f7fa",
      borderRadius: 10,
      marginBottom: 20,
    },
    infoText: {
      fontSize: 16,
      color: "#00796b",
    },
    inputContainer: {
      width: "100%",
      marginBottom: 20,
      padding: 10,
      backgroundColor: "#ffffff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    label: {
      fontSize: 18,
      marginBottom: 5,
      fontWeight: "bold",
      color: "#555",
    },
    button: {
      backgroundColor: "#2e7d32",
      padding: 15,
      marginTop: 20,
      borderRadius: 5,
      alignItems: "center",
      width: "100%",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
dateButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  });
  
export default CompanySchedule;