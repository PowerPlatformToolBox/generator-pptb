<script lang="ts">
    let { log } = $props<{ log: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void }>();

    async function showNotification(title: string, body: string, type: 'success' | 'info' | 'warning' | 'error') {
        try {
            await window.toolboxAPI.utils.showNotification({ title, body, type, duration: 3000 });
            log(`Notification shown: ${title} - ${body}`, type);
        } catch (error) {
            log(`Error showing notification: ${(error as Error).message}`, 'error');
        }
    }

    async function copyToClipboard() {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                message: 'This data was copied from the Svelte Sample Tool',
            };

            await window.toolboxAPI.utils.copyToClipboard(JSON.stringify(data, null, 2));
            await showNotification('Copied!', 'Data copied to clipboard', 'success');
        } catch (error) {
            log(`Error copying to clipboard: ${(error as Error).message}`, 'error');
        }
    }

    async function showCurrentTheme() {
        try {
            const theme = await window.toolboxAPI.utils.getCurrentTheme();
            await showNotification('Current Theme', `The current theme is: ${theme}`, 'info');
            log(`Current theme: ${theme}`, 'info');
        } catch (error) {
            log(`Error getting theme: ${(error as Error).message}`, 'error' );
        }
    }

    async function saveDataToFile() {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                message: 'Export from Svelte Sample Tool',
            };

            const filePath = await window.toolboxAPI.fileSystem.saveFile('svelte-export.json', JSON.stringify(data, null, 2));

            if (filePath) {
                await showNotification('File Saved', `File saved to: ${filePath}`, 'success');
                log(`File saved to: ${filePath}`, 'success');
            } else {
                log('File save cancelled', 'info');
            }
        } catch (error) {
            log(`Error saving file: ${(error as Error).message}`, 'error');
        }
    }
</script>

<div class="card">
    <h2>🛠️ ToolBox API Examples</h2>

    <div class="example-group">
        <h3>Notifications</h3>
        <div class="button-group">
            <button class="btn btn-success" onclick={() => showNotification('Success!', 'Operation completed successfully', 'success')}>Show Success</button>
            <button class="btn btn-info" onclick={() => showNotification('Information', 'This is an informational message', 'info')}>Show Info</button>
            <button class="btn btn-warning" onclick={() => showNotification('Warning', 'Please review this warning', 'warning')}>Show Warning</button>
            <button class="btn btn-error" onclick={() => showNotification('Error', 'An error has occurred', 'error')}>Show Error</button>
        </div>
    </div>

    <div class="example-group">
        <h3>Utilities</h3>
        <div class="button-group">
            <button class="btn" onclick={copyToClipboard}>Copy to Clipboard</button>
            <button class="btn" onclick={showCurrentTheme}>Get Theme</button>
            <button class="btn" onclick={saveDataToFile}>Save File</button>
        </div>
    </div>
</div>
