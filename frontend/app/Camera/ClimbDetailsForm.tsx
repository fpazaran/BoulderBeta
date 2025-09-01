import { SafeAreaView, StyleSheet, Text, View, TextInput, Alert, ScrollView } from "react-native";
import { Colors } from "@/assets/Colors";
import TopBar from "../components/TopBar";
import { RootStackNavigationProp, RootStackRouteProp } from "@/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import PinkButton from "../components/PinkButton";
import PhotoHoldView from "../components/Photo/PhotoHoldView";
import { Hold } from "@/types/climb";
import { useState } from "react";
import { climbStorage, SavedClimb } from "@/utils/climbStorage";

export default function ClimbDetailsFormScreen() {
  const route = useRoute<RootStackRouteProp<"ClimbDetailsForm">>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { image, holds: initialHolds } = route.params;
  const [selectedHoldID, setSelectedHoldID] = useState<string | null>(null);
  const [holds, setHolds] = useState<Hold[]>(initialHolds);
  
  // Form state
  const [grade, setGrade] = useState<string>("");
  const [gymName, setGymName] = useState<string>("");
  const [gymLocation, setGymLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!grade.trim() || !gymName.trim()) {
      Alert.alert("Error", "Please fill in the grade and gym name");
      return;
    }

    setIsSubmitting(true);
    try {
      const newClimb = {
        grade: grade.trim(),
        gym: {
          id: Date.now(), // Generate unique gym ID
          name: gymName.trim(),
          location: gymLocation.trim() || undefined,
        },
        holds: holds,
        imageUri: image, // Store the camera image URI
        notes: notes.trim() || undefined,
      };

      await climbStorage.saveClimb(newClimb);
      Alert.alert("Success", "Climb saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Profile"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save climb. Please try again.");
      console.error("Error saving climb:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Section - Top Bar */}
      <TopBar flex={0.2}>
        <View style={{flex: 1, paddingHorizontal: 30, paddingVertical: 20, alignItems: "flex-start"}}>
          <PinkButton title="Cancel" onPress={handleCancel}></PinkButton>
        </View>
        <View style={{flex: 1, paddingHorizontal: 30, paddingVertical: 20, alignItems: "flex-end"}}>
          <PinkButton 
            title={isSubmitting ? "Saving..." : "Save"} 
            onPress={handleSubmit}
          />
        </View>
      </TopBar>
      
      {/* Hold Preview/Labeling Section */}
      <PhotoHoldView flex={1} image={image} holds={holds} setHolds={setHolds} setSelectedHoldID={setSelectedHoldID} borderRadius={0} backgroundColor={Colors.transparent_pink}/>

      {/* Form Section */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          <Text style={styles.sectionTitle}>Climb Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade *</Text>
            <TextInput
              style={styles.input}
              value={grade}
              onChangeText={setGrade}
              placeholder="e.g., V5, V5-7"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gym Name *</Text>
            <TextInput
              style={styles.input}
              value={gymName}
              onChangeText={setGymName}
              placeholder="e.g., Seattle Bouldering Project"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gym Location</Text>
            <TextInput
              style={styles.input}
              value={gymLocation}
              onChangeText={setGymLocation}
              placeholder="e.g., Seattle, WA"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this climb..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mid_gray,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.transparent_pink,
  },
  formContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#111",
  },
  notesInput: {
    height: 100,
  },
});
