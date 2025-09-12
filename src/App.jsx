import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import HomePage from "./screens/HomePage";
import AnalyticsPage from "./screens/AnalyticsPage";
import SettingsPage from "./screens/SettingsPage";

import { supabase } from "./lib/supabaseClient";

function App() {
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      // Change setUser to setUserdata here
      setUserdata(data.session?.user ?? null);
    };

    getSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Change setUser to setUserdata here as well
      setUserdata(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <div>
      {userdata ? `Logged in as ${userdata.email}` : "Not logged in"}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage/>
            }
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage user={userdata} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
