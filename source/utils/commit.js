import generatePrompt from './openai.js';
import {execa} from 'execa';
import readline from 'readline';
import React from 'react';
import info from './info.js';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import {Box, render, Text, useApp, Newline} from 'ink';
import SelectInput from 'ink-select-input';

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
			<>
				<Gradient name="passion">
					<BigText text="Magicc" />
					<Text>
						You can do `magicc`, you can build anything that you desire. 🪄
					</Text>
				</Gradient>
				<Text>
					Version: <Text color="green">{info('version')}</Text> | Author:{' '}
					<Text color="blue">{info('author')}</Text>
					<Newline />
					<Text>
						Need Help? <Text color="cyan">magicc --help</Text>
					</Text>
					<Newline />
					==================================================
				</Text>
				<Box flexDirection="column">
					<Text>{`Suggested commit message: ${prompt}\nDo you want to proceed?`}</Text>
					<SelectInput items={items} onSelect={handleSelect} />
				</Box>
			</>
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
