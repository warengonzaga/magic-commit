import {CopilotClient} from '@github/copilot-sdk';
import OpenAI from 'openai';
import {
	getAuthMode,
	getToken,
	getConvention as getConventionName,
} from '../utils/config-manager.js';
import {getConvention} from '../utils/commit-conventions.js';

/**
 * AI Provider abstraction layer
 * Supports GitHub Copilot (primary) and OpenAI (legacy fallback)
 */

const MAX_DIFF_SIZE = 4000;

export class AIProvider {
	constructor(options = {}) {
		this.authMode = options.authMode || getAuthMode();
		this.model = options.model;
	}

	/**
	 * Generate commit message using configured AI provider
	 */
	async generateCommitMessage(diff, filePath = null, options = {}) {
		if (!diff || diff.trim() === '') {
			throw new Error('No changes to generate commit message');
		}

		// Check diff size
		if (diff.length > MAX_DIFF_SIZE) {
			console.warn('⚠️  Diff content is large, using summary approach...');
			return this.generateFallbackMessage(filePath);
		}

		// Get the convention (from options, config, or default to 'clean')
		const conventionName = options.convention || getConventionName() || 'clean';
		const convention = getConvention(conventionName);

		// Build prompt using the selected convention
		const prompt = convention.buildPrompt(diff, filePath);

		try {
			if (this.authMode === 'copilot') {
				return await this.generateWithCopilot(prompt, options);
			}

			if (this.authMode === 'openai') {
				return await this.generateWithOpenAI(prompt, options);
			}

			throw new Error(
				'No authentication mode configured. Please run "magicc auth copilot" or "magicc auth openai <key>"',
			);
		} catch (error) {
			console.error('Error generating commit message:', error.message);
			throw error;
		}
	}

	/**
	 * Generate commit message using GitHub Copilot
	 */
	async generateWithCopilot(prompt, options = {}) {
		let client;
		try {
			// Create and start the Copilot client
			client = new CopilotClient();
			await client.start();

			// Create session with model
			const session = await client.createSession({
				model: this.model || options.model || 'gpt-4.1',
			});

			// Send the prompt and wait for response
			const response = await session.sendAndWait({
				prompt,
			});

			// Clean up
			await client.stop();

			// Extract the content from response
			if (response?.data?.content) {
				return response.data.content.trim();
			}

			throw new Error('No response from Copilot');
		} catch (error) {
			// Clean up client if it was created
			if (client) {
				try {
					await client.stop();
				} catch {
					// Ignore cleanup errors
				}
			}

			console.error('Copilot error:', error.message);

			// Fallback to OpenAI if available
			if (getToken('openai')) {
				console.warn('⚠️  Copilot failed, using OpenAI fallback...');
				return this.generateWithOpenAI(prompt, options);
			}

			throw new Error(
				`GitHub Copilot failed: ${error.message}\n\n` +
					'Make sure you have:\n' +
					'1. GitHub Copilot subscription\n' +
					'2. Authenticated via: gh auth login\n' +
					'3. GitHub CLI installed and in PATH\n\n' +
					'Or set OpenAI key as fallback: magicc auth openai <key>',
			);
		}
	}

	/**
	 * Generate commit message using OpenAI (legacy)
	 */
	async generateWithOpenAI(prompt, options = {}) {
		const apiKey = getToken('openai');
		if (!apiKey) {
			throw new Error(
				'OpenAI API key not found. Please run "magicc auth openai <key>"',
			);
		}

		const openai = new OpenAI({apiKey});
		const model = this.model || options.model || 'gpt-4o-mini';

		const response = await openai.chat.completions.create({
			model,
			messages: [
				{
					role: 'system',
					content: 'You are an expert at writing git commit messages.',
				},
				{role: 'user', content: prompt},
			],
			temperature: 0.7,
			max_tokens: 100, // eslint-disable-line camelcase
		});

		return response.choices[0].message.content.trim();
	}

	/**
	 * Fallback message for large diffs
	 */
	generateFallbackMessage(filePath) {
		if (filePath) {
			return `🔧 update (${filePath}): update ${filePath}`;
		}

		return '🔧 update: update files';
	}
}
