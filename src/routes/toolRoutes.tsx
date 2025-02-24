import { lazy } from "react"
import { RouteObject } from "react-router-dom"
import { RouteGuard } from "@/components/routing/RouteGuard"
import { ToolLayout } from "@/components/layouts/ToolLayout"

// Tool Pages
const WhiteNoise = lazy(() => import("@/pages/tools/WhiteNoise"))
const BMICalculator = lazy(() => import("@/pages/tools/BMICalculator"))
const BodyFatCalculator = lazy(() => import("@/pages/tools/BodyFatCalculator"))
const BMRCalculator = lazy(() => import("@/pages/tools/BMRCalculator"))
const BiologicalAgeCalculator = lazy(() => import("@/pages/tools/BiologicalAgeCalculator"))
const HRVCalculator = lazy(() => import("@/pages/tools/HRVCalculator"))
const BreathingRateCalculator = lazy(() => import("@/pages/tools/BreathingRateCalculator"))
const CalorieCalculator = lazy(() => import("@/pages/tools/CalorieCalculator"))
const MacroCalculator = lazy(() => import("@/pages/tools/MacroCalculator"))
const WaterIntakeCalculator = lazy(() => import("@/pages/tools/WaterIntakeCalculator"))
const BinauralBeats = lazy(() => import("@/pages/tools/BinauralBeats"))
const NatureSounds = lazy(() => import("@/pages/tools/NatureSounds"))
const FocusTimer = lazy(() => import("@/pages/tools/FocusTimer"))
const ColorMatch = lazy(() => import("@/pages/tools/ColorMatch"))
const BrainMatch3 = lazy(() => import("@/pages/tools/BrainMatch3"))
const ReactionTime = lazy(() => import("@/pages/tools/ReactionTime"))
const MemoryCards = lazy(() => import("@/pages/tools/MemoryCards"))
const SequenceMemory = lazy(() => import("@/pages/tools/SequenceMemory"))
const WordScramble = lazy(() => import("@/pages/tools/WordScramble"))
const MentalRotation = lazy(() => import("@/pages/tools/MentalRotation"))
const Reversi = lazy(() => import("@/pages/tools/Reversi"))
const BreathingExercises = lazy(() => import("@/pages/tools/BreathingExercises"))
const StressCheck = lazy(() => import("@/pages/tools/StressCheck"))
const SleepCalculator = lazy(() => import("@/pages/tools/SleepCalculator"))
const CaffeineCalculator = lazy(() => import("@/pages/tools/CaffeineCalculator"))
const WithdrawalTracker = lazy(() => import("@/pages/tools/WithdrawalTracker"))
const BreathTraining = lazy(() => import("@/pages/tools/BreathTraining"))
const MouthTaping = lazy(() => import("@/pages/tools/MouthTaping"))
const RedLightTherapy = lazy(() => import("@/pages/tools/RedLightTherapy"))
const NootropicsDatabase = lazy(() => import("@/pages/tools/NootropicsDatabase"))
const ColdTherapy = lazy(() => import("@/pages/tools/ColdTherapy"))
const EMFProtection = lazy(() => import("@/pages/tools/EMFProtection"))
const BlueLightBlockers = lazy(() => import("@/pages/tools/BlueLightBlockers"))
const Grounding = lazy(() => import("@/pages/tools/Grounding"))
const SleepGuide = lazy(() => import("@/pages/tools/SleepGuide"))
const SleepGuideArticle = lazy(() => import("@/pages/tools/SleepGuideArticle"))
const SleepTracking = lazy(() => import("@/pages/tools/SleepTracking"))
const SleepHygieneChecklist = lazy(() => import("@/pages/tools/SleepHygieneChecklist"))
const SleepEnvironment = lazy(() => import("@/pages/tools/SleepEnvironment"))
const SleepAnalytics = lazy(() => import("@/pages/tools/SleepAnalytics"))
const SleepGoals = lazy(() => import("@/pages/tools/SleepGoals"))
const SmartAlarm = lazy(() => import("@/pages/tools/SmartAlarm"))
const CreatineGuide = lazy(() => import("@/pages/tools/CreatineGuide"))
const HerbalTeaGuide = lazy(() => import("@/pages/tools/HerbalTeaGuide"))

