import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import HomePage from "./screens/HomePage";
import AnalyticsPage from "./screens/AnalyticsPage";
import SettingsPage from "./screens/SettingsPage";

import Navbar from "./Components/Navbar";

import { supabase } from "./lib/supabaseClient";

import { ThemeProvider } from "./contexts/ThemeContext";
import { CategoryProvider } from "./contexts/CategoryContext";

function App() {
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserdata(data.session?.user ?? null);
    };
    getSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUserdata(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
     <ThemeProvider>
      <CategoryProvider>
        <div className="bg-slate-100 dark:bg-slate-900 text-zinc-900 dark:text-zinc-200 min-h-screen font-sans">
          <header className="flex justify-center p-4">
            <Navbar /> 
          </header>

          <main className="p-4 sm:p-6 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage user={userdata} />} />
            </Routes>
          </main>
        </div>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default App;
