<script lang="ts">
    let { connection, log } = $props<{ connection: ToolBoxAPI.DataverseConnection | null, log: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void }>();

    let accountName = $state('Sample Account');
    let createdAccountId: string | null = $state(null);
    let queryOutput = $state('');
    let crudOutput = $state('');
    let metadataOutput = $state('');

    async function showNotification(title: string, body: string, type: 'success' | 'info' | 'warning' | 'error') {
        try {
            await window.toolboxAPI.utils.showNotification({ title, body, type, duration: 3000 });
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    async function queryAccounts() {
        if (!connection) {
            await showNotification('No Connection', 'Please connect to a Dataverse environment', 'warning');
            return;
        }

        try {
            queryOutput = 'Querying accounts...\n';

            const fetchXml = `
<fetch top="10">
  <entity name="account">
    <attribute name="name" />
    <attribute name="accountid" />
    <attribute name="emailaddress1" />
    <attribute name="telephone1" />
    <order attribute="name" />
  </entity>
</fetch>
            `.trim();

            const result = await window.dataverseAPI.fetchXmlQuery(fetchXml);

            let output = `Found ${result.value.length} account(s):\n\n`;
            result.value.forEach((account: any, index: number) => {
                output += `${index + 1}. ${account.name}\n`;
                output += `   ID: ${account.accountid}\n`;
                if (account.emailaddress1) output += `   Email: ${account.emailaddress1}\n`;
                if (account.telephone1) output += `   Phone: ${account.telephone1}\n`;
                output += '\n';
            });

            queryOutput = output;
            log(`Queried ${result.value.length} accounts`, 'success');
        } catch (error) {
            queryOutput = `Error: ${(error as Error).message}`;
            log(`Error querying accounts: ${(error as Error).message}`, 'error');
        }
    }

    async function createAccount() {
        if (!connection) {
            await showNotification('No Connection', 'Please connect to a Dataverse environment', 'warning');
            return;
        }

        try {
            crudOutput = 'Creating account...\n';

            const result = await window.dataverseAPI.create('account', {
                name: accountName,
                emailaddress1: 'sample@example.com',
                telephone1: '555-0100',
                description: 'Created by Svelte Sample Tool',
            });

            createdAccountId = result.id;
            crudOutput = `Account created successfully!\n\nID: ${result.id}\nName: ${accountName}\n`;

            await showNotification('Account Created', `Account "${accountName}" created successfully`, 'success');
            log(`Account created: ${result.id}`, 'success');
        } catch (error) {
            crudOutput = `Error: ${(error as Error).message}`;
            log(`Error creating account: ${(error as Error).message}`, 'error');
        }
    }

    async function updateAccount() {
        if (!createdAccountId) {
            await showNotification('No Account', 'Please create an account first', 'warning');
            return;
        }

        try {
            crudOutput = 'Updating account...\n';

            await window.dataverseAPI.update('account', createdAccountId, {
                description: 'Updated by Svelte Sample Tool at ' + new Date().toISOString(),
                telephone1: '555-0200',
            });

            crudOutput = `Account updated successfully!\n\nID: ${createdAccountId}\nUpdated fields: description, telephone1\n`;

            await showNotification('Account Updated', 'Account updated successfully', 'success');
            log(`Account updated: ${createdAccountId}`, 'success');
        } catch (error) {
            crudOutput = `Error: ${(error as Error).message}`;
            log(`Error updating account: ${(error as Error).message}`, 'error');
        }
    }

    async function deleteAccount() {
        if (!createdAccountId) {
            await showNotification('No Account', 'Please create an account first', 'warning');
            return;
        }

        try {
            crudOutput = 'Deleting account...\n';

            await window.dataverseAPI.delete('account', createdAccountId);

            crudOutput = `Account deleted successfully!\n\nID: ${createdAccountId}\n`;

            await showNotification('Account Deleted', 'Account deleted successfully', 'success');
            log(`Account deleted: ${createdAccountId}`, 'success');
            createdAccountId = null;
        } catch (error) {
            crudOutput = `Error: ${(error as Error).message}`;
            log(`Error deleting account: ${(error as Error).message}`, 'error');
        }
    }

    async function getAccountMetadata() {
        if (!connection) {
            await showNotification('No Connection', 'Please connect to a Dataverse environment', 'warning');
            return;
        }

        try {
            metadataOutput = 'Retrieving metadata...\n';

            const metadata = await window.dataverseAPI.getEntityMetadata('account', true);
            const attributesArray = Array.isArray(metadata.Attributes) ? metadata.Attributes : [];

            let output = 'Account Entity Metadata:\n\n';
            output += `Logical Name: ${metadata.LogicalName}\n`;
            output += `Metadata ID: ${metadata.MetadataId}\n`;
            output += `Display Name: ${metadata.DisplayName?.LocalizedLabels?.[0]?.Label || 'N/A'}\n`;
            output += `Attributes: ${attributesArray.length}\n`;

            if (attributesArray.length > 0) {
                output += '\nSample Attributes:\n';
                attributesArray.slice(0, 5).forEach((attr: any) => {
                    output += `  - ${attr.LogicalName} (${attr.AttributeType})\n`;
                });
            }

            metadataOutput = output;
            log('Account metadata retrieved', 'success');
        } catch (error) {
            metadataOutput = `Error: ${(error as Error).message}`;
            log(`Error getting metadata: ${(error as Error).message}`, 'error');
        }
    }
</script>

<div class="card">
    <h2>💾 Dataverse API Examples</h2>

    <div class="example-group">
        <h3>Query Records</h3>
        <button class="btn btn-primary" onclick={queryAccounts}>Query Top 10 Accounts</button>
        <div class="output">{queryOutput}</div>
    </div>

    <div class="example-group">
        <h3>CRUD Operations</h3>
        <div class="input-group">
            <label for="account-name">Account Name:</label>
            <input type="text" id="account-name" bind:value={accountName} placeholder="Enter account name" />
        </div>
        <div class="button-group">
            <button class="btn btn-primary" onclick={createAccount}>Create Account</button>
            <button class="btn" disabled={!createdAccountId} onclick={updateAccount}>Update Account</button>
            <button class="btn btn-error" disabled={!createdAccountId} onclick={deleteAccount}>Delete Account</button>
        </div>
        <div class="output">{crudOutput}</div>
    </div>

    <div class="example-group">
        <h3>Metadata</h3>
        <button class="btn" onclick={getAccountMetadata}>Get Account Metadata</button>
        <div class="output">{metadataOutput}</div>
    </div>
</div>
