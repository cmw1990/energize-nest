
import { RouteObject } from "react-router-dom";
import WordScramble from "@/pages/tools/WordScramble";
import ColorMatch from "@/pages/tools/ColorMatch";
import BrainMatch3 from "@/pages/tools/BrainMatch3";
import MemoryCards from "@/pages/tools/MemoryCards";
import MentalRotation from "@/pages/tools/MentalRotation";
import SequenceMemory from "@/pages/tools/SequenceMemory";
import NBackGame from "@/pages/tools/NBackGame";
import DualNBack from "@/pages/tools/DualNBack";
import PatternRecognition from "@/pages/tools/PatternRecognition";
import SpeedMath from "@/pages/tools/SpeedMath";
import Test from "@/pages/Test";
import Tools from "@/pages/tools/Tools";
import BlueLightBlockers from "@/pages/tools/BlueLightBlockers";
import CaloriesNeededCalculator from "@/pages/tools/CaloriesNeededCalculator";
import FastingTimer from "@/pages/tools/FastingTimer";
import StressCheck from "@/pages/tools/StressCheck";
import BinauralBeats from "@/pages/tools/BinauralBeats";

export const toolRoutes: RouteObject[] = [
  {
    path: "test",
    element: <Test />,
  },
  {
    path: "tools",
    children: [
      {
        index: true,
        element: <Tools />,
      },
      {
        path: "word-scramble",
        element: <WordScramble />,
      },
      {
        path: "color-match",
        element: <ColorMatch />,
      },
      {
        path: "brain-match",
        element: <BrainMatch3 />,
      },
      {
        path: "memory-cards",
        element: <MemoryCards />,
      },
      {
        path: "mental-rotation",
        element: <MentalRotation />,
      },
      {
        path: "sequence-memory",
        element: <SequenceMemory />,
      },
      {
        path: "n-back",
        element: <NBackGame />,
      },
      {
        path: "dual-n-back",
        element: <DualNBack />,
      },
      {
        path: "pattern-recognition",
        element: <PatternRecognition />,
      },
      {
        path: "speed-math",
        element: <SpeedMath />,
      },
      {
        path: "blue-light-blockers",
        element: <BlueLightBlockers />,
      },
      {
        path: "calories-calculator",
        element: <CaloriesNeededCalculator />,
      },
      {
        path: "fasting-timer",
        element: <FastingTimer />,
      },
      {
        path: "stress-check",
        element: <StressCheck />,
      },
      {
        path: "binaural-beats",
        element: <BinauralBeats />,
      }
    ],
  }
];

export default toolRoutes;
