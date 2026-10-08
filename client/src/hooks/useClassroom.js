import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/';

export const useClassroom = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(BASE_URL + 'api/class/all-classes');
            setClasses(res.data?.classes || []);
        } catch (err) {
            console.error('Error fetching classes:', err);
            setError(err.response?.data?.message || 'Failed to load classes');
        } finally {
            setLoading(false);
        }
    }, []);

    const joinClass = useCallback(async (classId) => {
        const token = localStorage.getItem('StudentToken');
        if (!token) throw new Error('Please login to join a class');
        try {
            const res = await axios.post(
                BASE_URL + 'api/class/join/' + classId,
                {},
                { headers: { Authorization: 'Bearer ' + token } }
            );
            await fetchClasses();
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to join class');
        }
    }, [fetchClasses]);

    const filteredClasses = classes.filter((cls) => {
        const matchesSearch =
            !searchQuery ||
            cls.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject =
            filterSubject === 'all' ||
            cls.subject?.toLowerCase() === filterSubject.toLowerCase();
        return matchesSearch && matchesSubject;
    });

    const uniqueSubjects = [...new Set(classes.map((cls) => cls.subject).filter(Boolean))];

    useEffect(() => { fetchClasses(); }, [fetchClasses]);

    return {
        classes, filteredClasses, loading, error,
        searchQuery, setSearchQuery,
        filterSubject, setFilterSubject,
        uniqueSubjects, fetchClasses, joinClass
    };
};
