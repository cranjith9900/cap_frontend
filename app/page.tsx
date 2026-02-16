import { revalidatePath } from "next/cache";

export default async function BookstorePage() {
  // 1. READ: Fetch books directly in the Server Component
  const response = await fetch(
    "http://20.207.199.193:4004/odata/v4/catalog/Books",
    {
      cache: "no-store",
    },
  );
  const data = await response.json();
  const books = data.value || [];

  // 2. CREATE: Server Action defined inside the component
  async function addBook(formData: FormData) {
    "use server"; // Marks this specific function as a Server Action
    const API_URL = "http://20.207.199.193:4004/odata/v4/catalog/Books";

    const newBook = {
      ID: Math.floor(Math.random() * 1000),
      title: formData.get("title"),
      author: formData.get("author"),
      price: Number(formData.get("price")),
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });

    revalidatePath("/"); // Refresh the current page
  }

  // 3. DELETE: Server Action
  async function deleteBook(id) {
    "use server";
    await fetch(`http://20.207.199.193:4004/odata/v4/catalog/Books(${id})`, {
      method: "DELETE",
    });
    revalidatePath("/");
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bookstore Management</h1>

      {/* CREATE FORM */}
      <form
        action={addBook}
        className="grid gap-3 mb-10 p-4 border rounded shadow-sm"
      >
        <input
          name="title"
          placeholder="Book Title"
          className="border p-2 rounded"
          required
        />
        <input
          name="author"
          placeholder="Author"
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add New Book
        </button>
      </form>

      {/* READ & DELETE LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Inventory</h2>
        {books.map((book) => (
          <div
            key={book.ID}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <p className="font-medium">{book.title}</p>
              <p className="text-sm text-gray-500">
                {book.author} — ${book.price}
              </p>
            </div>
            {/* Bind the ID to the delete action */}
            <form action={deleteBook.bind(null, book.ID)}>
              <button className="text-red-600 hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
