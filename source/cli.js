#!/usr/bin/env node
import process from 'node:process';
import {Command} from 'commander';
import packageJSON from '../package.json';
import {showBanner, showWarning} from './utils/ui.js';
import {commitCommand} from './commands/commit.js';
import {
	authenticateWithCopilot,
	authenticateWithOpenAI,
	showAuthStatusCommand,
	logout,
} from './commands/auth.js';
import {showConfig, resetConfig} from './commands/config.js';
import {setConvention, getConvention} from './utils/config-manager.js';
import {showSuccess, showError} from './utils/ui.js';

const program = new Command();

// Setup program metadata
program
	.name('magicc')
	.description('🪄 You can do magicc, you can build anything that you desire.')
	.version(packageJSON.version);

// Show banner on startup (except for --help and --version)
const args = new Set(process.argv.slice(2));
if (
	!args.has('--help') &&
	!args.has('-h') &&
	!args.has('--version') &&
	!args.has('-V')
) {
	showBanner();
}

// Default command (commit)
program.action(() => {
	// If no command is specified, run commit
	commitCommand();
});

// Commit command
program
	.command('commit', {isDefault: false})
	.description('Generate AI-powered commit messages')
	.option('--all', 'Process all files at once')
	.option('--file <path>', 'Process specific file')
	.option('--model <model>', 'Specify AI model (e.g., gpt-4, gpt-3.5-turbo)')
	.option(
		'--convention <type>',
		'Commit convention (clean, conventional, gitmoji, simple)',
	)
	.action(options => {
		commitCommand(options);
	});

// Auth command
const authCmd = program.command('auth').description('Manage authentication');

authCmd
	.command('copilot')
	.description('Authenticate with GitHub Copilot')
	.option('--token <token>', 'GitHub token')
	.action(options => {
		authenticateWithCopilot(options.token);
	});

authCmd
	.command('openai <key>')
	.description('Authenticate with OpenAI (legacy)')
	.action(key => {
		authenticateWithOpenAI(key);
	});

authCmd
	.command('status')
	.description('Show authentication status')
	.action(() => {
		showAuthStatusCommand();
	});

authCmd
	.command('logout')
	.description('Clear all credentials')
	.action(() => {
		logout();
	});

// Config command
const configCmd = program.command('config').description('Manage configuration');

configCmd
	.command('set-convention <type>')
	.description('Set default commit convention')
	.action(type => {
		const validConventions = ['clean', 'conventional', 'gitmoji', 'simple'];
		if (!validConventions.includes(type)) {
			showError(`Invalid convention: ${type}`);
			console.log(`Available: ${validConventions.join(', ')}`);
			process.exit(1);
		}

		setConvention(type);
		showSuccess(`Default convention set to: ${type}`);
	});

configCmd
	.option('--show', 'Show current configuration')
	.option('--reset', 'Reset configuration to defaults')
	.action(options => {
		if (options.reset) {
			resetConfig();
		} else {
			showConfig();
		}
	});

// Legacy flags support with deprecation warnings
program
	.option('-s, --setopenai <key>', '[DEPRECATED] Set OpenAI API key')
	.option('-d, --delopenai', '[DEPRECATED] Delete OpenAI API key');

// Handle legacy flags
program.hook('preAction', thisCommand => {
	const options = thisCommand.opts();

	if (options.setopenai) {
		showWarning('The -s flag is deprecated. Use: magicc auth openai <key>');
		console.log('');
		authenticateWithOpenAI(options.setopenai);
		process.exit(0);
	}

	if (options.delopenai) {
		showWarning('The -d flag is deprecated. Use: magicc auth logout');
		console.log('');
		logout();
		process.exit(0);
	}
});

// Parse arguments
program.parse();
