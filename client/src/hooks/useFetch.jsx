import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const request = axios.create({
    baseURL: import.meta.env.VITE_URL_API,
    withCredentials: true,
});

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await request.get(url);
            setData(response.data.metadata);
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 600);
    }, [url, fetchData]);

    const reFetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, reFetch };
}

export default useFetch;
