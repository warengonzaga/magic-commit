import process from 'node:process';
import OpenAI from 'openai';
import {getAuthMode, getToken} from '../utils/config-manager.js';

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

		const prompt = this.buildCleanCommitPrompt(diff, filePath);

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
	 * NOTE: This is a simplified implementation. A GitHub token alone cannot authenticate
	 * with the OpenAI API. In production, this would either:
	 * 1. Use the GitHub Copilot API endpoint (requires different authentication)
	 * 2. Require users to have an OpenAI API key separately
	 * 3. Use a proxy service that bridges GitHub auth to OpenAI
	 * For now, this serves as a placeholder for the intended Copilot integration.
	 */
	async generateWithCopilot(prompt, options = {}) {
		try {
			// Check for GitHub token in environment variables or config
			const token =
				getToken('github') ||
				process.env.COPILOT_GITHUB_TOKEN ||
				process.env.GH_TOKEN ||
				process.env.GITHUB_TOKEN;

			if (!token) {
				throw new Error(
					'GitHub token not found. Please authenticate with "magicc auth copilot"',
				);
			}

			// In a real implementation, this would use the Copilot API endpoint
			// For now, if a GitHub token is provided, we fall back to OpenAI
			// This allows the structure to be in place for future Copilot integration
			throw new Error(
				'GitHub Copilot integration pending - using OpenAI fallback',
			);
		} catch (error) {
			// Fallback to OpenAI if available
			if (getToken('openai')) {
				console.warn('⚠️  Copilot not fully implemented, using OpenAI...');
				return this.generateWithOpenAI(prompt, options);
			}

			throw error;
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
	 * Build Clean Commit format prompt
	 */
	buildCleanCommitPrompt(diff, filePath = null) {
		return `You are an expert at writing git commit messages following the "Clean Commit" format.

**Clean Commit Format:**
<emoji> <type>: <description>
<emoji> <type> (<scope>): <description>

**The 9 Types:**
| Emoji | Type      | What it covers |
|-------|-----------|----------------|
| 📦    | new       | Adding new features, files, or capabilities |
| 🔧    | update    | Changing existing code, refactoring, improvements |
| 🗑️    | remove    | Removing code, files, features, or dependencies |
| 🔒    | security  | Security fixes, patches, vulnerability resolutions |
| ⚙️    | setup     | Project configs, CI/CD, tooling, build systems |
| ☕    | chore     | Maintenance tasks, dependency updates, housekeeping |
| 🧪    | test      | Adding, updating, or fixing tests |
| 📖    | docs      | Documentation changes and updates |
| 🚀    | release   | Version releases and release preparation |

**Rules:**
- Use lowercase for type
- Use present tense ("add" not "added")
- No period at the end
- Keep description under 72 characters
- Include scope (filename) if appropriate

**Git Diff:**
\`\`\`diff
${diff}
\`\`\`

${filePath ? `**File:** ${filePath}\n` : ''}
Generate a single commit message following Clean Commit format. Return ONLY the commit message, nothing else.`;
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
