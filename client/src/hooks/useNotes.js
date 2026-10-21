import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/";

/**
 * Custom hook for managing study materials & notes [Manish Regar]
 * Includes subject filtering, search, and local cache for rural offline resilience.
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch distinct subjects for filter tabs
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/notes/subjects`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setSubjects(response.data.subjects);
      }
      return response.data.subjects;
    } catch (err) {
      console.warn("Failed to fetch subjects from network, falling back to cache:", err.message);
      const cached = localStorage.getItem("rural_cached_subjects");
      if (cached) setSubjects(JSON.parse(cached));
      return [];
    }
  }, []);

  // Fetch notes with subject / category / search filters
  const fetchNotes = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${BASE_URL}api/notes?${queryParams}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setNotes(response.data.notes);
        // Cache for offline review in weak network zones
        localStorage.setItem("rural_cached_notes", JSON.stringify(response.data.notes.slice(0, 30)));
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch notes";
      setError(msg);
      const cached = localStorage.getItem("rural_cached_notes");
      if (cached) {
        setNotes(JSON.parse(cached));
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload study note (Teacher)
  const uploadNote = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}api/notes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Upload failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Track and trigger note download
  const downloadNote = useCallback(async (noteId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/notes/download/${noteId}`, {
        withCredentials: true,
      });
      if (response.data.success && response.data.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      }
      return response.data;
    } catch (err) {
      console.error("Error downloading note:", err);
      return null;
    }
  }, []);

  // Delete note (Teacher)
  const deleteNote = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BASE_URL}api/notes/${noteId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setNotes((prev) => prev.filter((n) => n._id !== noteId));
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Delete failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    subjects,
    stats,
    loading,
    error,
    fetchNotes,
    fetchSubjects,
    uploadNote,
    downloadNote,
    deleteNote,
  };
};

export default useNotes;
