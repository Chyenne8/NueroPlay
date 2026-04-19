import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import KidDashboard from "./pages/KidDashboard";
import QuizGame from "./pages/QuizGame";
import AdminUsers from "./pages/AdminUsers";
import AdminProfileView from "./pages/AdminProfileView";
import CaregiverLogin from "./pages/CaregiverLogin";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import Features from "./pages/Features";
import Challenge from "./pages/Challenge";
import SupabaseTest from "./pages/SupabaseTest";
import QuickSupabaseTest from "./pages/QuickSupabaseTest";
import ErrorBoundary from "./components/ErrorBoundary";

// Story Adventure Pages
import StoryAdventureHome from "./pages/StoryAdventure/Home";
import BoundariesGame from "./pages/StoryAdventure/BoundariesGame";
import ColoringBook from "./pages/StoryAdventure/ColoringBook";
import CooperativePlay from "./pages/StoryAdventure/CooperativePlay";
import TurnTakingGame from "./pages/StoryAdventure/TurnTakingGame";
import WordOfTheDay from "./pages/StoryAdventure/WordOfTheDay";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    Component: KidDashboard,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/kid-dashboard",
    Component: KidDashboard,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quiz",
    Component: QuizGame,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/challenge/:challengeId",
    Component: Challenge,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    Component: AdminUsers,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin/profile/:username",
    Component: AdminProfileView,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/caregiver-login",
    Component: CaregiverLogin,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/caregiver-dashboard",
    Component: CaregiverDashboard,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/features",
    Component: Features,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/supabase-test",
    Component: SupabaseTest,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quick-supabase-test",
    Component: QuickSupabaseTest,
    errorElement: <ErrorBoundary />,
  },
  // Story Adventure Routes
  {
    path: "/story-adventure",
    Component: StoryAdventureHome,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/story-adventure/boundaries",
    Component: BoundariesGame,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/story-adventure/coloring",
    Component: ColoringBook,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/story-adventure/cooperative",
    Component: CooperativePlay,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/story-adventure/turn-taking",
    Component: TurnTakingGame,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/story-adventure/word-of-day",
    Component: WordOfTheDay,
    errorElement: <ErrorBoundary />,
  },
]);