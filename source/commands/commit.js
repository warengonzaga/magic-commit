import {AIProvider} from '../providers/ai-provider.js';
import {
getChangedFiles,
stageFile,
stageAll,
unstageFile,
getDiff,
commit,
isGitRepository,
isCommitterSet,
} from '../utils/git.js';
import {
showSuccess,
showError,
showWarning,
showInfo,
confirmCommit,
} from '../utils/ui.js';
import {getAuthMode} from '../utils/config-manager.js';

/**
 * Main commit command logic
 * Handles file-by-file and all-files workflows
 */

export async function commitCommand(options = {}) {
try {
// Check if in git repository
if (!await isGitRepository()) {
showError('Not a git repository.');
console.log('Please run this command inside a git repository.');
process.exit(1);
}

// Check if committer is set
if (!await isCommitterSet()) {
showError('Git user not configured.');
console.log('Please configure git user:');
console.log('  git config user.name "Your Name"');
console.log('  git config user.email "your.email@example.com"');
process.exit(1);
}

// Check authentication
const authMode = getAuthMode();
if (!authMode) {
showError('Not authenticated.');
console.log('');
console.log('Please authenticate first:');
console.log('  magicc auth copilot          # Recommended');
console.log('  magicc auth openai <key>     # Legacy');
process.exit(1);
}

// Initialize AI provider
const aiProvider = new AIProvider({
authMode,
model: options.model,
});

// Route to appropriate workflow
if (options.all) {
await processAllFiles(aiProvider, options);
} else if (options.file) {
await processFile(options.file, aiProvider, options);
} else {
await processFilesInteractively(aiProvider, options);
}
} catch (error) {
showError(`Commit failed: ${error.message}`);
process.exit(1);
}
}

export async function processAllFiles(aiProvider, options = {}) {
showInfo('Processing all files together...');

// Stage all changes
await stageAll();

// Get full diff
const diff = await getDiff();
if (!diff) {
showWarning('No changes to commit.');
return;
}

// Generate commit message
showInfo('Generating commit message...');
const message = await aiProvider.generateCommitMessage(diff, null, options);

// Confirm and commit
const result = await confirmCommit(message);

if (result.action === 'accept') {
const success = await commit(result.message);
if (success) {
showSuccess('Changes committed successfully!');
console.log(`📝 ${result.message}`);
} else {
showError('Failed to commit changes.');
}
} else if (result.action === 'skip') {
showInfo('Commit cancelled.');
}
}

export async function processFilesInteractively(aiProvider, options = {}) {
showInfo('Processing files interactively (file-by-file)...');
console.log('');

const files = await getChangedFiles();
if (files.length === 0) {
showWarning('No changes to commit.');
return;
}

console.log(`Found ${files.length} changed file(s).\n`);

let committed = 0;
let skipped = 0;

for (const file of files) {
console.log(`\n📄 Processing: ${file}`);

// Stage the file
await stageFile(file);

// Get diff for this file
const diff = await getDiff(file);
if (!diff) {
showWarning(`No diff for ${file}, skipping...`);
await unstageFile(file);
skipped++;
continue;
}

// Generate commit message
try {
const message = await aiProvider.generateCommitMessage(diff, file, options);

// Confirm and commit
const result = await confirmCommit(message, file);

if (result.action === 'accept') {
const success = await commit(result.message);
if (success) {
showSuccess(`Committed: ${file}`);
console.log(`📝 ${result.message}`);
committed++;
} else {
showError(`Failed to commit ${file}`);
await unstageFile(file);
skipped++;
}
} else if (result.action === 'skip') {
showInfo(`Skipped: ${file}`);
await unstageFile(file);
skipped++;
}
} catch (error) {
showError(`Error processing ${file}: ${error.message}`);
await unstageFile(file);
skipped++;
}
}

// Show summary
console.log('\n' + '═'.repeat(50));
console.log('📊 Summary:');
console.log(`   ✅ Committed: ${committed} file(s)`);
console.log(`   ⏭️  Skipped: ${skipped} file(s)`);
console.log('═'.repeat(50) + '\n');
}

export async function processFile(filePath, aiProvider, options = {}) {
showInfo(`Processing single file: ${filePath}`);
console.log('');

// Stage the file
const staged = await stageFile(filePath);
if (!staged) {
showError(`Failed to stage ${filePath}`);
return;
}

// Get diff
const diff = await getDiff(filePath);
if (!diff) {
showWarning(`No changes in ${filePath}`);
await unstageFile(filePath);
return;
}

// Generate commit message
showInfo('Generating commit message...');
const message = await aiProvider.generateCommitMessage(diff, filePath, options);

// Confirm and commit
const result = await confirmCommit(message, filePath);

if (result.action === 'accept') {
const success = await commit(result.message);
if (success) {
showSuccess('Changes committed successfully!');
console.log(`📝 ${result.message}`);
} else {
showError('Failed to commit changes.');
}
} else if (result.action === 'skip') {
showInfo('Commit cancelled.');
await unstageFile(filePath);
}
}
