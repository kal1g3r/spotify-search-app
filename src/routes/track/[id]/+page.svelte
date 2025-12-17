<script>
    let { data } = $props();
    const track = data.track;
    const error = data.error;
</script>

<main class="min-h-screen bg-surface-950 text-surface-50">
    <section class="max-w-3xl mx-auto p-4 space-y-4">
        <a href="/" class="btn btn-sm preset-outlined-primary-500">Back to search</a>

        {#if error}
            <p class="text-error-400 text-sm">{error}</p>
        {:else if !track}
            <p>No track data.</p>
        {:else}
            <div
                class="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-surface-900 border border-surface-700"
            >
                {#if track.album && track.album.images && track.album.images.length > 0}
                    <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        width="200"
                        height="200"
                        class="rounded"
                    />
                {/if}

                <div class="space-y-2">
                    <h1 class="text-2xl font-semibold text-primary-500">
                        {track.name}
                    </h1>

                    {#if track.artists}
                        <p class="text-sm">
                            <span class="font-semibold">Artists:</span>
                            {" "}{track.artists.map((a) => a.name).join(", ")}
                        </p>
                    {/if}

                    {#if track.album}
                        <p class="text-sm">
                            <span class="font-semibold">Album:</span>
                            {" "}{track.album.name}
                        </p>
                        <p class="text-sm">
                            <span class="font-semibold">Release date:</span>
                            {" "}{track.album.release_date}
                        </p>
                    {/if}

                    {#if track.duration_ms}
                        <p class="text-sm">
                            <span class="font-semibold"
                                >Duration (seconds):</span
                            >
                            {" "}{Math.round(track.duration_ms / 1000)}
                        </p>
                    {/if}

                    {#if track.popularity !== undefined}
                        <p class="text-sm">
                            <span class="font-semibold">Popularity:</span>
                            {" "}{track.popularity}
                        </p>
                    {/if}

                    {#if track.external_urls && track.external_urls.spotify}
                        <a
                            href={track.external_urls.spotify}
                            target="_blank"
                            rel="noreferrer"
                            class="btn btn-sm preset-filled-primary-500 inline-flex items-center justify-center"
                        >
                            Open in Spotify
                        </a>
                    {/if}
                </div>
            </div>
        {/if}
    </section>
</main>
