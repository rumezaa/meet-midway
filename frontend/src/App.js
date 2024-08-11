import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthView from "./Screen/AuthView";
import HomeView from "./Screen/HomeView";
import PreferencesView from "./Screen/PreferencesView";
import ManageAccount from "./Screen/ManageAccount";
import "./App.css";
import { UserProvider } from "./contexts/UserProvider";
import { auth } from "./Firebase/Firebase";
import { useEffect, useState } from "react";
import { GoogleMapsProvider } from "./contexts/MapsContext";
import Loading from "./Screen/Loading";

// ProtectedRoute Component
function ProtectedRoute({ element, user }) {
  return user ? element : <Navigate to="/signin" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Loading />; // or a loading spinner
  }

  return (
    <div className="app-container h-screen">
      <UserProvider>
        <BrowserRouter>
          <GoogleMapsProvider>
            <Routes>
              <Route path="/signin" element={<AuthView />} />
              <Route
                path="/"
                element={<ProtectedRoute element={<HomeView />} user={user} />}
              />
              <Route
                path="/add-preferences"
                element={
                  <ProtectedRoute element={<PreferencesView />} user={user} />
                }
              />
              <Route
                path="/manage-account"
                element={
                  <ProtectedRoute element={<ManageAccount />} user={user} />
                }
              />
              {/* Redirect to /signin if route is not matched and user is not authenticated */}
              <Route
                path="*"
                element={<Navigate to={user ? "/" : "/signin"} />}
              />
            </Routes>
          </GoogleMapsProvider>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
