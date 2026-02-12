<script lang="ts">
    import type { LogEntry } from "../stores/event-log-store.svelte";

    let { logs, onClear } = $props<{ logs: LogEntry[]; onClear: () => void }>();
</script>

<div class="card">
    <h2>📋 Event Log</h2>
    <button class="btn btn-secondary" onclick={onClear}>Clear Log</button>
    <div class="log">
        {#if logs.length === 0}
            <div style="color: #666; font-style: italic">No logs yet...</div>
        {:else}
            {#each logs as log}
                <div class="log-entry {log.type}">
                    <span class="log-timestamp">[{log.timestamp.toLocaleTimeString()}]</span>
                    <span>{log.message}</span>
                </div>
            {/each}
        {/if}
    </div>
</div>
