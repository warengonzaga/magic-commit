import execa from 'execa';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import config from './config.json';

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getGitDiff() {
	try {
			const { stdout: gitDiff } = await execa('git', ['diff']);

			const completion = await openai.chat.completions.create({
				messages: [
					{
						role: "system",
						content: config.prompt,
					},
					{ role: "user", content: gitDiff },
				],
				model: "gpt-3.5-turbo-0125"
			});
			console.log(completion.choices[0].message.content);
	} catch (error) {
			console.error(error);
	}
}

export default getGitDiff;