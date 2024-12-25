import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

// Use your API URL
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/admin'; 

// Optional: Configure headers, auth tokens etc
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // Add any auth tokens if needed
    // options.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(apiUrl, httpClient);