const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
// const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension test', async () => {
		const extensionId = 'CoreyApplegate.get-preferences'; // Replace with your extension ID
		// Ensure that the extension is installed and activated
        const extension = vscode.extensions.getExtension(extensionId);
        assert.ok(extension, `Extension ${extensionId} is not installed!`);
	});

	test('downloadNetworkTables test', async () => {
        const commandId = 'extension.downloadNetworkTables'; // Replace with the command ID you want to test

		// Activate the extension by invoking the command
        await vscode.commands.executeCommand(commandId);

        // Check if the command is successfully invoked
        const isCommandRegistered = await vscode.commands.getCommands(true)
            .then(commands => commands.includes(commandId));
        
        assert.ok(isCommandRegistered, `Command ${commandId} is not registered.`);
	});

	test('uploadNetworkTables test', async () => {
        const commandId = 'extension.uploadNetworkTables'; // Replace with the command ID you want to test

		// Activate the extension by invoking the command
        await vscode.commands.executeCommand(commandId);

        // Check if the command is successfully invoked
        const isCommandRegistered = await vscode.commands.getCommands(true)
            .then(commands => commands.includes(commandId));
        
        assert.ok(isCommandRegistered, `Command ${commandId} is not registered.`);
	});
});
