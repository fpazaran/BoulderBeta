import { Climb, Hold } from "./climb";

export type RootStackParamList = {
  Index: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Climb: { climb: Climb; source: "home" | "profile" }; // Added parameter for climb details
  Profile: undefined;
  Camera: undefined;
  CreateOrPredict: { image: string; create: boolean };
  ClimbDetailsForm: { 
    holds: Hold[]; 
    image: string;
    originalImageSize: { width: number; height: number };
  };
  Prediction: { holds: Hold[] };
};

export type TabParamList = {
  HomeTab: undefined;
  CameraTab: undefined;
  ProfileTab: undefined;
};

// Helper type for useNavigation hook
export type RootStackNavigationProp =
  import("@react-navigation/stack").StackNavigationProp<RootStackParamList>;

// Helper type for useRoute hook
export type RootStackRouteProp<T extends keyof RootStackParamList> =
  import("@react-navigation/native").RouteProp<RootStackParamList, T>;

// Helper type for Tab Navigation
export type TabNavigationProp =
  import("@react-navigation/bottom-tabs").BottomTabNavigationProp<TabParamList>;
