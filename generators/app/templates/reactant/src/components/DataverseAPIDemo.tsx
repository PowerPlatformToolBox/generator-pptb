import React, { useState, useCallback } from "react";
import { Card, Button, Input, Space, Typography } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

interface DataverseAPIDemoProps {
  connection: ToolBoxAPI.DataverseConnection | null;
  onLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error"
  ) => void;
}

export const DataverseAPIDemo: React.FC<DataverseAPIDemoProps> = ({
  connection,
  onLog,
}) => {
  const [accountName, setAccountName] = useState("Sample Account");
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [queryOutput, setQueryOutput] = useState("");
  const [crudOutput, setCrudOutput] = useState("");
  const [metadataOutput, setMetadataOutput] = useState("");

  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      type: "success" | "info" | "warning" | "error"
    ) => {
      try {
        await window.toolboxAPI.utils.showNotification({
          title,
          body,
          type,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    },
    []
  );

  const queryAccounts = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setQueryOutput("Querying accounts...\n");

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
        if (account.emailaddress1)
          output += `   Email: ${account.emailaddress1}\n`;
        if (account.telephone1) output += `   Phone: ${account.telephone1}\n`;
        output += "\n";
      });

      setQueryOutput(output);
      onLog(`Queried ${result.value.length} accounts`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setQueryOutput(errorMsg);
      onLog(`Error querying accounts: ${(error as Error).message}`, "error");
    }
  }, [connection, onLog, showNotification]);

  const createAccount = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Creating account...\n");

      const result = await window.dataverseAPI.create("account", {
        name: accountName,
        emailaddress1: "sample@example.com",
        telephone1: "555-0100",
        description: "Created by React Sample Tool",
      });

      setCreatedAccountId(result.id);

      const output = `Account created successfully!\n\nID: ${result.id}\nName: ${accountName}\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Created",
        `Account "${accountName}" created successfully`,
        "success"
      );
      onLog(`Account created: ${result.id}`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error creating account: ${(error as Error).message}`, "error");
    }
  }, [connection, accountName, onLog, showNotification]);

  const updateAccount = useCallback(async () => {
    if (!createdAccountId) {
      await showNotification(
        "No Account",
        "Please create an account first",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Updating account...\n");

      await window.dataverseAPI.update("account", createdAccountId, {
        description:
          "Updated by React Sample Tool at " + new Date().toISOString(),
        telephone1: "555-0200",
      });

      const output = `Account updated successfully!\n\nID: ${createdAccountId}\nUpdated fields: description, telephone1\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Updated",
        "Account updated successfully",
        "success"
      );
      onLog(`Account updated: ${createdAccountId}`, "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error updating account: ${(error as Error).message}`, "error");
    }
  }, [createdAccountId, onLog, showNotification]);

  const deleteAccount = useCallback(async () => {
    if (!createdAccountId) {
      await showNotification(
        "No Account",
        "Please create an account first",
        "warning"
      );
      return;
    }

    try {
      setCrudOutput("Deleting account...\n");

      await window.dataverseAPI.delete("account", createdAccountId);

      const output = `Account deleted successfully!\n\nID: ${createdAccountId}\n`;
      setCrudOutput(output);

      await showNotification(
        "Account Deleted",
        "Account deleted successfully",
        "success"
      );
      onLog(`Account deleted: ${createdAccountId}`, "success");
      setCreatedAccountId(null);
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setCrudOutput(errorMsg);
      onLog(`Error deleting account: ${(error as Error).message}`, "error");
    }
  }, [createdAccountId, onLog, showNotification]);

  const getAccountMetadata = useCallback(async () => {
    if (!connection) {
      await showNotification(
        "No Connection",
        "Please connect to a Dataverse environment",
        "warning"
      );
      return;
    }

    try {
      setMetadataOutput("Retrieving metadata...\n");

      const metadata = await window.dataverseAPI.getEntityMetadata(
        "account",
        true
      );

      let output = "Account Entity Metadata:\n\n";
      output += `Logical Name: ${metadata.LogicalName}\n`;
      output += `Metadata ID: ${metadata.MetadataId}\n`;
      output += `Display Name: ${
        metadata.DisplayName?.LocalizedLabels?.[0]?.Label || "N/A"
      }\n`;
      output += `Attributes: ${metadata.Attributes?.length || 0}\n`;

      if (metadata.Attributes && metadata.Attributes.length > 0) {
        output += "\nSample Attributes:\n";
        metadata.Attributes.slice(0, 5).forEach((attr: any) => {
          output += `  - ${attr.LogicalName} (${attr.AttributeType})\n`;
        });
      }

      setMetadataOutput(output);
      onLog("Account metadata retrieved", "success");
    } catch (error) {
      const errorMsg = `Error: ${(error as Error).message}`;
      setMetadataOutput(errorMsg);
      onLog(`Error getting metadata: ${(error as Error).message}`, "error");
    }
  }, [connection, onLog, showNotification]);

  return (
    <Card title="💾 Dataverse API Examples" style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={5}>Query Records</Title>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={queryAccounts}
            style={{ marginBottom: 8 }}
          >
            Query Top 10 Accounts
          </Button>
          <TextArea
            value={queryOutput}
            readOnly
            placeholder="No output yet..."
            style={{
              fontFamily: "monospace",
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              minHeight: 120,
            }}
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </div>

        <div>
          <Title level={5}>CRUD Operations</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              addonBefore="Account Name"
            />
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createAccount}
              >
                Create Account
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={updateAccount}
                disabled={!createdAccountId}
              >
                Update Account
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={deleteAccount}
                disabled={!createdAccountId}
              >
                Delete Account
              </Button>
            </Space>
            <TextArea
              value={crudOutput}
              readOnly
              placeholder="No output yet..."
              style={{
                fontFamily: "monospace",
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                minHeight: 120,
              }}
              autoSize={{ minRows: 5, maxRows: 10 }}
            />
          </Space>
        </div>

        <div>
          <Title level={5}>Metadata</Title>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={getAccountMetadata}
            style={{ marginBottom: 8 }}
          >
            Get Account Metadata
          </Button>
          <TextArea
            value={metadataOutput}
            readOnly
            placeholder="No output yet..."
            style={{
              fontFamily: "monospace",
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              minHeight: 120,
            }}
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </div>
      </Space>
    </Card>
  );
};
