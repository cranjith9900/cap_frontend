import { API_BASE } from "../lib/api.js";

export const bookService = {
  // 1. READ (Get all books)
  getBooks: async () => {
    const res = await fetch(`${API_BASE}/Books`);
    const data = await res.json();
    return data.value; // OData wraps arrays in a "value" property
  },

  // 2. CREATE (Post a new book)
  createBook: async (bookData) => {
    const res = await fetch(`${API_BASE}/Books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    return res.json();
  },

  // 3. UPDATE (Patch an existing book)
  updateBook: async (id, updatedFields) => {
    const res = await fetch(`${API_BASE}/Books(${id})`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    return res.status === 204 ? { success: true } : res.json();
  },

  // 4. DELETE (Remove a book)
  deleteBook: async (id) => {
    const res = await fetch(`${API_BASE}/Books(${id})`, {
      method: "DELETE",
    });
    return res.status === 204;
  },
};
