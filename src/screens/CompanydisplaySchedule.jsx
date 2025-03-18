import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { CheckCircle, XCircle, Clock, Navigation } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompanydisplaySchedule = ({navigation}) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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
        const response = await fetch(`https://binwinbackend.onrender.com/displayCompanySchedule?user_id=${parsedData.user_id}`);
        const data = await response.json();
        setScheduleData(data.schedules);
      } catch (err) {
        setError('Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.profile_image }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.info}>📌 {item.location}</Text>
          <Text style={styles.info}>📅 {new Date(item.date).toDateString()}</Text>
          <Text style={styles.info}>⏰ {item.time}</Text>
          <View style={styles.statusRow}>
            {item.status === 'no' ? (
              <><Clock color="#FFA000" size={20} /><Text style={[styles.status, { color: '#FFA000' }]}>Pending</Text></>
            ) : item.status === 'accepted' ? (
              <><CheckCircle color="#4CAF50" size={20} /><Text style={[styles.status, { color: '#4CAF50' }]}>Accepted</Text></>
            ) : (
              <><XCircle color="#F44336" size={20} /><Text style={[styles.status, { color: '#F44336' }]}>Rejected</Text></>
            )}
          </View>
          {item.status === 'rejected' && (
            <View style={styles.rejectionInfo}>
              <Text style={styles.reason}>Reason: {item.reason}</Text>
              {/* {item.rescheduledTime && (
                <View>
                    <Text style={styles.reschedule}>Rescheduled Time: {item.rescheduledTime}</Text>
                </View>   
              )} */}
            <Text style={styles.button} onPress={()=>navigation.navigate("CompanySchedule", { user_id: item.user_id })}>Reschedule</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company Schedule</Text>
      <FlatList
        data={scheduleData}
        keyExtractor={(item) => item.schedule_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#424242',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  rejectionInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  reason: {
    fontSize: 14,
    color: '#D32F2F',
  },
  reschedule: {
    fontSize: 14,
    color: '#388E3C',
    marginTop: 4,
  },
  error: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    color:"white",
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CompanydisplaySchedule;