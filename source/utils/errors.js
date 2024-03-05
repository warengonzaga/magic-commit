import { execa } from "execa"

const isCommitterSet = async () => {
  try {
    const { stdout: name } = await execa("git", ["config", "--get", "user.name"]);
    const { stdout: email } = await execa("git", ["config", "--get", "user.email"]);

    if (name && email) {
      return true;
    }
  } catch (error) {
    console.error("Failed to check if committer is set:", error);
    return false;
  }
}

export default isCommitterSet;