// Tool Categories
const categories = {
  calculators: {
    name: "Health Calculators",
    tools: [
      { path: "bmi", element: <BMICalculator />, name: "BMI Calculator" },
      { path: "body-fat", element: <BodyFatCalculator />, name: "Body Fat Calculator" },
      { path: "bmr", element: <BMRCalculator />, name: "BMR Calculator" },
      { path: "biological-age", element: <BiologicalAgeCalculator />, name: "Biological Age Calculator" },
      { path: "hrv", element: <HRVCalculator />, name: "HRV Calculator" },
      { path: "breathing-rate", element: <BreathingRateCalculator />, name: "Breathing Rate Calculator" },
      { path: "calorie", element: <CalorieCalculator />, name: "Calorie Calculator" },
      { path: "macro", element: <MacroCalculator />, name: "Macro Calculator" },
      { path: "water-intake", element: <WaterIntakeCalculator />, name: "Water Intake Calculator" },
    ]
  },
  focus: {
    name: "Focus Tools",
    tools: [
      { path: "white-noise", element: <WhiteNoise />, name: "White Noise Generator" },
      { path: "binaural-beats", element: <BinauralBeats />, name: "Binaural Beats" },
      { path: "nature-sounds", element: <NatureSounds />, name: "Nature Sounds" },
      { path: "focus-timer", element: <FocusTimer />, name: "Focus Timer" },
    ]
  },
  brain: {
    name: "Brain Training",
    tools: [
      { path: "color-match", element: <ColorMatch />, name: "Color Match" },
      { path: "brain-match3", element: <BrainMatch3 />, name: "Brain Match 3" },
      { path: "reaction-time", element: <ReactionTime />, name: "Reaction Time" },
      { path: "memory-cards", element: <MemoryCards />, name: "Memory Cards" },
      { path: "sequence-memory", element: <SequenceMemory />, name: "Sequence Memory" },
      { path: "word-scramble", element: <WordScramble />, name: "Word Scramble" },
      { path: "mental-rotation", element: <MentalRotation />, name: "Mental Rotation" },
      { path: "reversi", element: <Reversi />, name: "Reversi" },
    ]
  },
  wellness: {
    name: "Wellness Tools",
    tools: [
      { path: "breathing-exercises", element: <BreathingExercises />, name: "Breathing Exercises" },
      { path: "stress-check", element: <StressCheck />, name: "Stress Check" },
      { path: "sleep-calculator", element: <SleepCalculator />, name: "Sleep Calculator" },
      { path: "caffeine-calculator", element: <CaffeineCalculator />, name: "Caffeine Calculator" },
      { path: "withdrawal-tracker", element: <WithdrawalTracker />, name: "Withdrawal Tracker" },
    ]
  },
  biohacking: {
    name: "Biohacking",
    tools: [
      { path: "breath-training", element: <BreathTraining />, name: "Breath Training" },
      { path: "mouth-taping", element: <MouthTaping />, name: "Mouth Taping Guide" },
      { path: "red-light-therapy", element: <RedLightTherapy />, name: "Red Light Therapy" },
      { path: "nootropics", element: <NootropicsDatabase />, name: "Nootropics Database" },
      { path: "cold-therapy", element: <ColdTherapy />, name: "Cold Therapy" },
      { path: "emf-protection", element: <EMFProtection />, name: "EMF Protection" },
      { path: "blue-light-blockers", element: <BlueLightBlockers />, name: "Blue Light Blockers" },
    ]
  },
  sleep: {
    name: "Sleep Tools",
    tools: [
      { path: "sleep-guide", element: <SleepGuide />, name: "Sleep Guide" },
      { path: "sleep-tracking", element: <SleepTracking />, name: "Sleep Tracking" },
      { path: "sleep-hygiene", element: <SleepHygieneChecklist />, name: "Sleep Hygiene Checklist" },
      { path: "sleep-environment", element: <SleepEnvironment />, name: "Sleep Environment" },
      { path: "sleep-analytics", element: <SleepAnalytics />, name: "Sleep Analytics" },
      { path: "sleep-goals", element: <SleepGoals />, name: "Sleep Goals" },
      { path: "smart-alarm", element: <SmartAlarm />, name: "Smart Alarm" },
    ]
  },
  guides: {
    name: "Guides",
    tools: [
      { path: "creatine-guide", element: <CreatineGuide />, name: "Creatine Guide" },
      { path: "herbal-tea-guide", element: <HerbalTeaGuide />, name: "Herbal Tea Guide" },
    ]
  }
}

// Create route objects with guards
const createToolRoute = (tool: { path: string; element: JSX.Element; name: string }) => ({
  path: tool.path,
  element: (
    <RouteGuard
      requirements={{
        permission: 'public',
        platform: ['webapp', 'webtool'],
        features: ['tools']
      }}
    >
      {tool.element}
    </RouteGuard>
  )
})

// Export routes
export const toolRoutes: RouteObject = {
  path: "tools",
  element: (
    <RouteGuard
      requirements={{
        permission: 'public',
        platform: ['webapp', 'webtool']
      }}
    >
      <ToolLayout />
    </RouteGuard>
  ),
  children: Object.values(categories).flatMap(category => 
    category.tools.map(tool => createToolRoute(tool))
  )
}
