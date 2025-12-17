<script>
    import axios from "axios";
    let query = "";
    let results = [];
    let error = "";
    let loading = false;

    async function search() {
        const q = query.trim();
        if (!q) {
            results = [];
            error = "";
            return;
        }

        loading = true;
        error = "";

        try {
            const res = await axios.get("/api/spotify-search", {
                params: { q },
            });

            results = res.data.tracks ?? [];
        } catch (e) {
            console.error(e);
            error = "Could not load songs from Spotify.";
            results = [];
        } finally {
            loading = false;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        search();
    }
</script>



<main class="min-h-screen bg-surface-950 text-surface-50">
    <section class="max-w-3xl mx-auto p-4 space-y-6">
        <h1 class="text-3xl font-bold text-primary-500">Spotify Song Search</h1>

        <form class="space-y-3" on:submit={handleSubmit}>
            <label for="search" class="block text-sm font-medium text-surface-100">Search songs</label>
            <div class="flex gap-2 items-center">
                <input
                    id="search"
                    type="text"
                    bind:value={query}
                    class="flex-1 input input-md bg-surface-900 border border-surface-700 text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    class="btn btn-base preset-filled-primary-500 disabled:opacity-60"
                >
                    {#if loading}
                        Searching...
                    {:else}
                        Search
                    {/if}
                </button>
            </div>
        </form>

        {#if error}
            <p class="text-error-400 text-sm">{error}</p>
        {/if}

        {#if !error && results.length === 0}
            <p class="text-sm text-surface-200">
                No results yet. Type something and press Search.
            </p>
        {/if}

        {#if results.length > 0}
            <section class="space-y-3">
                <h2 class="text-xl font-semibold text-surface-100">Results</h2>
                <ul class="space-y-3">
                    {#each results as track}
                        <li class="list-none">
                            <a
                                href={`/track/${track.id}`}
                                class="flex items-center gap-4 p-3 rounded-lg bg-surface-900 border border-surface-700 hover:bg-surface-800 transition-colors"
                            >
                                {#if track.album && track.album.images && track.album.images.length > 0}
                                    <img
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        width="64"
                                        height="64"
                                        class="rounded"
                                    />
                                {/if}
                                <div>
                                    <p class="text-sm font-medium">
                                        {track.name}
                                    </p>
                                    {#if track.artists}
                                        <p class="text-xs text-surface-200">
                                            {track.artists
                                                .map((a) => a.name)
                                                .join(", ")}
                                        </p>
                                    {/if}
                                </div>
                            </a>
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}
    </section>
</main>
