import React, { useState, useEffect } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

// Helper: Generate Next 3 Collection Dates
const getNextDates = (currentDate) => {
  const nextDates = [];
  let date = new Date(currentDate);
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  for (let i = 1; i <= 3; i++) {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + i);
    nextDates.push(newDate.toISOString().split("T")[0]);
  }
  return nextDates;
};

const UserSchedule = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [userData, setUserData] = useState({
    mobile: "",
    wasteQuantity: "",
    reimbursement: 0,
  });
  const [declineReason, setDeclineReason] = useState("");
  const [nextCollectionDates, setNextCollectionDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load data on mount
  useEffect(() => {
    const fetchUserid = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@UserStore:data");
        console.log("Raw Stored Data:", storedData);

        if (!storedData) {
          console.warn("No user data found in AsyncStorage.");
          return;
        }

        const parsedData = JSON.parse(storedData);
        console.log("Parsed User ID:", parsedData.user_id);

        setUserId(parsedData.user_id);

        // API call to fetch company schedules
        const response = await fetch(`https://binwinbackend.onrender.com/displayuserSchedule?user_id=${parsedData.user_id}`);
        const data = await response.json();

        if (response.ok) {
          setCompanies(data.schedules);
        } else {
          console.error("Error fetching schedules:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user ID or schedules:", error);
      }
    };

    fetchUserid();
  }, []);

  // Handle Accept Click
  const handleAccept = (company) => {
    setSelectedCompany(company);
    setShowAcceptModal(true);
  };

  // Handle Decline Click
  const handleDecline = (company) => {
    setSelectedCompany(company);
    setNextCollectionDates(getNextDates(company.schedule));
    setShowDeclineModal(true);
  };

  // Calculate reimbursement based on waste quantity (kg)
  const handleQuantityChange = (value) => {
    const quantity = parseFloat(value) || 0;
    const reimbursement = quantity * (selectedCompany?.price || 10);
    setUserData({ ...userData, wasteQuantity: value, reimbursement });
  };

  // Open Image Picker
  const handleSelectImage = async (companyId) => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image selection.");
        return;
      }
      if (response.assets) {
        const updatedCompanies = companies.map((company) =>
          company.id === companyId
            ? { ...company, image: response.assets[0].uri }
            : company
        );
        setCompanies(updatedCompanies);
        try {
          await AsyncStorage.setItem('companies', JSON.stringify(updatedCompanies));
        } catch (error) {
          console.error("Failed to save companies data:", error);
        }
      } else {
        console.error("Failed to select image.");
      }
    });
  };

  // Accept Modal Submit Handler
  const handleAcceptSubmit = async () => {
    console.log("Accepting schedule...");
    console.log(selectedCompany)
    try {
      const response = await fetch('https://binwinbackend.onrender.com/acceptSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, company_id: selectedCompany.company_id, id: selectedCompany.schedule_id }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Accepted", "Your collection is scheduled successfully.");
      } else {
        Alert.alert("Error", result.error || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to accept schedule.");
      console.error('API call error:', error);
    }
  };  

  // Decline Modal Submit Handler
  const handleDeclineSubmit = () => {
    if (!declineReason || !selectedDate) {
      Alert.alert("Error", "Please provide a reason and select a new collection date.");
      return;
    }
    Alert.alert(
      "Rescheduled",
      `You have rescheduled to ${selectedDate}. We will notify you on that date.`
    );
    setShowDeclineModal(false);
    setDeclineReason("");
    setSelectedDate(null);
  };

  return (
    <ScrollView style={styles.container}>
      {companies.map((company) => (
        <View key={company.company_id} style={styles.card}>
          <TouchableOpacity onPress={() => handleSelectImage(company.company_id)}>
            <Image
              source={{ uri: company.profile_image }}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{company.company_name}</Text>
          <Text style={styles.subtitle}>
            📍 Location: Your Current Location 
          </Text>
          <Text style={styles.subtitle}>📅 Scheduled: {company.date} - {company.time}</Text>
          <Text style={styles.subtitle}>📞 Contact: {company.contact_number}</Text>
          <Text style={styles.subtitle}>💰 Price: ₹{company.price}/kg</Text>
          {company.status == 'no' ?
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(company)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDecline(company)}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View> : <Text style={styles.status}>{company.status}</Text>
}
        </View>
      ))}
     <Modal visible={showAcceptModal} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}> 
      <Text style={styles.modalTitle}>✅ Accept Collection</Text>
      <TextInput
        style={styles.inputField}
        placeholder="♻️ Waste Quantity (kg)"
        placeholderTextColor="#6E8B74"
        value={userData.wasteQuantity}
        onChangeText={handleQuantityChange}
        keyboardType="numeric"
      />
      <Text style={styles.reimbursementText}>
        💰 Reimbursement: ₹{userData.reimbursement.toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleAcceptSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAcceptModal(false)}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

<Modal visible={showDeclineModal} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}> 
      <Text style={styles.modalTitle}>❌ Decline Collection</Text>
      <TextInput
        style={styles.inputField}
        placeholder="📋 Reason for Decline"
        placeholderTextColor="#6E8B74"
        value={declineReason}
        onChangeText={(text) => setDeclineReason(text)}
      />
      <Text style={styles.label}>📅 Select New Collection Date:</Text>
      {nextCollectionDates.map((date) => (
        <TouchableOpacity
          key={date}
          style={[
            styles.dateButton,
            selectedDate === date && styles.selectedDate
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={styles.dateText}>{date}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleDeclineSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeclineModal(false)}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  card: { backgroundColor: "#DFFFD6", padding: 16, borderRadius: 10, marginBottom: 16, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#379237" },
  subtitle: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  acceptButton: { backgroundColor: "#58CC02", padding: 10, borderRadius: 5, width: "45%", alignItems: "center" },
  declineButton: { backgroundColor: "#F4A900", padding: 10, borderRadius: 5, width: "45%", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#DFFFD6',
    padding: 25,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#379237',
    marginBottom: 20,
  },
  inputField: {
    height: 50,
    width: '100%',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#2C5F2D',
    backgroundColor: '#F0FFF0',
  },
  reimbursementText: {
    fontSize: 18,
    color: '#2C5F2D',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#2C5F2D',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#4CAF50',
  },
  dateText: {
    fontSize: 16,
    color: '#2C5F2D',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#8BC34A',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  status:{
    backgroundColor: '#8BC34A',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    color:"white",
    textAlign: 'center',
    fontSize: 16,
  }
});

export default UserSchedule;