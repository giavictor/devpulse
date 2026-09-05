import { useEffect, useState } from "react";
import { FileText, Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

import api from "../services/api";
import type { Note } from "../types";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

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

  function showSuccess(message: string) {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess(null);
    }, 2000);
  }

  // READ — Get all notes
  async function fetchNotes() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Note[]>("/notes");

      setNotes(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not load notes. Check your connection and try again."
      );
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
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await api.post<Note>("/notes", {
        title: title.trim(),
        content: content.trim(),
      });

      setNotes((prev) => [data, ...prev]);

      setTitle("");
      setContent("");

      showSuccess("Note saved successfully!");
    } catch (err) {
      console.error(err);

      setError(
        "Could not save the note. Check your connection and try again."
      );
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
      return;
    }

    setUpdatingId(id);
    setError(null);
    setSuccess(null);

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
    } catch (err) {
      console.error(err);

      setError(
        "Could not update the note. Check your connection and try again."
      );
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

    try {
      await api.delete(`/notes/${id}`);

      setNotes((prev) =>
        prev.filter((note) => note.id !== id)
      );

      showSuccess("Note deleted successfully!");
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the note. Check your connection and try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="notes-section">
      {/* HEADER */}
      <div className="notes-heading">
        <div>
          <div className="notes-title-row">
            <FileText size={20} />

            <h2>Developer Notes</h2>
          </div>

          <p>
            Keep important ideas, tasks, and developer notes in one place.
          </p>
        </div>

        <span className="notes-count">
          {notes.length} {notes.length === 1 ? "Note" : "Notes"}
        </span>
      </div>

      {/* ADD NOTE FORM */}
      <form onSubmit={handleAdd} className="notes-form">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          rows={4}
        />

        <button
          type="submit"
          disabled={submitting}
          className="notes-add-button"
        >
          {submitting ? (
            <>
              <Loader2 size={17} className="spin-icon" />
              Saving...
            </>
          ) : (
            <>
              <Plus size={17} />
              Add Note
            </>
          )}
        </button>
      </form>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="notes-success-message">
          <Check size={17} />
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="notes-error-message">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchNotes}
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="notes-loading">
          <Loader2 size={24} className="spin-icon" />
          <p>Loading your notes...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && notes.length === 0 && (
        <div className="notes-empty">
          <FileText size={35} />

          <h3>No notes yet</h3>

          <p>
            Add your first developer note using the form above.
          </p>
        </div>
      )}

      {/* NOTES LIST */}
      {!loading && notes.length > 0 && (
        <div className="notes-list">
          {notes.map((note) =>
            editingId === note.id ? (
              <div
                key={note.id}
                className="note-card note-edit-card"
              >
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  disabled={updatingId === note.id}
                  className="note-edit-input"
                />

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                  disabled={updatingId === note.id}
                  className="note-edit-textarea"
                  rows={4}
                />

                <div className="note-edit-actions">
                  <button
                    type="button"
                    onClick={() => handleUpdate(note.id)}
                    disabled={updatingId === note.id}
                    className="note-save-button"
                  >
                    {updatingId === note.id ? (
                      <>
                        <Loader2
                          size={16}
                          className="spin-icon"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={updatingId === note.id}
                    className="note-cancel-button"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={note.id}
                className="note-card"
              >
                <div className="note-card-content">
                  <div className="note-icon">
                    <FileText size={19} />
                  </div>

                  <div className="note-text">
                    <h3>{note.title}</h3>

                    <p>{note.content}</p>
                  </div>
                </div>

                <div className="note-actions">
                  <button
                    type="button"
                    onClick={() => startEdit(note)}
                    disabled={deletingId === note.id}
                    className="note-edit-button"
                    title="Edit note"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(note.id)
                    }
                    disabled={deletingId === note.id}
                    className="note-delete-button"
                    title="Delete note"
                  >
                    {deletingId === note.id ? (
                      <Loader2
                        size={17}
                        className="spin-icon"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}