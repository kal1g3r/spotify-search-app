import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1';

async function getAccessToken() {
	if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
		throw new Error('SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing in your env file.');
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

export async function GET({ params }) {
	const { id } = params;

	if (!id) {
		return new Response(JSON.stringify({ error: 'Track id is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const token = await getAccessToken();

		const response = await axios.get(`${API_BASE_URL}/tracks/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return new Response(JSON.stringify({ track: response.data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Spotify track error:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to load track from Spotify. Check server logs and env.' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}


