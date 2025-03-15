import { Navigation } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const BACKEND_URL = "https://binwinbackend.onrender.com/getprofile";

const Profile = ({navigation}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

 

  const pickImage = async () => {
    console.log("Pick Image");
    const options = {
      mediaType: "photo",
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log("Image Response:", response.assets[0]);
        console.log("Image URI:", response.assets[0].uri);
        setImage(response.assets[0].uri);
      }
    });
  };

  const uploadToCloudinary = async (imageUri) => {
    console.log("Uploading Image to Cloudinary");
    try {
      let formData = new FormData();
      formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
      formData.append("upload_preset", "Profile");  
      formData.append("api_key", "685557167882957");  
      formData.append("cloud_name", "dmpvchis3");
  
      const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Cloudinary Response:", data);
  
      if (data.secure_url) {
        return data.secure_url;  
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };
  const handleSaveProfile = async () => {
    if (!name || !age || !location || !bio) {
      Alert.alert("Missing Fields", "Please fill all fields before saving.");
      return;
    }

    setLoading(true);

    let imageUrl = image;
    if (image) {
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }

    const profileData = {
      name,
      age,
      location,
      bio,
      profile_image: imageUrl,
      user_id : 2
    };

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        Alert.alert("Success", "Profile saved successfully!");
        navigation.navigate("Dispayprofile");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Backend Error:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.uploadBox}>
            <Text style={styles.uploadText}>Tap to Upload</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#379237"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#379237"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#379237"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Short Bio"
        placeholderTextColor="#379237"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Profile</Text>}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#379237",
    marginBottom: 20,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  uploadBox: {
    width: 96,
    height: 96,
    backgroundColor: "#DFFFD6",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#379237",
    marginBottom: 16,
  },
  uploadText: {
    color: "#379237",
    fontSize: 14,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#DFFFD6",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#379237",
  },
  bioInput: {
    height: 80,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;