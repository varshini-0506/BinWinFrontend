import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const CompanyProfile = ({ onEdit }) => {
  // Default company data
  const [profileData] = useState({
    company_name: "Green Waste Solutions",
    location: "Los Angeles, CA",
    contact_number: "+1 234 567 890",
    profile_image: "https://www.w3schools.com/w3images/avatar2.png",
    buildingImages: [
      "https://www.w3schools.com/w3images/house5.jpg",
      "https://www.w3schools.com/w3images/house2.jpg",
    ],
  });

  const { company_name, location, contact_number, profile_image, buildingImages } = profileData;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image Section */}
      <Text style={styles.sectionTitle}>🏢 Company Profile</Text>
      <View style={styles.header}>
        <Image source={{ uri: profile_image }} style={styles.profileImage} />
        <Text style={styles.companyName}>{company_name}</Text>
        <Text style={styles.username}>@{company_name.toLowerCase().replace(/\s+/g, "")}</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        <Text style={styles.detailText}>📍 Location: {location}</Text>
        <Text style={styles.detailText}>📞 Contact: {contact_number}</Text>
        <Text style={styles.detailText}>💰 Price: 10/Kg</Text>
        <Text style={styles.detailText}>👀 Visits: 2</Text>
      </View>

      {/* Company Building Images Section */}
      <Text style={styles.sectionTitle}>🏢 Company Images</Text>
      {buildingImages.length > 0 ? (
        <View style={styles.buildingContainer}>
          {buildingImages.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.buildingImage} />
          ))}
        </View>
      ) : (
        <Text style={styles.noImageText}>No Building Images Available</Text>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  headerContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#166534",
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 12,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#166534",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginTop: 16,
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
  },
  profileDetails: {
    backgroundColor: "#bbf7d0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailText: {
    fontSize: 18,
    color: "#166534",
    marginBottom: 8,
  },
  buildingContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  buildingImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#166534",
    marginBottom: 15,
  },
  noImageText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 10,
  },
});

export default CompanyProfile;
