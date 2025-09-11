// src/screens/SettingsPage.jsx
import { supabase } from "../lib/supabaseClient"; 
function SettingsPage({ user }) {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
  }

  return (
    <div>
      <h2>Settings</h2>
      {user ? (
        <div>
          <p>You are logged in.</p>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Sign in to your account:</p>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
