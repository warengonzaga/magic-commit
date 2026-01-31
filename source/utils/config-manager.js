import Conf from 'conf';

const config = new Conf({projectName: 'magicc'});

/**
 * Configuration manager wrapper for magicc
 * Handles auth tokens, settings, and user preferences
 */

// Auth mode management
export function setAuthMode(mode) {
	config.set('authMode', mode);
}

export function getAuthMode() {
	return config.get('authMode');
}

// Token management
export function setToken(provider, token) {
	if (provider === 'copilot' || provider === 'github') {
		config.set('githubToken', token);
	} else if (provider === 'openai') {
		config.set('openai', token);
	}
	config.set('authenticatedAt', new Date().toISOString());
}

export function getToken(provider) {
	if (provider === 'copilot' || provider === 'github') {
		return config.get('githubToken');
	} else if (provider === 'openai') {
		return config.get('openai');
	}
	return null;
}

// Legacy support
export function getOpenAIKey() {
	return config.get('openai');
}

export function setOpenAIKey(key) {
	config.set('openai', key);
	config.set('authenticatedAt', new Date().toISOString());
}

export function deleteOpenAIKey() {
	config.delete('openai');
}

// Config management
export function getAllConfig() {
	return config.store;
}

export function clearAll() {
	config.clear();
}

export function getConfigPath() {
	return config.path;
}

export function setUseGhCli(value) {
	config.set('useGhCli', value);
}

export function getUseGhCli() {
	return config.get('useGhCli', false);
}
