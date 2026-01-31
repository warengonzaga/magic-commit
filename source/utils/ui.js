import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import {
	listConventions,
	getConvention,
} from '../utils/commit-conventions.js';

/**
 * UI utilities for magic-commit terminal interface
 * Uses figlet for banners, chalk for colors, and inquirer for prompts
 */

export function showBanner() {
	const banner = figlet.textSync('Magic Commit', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
	});

	console.log(chalk.magenta(banner));
	console.log(
		chalk.cyan(
			'  🪄 You can do magicc, you can build anything that you desire. 🔮\n',
		),
	);
}

export function showCommitPreview(message, filePath = null) {
	console.log(chalk.yellow('\n📝 Suggested Commit Message:'));
	console.log(chalk.white(message));
	if (filePath) {
		console.log(chalk.gray(`   File: ${filePath}`));
	}

	console.log();
}

export async function promptConventionSelection() {
	const answer = await inquirer.prompt([
		{
			type: 'list',
			name: 'convention',
			message: 'Select commit message convention:',
			choices: listConventions(),
		},
	]);
	return answer.convention;
}

export async function confirmCommit(
	message,
	filePath = null,
	conventionName = 'clean',
) {
	const conv = getConvention(conventionName);

	console.log(chalk.gray(`\n📋 Convention: ${conv.name}`));
	console.log(chalk.yellow('📝 Suggested Commit Message:'));
	console.log(chalk.white(message));
	if (filePath) {
		console.log(chalk.gray(`   File: ${filePath}`));
	}

	console.log();

	const answer = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				{name: '✅ Accept and commit', value: 'accept'},
				{name: '✏️  Edit message', value: 'edit'},
				{name: '🔄 Regenerate with different convention', value: 'change-convention'},
				{name: '⏭️  Skip this file', value: 'skip'},
			],
		},
	]);

	if (answer.action === 'edit') {
		const edited = await inquirer.prompt([
			{
				type: 'input',
				name: 'message',
				message: 'Edit commit message:',
				default: message,
			},
		]);
		return {action: 'accept', message: edited.message};
	}

	if (answer.action === 'change-convention') {
		const newConvention = await promptConventionSelection();
		return {action: 'regenerate', convention: newConvention};
	}

	return {action: answer.action, message};
}

export async function promptModelSelection() {
	const answer = await inquirer.prompt([
		{
			type: 'list',
			name: 'model',
			message: 'Select AI model:',
			choices: [
				{name: 'GPT-4 (Copilot default)', value: 'gpt-4'},
				{name: 'GPT-4o-mini (OpenAI default)', value: 'gpt-4o-mini'},
				{name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo'},
			],
		},
	]);
	return answer.model;
}

export function showSuccess(message) {
	console.log(chalk.green('✅ ' + message));
}

export function showError(message) {
	console.log(chalk.red('❌ ' + message));
}

export function showWarning(message) {
	console.log(chalk.yellow('⚠️  ' + message));
}

export function showInfo(message) {
	console.log(chalk.blue('ℹ️  ' + message));
}

export function showAuthStatus(config) {
	console.log(chalk.cyan('\n🔐 Authentication Status'));
	console.log('──────────────────────────────────────────────────');

	const {authMode} = config;
	const {authenticatedAt} = config;

	if (authMode === 'copilot') {
		console.log(chalk.green('✅ GitHub Copilot'));
		if (authenticatedAt) {
			const date = new Date(authenticatedAt);
			console.log(chalk.gray(`   Authenticated: ${date.toLocaleString()}`));
		}

		console.log(chalk.gray('   Model: gpt-4 (default)'));
	} else if (authMode === 'openai') {
		console.log(chalk.green('✅ OpenAI (Legacy)'));
		if (authenticatedAt) {
			const date = new Date(authenticatedAt);
			console.log(chalk.gray(`   Authenticated: ${date.toLocaleString()}`));
		}

		console.log(chalk.gray('   Model: gpt-4o-mini (default)'));
	} else {
		console.log(chalk.red('❌ Not authenticated'));
		console.log(
			chalk.gray('   Run "magicc auth copilot" or "magicc auth openai <key>"'),
		);
	}

	console.log('──────────────────────────────────────────────────');
}

export async function promptYesNo(message, defaultValue = true) {
	const answer = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirmed',
			message,
			default: defaultValue,
		},
	]);
	return answer.confirmed;
}
