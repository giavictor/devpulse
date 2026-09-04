import { useEffect, useState } from "react";
import api from "../services/api";

import type { SavedLink } from "../types";

export default function SavedLinks() {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Loading states for update and delete
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Edit form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // READ — Load all links
  async function fetchLinks() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get<SavedLink[]>("/links");
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved links.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // CREATE — Add a link
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data } = await api.post<SavedLink>("/links", {
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || undefined,
      });

      setLinks((prev) => [data, ...prev]);

      setTitle("");
      setUrl("");
      setDescription("");
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.errors?.join(", ") ||
          "Failed to add link. Check the URL."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Start editing
  function startEdit(link: SavedLink) {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditDescription(link.description || "");
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  // UPDATE
  async function handleUpdate(id: number) {
    if (!editTitle.trim() || !editUrl.trim()) {
      setError("Title and URL are required.");
      return;
    }

    setUpdatingId(id);
    setError(null);

    try {
      const { data } = await api.put<SavedLink>(`/links/${id}`, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        description: editDescription.trim() || undefined,
      });

      setLinks((prev) =>
        prev.map((link) => (link.id === id ? data : link))
      );

      setEditingId(null);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.errors?.join(", ") ||
          "Failed to update link."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);

    try {
      await api.delete(`/links/${id}`);

      setLinks((prev) =>
        prev.filter((link) => link.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete link.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Saved Links</h2>

      {/* CREATE FORM */}
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Link"}
        </button>
      </form>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* LOADING, EMPTY AND DATA STATES */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading links...</p>
      ) : links.length === 0 ? (
        <p className="text-sm text-gray-400">
          No saved links yet. Add one above.
        </p>
      ) : (
        <ul className="space-y-2">
          {links.map((link) =>
            editingId === link.id ? (
              /* UPDATE FORM */
              <li
                key={link.id}
                className="border rounded p-2 space-y-2"
              >
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(link.id)}
                    disabled={updatingId === link.id}
                    className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    {updatingId === link.id ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={updatingId === link.id}
                    className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              /* NORMAL VIEW */
              <li
                key={link.id}
                className="border rounded p-3 flex justify-between"
              >
                <div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {link.title}
                  </a>

                  {link.description && (
                    <p className="text-sm text-gray-500">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(link)}
                    disabled={deletingId === link.id}
                    className="disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="text-red-600 disabled:opacity-50"
                  >
                    {deletingId === link.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}