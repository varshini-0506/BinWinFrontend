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

// Company Data
const initialCompanies = [
  {
    id: "1",
    name: "Eco Kaari",
    image: "https://ik.imagekit.io/zcdsz07ad/ecokaari.png?updatedAt=1741870357737",
    subtitle: "Upcycling waste into eco-friendly products.",
    schedule: "2024-07-20",
    location: "From your current location",
    pricePerKg: 10,
    requirement: ["Biodegradable", "Non-Biodegradable", "Recyclable"],
  },
  {
    id: "2",
    name: "GreenTech Recycle",
    image: "https://ik.imagekit.io/zcdsz07ad/greentech.png?updatedAt=1741870861808",
    subtitle: "Specialized in recycling electronic waste.",
    schedule: "2024-07-25",
    location: "From your current location",
    pricePerKg: 12,
    requirement: ["Non-Biodegradable", "Recyclable"],
  },
  {
    id: "3",
    name: "Attero",
    image: "https://ik.imagekit.io/zcdsz07ad/attero.png?updatedAt=1741870922564",
    subtitle: "Innovative solutions for plastic waste management.",
    schedule: "2024-08-01",
    location: "From your current location",
    pricePerKg: 8,
    requirement: ["Recyclable"],
  },
  {
    id: "4",
    name: "RecommerceX",
    image: "https://ik.imagekit.io/zcdsz07ad/recommercex.png?updatedAt=1741870462849",
    subtitle: "Transforming organic waste into useful products.",
    schedule: "2024-07-15",
    location: "From your current location",
    pricePerKg: 9,
    requirement: ["Biodegradable"],
  },
  {
    id: "5",
    name: "Recykal",
    image: "https://ik.imagekit.io/zcdsz07ad/recykal.png?updatedAt=1741870517081",
    subtitle: "Recycling old electronic devices efficiently.",
    schedule: "2024-07-10",
    location: "From your current location",
    pricePerKg: 11,
    requirement: ["Non-Biodegradable", "Recyclable"],
  },
];

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
  const [companies, setCompanies] = useState(initialCompanies);
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

  // Load data on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const storedCompanies = await AsyncStorage.getItem('companies');
        if (storedCompanies) {
          setCompanies(JSON.parse(storedCompanies));
        }
      } catch (error) {
        console.error("Failed to load companies data:", error);
      }
    };
    loadCompanies();
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
    const reimbursement = quantity * (selectedCompany?.pricePerKg || 10);
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
  const handleAcceptSubmit = () => {
    if (!userData.mobile || !userData.wasteQuantity) {
      Alert.alert("Error", "Please enter mobile number and waste quantity.");
      return;
    }
    Alert.alert(
      "Accepted",
      `Your collection is scheduled. You will receive ₹${userData.reimbursement.toFixed(2)}.`
    );
    setShowAcceptModal(false);
    setUserData({ mobile: "", wasteQuantity: "", reimbursement: 0 });
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
        <View key={company.id} style={styles.card}>
          <TouchableOpacity onPress={() => handleSelectImage(company.id)}>
            <Image
              source={{ uri: company.image }}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{company.name}</Text>
          <Text style={styles.subtitle}>
            📍 Location: {company.location} | 📅 Scheduled: {company.schedule}
          </Text>
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
          </View>
        </View>
      ))}
      <Modal visible={showAcceptModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Accept Collection</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Mobile Number"
            value={userData.mobile}
            onChangeText={(text) => setUserData({ ...userData, mobile: text })}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Waste Quantity (kg)"
            value={userData.wasteQuantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
          <Text>Reimbursement: ₹{userData.reimbursement.toFixed(2)}</Text>
          <Button title="Submit" onPress={handleAcceptSubmit} />
          <Button title="Cancel" onPress={() => setShowAcceptModal(false)} />
        </View>
      </Modal>
      <Modal visible={showDeclineModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Decline Collection</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Reason for Decline"
            value={declineReason}
            onChangeText={(text) => setDeclineReason(text)}
          />
          <Text>Select New Collection Date:</Text>
          {nextCollectionDates.map((date) => (
            <TouchableOpacity
              key={date}
              style={styles.dateButton}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={styles.dateText}>{date}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Submit" onPress={handleDeclineSubmit} />
          <Button title="Cancel" onPress={() => setShowDeclineModal(false)} />
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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  modalTitle: { fontSize: 20, marginBottom: 10, color: "#379237", fontWeight: "bold" },
  inputField: { height: 40, borderColor: "#379237", borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  dateButton: { backgroundColor: "#ddd", padding: 10, marginBottom: 10, borderRadius: 5 },
  dateText: { fontSize: 16, color: "#379237" },
});

export default UserSchedule;