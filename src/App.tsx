
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { mainRoutes } from "@/routes/mainRoutes";
import { toolRoutes } from "@/routes/toolRoutes";
import { gameRoutes } from "@/routes/gameRoutes";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

// Create a new query client with better caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create the router with all routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      ...mainRoutes[0].children,
      ...toolRoutes,
      ...gameRoutes
    ]
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
