// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

/* ************************************************************************* */

// Import the main app component
import App from "./App";
import Bookings from "./pages/Booking/Bookings";
import Contact from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Registrer/Registrer";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ReviewForm from "./pages/ReviewForm/ReviewForm";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Vérification de la session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

import axios from "axios";

axios.defaults.withCredentials = true;
// Import additional components for new routes
// Try creating these components in the "pages" folder

// import About from "./pages/About";
// import Contact from "./pages/Contact";

/* ************************************************************************* */

// Create router configuration with routes
// You can add more routes as you build out your app!

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/inscription",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          {
            path: "maps",
            element: <MapPage />,
          },
          {
            path: "bookings",
            element: <Bookings />,
          },
          {
            path: "bookings/:id",
            element: <Bookings />,
          },
          {
            path: "profil",
            element: <Profile />,
          },
          {
            path: "review-form/:id",
            element: <ReviewForm />,
          },
        ],
      },
    ],
  },
  // Try adding a new route! For example, "/about" with an About component
]);
/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
