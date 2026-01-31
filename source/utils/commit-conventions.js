export const CONVENTIONS = {
	clean: {
		name: 'Clean Commit',
		description: 'wgtechlabs Clean Commit format with emojis',
		buildPrompt: (diff, filePath) => `You are an expert at writing git commit messages following the "Clean Commit" format.

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
Generate a single commit message following Clean Commit format. Return ONLY the commit message, nothing else.`,
	},

	conventional: {
		name: 'Conventional Commits',
		description: 'Standard Conventional Commits specification',
		buildPrompt: (diff, filePath) => `You are an expert at writing git commit messages following the "Conventional Commits" specification.

**Format:**
<type>(<scope>): <description>

**Types:**
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that don't affect code meaning (whitespace, formatting)
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies
- ci: Changes to CI configuration files and scripts
- chore: Other changes that don't modify src or test files

**Rules:**
- Use lowercase for type
- Use present tense ("add" not "added")
- No period at the end
- Keep description under 72 characters
- Scope is optional but recommended

**Git Diff:**
\`\`\`diff
${diff}
\`\`\`

${filePath ? `**File:** ${filePath}\n` : ''}
Generate a single commit message following Conventional Commits format. Return ONLY the commit message, nothing else.`,
	},

	gitmoji: {
		name: 'Gitmoji',
		description: 'Gitmoji commit convention with emojis',
		buildPrompt: (diff, filePath) => `You are an expert at writing git commit messages using the "Gitmoji" convention.

**Format:**
:<emoji-code>: <description>

**Common Emoji Codes:**
- :sparkles: Introduce new features
- :bug: Fix a bug
- :recycle: Refactor code
- :lipstick: Update UI and style files
- :memo: Add or update documentation
- :rocket: Deploy stuff
- :white_check_mark: Add, update, or pass tests
- :lock: Fix security issues
- :arrow_up: Upgrade dependencies
- :arrow_down: Downgrade dependencies
- :fire: Remove code or files
- :construction: Work in progress

**Rules:**
- Start with emoji code (e.g., :sparkles:)
- Use present tense
- Keep concise and clear
- No period at the end

**Git Diff:**
\`\`\`diff
${diff}
\`\`\`

${filePath ? `**File:** ${filePath}\n` : ''}
Generate a single commit message using Gitmoji format. Return ONLY the commit message, nothing else.`,
	},

	simple: {
		name: 'Simple',
		description: 'Plain descriptive commit messages',
		buildPrompt: (diff, filePath) => `You are an expert at writing clear, concise git commit messages.

**Format:**
Simple descriptive message in imperative mood

**Rules:**
- Use imperative mood ("Add feature" not "Added feature")
- Start with capital letter
- No period at the end
- Keep under 72 characters
- Be specific and clear
- No prefixes or emojis

**Git Diff:**
\`\`\`diff
${diff}
\`\`\`

${filePath ? `**File:** ${filePath}\n` : ''}
Generate a single, clear commit message. Return ONLY the commit message, nothing else.`,
	},
};

export function getConvention(name = 'clean') {
	return CONVENTIONS[name] || CONVENTIONS.clean;
}

export function listConventions() {
	return Object.entries(CONVENTIONS).map(([key, conv]) => ({
		value: key,
		name: `${conv.name} - ${conv.description}`,
	}));
}
