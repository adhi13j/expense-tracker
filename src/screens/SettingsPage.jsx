import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTheme } from "../contexts/ThemeContext";
import { useCategories } from "../contexts/CategoryContext";

function SettingsPage({ user }) {
  const { theme, setTheme } = useTheme();
  const { categories, addCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === "") return;
    await addCategory(newCategory);
    setNewCategory("");
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
        Settings
      </h2>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Theme
        </h4>
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="form-radio text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2">Light</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="form-radio text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2">Dark</span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">
          Manage Categories
        </h4>
        <ul className="space-y-2 mb-4 list-disc list-inside text-slate-600 dark:text-slate-400">
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
        <form onSubmit={handleAddCategory} className="flex space-x-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-grow block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        {user ? (
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
              Logged in as {user.email}
            </p>
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to your account to get started.
            </p>
            <button
              onClick={signInWithGoogle}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md text-center">
        <b>Credits</b> <br />
        Base code by Srivenkata <br />
        art design by gemini
      </div>
    </div>
  );
}

export default SettingsPage;
