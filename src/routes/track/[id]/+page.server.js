/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const res = await fetch(`/api/spotify-track/${params.id}`);

    if (!res.ok) {
        return {
            track: null,
            error: 'Could not load this song from Spotify.'
        };
    }

    const data = await res.json();

    return {
        track: data.track,
        error: null
    };
}


