import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const CategoryContext = createContext();

// Create a provider component
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const { data: userSession } = await supabase.auth.getSession();
    if (userSession.session) {
      const { data, error } = await supabase
        .from("Categories")
        .select("id, name");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (categoryName) => {
    const { data, error } = await supabase
      .from("Categories")
      .insert({ name: categoryName })
      .select()
      .single();

    if (error) {
      console.error("Error adding category:", error);
      return null;
    }

    setCategories([...categories, data]);
    return data;
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, loading }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
