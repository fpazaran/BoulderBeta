import { Climb, Hold } from "@/types/climb";
import { images } from "./images";

const holds: Hold[] = [
  {
    id: "1",
    type: "Crimp",
    nextHold: undefined,
    position: { top: 20, left: 30 },
    size: { width: 20, height: 20 },
  },
  {
    id: "2",
    type: "Sloper",
    nextHold: "1",
    position: { top: 40, left: 60 },
    size: { width: 20, height: 20 },
  },
  {
    id: "3",
    type: "Foothold",
    nextHold: "2",
    position: { top: 60, left: 20 },
    size: { width: 20, height: 20 },
  },
  {
    id: "4",
    type: "Jug",
    nextHold: "3",
    position: { top: 80, left: 70 },
    size: { width: 20, height: 20 },
  },
];

export const mock_climbs: Climb[] = [
    {
        id: 1,
        grade: "V5",
        gym: {
            id: 1,
            name: "Gym 1",
        },
        image: images.image1,
        holds: holds,
    },
    {
        id: 2,
        grade: "V6",
        gym: {
            id: 2,
            name: "Gym 2",
        },
        image: images.image2,
        holds: holds,
    },
    {
        id: 3,
        grade: "V7",
        gym: {
            id: 3,
            name: "Gym 3",
        },
        image: images.image3,
        holds: holds,
    },
    {
        id: 4,
        grade: "V8",
        gym: {
            id: 4,
            name: "Gym 4",
        },
        image: images.image4,
        holds: holds,
    },
    {
        id: 5,
        grade: "V9",
        gym: {
            id: 5,
            name: "Gym 5",
        },
        image: images.image5,
        holds: holds,
    },
    {
        id: 6,
        grade: "V10",
        gym: {
            id: 6,
            name: "Gym 6",
        },
        image: images.image6,
        holds: holds,
    },
    {
        id: 7,
        grade: "V11",
        gym: {
            id: 7,
            name: "Gym 7",
        },
        image: images.image7,
        holds: holds,
    },
    {
        id: 8,
        grade: "V12",
        gym: {
            id: 8,
            name: "Gym 8",
        },
        image: images.image8,
        holds: holds,
    },
    {
        id: 9,
        grade: "V13",
        gym: {
            id: 9,
            name: "Gym 9",
        },
        image: images.image9,
        holds: holds,
    },
    {
        id: 10,
        grade: "V14",
        gym: {
            id: 10,
            name: "Gym 10",
        },
        image: images.image10,
        holds: holds,
    },
]