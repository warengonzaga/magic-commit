import {generateCommitMessage} from './generateCommitMessage.js';
import {execa} from 'execa';
import readline from 'readline';
import React from 'react';
import {Box, render, Text, useApp} from 'ink';
import SelectInput from 'ink-select-input';

async function askForCommitMessage(flags, model) {
	const prompt = await generateCommitMessage(flags, model);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const SelectSuggestedCommit = () => {
		const {exit} = useApp();
		const handleSelect = item => {
			if (item.value) {
				execa('git', ['commit', '-m', prompt])
					.then(() => {
						console.log('Changes committed successfully!');
					})
					.catch(error => {
						console.error('Failed to commit changes:', error);
					});
			} else {
				console.log('Changes not committed.');
			}
			rl.close();
			exit();
		};

		const items = [
			{
				label: 'No',
				value: false,
			},
			{
				label: 'Yes',
				value: true,
			},
		];

		return (
			<Box flexDirection="column">
				<Text>{`Suggested commit message: ${prompt}\nDo you want to proceed?`}</Text>
				<SelectInput items={items} onSelect={handleSelect} />
			</Box>
		);
	};
	if (prompt) {
		render(<SelectSuggestedCommit />);
	} else {
		console.log('No changes to commit...');
		rl.close();
	}
}

export async function initGit() {
	try {
		await execa('git', ['restore', '--staged', '.']);
	} catch (error) {
		console.error(error);
	}
}

// git status to see if there are any changes
// if there's any changes add the first file in the list of changes
let firstFilePath = '';

export async function gitStatus() {
	try {
		const {stdout: status} = await execa('git', ['status', '--porcelain']);
		if (status) {
			// get the first file path in the list of changes
			const lines = status.split('\n');
			const filePaths = lines
				.map(line => line.split(' ').slice(2).join(' ').trim())
				.filter(filePath => filePath !== '')
				.concat(
					lines
						.filter(line => line.startsWith('??'))
						.map(line => line.split(' ').slice(1).join(' ').trim()),
				);
			// git add the first file in the list of changes
			firstFilePath = filePaths[0];
			await execa('git', ['add', firstFilePath]);
			console.log(`${firstFilePath} has been added to the staging area.`);
		} else {
			console.log('No changes to commit.');
			return false;
		}
	} catch (error) {
		console.error(error);
	}
}

// get the diff of the staged changes
export async function gitDiff() {
	try {
		const {stdout: gitDiff} = await execa('git', ['diff', '--staged']);
		return gitDiff;
	} catch (error) {
		console.error(error);
	}
}


export default askForCommitMessage;
