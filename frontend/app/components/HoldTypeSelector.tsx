import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { HoldType } from '@/types/climb';

interface HoldTypeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onHoldTypeSelect: (holdType: HoldType) => void;
  currentHoldType?: HoldType;
}

const HOLD_TYPES: { type: HoldType; description: string; emoji: string }[] = [
  { type: 'Crimp', description: 'Small edge requiring fingertip strength', emoji: '🤏' },
  { type: 'Jug', description: 'Large, positive hold that\'s easy to grip', emoji: '✊' },
  { type: 'Sloper', description: 'Rounded hold requiring open-hand grip', emoji: '🤲' },
  { type: 'Pinch', description: 'Hold gripped by pinching with thumb', emoji: '👌' },
  { type: 'Sidepull', description: 'Hold pulled from the side', emoji: '👈' },
  { type: 'Undercling', description: 'Hold gripped from underneath', emoji: '👆' },
  { type: 'Foothold', description: 'Hold primarily used for feet', emoji: '🦶' },
];

export default function HoldTypeSelector({ visible, onClose, onHoldTypeSelect, currentHoldType }: HoldTypeSelectorProps) {
  const handleSelect = (holdType: HoldType) => {
    onHoldTypeSelect(holdType);
    onClose();
  };

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
            <Text style={styles.modalTitle}>Select Hold Type</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.holdTypeList} showsVerticalScrollIndicator={false}>
            {HOLD_TYPES.map((holdTypeInfo) => (
              <TouchableOpacity
                key={holdTypeInfo.type}
                style={[
                  styles.holdTypeItem,
                  currentHoldType === holdTypeInfo.type && styles.selectedHoldType
                ]}
                onPress={() => handleSelect(holdTypeInfo.type)}
              >
                <View style={styles.holdTypeHeader}>
                  <Text style={styles.holdTypeEmoji}>{holdTypeInfo.emoji}</Text>
                  <Text style={[
                    styles.holdTypeName,
                    currentHoldType === holdTypeInfo.type && styles.selectedText
                  ]}>
                    {holdTypeInfo.type}
                  </Text>
                </View>
                <Text style={[
                  styles.holdTypeDescription,
                  currentHoldType === holdTypeInfo.type && styles.selectedDescriptionText
                ]}>
                  {holdTypeInfo.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onHoldTypeSelect(undefined as any); // Clear the hold type
              onClose();
            }}
          >
            <Text style={styles.clearButtonText}>Clear Hold Type</Text>
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
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  holdTypeList: {
    maxHeight: 400,
  },
  holdTypeItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHoldType: {
    backgroundColor: '#fff0f8',
    borderColor: '#ff0080',
  },
  holdTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  holdTypeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  holdTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  selectedText: {
    color: '#ff0080',
  },
  holdTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 36,
  },
  selectedDescriptionText: {
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#666',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
