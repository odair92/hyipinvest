import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "../supabase/auth";
import SetupWizard from "./components/setup/SetupWizard";
import { supabase } from "../supabase/supabase";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const [isSystemInitialized, setIsSystemInitialized] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSystemInitialization() {
      try {
        const { data, error } = await supabase
          .from("system_settings")
          .select("setting_value")
          .eq("setting_key", "system_initialized")
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking system initialization:", error);
        }

        setIsSystemInitialized(data?.setting_value === "true");
      } catch (err) {
        console.error("Failed to check system initialization:", err);
        setIsSystemInitialized(false);
      } finally {
        setLoading(false);
      }
    }

    checkSystemInitialization();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If system is not initialized, show setup wizard
  if (isSystemInitialized === false) {
    return (
      <Routes>
        <Route path="*" element={<SetupWizard />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/setup" element={<SetupWizard />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
