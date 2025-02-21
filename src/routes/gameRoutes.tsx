
import { Suspense, lazy } from "react"

const BreathingGame = lazy(() => import("@/components/games/BreathingGame"))
const BalloonJourney = lazy(() => import("@/components/games/BalloonJourney"))
const ZenGarden = lazy(() => import("@/components/games/ZenGarden"))

export const gameRoutes = [
  {
    path: "breathing-pufferfish", // Removed leading slash
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BreathingGame />
      </Suspense>
    ),
  },
  {
    path: "breathing-balloon", // Removed leading slash
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BalloonJourney />
      </Suspense>
    ),
  },
  {
    path: "breathing-zen", // Removed leading slash
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ZenGarden />
      </Suspense>
    ),
  },
]
