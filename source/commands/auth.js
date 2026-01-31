import process from 'node:process';
import {execa} from 'execa';
import {
	setAuthMode,
	setToken,
	clearAll,
	getAllConfig,
	getConfigPath,
} from '../utils/config-manager.js';
import {
	showSuccess,
	showError,
	showWarning,
	showAuthStatus,
} from '../utils/ui.js';

/**
 * Authentication commands
 * Handles GitHub Copilot and OpenAI authentication
 */

export async function authenticateWithCopilot() {
	try {
		console.log('🔐 Setting up GitHub Copilot authentication...\n');

		// Check if gh CLI is installed
		try {
			await execa('gh', ['--version']);
		} catch {
			showError('GitHub CLI (gh) is not installed.');
			console.log('');
			console.log('Install it from: https://cli.github.com/');
			console.log('Then run: gh auth login');
			process.exit(1);
		}

		// Check if gh is authenticated
		try {
			await execa('gh', ['auth', 'status']);
		} catch {
			showError('GitHub CLI is not authenticated.');
			console.log('');
			console.log('Please authenticate first:');
			console.log('  gh auth login');
			console.log('');
			console.log('Make sure you have GitHub Copilot enabled on your account.');
			process.exit(1);
		}

		// Store auth mode
		setAuthMode('copilot');

		showSuccess('GitHub Copilot ready!');
		console.log('');
		console.log('✅ GitHub CLI authenticated');
		console.log('✅ Copilot SDK will use your CLI session');
		console.log('');
		console.log('You can now use: magicc commit');
	} catch (error) {
		showError(`Setup failed: ${error.message}`);
		process.exit(1);
	}
}

export async function authenticateWithOpenAI(apiKey) {
	try {
		if (!apiKey) {
			showError('OpenAI API key is required.');
			console.log('');
			console.log('Usage: magicc auth openai <your-api-key>');
			console.log('');
			console.log('To get an API key:');
			console.log('  Visit: https://platform.openai.com/account/api-keys');
			process.exit(1);
		}

		// Validate the API key format
		if (!apiKey.startsWith('sk-')) {
			showWarning('API key should start with "sk-". Please verify your key.');
		}

		// Store the key
		setToken('openai', apiKey);
		setAuthMode('openai');

		showSuccess('OpenAI authentication successful!');
		console.log('');
		console.log(`📁 Config stored at: ${getConfigPath()}`);
		console.log('');
		console.log(
			'💡 Consider switching to GitHub Copilot for better integration:',
		);
		console.log('   magicc auth copilot');
	} catch (error) {
		showError(`Authentication failed: ${error.message}`);
		process.exit(1);
	}
}

export function showAuthStatusCommand() {
	const config = getAllConfig();
	showAuthStatus(config);
	console.log(`📁 Config: ${getConfigPath()}`);
	console.log();
}

export function logout() {
	try {
		clearAll();
		showSuccess('All credentials cleared.');
		console.log('');
		console.log('To authenticate again, use:');
		console.log('  magicc auth copilot');
		console.log('  magicc auth openai <key>');
	} catch (error) {
		showError(`Logout failed: ${error.message}`);
		process.exit(1);
	}
}
