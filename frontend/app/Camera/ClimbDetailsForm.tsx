import { SafeAreaView, StyleSheet, Text, View, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Colors } from "@/assets/Colors";
import TopBar from "../components/TopBar";
import { RootStackNavigationProp, RootStackRouteProp } from "@/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import PinkButton from "../components/PinkButton";
import PhotoHoldView from "../components/Photo/PhotoHoldView";
import GradeSelector from "../components/GradeSelector";
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
  const [showGradeSelector, setShowGradeSelector] = useState<boolean>(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setShowGradeSelector(false);
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
      <TopBar flex={0.1}>
        <View style={styles.buttonContainer}>
          <PinkButton title="Cancel" onPress={handleCancel} styles={styles.pinkButton}></PinkButton>
        </View>
        <View style={styles.buttonContainer}>
          <PinkButton 
            title={isSubmitting ? "Saving..." : "Save"} 
            onPress={handleSubmit}  
            styles={styles.pinkButton}
          />
        </View>
      </TopBar>
      <KeyboardAvoidingView 
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
      {/* Hold Preview/Labeling Section */}
      <PhotoHoldView flex={1} image={image} holds={holds} setHolds={setHolds} setSelectedHoldID={setSelectedHoldID} borderRadius={0} backgroundColor={Colors.transparent_pink}/>

      {/* Form Section */}
      
        <Text style={styles.sectionTitle}>Climb Details</Text>
        <ScrollView style={styles.formContent} showsVerticalScrollIndicator={true} indicatorStyle="white">
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grade *</Text>
              <TouchableOpacity
                style={[styles.input, styles.gradePicker]}
                onPress={() => setShowGradeSelector(true)}
              >
                <Text style={[styles.gradeText, !grade && styles.placeholderText]}>
                  {grade || "Select grade (e.g., V5, V4-6)"}
                </Text>
              </TouchableOpacity>
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
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Grade Selector Modal */}
      <GradeSelector
        visible={showGradeSelector}
        onClose={() => setShowGradeSelector(false)}
        onGradeSelect={handleGradeSelect}
        currentGrade={grade}
      />
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
    padding: 20,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  pinkButton:{
    flex: 0,
    height: "25%",
    width:  "60%"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginVertical: 15,
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
  gradePicker: {
    justifyContent: "center",
  },
  gradeText: {
    fontSize: 16,
    color: "#111",
  },
  placeholderText: {
    color: "#666",
  },
});
