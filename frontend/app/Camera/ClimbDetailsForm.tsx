import { SafeAreaView, StyleSheet, Text, View, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Colors } from "@/assets/Colors";
import TopBar from "../components/TopBar";
import { RootStackNavigationProp, RootStackRouteProp } from "@/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import PinkButton from "../components/PinkButton";
import PhotoHoldView from "../components/Photo/PhotoHoldView";
import GradeSelector from "../components/GradeSelector";
import HoldTypeSelector from "../components/HoldTypeSelector";
import { Hold, HoldType } from "@/types/climb";
import { useState } from "react";
import { climbStorage } from "@/utils/climbStorage";

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
  
  // Sequence mode state
  const [isSequenceMode, setIsSequenceMode] = useState<boolean>(false);
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  
  // Hold type selection state
  const [showHoldTypeSelector, setShowHoldTypeSelector] = useState<boolean>(false);
  const [selectedHoldForType, setSelectedHoldForType] = useState<string | null>(null);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setShowGradeSelector(false);
  };

  const handleSequenceModeToggle = () => {
    setIsSequenceMode(!isSequenceMode);
    if (!isSequenceMode) {
      // Clear existing sequence when entering sequence mode
      setSequenceOrder([]);
      setHolds(holds.map(hold => ({ ...hold, nextHold: undefined })));
    }
  };

  const handleHoldSequenceSelect = (holdId: string) => {
    if (!isSequenceMode) return;
    
    const newSequenceOrder = [...sequenceOrder];
    const holdIndex = newSequenceOrder.indexOf(holdId);
    
    if (holdIndex !== -1) {
      // Remove hold from sequence
      newSequenceOrder.splice(holdIndex, 1);
    } else {
      // Add hold to sequence
      newSequenceOrder.push(holdId);
    }
    
    setSequenceOrder(newSequenceOrder);
    
    // Update holds with nextHold relationships
    const updatedHolds = holds.map(hold => {
      const sequenceIndex = newSequenceOrder.indexOf(hold.id);
      const nextIndex = sequenceIndex + 1;
      const nextHoldId = nextIndex < newSequenceOrder.length ? newSequenceOrder[nextIndex] : undefined;
      
      return {
        ...hold,
        nextHold: nextHoldId
      };
    });
    
    setHolds(updatedHolds);
  };

  const clearSequence = () => {
    setSequenceOrder([]);
    setHolds(holds.map(hold => ({ ...hold, nextHold: undefined })));
  };

  const handleHoldSelect = (holdId: string) => {
    if (isSequenceMode) {
      handleHoldSequenceSelect(holdId);
    } else {
      // Regular hold selection for type assignment
      setSelectedHoldID(holdId);
      setSelectedHoldForType(holdId);
      setShowHoldTypeSelector(true);
    }
  };

  const handleHoldTypeSelect = (holdType: HoldType) => {
    if (selectedHoldForType) {
      const updatedHolds = holds.map(hold => 
        hold.id === selectedHoldForType 
          ? { ...hold, type: holdType }
          : hold
      );
      setHolds(updatedHolds);
    }
    setShowHoldTypeSelector(false);
    setSelectedHoldForType(null);
  };

  const handleSubmit = async () => {
    if (!grade.trim() || !gymName.trim() || !gymLocation.trim()) {
      Alert.alert("Error", "Please fill in the grade, gym name, and gym location");
      return;
    }

    setIsSubmitting(true);
    try {
      const newClimb = {
        grade: grade.trim(),
        gym: {
          id: Date.now(), // Generate unique gym ID
          name: gymName.trim(),
          location: gymLocation.trim(),
        },
        holds: holds,
        imageUri: image, // Store the camera image URI
        notes: notes.trim() || undefined,
      };

      await climbStorage.saveClimb(newClimb);
      Alert.alert("Success", "Climb saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
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
      <PhotoHoldView 
        flex={1} 
        image={image} 
        holds={holds} 
        setHolds={setHolds} 
        setSelectedHoldID={setSelectedHoldID} 
        borderRadius={0} 
        backgroundColor={Colors.transparent_pink}
        isSequenceMode={isSequenceMode}
        sequenceOrder={sequenceOrder}
        onHoldSelect={handleHoldSelect}
      />

      {/* Form Section */}
        
        <Text style={styles.sectionTitle}>Climb Details</Text>
        <ScrollView style={styles.formContent} showsVerticalScrollIndicator={true} indicatorStyle="white">
        <View style={styles.inputGroup}>
              <Text style={styles.label}>Hold Sequence</Text>
              <View style={styles.sequenceControls}>
                <TouchableOpacity
                  style={[styles.sequenceToggle, isSequenceMode && styles.sequenceToggleActive]}
                  onPress={handleSequenceModeToggle}
                >
                  <Text style={[styles.sequenceToggleText, isSequenceMode && styles.sequenceToggleTextActive]}>
                    {isSequenceMode ? "Sequence Mode ON" : "Sequence Mode OFF"}
                  </Text>
                </TouchableOpacity>
                
                {isSequenceMode && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearSequence}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.instructionsContainer}>
                {isSequenceMode ? (
                  <View style={styles.sequenceInfo}>
                    <Text style={styles.sequenceInfoText}>
                      📍 Tap holds in order to create sequence ({sequenceOrder.length} holds selected)
                    </Text>
                    {sequenceOrder.length > 0 && (
                      <Text style={styles.sequenceOrder}>
                        Sequence: {sequenceOrder.map((holdId, index) => `${index + 1}`).join(' → ')}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.holdTypeInfo}>
                    <Text style={styles.holdTypeInfoText}>
                      🪨 Tap any hold to choose its type (Crimp, Jug, Sloper, etc.)
                    </Text>
                  </View>
                )}
              </View>
            </View>
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
              <Text style={styles.label}>Gym Location *</Text>
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

      {/* Hold Type Selector Modal */}
      <HoldTypeSelector
        visible={showHoldTypeSelector}
        onClose={() => {
          setShowHoldTypeSelector(false);
          setSelectedHoldForType(null);
        }}
        onHoldTypeSelect={handleHoldTypeSelect}
        currentHoldType={selectedHoldForType ? holds.find(h => h.id === selectedHoldForType)?.type : undefined}
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
  sequenceControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  sequenceToggle: {
    flex: 1,
    backgroundColor: "#666",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  sequenceToggleActive: {
    backgroundColor: "#ff0080",
  },
  sequenceToggleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sequenceToggleTextActive: {
    color: "#fff",
  },
  clearButton: {
    backgroundColor: "#ff4444",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sequenceInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  sequenceInfoText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  sequenceOrder: {
    color: "#ff0080",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionsContainer: {
    marginTop: 8,
  },
  holdTypeInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
  },
  holdTypeInfoText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
