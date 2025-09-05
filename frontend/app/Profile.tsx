import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackNavigationProp } from "../types/navigation";
import { climbStorage, SavedClimb } from "@/utils/climbStorage";
import ClimbCard from "./components/ClimbCard";
import { Climb } from "@/types/climb";
import { Colors } from "../assets/Colors";
import { useAuth } from "../contexts/AuthContext";

interface UserProfile {
  username: string;
  avatar: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: user?.email?.split('@')[0] || "User",
    avatar: "😊",
  });
  const [savedClimbs, setSavedClimbs] = useState<SavedClimb[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved climbs from storage
  const loadSavedClimbs = async () => {
    try {
      setIsLoading(true);
      const climbs = await climbStorage.getSavedClimbs();
      setSavedClimbs(climbs);
    } catch (error) {
      console.error("Error loading saved climbs:", error);
      Alert.alert("Error", "Failed to load saved climbs");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload climbs when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSavedClimbs();
    }, [])
  );

  // Update user profile when user changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        username: user.email?.split('@')[0] || "User",
        avatar: "😊",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by the auth state change
            } catch (error: any) {
              Alert.alert("Logout Error", error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteClimb = async (climbId: number) => {
    Alert.alert(
      "Delete Climb",
      "Are you sure you want to delete this climb?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await climbStorage.deleteClimb(climbId);
              await loadSavedClimbs(); // Refresh the list
            } catch (error) {
              Alert.alert("Error", "Failed to delete climb");
            }
          },
        },
      ]
    );
  };

  const handlePressClimb = (climb: Climb) => {
    navigation.navigate("Climb", { climb, source: "profile" });
  };

  const handleLongPressClimb = (climb: Climb) => {
    handleDeleteClimb(climb.id);
  };

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
          <Text style={styles.username}>{userProfile.username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Routes Section */}
      <View style={styles.savedRoutesContainer}>
        <Text style={styles.savedRoutesTitle}>
          Saved Climbs ({savedClimbs.length})
        </Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading climbs...</Text>
          </View>
        ) : savedClimbs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved climbs yet</Text>
            <Text style={styles.emptySubtext}>Create your first climb using the camera!</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.routesList}
            showsVerticalScrollIndicator={false}
          >
            {savedClimbs.map((savedClimb) => {
              const climb = climbStorage.convertToClimb(savedClimb); // Convert back to Climb format
              return (
                <ClimbCard key={climb.id} climb={climb} card_color={Colors.green} image_color={Colors.light_green} handlePressClimb={handlePressClimb} handleLongPressClimb={handleLongPressClimb} />
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flex: 1,
    backgroundColor: "#90EE90",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  profileInfo: {
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFA500",
  },
  avatarText: {
    fontSize: 32,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  logoutButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    position: "absolute",
    top: 10,
    right: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0.0,
  },
  logoutText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  savedRoutesContainer: {
    flex: 3,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  savedRoutesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  routesList: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#90EE90",
    borderRadius: 18,
    marginVertical: 8,
    padding: 12,
    minHeight: 180,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    marginHorizontal: 20,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#B8E6B8",
    marginRight: 18,
  },
  cardContent: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  gymNameContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#222",
    marginBottom: 10,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  gymName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },
  gymGrade: {
    fontSize: 13,
    color: "#222",
    fontWeight: "normal",
    marginBottom: 6,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  notesText: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
    fontStyle: "italic",
  },
});
