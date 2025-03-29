import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Alert
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {launchCamera} from 'react-native-image-picker';
import {Home, User, Trophy, Gamepad, Menu, LogOut} from 'lucide-react-native';
import ImageResizer from 'react-native-image-resizer';

const levels = [
  {level: 1, status: 'yes'},
  {level: 2, status: 'yes'},
  {level: 3, status: 'yes'},
  {level: 4, status: 'yes'},
  {level: 5, status: 'no'},
  {level: 6, status: 'no'},
  {level: 7, status: 'no'},
  {level: 8, status: 'no'},
  {level: 9, status: 'no'},
  {level: 10, status: 'no'},
  {level: 11, status: 'no'},
  {level: 12, status: 'no'},
  {level: 13, status: 'no'},
  {level: 14, status: 'no'},
  {level: 15, status: 'no'},
  {level: 16, status: 'no'},
  {level: 17, status: 'no'},
  {level: 18, status: 'no'},
  {level: 19, status: 'no'},
  {level: 20, status: 'no'},
];

const user = {
  level: 5,
  points: 50,
};

export default function Gamified({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [scaleValue] = useState(new Animated.Value(1));
  const [screenHeight, setScreenHeight] = useState(0);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const cameraRef = useRef(null);
  const [images, setImages] = useState({"front_view":"", "top_view1":"", "top_view2":"", "top_view3":""});
  const [submitImageModel, setSubmitImageModel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    //console.log('useEffect triggered!');

    (async () => {
      //console.log('Requesting camera permission...');
      const cameraPermission = await Camera.requestCameraPermission();
      //console.log('Camera permission result:', cameraPermission);

      if (cameraPermission === 'granted') {
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    })();
  }, []);

// Update the openCamera function check
const openCamera = async () => {
  // Check if all image slots are filled
  if (
    images.front_view &&
    images.top_view1 &&
    images.top_view2 &&
    images.top_view3
  ) {
    alert('You can only take 4 pictures.');
    return;
  }

  const options = {
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true,
  };

  launchCamera(options, response => {
     if (response.assets && response.assets.length > 0) {
      const newImageUri = response.assets[0].uri;

      setImages(prevImages => {
        const updatedImages = { ...prevImages };

        // Fill the appropriate slots
        if (!updatedImages.front_view) {
          updatedImages.front_view = newImageUri;
        } else if (!updatedImages.top_view1) {
          updatedImages.top_view1 = newImageUri;
        } else if (!updatedImages.top_view2) {
          updatedImages.top_view2 = newImageUri;
        } else if (!updatedImages.top_view3) {
          updatedImages.top_view3 = newImageUri;
        }

        // Check if all slots are filled and show the submit modal
        if (
          updatedImages.front_view &&
          updatedImages.top_view1 &&
          updatedImages.top_view2 &&
          updatedImages.top_view3
        ) {
          setTimeout(() => {
            setSubmitImageModel(true);
          }, 100);
        }

        return updatedImages;
      });
    }
  });
};

const uploadToCloudinary = async (imageUri) => {
  try {
    let formData = new FormData();
    formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
    formData.append("upload_preset", "wasteUpload");  
    formData.append("api_key", "685557167882957");  
    formData.append("cloud_name", "dmpvchis3");

    const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    //console.log("Cloudinary Response:", data);

    if (data.secure_url) {
      return data.secure_url;  
    } else {
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to upload image to Cloudinary.");	
    //console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};

const resizeImage = async (uri) => {
  const resizedImage = await ImageResizer.createResizedImage(
    uri,  // Image URI
    800,  // New Width
    800,  // New Height
    'JPEG',
    80,   // Quality (0-100)
  );
  return resizedImage.uri;
};

const handleSubmit = async () => {
  try {
    setIsAnalyzing(true);
    //console.log("Original Images:", images);

    // Resize images before uploading
    const resizedImages = {
      front_view: images.front_view ? await resizeImage(images.front_view) : null,
      top_views: await Promise.all(
        [images.top_view1, images.top_view2, images.top_view3].map(
          async (img) => (img ? await resizeImage(img) : null)
        )
      ),
    };

    //console.log("Resized Images:", resizedImages);

    // Upload images to Cloudinary
    const frontViewUrl = resizedImages.front_view
      ? await uploadToCloudinary(resizedImages.front_view)
      : null;

    const topViewUrls = await Promise.all(
      resizedImages.top_views.map(async (img) =>
        img ? await uploadToCloudinary(img) : null
      )
    );

    //console.log("Front View URL:", frontViewUrl);
    //console.log("Top Views URLs:", topViewUrls);
    //console.log("Uploaded URLs:", { front_view: frontViewUrl, top_views: topViewUrls });

    if (
      !frontViewUrl ||
      topViewUrls.every((url) => !url) || // Check if all top views are missing
      !selectedLevel ||
      !selectedLevel.level
    ) {
      alert("⚠️ Please fill all required fields!");
      setIsAnalyzing(false);
      return;
    }

    // Send uploaded URLs to backend
    const response = await fetch("https://binwinbackend.onrender.com/wasteUpload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        level: selectedLevel.level.toString(), // Ensure level is a string if needed
        front_view: frontViewUrl,
        top_views: topViewUrls.filter((url) => url !== null), // Filter out null values
      }),
    });

    const data = await response.json();
    //console.log("Server Response:", data);
    setIsAnalyzing(false); // Hide the analyzing modal


    if (response.ok && data.classification_results) {
      const classifications = data.classification_results.map((result) => result.join(', '));
      const classificationMessage = classifications.join('\n');
      
      alert(`🎉 ${data.detected_bins} Bins Detected and properly classified! Your images have been successfully submitted. 🌟

Classification Results:
${classificationMessage}`);
      
      setImages({
        front_view: "",
        top_view1: "",
        top_view2: "",
        top_view3: "",
      });
      setSubmitImageModel(false);
    } else {
      alert(`⚠️ Try again! ${data.detected_bins} Bins detected.`);
    }
  } catch (error) {
    Alert.alert("Error", "An error occurred while submitting. Please try again later.");  
    //console.error("Error submitting images:", error);
    setIsAnalyzing(false);

    alert("❌ An error occurred while submitting. Please try again later.");
  }
};


  const handleCancel = () => {
    setImages([]); 
    setSubmitImageModel(false);
  };

  const handleLevelPress = level => {
    if (level.level !== user.level && level.level > user.level) {
      alert(`Complete ${user.level} first!`);
      return;
    } else {
      setSelectedLevel(level);

      if (level.level < user.level) {
        setCompletedModalVisible(true);
      } else {
        setModalVisible(true);
      }
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const {height} = Dimensions.get('window');

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  };

  const scrollEnabled = screenHeight > height;
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.centerContent}>
            <View style={styles.header}>
              <View style={styles.levelContainer}>
                <Image
                  source={{
                    uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/level-up.png?updatedAt=1741099801763',
                  }}
                  style={styles.levelImage}
                />
                <Text style={styles.levelText}>{user.level}</Text>
              </View>
              <View style={styles.coinContainer}>
                <Image
                  source={{
                    uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/coin.png?updatedAt=1741099743197',
                  }}
                  style={styles.coinImage}
                />
                <Text style={styles.coinText}>{user.points}</Text>
              </View>
            </View>
            <View style={styles.levelsContainer}>
              {levels.map((level, index) => {
                return (
                  <View key={level.level} style={styles.levelRow}>
                    {(index == 2  || index== 14)&& (
                      <Image
                        source={{
                          uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/recycle.png?updatedAt=1741099743688',
                        }}
                        style={styles.recycleImage}
                      />
                    )}
                    {index == 8 && (
                      <Image
                        source={{
                          uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/recycle%20(1).png?updatedAt=1741099743246',
                        }}
                        style={styles.ecologyImage}
                      />
                    )}
                    <TouchableOpacity
                      style={[
                        styles.levelButton,
                        {marginLeft: 150 * Math.sin(index)},
                      ]}
                      onPress={() => handleLevelPress(level)}>
                      {level.level < user.level ? (
                        <Image
                          source={{
                            uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/favorite.png?updatedAt=1741165687306',
                          }}
                          style={styles.favoriteImage}
                        />
                      ) : (
                        <Text style={styles.levelNumber}>{level.level}</Text>
                      )}
                    </TouchableOpacity>
                    {(index == 5 || index==11 || index == 17) && (
                      <Image
                        source={{
                          uri: 'https://ik.imagekit.io/varsh0506/Bin%20Win/ecology.png?updatedAt=1741099744300',
                        }}
                        style={styles.ecologyImageRight}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>📸 Snap Your Sorted Bins!</Text>
                <Text style={styles.modalDescription}>
  Click 📷 to take <Text style={{ fontWeight: "bold" }}>photos</Text> – first from the  
  <Text style={{ fontWeight: "bold" }}>front</Text> and then from the <Text style={{ fontWeight: "bold" }}>top</Text>.  
  Help improve waste analysis and <Text style={{ fontWeight: "bold" }}>earn rewards</Text> for your efforts! 🌱✨
</Text>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={() => {
                      setModalVisible(false);
                      openCamera();
                    }}>
                    <Image
                      source={{
                        uri: 'https://ik.imagekit.io/mino2112/photo.png?updatedAt=1741163526004',
                      }}
                      style={styles.cameraImage}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
        style={[styles.submitButton, { marginTop: 20 }]}
        onPress={() => {
          setModalVisible(false);
          setSubmitImageModel(true);
        }}>
        <Text style={[styles.buttonText, { color: 'white' }]}>✅ Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cancelButton, { marginTop: 10 }]}
        onPress={handleCancel}>
        <Text style={[styles.buttonText, { color: 'white' }]}>❌ Cancel</Text>
      </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              transparent={true}
              visible={completedModalVisible}
              animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Level Completed!</Text>
                  <Text style={styles.modalDescription}>
                    This level is completed, go to the next 🌱✨
                  </Text>

                  <TouchableOpacity
                    style={styles.closeButtonGreen}
                    onPress={() => setCompletedModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButtonGreen}
                    onPress={() => {setCompletedModalVisible(false);
                      setSubmitImageModel(true);
                    }}>
                    <Text style={styles.closeButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              visible={submitImageModel}
              transparent={true}
              animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>
                    📷 These are the images taken:
                  </Text>

                  <View style={styles.imageContainer}>
                  {Object.values(images).map((img, index) => (
  img ? (
    <Image
      key={index}
      source={{ uri: img }}
      style={styles.image}
    />
  ) : null
))}
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>✅ Submit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}>
                    <Text style={styles.buttonText}>❌ Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal visible={isAnalyzing} transparent animationType="fade">
  <View style={styles.modalContainerloading}>
    <View style={styles.modalContentloading}>
      <Text style={styles.modalText}>🔍 Analyzing Images...</Text>
    </View>
  </View>
</Modal>

          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Displayprofile')}>
          <User size={26} color="gray" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Homepage')}>
          <Home size={26} color="#58CC02" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Leaderboard')}>
          <Trophy size={26} color="#F4A900" />
          <Text style={styles.footerText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Gamified')}>
          <Gamepad size={26} color="#379237" />
          <Text style={styles.footerTextActive}>Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#DFFFD6',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  levelImage: {
    width: 48,
    height: 48,
  },
  levelText: {
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 8,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinImage: {
    width: 32,
    height: 32,
  },
  coinText: {
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 8,
  },
  levelsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  recycleImage: {
    position: 'absolute',
    width: 128,
    height: 128,
    left: 8,
    marginTop: -16,
  },
  ecologyImage: {
    position: 'absolute',
    width: 160,
    height: 160,
    left: 8,
    marginTop: -16,
  },
  levelButton: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58CC02',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
  favoriteImage: {
    width: 40,
    height: 40,
  },
  levelNumber: {
    color: 'white',
    fontWeight: '800',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  ecologyImageRight: {
    position: 'absolute',
    width: 128,
    height: 128,
    right: 8,
    marginTop: -16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14532d',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 20,
  },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cameraImage: {
    width: 56,
    height: 56,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#f87171',
    borderRadius: 8,
  },
  closeButtonGreen: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#4ade80',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#374151',
    fontSize: 12,
  },
  footerTextActive: {
    color: '#58CC02',
    fontSize: 12,
  },
  modalContainer: {
    width: 320,
    padding: 20,
    backgroundColor: '#DFFFD6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#379237',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  modalContainerloading: {
    flex: 1,               // This ensures the modal takes the full screen space
    justifyContent: "center",  
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Dim the background
  },
  modalContentloading: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",   // Ensure content is centered inside the box
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: '#58CC02',
    borderWidth: 2,
  },
  submitButton: {
    backgroundColor: '#58CC02',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#F4A900',
    padding: 12,
    borderRadius: 8,
    width: '80%',
  },
});
