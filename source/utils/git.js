import {execa} from 'execa';
import isGit from 'is-git-repository';

/**
 * Git utilities for magic-commit
 * Handles staging, committing, diffs, and repository checks
 */

export async function isGitRepository() {
	return isGit();
}

export async function isCommitterSet() {
	try {
		const {stdout: name} = await execa('git', ['config', '--get', 'user.name']);
		const {stdout: email} = await execa('git', [
			'config',
			'--get',
			'user.email',
		]);
		return Boolean(name && email);
	} catch {
		return false;
	}
}

export async function getChangedFiles() {
	try {
		const {stdout: status} = await execa('git', ['status', '--porcelain']);
		if (!status) {
			return [];
		}

		const lines = status.split('\n');
		const filePaths = lines
			.map(line => {
				// Handle different git status formats
				const parts = line.trim().split(/\s+/);
				if (parts[0] === '??') {
					// Untracked files
					return parts.slice(1).join(' ');
				}

				// Modified/added files
				return parts.slice(1).join(' ');
			})
			.filter(filePath => filePath !== '');

		return filePaths;
	} catch (error) {
		console.error('Error getting changed files:', error);
		return [];
	}
}

export async function stageFile(filePath) {
	try {
		await execa('git', ['add', filePath]);
		return true;
	} catch (error) {
		console.error(`Error staging file ${filePath}:`, error);
		return false;
	}
}

export async function stageAll() {
	try {
		await execa('git', ['add', '.']);
		return true;
	} catch (error) {
		console.error('Error staging all files:', error);
		return false;
	}
}

export async function unstageFile(filePath) {
	try {
		await execa('git', ['restore', '--staged', filePath]);
		return true;
	} catch (error) {
		console.error(`Error unstaging file ${filePath}:`, error);
		return false;
	}
}

export async function unstageAll() {
	try {
		await execa('git', ['restore', '--staged', '.']);
		return true;
	} catch (error) {
		console.error('Error unstaging all files:', error);
		return false;
	}
}

export async function getDiff(filePath = null) {
	try {
		const args = ['diff', '--staged'];
		if (filePath) {
			args.push('--', filePath);
		}

		const {stdout: diff} = await execa('git', args);
		return diff;
	} catch (error) {
		console.error('Error getting diff:', error);
		return '';
	}
}

export async function commit(message) {
	try {
		await execa('git', ['commit', '-m', message]);
		return true;
	} catch (error) {
		console.error('Error committing:', error.message);
		return false;
	}
}

export async function getStagedFiles() {
	try {
		const {stdout} = await execa('git', ['diff', '--staged', '--name-only']);
		if (!stdout) {
			return [];
		}

		return stdout.split('\n').filter(file => file !== '');
	} catch (error) {
		console.error('Error getting staged files:', error);
		return [];
	}
}
