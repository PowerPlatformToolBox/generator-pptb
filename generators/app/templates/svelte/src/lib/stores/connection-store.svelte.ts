export class ConnectionStore {
    connection = $state<ToolBoxAPI.DataverseConnection | null>(null);
    isLoading = $state(true);

    refreshConnection = async () => {
        try {
            const conn = await window.toolboxAPI.connections.getActiveConnection();
            this.connection = conn;
        } catch (error) {
            console.error('Error refreshing connection:', error);
        } finally {
            this.isLoading = false;
        }
    }
}
