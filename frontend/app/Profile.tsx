import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Climb } from '../types/climb';
import { StackNavigationProp } from '@react-navigation/stack';

interface UserProfile {
  username: string;
  avatar: string;
}

interface SavedRoute {
  id: number;
  gym: {
    name: string;
    location: string;
  };
  grades: string[];
  climbs: Climb[]; // Array of climbs for this route
}

type RootStackParamList = {
  Index: undefined;
};

export default function ProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Fueki123',
    avatar: '😊'
  });
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  // TODO: Replace with API call to fetch user profile
  useEffect(() => {
    setUserProfile({
      username: 'Fueki123',
      avatar: '😊'
    });
  }, []);

  // TODO: Replace with API call to fetch saved routes
  useEffect(() => {
    setSavedRoutes([
      {
        id: 1,
        gym: { name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' },
        grades: ['V5-7', 'V5-7', 'V5-7'],
        climbs: [
          { id: 1, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
          { id: 2, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
          { id: 3, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
        ]
      },
      {
        id: 2,
        gym: { name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' },
        grades: ['V5-7', 'V5-7', 'V5-7'],
        climbs: [
          { id: 4, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
          { id: 5, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
          { id: 6, grade: 'V5-7', gym: { id: 1, name: 'Seattle Bouldering Project - U District', location: 'Seattle, WA' } },
        ]
      },
      {
        id: 3,
        gym: { name: 'Seattle Bouldering Project - Poplar', location: 'Seattle, WA' },
        grades: ['V6', 'V4-5', 'V7'],
        climbs: [
          { id: 7, grade: 'V6', gym: { id: 2, name: 'Seattle Bouldering Project - Poplar', location: 'Seattle, WA' } },
          { id: 8, grade: 'V4-5', gym: { id: 2, name: 'Seattle Bouldering Project - Poplar', location: 'Seattle, WA' } },
          { id: 9, grade: 'V7', gym: { id: 2, name: 'Seattle Bouldering Project - Poplar', location: 'Seattle, WA' } },
        ]
      },
    ]);
  }, []);

  // TODO: Replace with API call to logout
  const handleLogout = () => {
    navigation.navigate('Index');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>😊</Text>
              </View>
            </View>
            <Text style={styles.username}>Fueki123</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Routes Section */}
        <View style={styles.savedRoutesContainer}>
          <Text style={styles.savedRoutesTitle}>Saved Routes</Text>
          <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
            {savedRoutes.flatMap((route) => 
              route.climbs.map((climb) => (
                <TouchableOpacity 
                  key={climb.id} 
                  style={styles.card} 
                  onPress={() => (navigation as any).navigate('Climb', { climb, source: 'profile' })}
                >
                  <View style={styles.imagePlaceholder} />
                  <View style={styles.cardContent}>
                    <View style={styles.gymNameContainer}>
                      <Text style={styles.gymName}>{climb.gym.name}</Text>
                    </View>
                    <Text style={styles.gymGrade}>Grade: {climb.grade}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flex: 1,
    backgroundColor: '#90EE90',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  profileInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFA500',
  },
  avatarText: {
    fontSize: 32,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  logoutButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'absolute',
    top: 10,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0.0,
  },
  logoutText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  savedRoutesContainer: {
    flex: 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  savedRoutesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  routesList: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#90EE90',
    borderRadius: 18,
    marginVertical: 8,
    padding: 12,
    minHeight: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    marginHorizontal: 20,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#B8E6B8',
    marginRight: 18,
  },
  cardContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  gymNameContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#222',
    marginBottom: 10,
    paddingBottom: 2,
    alignSelf: 'stretch',
  },
  gymName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
  gymGrade: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'normal',
    marginBottom: 6,
    marginTop: 2,
  }
});