import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Video from "react-native-video";
import { PlayCircle } from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function EducationalVideo() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {!videoPlaying ? (
        <TouchableOpacity
          onPress={() => setVideoPlaying(true)}
          style={styles.playButton}
        >
          <PlayCircle size={50} color="#58CC02" />
          <Text style={styles.playText}>Play Video</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.videoWrapper}>
          <Video
            source={{
              uri: "https://ik.imagekit.io/zcdsz07ad/Meet%20Binwin_%20Your%20Eco-Friendly%20Buddy!.mp4?updatedAt=1741848785486",
            }}
            style={styles.video}
            controls
            resizeMode="contain"
            onEnd={() => setVideoPlaying(false)} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
  },
  playButton: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#DFFFD6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playText: {
    color: "#379237",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  videoWrapper: {
    width: "100%",
    height: 200, 
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000", 
  },
  video: {
    width: "100%",
    height: "100%", 
    borderRadius: 10,
  },
});