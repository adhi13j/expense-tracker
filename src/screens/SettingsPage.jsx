import { supabase } from "../lib/supabaseClient";
import { useTheme } from "../contexts/ThemeContext";
import { useCategories } from "../contexts/CategoryContext";
import { useState } from "react";
function SettingsPage({ user }) {
  const { theme, setTheme } = useTheme();
  const { categories, addCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === "") return;
    await addCategory(newCategory);
    setNewCategory(""); // Clear the input field
  };
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
      <div>
        <h4>Theme</h4>
        <label>
          <input
            type="radio"
            value="light"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />
          Light
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            value="dark"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />
          Dark
        </label>
      </div>
      <hr />
      <div>
        <h4>Manage Categories</h4>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button type="submit">Add Category</button>
        </form>
      </div>

      <hr />
      <hr />
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
