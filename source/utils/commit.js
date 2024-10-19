import generatePrompt from './openai.js';
import {execa} from 'execa';
import readline from 'readline';
import React from 'react';
import {Box, render, Text, useApp} from 'ink';
import SelectInput from 'ink-select-input';
import Logo from './logo.js';

async function askForCommitMessage() {
	const prompt = await generatePrompt();

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
			<Logo>
				<Box flexDirection="column">
					<Text>{`Suggested commit message: ${prompt}\nDo you want to proceed?`}</Text>
					<SelectInput items={items} onSelect={handleSelect} />
				</Box>
			</Logo>
		);
	};

	if (prompt) {
		render(<SelectSuggestedCommit />);
	} else {
		console.log('No changes to commit...');
		rl.close();
	}
}

export default askForCommitMessage;
