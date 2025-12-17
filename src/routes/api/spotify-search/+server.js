import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1';

async function getAccessToken() {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        throw new Error('SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET missing!');
    }

    const credentials = Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
        'utf-8'
    ).toString('base64');

    const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
            grant_type: 'client_credentials'
        }),
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data.access_token;
}
// q = query 
export async function GET({ url }) {
    const q = url.searchParams.get('q') ?? '';

    if (!q.trim()) {
        return new Response(JSON.stringify({ tracks: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const token = await getAccessToken();

        const response = await axios.get(`${API_BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q,
                type: 'track',
                limit: 20
            }
        });

        // Return just the track items array to keep the frontend simple
        const tracks = response.data.tracks?.items ?? [];

        return new Response(JSON.stringify({ tracks }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Spotify search error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to search Spotify. Check server logs and env config.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
