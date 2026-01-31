import chalk from 'chalk';
import {
	getAllConfig,
	clearAll,
	getConfigPath,
} from '../utils/config-manager.js';
import {showSuccess, showInfo} from '../utils/ui.js';

/**
 * Configuration commands
 */

export function showConfig() {
	const config = getAllConfig();

	console.log(chalk.cyan('\n⚙️  Configuration'));
	console.log('═'.repeat(50));

	if (Object.keys(config).length === 0) {
		showInfo('No configuration found.');
		console.log('Run "magicc auth copilot" to get started.');
	} else {
		for (const [key, value] of Object.entries(config)) {
			// Mask sensitive values
			let displayValue = value;
			if (
				(key === 'openai' || key === 'githubToken') &&
				typeof value === 'string' &&
				value.length > 10
			) {
				displayValue = value.slice(0, 10) + '...';
			}

			console.log(`  ${chalk.yellow(key)}: ${chalk.white(displayValue)}`);
		}
	}

	console.log('═'.repeat(50));
	console.log(chalk.gray(`📁 Config file: ${getConfigPath()}`));
	console.log();
}

export function resetConfig() {
	clearAll();
	showSuccess('Configuration reset to defaults.');
	console.log('Run "magicc auth copilot" to authenticate again.');
}
