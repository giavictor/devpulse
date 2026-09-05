import { useEffect, useState } from "react";

import {
  Bookmark,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

import type { SavedLink } from "../types";

type OperationStatus = "idle" | "loading" | "success" | "error";

export default function SavedLinks() {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [, setStatus] =
    useState<OperationStatus>("idle");

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // Update and delete loading states
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // Edit form state
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editUrl, setEditUrl] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  // Show success message temporarily
  function showSuccess(message: string) {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess(null);
    }, 2500);
  }

  // READ — Load all links
  async function fetchLinks() {
    setLoading(true);
    setStatus("loading");
    setError(null);

    try {
      const { data } =
        await api.get<SavedLink[]>("/links");

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
  async function handleAdd(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError(
        "Please enter both a title and a valid URL."
      );

      setSuccess(null);
      setStatus("error");

      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      const { data } =
        await api.post<SavedLink>("/links", {
          title: title.trim(),
          url: url.trim(),
          description:
            description.trim() || undefined,
        });

      setLinks((prev) => [
        data,
        ...prev,
      ]);

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

    setEditDescription(
      link.description || ""
    );

    setError(null);
    setSuccess(null);
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);

    setError(null);

    setEditTitle("");
    setEditUrl("");
    setEditDescription("");
  }

  // UPDATE
  async function handleUpdate(id: number) {
    if (
      !editTitle.trim() ||
      !editUrl.trim()
    ) {
      setError(
        "Please enter both a title and a valid URL."
      );

      setSuccess(null);
      setStatus("error");

      return;
    }

    setUpdatingId(id);
    setError(null);
    setSuccess(null);
    setStatus("loading");

    try {
      const { data } =
        await api.put<SavedLink>(
          `/links/${id}`,
          {
            title: editTitle.trim(),
            url: editUrl.trim(),
            description:
              editDescription.trim() || undefined,
          }
        );

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id
            ? data
            : link
        )
      );

      setEditingId(null);

      showSuccess(
        "Link updated successfully!"
      );

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
      await api.delete(
        `/links/${id}`
      );

      setLinks((prev) =>
        prev.filter(
          (link) => link.id !== id
        )
      );

      showSuccess(
        "Link deleted successfully!"
      );

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
    <section className="saved-links-section">
      {/* Heading */}
      <div className="saved-links-heading">
        <div>
          <div className="section-title-row">
            <Bookmark size={22} />

            <h2>Saved Links</h2>
          </div>

          <p>
            Keep your favorite developer
            resources in one place.
          </p>
        </div>

        <span className="links-count">
          {links.length}{" "}
          {links.length === 1
            ? "Link"
            : "Links"}
        </span>
      </div>

      {/* Add Link Form */}
      <form
        onSubmit={handleAdd}
        className="add-link-form"
      >
        <div className="add-link-form-header">
          <Plus size={18} />

          <h3>Add New Resource</h3>
        </div>

        <div className="link-input-group">
          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            disabled={submitting}
          />

          <div className="url-input-wrapper">
            <LinkIcon size={17} />

            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              disabled={submitting}
            />
          </div>

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="add-link-button"
        >
          {submitting ? (
            <>
              <Loader2
                size={17}
                className="spin-icon"
              />

              Saving...
            </>
          ) : (
            <>
              <Plus size={17} />

              Add Link
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="saved-links-success">
          <Check size={18} />

          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="saved-links-error">
          <AlertCircle size={19} />

          <div>
            <p>{error}</p>

            {!loading && (
              <button
                type="button"
                onClick={fetchLinks}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="links-loading">
          <Loader2
            size={28}
            className="spin-icon"
          />

          <p>Loading your saved links...</p>
        </div>
      ) : links.length === 0 ? (
        /* Empty State */
        <div className="links-empty-state">
          <Bookmark size={35} />

          <h3>No saved links yet</h3>

          <p>
            Add useful developer resources,
            documentation, tutorials, and
            websites above.
          </p>
        </div>
      ) : (
        /* Links List */
        <div className="saved-links-list">
          {links.map((link) =>
            editingId === link.id ? (
              /* Edit Mode */
              <div
                key={link.id}
                className="saved-link-edit-card"
              >
                <div className="edit-card-header">
                  <Pencil size={17} />

                  <h3>Edit Link</h3>
                </div>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(
                      e.target.value
                    )
                  }
                  disabled={
                    updatingId === link.id
                  }
                  placeholder="Title"
                />

                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) =>
                    setEditUrl(
                      e.target.value
                    )
                  }
                  disabled={
                    updatingId === link.id
                  }
                  placeholder="URL"
                />

                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  disabled={
                    updatingId === link.id
                  }
                  placeholder="Description"
                />

                <div className="edit-actions">
                  <button
                    type="button"
                    className="save-edit-button"
                    onClick={() =>
                      handleUpdate(link.id)
                    }
                    disabled={
                      updatingId === link.id
                    }
                  >
                    {updatingId ===
                    link.id ? (
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

                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="cancel-edit-button"
                    onClick={cancelEdit}
                    disabled={
                      updatingId === link.id
                    }
                  >
                    <X size={16} />

                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Link Card */
              <div
                key={link.id}
                className="saved-link-card"
              >
                <div className="saved-link-icon">
                  <LinkIcon size={19} />
                </div>

                <div className="saved-link-content">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="saved-link-title"
                  >
                    {link.title}

                    <ExternalLink size={15} />
                  </a>

                  {link.description && (
                    <p>
                      {link.description}
                    </p>
                  )}

                  <span className="saved-link-url">
                    {link.url}
                  </span>
                </div>

                <div className="saved-link-actions">
                  <button
                    type="button"
                    className="edit-link-button"
                    onClick={() =>
                      startEdit(link)
                    }
                    disabled={
                      deletingId === link.id
                    }
                    title="Edit link"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="delete-link-button"
                    onClick={() =>
                      handleDelete(link.id)
                    }
                    disabled={
                      deletingId === link.id
                    }
                    title="Delete link"
                  >
                    {deletingId ===
                    link.id ? (
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