import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
function App() {
  //for getting the logged in user data
  const { data: authuser, isLoading } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authuser data", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  // to remember: ? and : used below are like if else (eg: if : authuser is true then homepage then : to login)
  return (
    <div className="flex max-w-6xl mx-auto">
      {/*A common component ,bcoz its not wrapped in a routes,it will show on all the pages*/}
      {authuser && <Sidebar />}
      <Routes>
        <Route
          path="/signup"
          element={!authuser ? <SignUpPage /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/"
          element={authuser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authuser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authuser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authuser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authuser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
