import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/Profile/ProfilePage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/*A common component ,bcoz its not wrapped in a routes,it will show on all the pages*/}
      <Sidebar />
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
