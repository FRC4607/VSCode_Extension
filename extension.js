const vscode = require('vscode');
const Client = require('ssh2-sftp-client');
const path = require('path');

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "roborio-networktables" is now active!');

    // Register the command
    let disposable = vscode.commands.registerCommand('extension.downloadNetworkTables', async () => {
        // Prompt for team number
        const teamNumber = await vscode.window.showInputBox({
            prompt: 'Enter your team number (e.g., 9999)',
            validateInput: (value) => (value.match(/^\d+$/) ? null : 'Please enter a valid team number.'),
        });

        if (!teamNumber) {
            vscode.window.showErrorMessage('Team number is required.');
            return;
        }

        // Define file paths
        const roboRIOHost = `roboRIO-${teamNumber}-frc.local`;
        const remoteFilePath = '/home/lvuser/networktables.json';
        const localFilePath = path.join(vscode.workspace.rootPath || '', 'networktables.json');

        // Create an SFTP client instance
        const sftp = new Client();

        try {
            vscode.window.showInformationMessage('Connecting to roboRIO...');
            await sftp.connect({
                host: roboRIOHost,
                username: 'lvuser',
                password: '', // No password required for lvuser
            });

            vscode.window.showInformationMessage('Connected to roboRIO. Downloading networktables.json...');
            await sftp.get(remoteFilePath, localFilePath);

            vscode.window.showInformationMessage(`File downloaded successfully to ${localFilePath}`);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to download file: ${err.message}`);
        } finally {
            await sftp.end();
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Deactivates the extension.
 */
function deactivate() {
    console.log('Extension "roborio-networktables" is now deactivated.');
}

module.exports = {
    activate,
    deactivate,
};
