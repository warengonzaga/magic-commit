import process from 'node:process';
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

export async function authenticateWithCopilot(token = null) {
	try {
		// Check for token in arguments first
		let authToken = token;

		// If no token provided, check environment variables
		if (!authToken) {
			authToken =
				process.env.COPILOT_GITHUB_TOKEN ||
				process.env.GH_TOKEN ||
				process.env.GITHUB_TOKEN;
		}

		if (!authToken) {
			showError('No GitHub token found.');
			console.log('');
			console.log('Please provide a token using one of these methods:');
			console.log('  1. Pass token: magicc auth copilot --token <your-token>');
			console.log('  2. Set environment variable: GITHUB_TOKEN or GH_TOKEN');
			console.log(
				'  3. Use gh CLI: gh auth login (then use: magicc auth copilot)',
			);
			console.log('');
			console.log('To create a token:');
			console.log('  Visit: https://github.com/settings/tokens');
			console.log('  Scopes needed: repo, read:user');
			process.exit(1);
		}

		// Store token and set auth mode
		setToken('github', authToken);
		setAuthMode('copilot');

		showSuccess('GitHub Copilot authentication successful!');
		console.log('');
		console.log(`📁 Config stored at: ${getConfigPath()}`);
		console.log('');
		console.log('You can now use: magicc commit');
	} catch (error) {
		showError(`Authentication failed: ${error.message}`);
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
