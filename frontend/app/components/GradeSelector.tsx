import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';

interface GradeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onGradeSelect: (grade: string) => void;
  currentGrade?: string;
}

const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
const ITEM_HEIGHT = 50;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VISIBLE_ITEMS = 5;
const SELECTOR_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function GradeSelector({ visible, onClose, onGradeSelect, currentGrade }: GradeSelectorProps) {
  const [selectedMinIndex, setSelectedMinIndex] = useState(0);
  const [selectedMaxIndex, setSelectedMaxIndex] = useState(0);
  
  const minScrollRef = useRef<ScrollView>(null);
  const maxScrollRef = useRef<ScrollView>(null);

  // Initialize selected indices based on current grade
  useEffect(() => {
    if (currentGrade) {
      if (currentGrade.includes('-')) {
        // Range grade like "V4-6"
        const [minGrade, maxGrade] = currentGrade.split('-');
        const minIndex = GRADES.indexOf(minGrade);
        const maxIndex = GRADES.indexOf(`V${maxGrade}`);
        if (minIndex !== -1 && maxIndex !== -1) {
          setSelectedMinIndex(minIndex);
          setSelectedMaxIndex(maxIndex);
        }
      } else {
        // Single grade like "V5"
        const index = GRADES.indexOf(currentGrade);
        if (index !== -1) {
          setSelectedMinIndex(index);
          setSelectedMaxIndex(index);
        }
      }
    }
  }, [currentGrade, visible]);

  const scrollToIndex = (scrollRef: React.RefObject<ScrollView>, index: number) => {
    if (scrollRef.current) {
      const offset = index * ITEM_HEIGHT;
      scrollRef.current.scrollTo({ y: offset, animated: true });
    }
  };

  const handleScroll = (event: any, isMin: boolean) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    let clampedIndex = Math.max(0, Math.min(index, GRADES.length - 1));
    
    if (isMin) {
      setSelectedMinIndex(clampedIndex);
    } else {
      // For max grade, ensure it's not less than min grade
      clampedIndex = Math.max(clampedIndex, selectedMinIndex);
      setSelectedMaxIndex(clampedIndex);
    }
  };

  const handleMomentumScrollEnd = (event: any, isMin: boolean) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    let clampedIndex = Math.max(0, Math.min(index, GRADES.length - 1));
    
    if (isMin) {
      scrollToIndex(minScrollRef as React.RefObject<ScrollView>, clampedIndex);
      setSelectedMinIndex(clampedIndex);
      
      // If min becomes greater than max, set max equal to min
      if (clampedIndex > selectedMaxIndex) {
        setSelectedMaxIndex(clampedIndex);
        scrollToIndex(maxScrollRef as React.RefObject<ScrollView>, clampedIndex);
      }
    } else {
      // For max grade, ensure it's not less than min grade
      const finalClampedIndex = Math.max(clampedIndex, selectedMinIndex);
      scrollToIndex(maxScrollRef as React.RefObject<ScrollView>, finalClampedIndex);
      setSelectedMaxIndex(finalClampedIndex);
    }
  };

  const handleConfirm = () => {
    let grade: string;
    
    if (selectedMinIndex !== selectedMaxIndex) {
      // Ensure min is not greater than max
      const minIdx = Math.min(selectedMinIndex, selectedMaxIndex);
      const maxIdx = Math.max(selectedMinIndex, selectedMaxIndex);
      grade = `${GRADES[minIdx]}-${GRADES[maxIdx].substring(1)}`; // Remove 'V' from max grade
    } else {
      // Single grade
      grade = GRADES[selectedMinIndex];
    }
    
    onGradeSelect(grade);
    onClose();
  };

  const renderGradeItem = (grade: string, index: number, selectedIndex: number) => {
    const isSelected = index === selectedIndex;
    return (
      <View key={grade} style={[styles.gradeItem, isSelected && styles.selectedGradeItem]}>
        <Text style={[styles.gradeText, isSelected && styles.selectedGradeText]}>
          {grade}
        </Text>
      </View>
    );
  };

  const renderScrollSelector = (
    scrollRef: React.RefObject<ScrollView>,
    selectedIndex: number,
    isMin: boolean,
    title: string
  ) => (
    <View style={styles.scrollContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={(event) => handleScroll(event, isMin)}
          onMomentumScrollEnd={(event) => handleMomentumScrollEnd(event, isMin)}
          scrollEventThrottle={16}
        >
          {/* Padding items at top and bottom */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
          {GRADES.map((grade, index) => renderGradeItem(grade, index, selectedIndex))}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        
        {/* Selection indicator */}
        <View style={[styles.selectionIndicator, { pointerEvents: 'none' }]} />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Grade</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Grade Preview */}
          <View style={styles.gradePreview}>
            <Text style={styles.previewLabel}>Selected Grade:</Text>
            <Text style={styles.previewText}>
              {selectedMinIndex !== selectedMaxIndex
                ? `${GRADES[Math.min(selectedMinIndex, selectedMaxIndex)]}-${GRADES[Math.max(selectedMinIndex, selectedMaxIndex)].substring(1)}`
                : GRADES[selectedMinIndex]
              }
            </Text>
          </View>

          {/* Grade Selectors */}
          <View style={styles.selectorsContainer}>
            {renderScrollSelector(minScrollRef as React.RefObject<ScrollView>, selectedMinIndex, true, "Min Grade")}
            {renderScrollSelector(maxScrollRef as React.RefObject<ScrollView>, selectedMaxIndex, false, "Max Grade")}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#ff0080',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  gradePreview: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  previewText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0080',
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
  },
  scrollWrapper: {
    position: 'relative',
    height: SELECTOR_HEIGHT,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  gradeItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  selectedGradeItem: {
    // Style will be handled by the selection indicator
  },
  gradeText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
  },
  selectedGradeText: {
    fontSize: 22,
    color: '#111',
    fontWeight: 'bold',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: '50%',
    transform: [{ translateX: -40 }], // Center the 80px wide container
    width: 80,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255, 0, 128, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff0080',
  },
  confirmButton: {
    backgroundColor: '#ff0080',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
