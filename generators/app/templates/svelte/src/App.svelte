<script lang="ts">
    import { onMount } from 'svelte';
    import ConnectionStatus from './lib/components/ConnectionStatus.svelte';
    import ToolboxAPIDemo from './lib/components/ToolboxAPIDemo.svelte';
    import DataverseAPIDemo from './lib/components/DataverseAPIDemo.svelte';
    import EventLog from './lib/components/EventLog.svelte';
    import { ConnectionStore } from './lib/stores/connection-store.svelte';
    import { EventLogStore } from './lib/stores/event-log-store.svelte';

    const connectionStore = new ConnectionStore();
    const eventLog = new EventLogStore();

    onMount(() => {
        connectionStore.refreshConnection();
        eventLog.addLog('Svelte Sample Tool initialized', 'success');

        window.toolboxAPI.events.on((_event: any, payload: ToolBoxAPI.ToolBoxEventPayload) => {
            eventLog.addLog(`Event: ${payload.event}`, 'info');

            switch (payload.event) {
                case 'connection:updated':
                case 'connection:created':
                case 'connection:deleted':
                    connectionStore.refreshConnection();
                    break;
            }
        });
    });


</script>

<header class="header">
    <h1>🔥 Svelte Sample Tool</h1>
    <p class="subtitle">A complete example of building Power Platform Tool Box tools with Svelte 5 & TypeScript</p>
</header>

<ConnectionStatus connection={connectionStore.connection} isLoading={connectionStore.isLoading} />

<ToolboxAPIDemo log={eventLog.addLog} />

<DataverseAPIDemo connection={connectionStore.connection} log={eventLog.addLog} />

<EventLog logs={eventLog.logs} onClear={() => eventLog.clearLogs()} />
