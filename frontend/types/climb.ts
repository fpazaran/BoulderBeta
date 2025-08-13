export type Gym = {
  id: number;
  name: string;
  location?: string;
};

export type Hold = {
  id: string;
  type?: HoldType;
  nextHold?: string;
  position: {
    top: number;
    left: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type HoldType =
  | "Crimp"
  | "Sloper"
  | "Jug"
  | "Foothold"
  | "Pinch"
  | "Sidepull"
  | "Undercling";

export type Climb = {
  id: number;
  grade: string; // Can be single grade like "V5" or range like "V5-7"
  gym: Gym;
  holds?: Hold[];
};

export type ClimbGrade = string;

export type ClimbFilters = {
  minGrade?: string;
  maxGrade?: string;
  gymId?: number;
  location?: string;
};

export type ClimbSortOption = "name" | "difficulty" | "rating" | "gym";

export type Tool = "rectangle" | "move" | "delete";