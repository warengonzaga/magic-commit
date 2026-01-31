import test from 'ava';
import {AIProvider} from './source/providers/ai-provider.js';
import {
	setAuthMode,
	setToken,
	getAuthMode,
	getToken,
	clearAll,
} from './source/utils/config-manager.js';

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

	setToken('github', 'ghp-test-token');
	t.is(getToken('github'), 'ghp-test-token');

	clearAll();
	t.is(getToken('openai'), undefined);
	t.is(getToken('github'), undefined);
});

test('AIProvider builds Clean Commit prompt correctly', t => {
	const provider = new AIProvider({authMode: 'openai'});
	const diff = 'test diff content';
	const filePath = 'test.js';

	const prompt = provider.buildCleanCommitPrompt(diff, filePath);

	t.true(prompt.includes('Clean Commit'));
	t.true(prompt.includes('test diff content'));
	t.true(prompt.includes('test.js'));
	t.true(prompt.includes('📦'));
	t.true(prompt.includes('🔧'));
});

test('AIProvider generates fallback message for large diffs', t => {
	const provider = new AIProvider({authMode: 'openai'});
	const message = provider.generateFallbackMessage('test-file.js');

	t.true(message.includes('test-file.js'));
	t.true(message.includes('update'));
});
