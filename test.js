import test from 'ava';
import {AIProvider} from './source/providers/ai-provider.js';
import {
	setAuthMode,
	setToken,
	getAuthMode,
	getToken,
	setConvention,
	getConvention,
	clearAll,
} from './source/utils/config-manager.js';
import {
	getConvention as getConventionDetails,
	listConventions,
} from './source/utils/commit-conventions.js';

test('config manager stores and retrieves auth mode', t => {
	clearAll();
	setAuthMode('openai');
	t.is(getAuthMode(), 'openai');

	setAuthMode('copilot');
	t.is(getAuthMode(), 'copilot');

	clearAll();
	t.is(getAuthMode(), undefined);
});

test('config manager stores and retrieves tokens', t => {
	clearAll();
	setToken('openai', 'sk-test-key');
	t.is(getToken('openai'), 'sk-test-key');

	clearAll();
	t.is(getToken('openai'), undefined);
});

test('config manager stores and retrieves convention', t => {
	clearAll();
	t.is(getConvention(), 'clean'); // Default

	setConvention('conventional');
	t.is(getConvention(), 'conventional');

	setConvention('gitmoji');
	t.is(getConvention(), 'gitmoji');

	clearAll();
	t.is(getConvention(), 'clean'); // Back to default
});

test('convention system returns correct convention details', t => {
	const cleanConv = getConventionDetails('clean');
	t.is(cleanConv.name, 'Clean Commit');
	t.true(cleanConv.description.includes('emoji'));

	const conventionalConv = getConventionDetails('conventional');
	t.is(conventionalConv.name, 'Conventional Commits');

	const gitmojiConv = getConventionDetails('gitmoji');
	t.is(gitmojiConv.name, 'Gitmoji');

	const simpleConv = getConventionDetails('simple');
	t.is(simpleConv.name, 'Simple');
});

test('convention system lists all conventions', t => {
	const conventions = listConventions();
	t.is(conventions.length, 4);
	t.true(conventions.some(c => c.value === 'clean'));
	t.true(conventions.some(c => c.value === 'conventional'));
	t.true(conventions.some(c => c.value === 'gitmoji'));
	t.true(conventions.some(c => c.value === 'simple'));
});

test('convention system builds prompts correctly', t => {
	const diff = 'test diff content';
	const filePath = 'test.js';

	// Test Clean Commit
	const cleanConv = getConventionDetails('clean');
	const cleanPrompt = cleanConv.buildPrompt(diff, filePath);
	t.true(cleanPrompt.includes('Clean Commit'));
	t.true(cleanPrompt.includes('test diff content'));
	t.true(cleanPrompt.includes('test.js'));
	t.true(cleanPrompt.includes('📦'));

	// Test Conventional Commits
	const conventionalConv = getConventionDetails('conventional');
	const conventionalPrompt = conventionalConv.buildPrompt(diff, filePath);
	t.true(conventionalPrompt.includes('Conventional Commits'));
	t.true(conventionalPrompt.includes('feat:'));
	t.true(conventionalPrompt.includes('fix:'));

	// Test Gitmoji
	const gitmojiConv = getConventionDetails('gitmoji');
	const gitmojiPrompt = gitmojiConv.buildPrompt(diff, filePath);
	t.true(gitmojiPrompt.includes('Gitmoji'));
	t.true(gitmojiPrompt.includes(':sparkles:'));

	// Test Simple
	const simpleConv = getConventionDetails('simple');
	const simplePrompt = simpleConv.buildPrompt(diff, filePath);
	t.true(simplePrompt.includes('imperative mood'));
	t.true(simplePrompt.includes('test diff content'));
});

test('convention system defaults to clean for unknown convention', t => {
	const unknownConv = getConventionDetails('unknown-convention');
	t.is(unknownConv.name, 'Clean Commit'); // Should fallback to clean
});

test('AIProvider generates fallback message for large diffs', t => {
	const provider = new AIProvider({authMode: 'openai'});
	const message = provider.generateFallbackMessage('test-file.js');

	t.true(message.includes('test-file.js'));
	t.true(message.includes('update'));
});
