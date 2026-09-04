import { useEffect, useState } from "react";
import api from "../services/api";

import type { Note } from "../types";

type OperationStatus = "idle" | "loading" | "success" | "error";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] =
    useState<OperationStatus>("idle");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create note state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Update and delete loading states
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Edit note state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Show success message for 2 seconds
  function showSuccess(message: string) {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess(null);
    }, 2000);
  }

  // READ — Get all notes
  async function fetchNotes() {
    setLoading(true);
    setStatus("loading");
    setError(null);

    try {
      const { data } = await api.get<Note[]>("/notes");

      setNotes(data);
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not load notes. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // CREATE — Add a note
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and note content.");
      setSuccess(null);
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      const { data } = await api.post<Note>("/notes", {
        title: title.trim(),
        content: content.trim(),
      });

      setNotes((prev) => [data, ...prev]);

      setTitle("");
      setContent("");

      showSuccess("Note saved successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not save the note. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  // Start editing
  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);

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
    if (!editTitle.trim() || !editContent.trim()) {
      setError("Please enter both a title and note content.");
      setSuccess(null);
      setStatus("error");
      return;
    }

    setUpdatingId(id);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      const { data } = await api.put<Note>(`/notes/${id}`, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? data : note
        )
      );

      setEditingId(null);

      showSuccess("Note updated successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not update the note. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setUpdatingId(null);
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      await api.delete(`/notes/${id}`);

      setNotes((prev) =>
        prev.filter((note) => note.id !== id)
      );

      showSuccess("Note deleted successfully!");
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the note. Check your connection and try again."
      );

      setStatus("error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-3">
        Notes
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

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          className="border rounded px-3 py-2 text-sm disabled:opacity-50"
          rows={3}
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Note"}
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
              onClick={fetchNotes}
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
          ⏳ Loading notes...
        </p>
      ) : notes.length === 0 ? (
        /* EMPTY STATE */
        <p className="text-sm text-gray-400">
          No notes yet — add your first one above.
        </p>
      ) : (
        /* NOTES LIST */
        <ul className="space-y-2">
          {notes.map((note) =>
            editingId === note.id ? (
              <li
                key={note.id}
                className="border rounded p-2 space-y-2"
              >
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  disabled={updatingId === note.id}
                  className="border rounded px-2 py-1 text-sm w-full disabled:opacity-50"
                />

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                  disabled={updatingId === note.id}
                  className="border rounded px-2 py-1 text-sm w-full disabled:opacity-50"
                  rows={3}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(note.id)}
                    disabled={updatingId === note.id}
                    className="text-sm bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    {updatingId === note.id
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={updatingId === note.id}
                    className="text-sm bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li
                key={note.id}
                className="border rounded p-2 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">
                    {note.title}
                  </p>

                  <p className="text-xs text-gray-500 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => startEdit(note)}
                    disabled={deletingId === note.id}
                    className="text-gray-600 hover:underline disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === note.id
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