import { useEffect, useState } from "react";
import api from "../services/api";

import type { SavedLink } from "../types";

type OperationStatus = "idle" | "loading" | "success" | "error";

export default function SavedLinks() {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] =
    useState<OperationStatus>("idle");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Update and delete loading states
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Edit form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Show success message temporarily
  function showSuccess(message: string) {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess(null);
    }, 2000);
  }

  // READ — Load all links
  async function fetchLinks() {
    setLoading(true);
    setStatus("loading");
    setError(null);

    try {
      const { data } = await api.get<SavedLink[]>("/links");

      setLinks(data);
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not load saved links. Check your connection and try again."
      );

      setStatus("error");
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
      setError("Please enter both a title and a valid URL.");
      setSuccess(null);
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setStatus("loading");

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

      showSuccess("Link saved successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not save the link. Check the URL, your connection, and try again."
      );

      setStatus("error");
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

    setError(null);
    setSuccess(null);
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  // UPDATE
  async function handleUpdate(id: number) {
    if (!editTitle.trim() || !editUrl.trim()) {
      setError("Please enter both a title and a valid URL.");
      setSuccess(null);
      setStatus("error");
      return;
    }

    setUpdatingId(id);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      const { data } = await api.put<SavedLink>(
        `/links/${id}`,
        {
          title: editTitle.trim(),
          url: editUrl.trim(),
          description: editDescription.trim() || undefined,
        }
      );

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? data : link
        )
      );

      setEditingId(null);

      showSuccess("Link updated successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not update the link. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setUpdatingId(null);
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      await api.delete(`/links/${id}`);

      setLinks((prev) =>
        prev.filter((link) => link.id !== id)
      );

      showSuccess("Link deleted successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the link. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-3">
        Saved Links
      </h2>

      {/* CREATE FORM */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          className="border rounded px-3 py-2 text-sm disabled:opacity-50"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={submitting}
          className="border rounded px-3 py-2 text-sm disabled:opacity-50"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          className="border rounded px-3 py-2 text-sm disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Link"}
        </button>
      </form>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          ✅ {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          <p>❌ {error}</p>

          {!loading && (
            <button
              type="button"
              onClick={fetchLinks}
              className="mt-2 underline font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-sm text-gray-500">
          ⏳ Loading links...
        </p>
      ) : links.length === 0 ? (
        /* EMPTY STATE */
        <p className="text-sm text-gray-400">
          No saved links yet — add your first one above.
        </p>
      ) : (
        /* DATA STATE */
        <ul className="space-y-2">
          {links.map((link) =>
            editingId === link.id ? (
              <li
                key={link.id}
                className="border rounded p-2 space-y-2"
              >
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <input
                  value={editUrl}
                  onChange={(e) =>
                    setEditUrl(e.target.value)
                  }
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <input
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  disabled={updatingId === link.id}
                  className="border rounded px-2 py-1 w-full disabled:opacity-50"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdate(link.id)
                    }
                    disabled={updatingId === link.id}
                    className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    {updatingId === link.id
                      ? "Saving..."
                      : "Save"}
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
                    onClick={() =>
                      handleDelete(link.id)
                    }
                    disabled={deletingId === link.id}
                    className="text-red-600 disabled:opacity-50"
                  >
                    {deletingId === link.id
                      ? "Deleting..."
                      : "Delete"}
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