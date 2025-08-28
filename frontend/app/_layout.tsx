import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import { RootStackParamList, TabParamList } from '../types/navigation';
import HomeScreen from './Home/Home';
import LoginScreen from './login';
import SignupScreen from './signup';
import IndexScreen from './index';
import ClimbScreen from './Home/Climb';
import ProfileScreen from './Profile';
import CameraScreen from './Camera/Camera';
import CreateOrPredictScreen from './Camera/CreateOrPredict';
import ClimbDetailsFormScreen from './Camera/ClimbDetailsForm';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: '#000000',
        paddingVertical: 10,
        height: 80,
        borderTopWidth: 0, // Remove top border
      },
    })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            top: 10,
            height: 42,
            width: 42,
          }}>
            <Ionicons name="home" size={34} color={focused ? '#ffe600' : '#fff'} />
          </View>),
      }}/>
      <Tab.Screen name="CameraTab" component={CameraScreen} options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            top: 10,
            height: 42,
            width: 42,
          }}>
            <Ionicons name="camera" size={38} color={focused ? '#ff0080' : '#fff'} />
          </View>
        ),
      }}/>
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            top: 10,
            height: 42,
            width: 42,
          }}>
            <MaterialIcons name="person-outline" size={38} color={focused ? '#00ff00' : '#fff'} />
          </View>
        ),
      }}/>
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <StatusBar style="light" backgroundColor="#111" />
      <Stack.Navigator 
        initialRouteName="Index"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#111' }
        }}
      >
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Climb" component={ClimbScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="CreateOrPredict" component={CreateOrPredictScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="ClimbDetailsForm" component={ClimbDetailsFormScreen} options={{ gestureEnabled: false }}/>
      </Stack.Navigator>
    </View>
  );
}
