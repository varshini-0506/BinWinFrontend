import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homepage from './screens/Homepage';
import Splashscreen from './screens/Splashscreen';
import Displayprofile from './screens/Displayprofile';
import Profile from './screens/Profile';
import Chatbot from './screens/Chatbot';
import Leaderboard from './screens/Leaderboard';
import Gamified from './screens/Gamified';
import Login from './screens/Login';
import Signup from './screens/Signup';
import QuizComponent from './screens/QuizComponent';
import UserSchedule from './screens/UserScheduling';
import Milestone from './screens/Milestone';
import Charity from './screens/Charity';
import CompanyHomepage from './screens/CompanyHomepage';
import CompanySchedule from './screens/CompanySchedule';
import Maps from './screens/Maps';
import CompanyProfile from './screens/Companyprofile';
import ScheduleProfile from './screens/ScheduleProfile';

export type RootStackParamList = {
  Homepage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = ()=>{
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Splashscreen" component={Splashscreen} options={{ headerShown: false }} />
      <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }}      />
      <Stack.Screen name="Displayprofile" component={Displayprofile} options={{ headerShown: false }}      />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}      />
      <Stack.Screen name="Chatbot" component={Chatbot} options={{ headerShown: false }}      />
      <Stack.Screen name="Leaderboard" component={Leaderboard} options={{ headerShown: false }}      />
      <Stack.Screen name="Gamified" component={Gamified} options={{ headerShown: false }}      />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}      />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}      />
      <Stack.Screen name="Quiz" component={QuizComponent} options={{ headerShown: false }}      />
      <Stack.Screen name="UserSchedule" component={UserSchedule} options={{ headerShown: false }}      />
      <Stack.Screen name="Milestone" component={Milestone} options={{ headerShown: false }}      />
      <Stack.Screen name="Charity" component={Charity} options={{ headerShown: false }}      />
     <Stack.Screen name="CompanyHomepage" component={CompanyHomepage} options={{ headerShown: false }}      />
      <Stack.Screen name="CompanySchedule" component={CompanySchedule} options={{ headerShown: false }}      />
      <Stack.Screen name="Maps" component={Maps} options={{ headerShown: false }}      />
      <Stack.Screen name="CompanyProfile" component={CompanyProfile} options={{ headerShown: false }}      />
      <Stack.Screen name="ScheduleProfile" component={ScheduleProfile} options={{ headerShown: false }}/>
      </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;
