import generatePrompt from "./openai.js";
import execa from 'execa';
import readline from "readline";

async function askForCommitMessage() {
  const prompt = await generatePrompt();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (prompt) {
    rl.question(`Suggested commit message: ${prompt}\nDo you want to proceed? (y/n) `, (answer) => {
      if (answer.toLowerCase() === "y") {
        execa("git", ["commit", "-m", prompt])
          .then(() => {
            console.log("Changes committed successfully!");
          })
          .catch((error) => {
            console.error("Failed to commit changes:", error);
          });
      } else {
        console.log("Changes not committed.");
      }

      rl.close();
    });
  } else {
    console.log("No changes to commit...");
    rl.close();
  }
}

export default askForCommitMessage;