import AsyncStorage from '@react-native-async-storage/async-storage';
import { Climb } from '@/types/climb';

const CLIMBS_STORAGE_KEY = '@saved_climbs';

export interface SavedClimb extends Omit<Climb, 'image'> {
  dateCreated: string;
  notes?: string;
  imageUri: string; // Store the camera image URI
}

export const climbStorage = {
  // Save a new climb (from camera)
  async saveClimb(climbData: Omit<SavedClimb, 'id' | 'dateCreated'>): Promise<void> {
    try {
      const existingClimbs = await this.getSavedClimbs();
      const newClimb: SavedClimb = {
        ...climbData,
        id: Date.now(), // Generate unique ID
        dateCreated: new Date().toISOString(),
      };
      const updatedClimbs = [...existingClimbs, newClimb];
      await AsyncStorage.setItem(CLIMBS_STORAGE_KEY, JSON.stringify(updatedClimbs));
    } catch (error) {
      console.error('Error saving climb:', error);
      throw error;
    }
  },

  // Get all saved climbs
  async getSavedClimbs(): Promise<SavedClimb[]> {
    try {
      const climbs = await AsyncStorage.getItem(CLIMBS_STORAGE_KEY);
      return climbs ? JSON.parse(climbs) : [];
    } catch (error) {
      console.error('Error loading climbs:', error);
      return [];
    }
  },

  // Delete a climb
  async deleteClimb(climbId: number): Promise<void> {
    try {
      const existingClimbs = await this.getSavedClimbs();
      const updatedClimbs = existingClimbs.filter(climb => climb.id !== climbId);
      await AsyncStorage.setItem(CLIMBS_STORAGE_KEY, JSON.stringify(updatedClimbs));
    } catch (error) {
      console.error('Error deleting climb:', error);
      throw error;
    }
  },

  // Clear all climbs (useful for testing or when implementing Firebase sync)
  async clearAllClimbs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CLIMBS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing climbs:', error);
      throw error;
    }
  },

  // Helper method to convert SavedClimb back to Climb format for navigation
  convertToClimb(savedClimb: SavedClimb): Climb {
    return {
      id: savedClimb.id,
      grade: savedClimb.grade,
      gym: savedClimb.gym,
      holds: savedClimb.holds,
      image: { uri: savedClimb.imageUri }, // Wrap URI in object format
    };
  }
};
