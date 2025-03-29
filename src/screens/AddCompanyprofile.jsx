import React, { useState,} from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const AddCompanyprofile = ({navigation}) => {
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [price, setPrice] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [buildingImages, setBuildingImages] = useState([]);

  // Function to upload a single profile image
  const pickProfileImage = async () => {
    const options = { mediaType: "photo", quality: 1 };
    launchImageLibrary(options, async (response) => {
      if (!response.didCancel && response.assets?.length > 0) {
        const uploadedUrl = await uploadToCloudinary(response.assets[0].uri);
        setProfileImage(uploadedUrl);
      }
    });
  };

  // Function to upload multiple building images
  const pickBuildingImages = async () => {
    const options = { mediaType: "photo", quality: 1, selectionLimit: 5 };
    launchImageLibrary(options, async (response) => {
      if (!response.didCancel && response.assets?.length > 0) {
        const uploadedUrls = await Promise.all(
          response.assets.map(async (asset) => await uploadToCloudinary(asset.uri))
        );
        setBuildingImages([...buildingImages, ...uploadedUrls]);
      }
    });
  };

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
    formData.append("upload_preset", "Profile"); // Replace with your Cloudinary preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dmpvchis3/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      //console.error("Upload Error:", error);
      Alert.alert("Upload Failed", "Unable to upload image.");
      return null;
    }
  };

  // Function to submit data to backend
  const handleSaveProfile = async () => {
    if (!companyName || !location || !contactNumber || !price) {
      Alert.alert("Error", "Please fill all fields and upload images.");
      return;
    }

    const requestData = {
      company_name: companyName,
      location,
      contact_number: contactNumber,
      price,
      profile_image: profileImage,
      building_images: buildingImages,
      user_id:3,
    };

    try {
      //console.log("api caling");
      const response = await fetch("https://binwinbackend.onrender.com/getcompanyprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      //console.log("Response:", data);
      if (response.ok) {
        Alert.alert("Success", "Profile saved successfully!");
    navigation.navigate("Companyprofile");
      } else {
        throw new Error(data.message || "Failed to save profile");
      }
    } catch (error) {
      //console.error("Error:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Up Recycling Center Profile</Text>

      {/* Profile Image Upload */}
      <TouchableOpacity onPress={pickProfileImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadText}>Upload Profile Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Building Images Upload */}
      <TouchableOpacity onPress={pickBuildingImages} style={styles.uploadButton}>
        <Text style={styles.buttonText}>Upload Building Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal>
        {buildingImages.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.buildingImage} />
        ))}
      </ScrollView>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />

      {/* Save Profile Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = {
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  uploadPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#bbf7d0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#166534",
    marginBottom: 16,
  },
  uploadText: {
    color: "#166534",
    fontSize: 12,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#bbf7d0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: "#166534",
  },
  button: {
    backgroundColor: "#166534",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#379237",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  buildingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
};

export default AddCompanyprofile;