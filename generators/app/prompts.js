import Generator from 'yeoman-generator';
import * as path from 'path';

/**
 * @typedef {import('./index.js').ToolConfig} ToolConfig
*/

/**
 * Validate tool ID
 */
export function validateToolId(id) {
    if (!id || id.length === 0) {
        return 'The tool identifier cannot be empty';
    }
    if (id.match(/[^a-z0-9\-]/)) {
        return 'The tool identifier can only contain lowercase letters, numbers and hyphens';
    }
    return true;
}

/**
 * Ask for tool display name
 * @param {Generator} generator
 * @param {ToolConfig} toolConfig
 */
export async function askForToolDisplayName(generator, toolConfig) {
    let toolDisplayName = generator.options['toolDisplayName'];
    if (toolDisplayName) {
        toolConfig.displayName = toolDisplayName;
        return;
    }
    
    const nameFromFolder = generator.options['destination'] ? path.basename(generator.destinationPath()) : '';

    if (generator.options['quick'] && nameFromFolder) {
        toolConfig.displayName = nameFromFolder;
        return;
    }

    const answer = await generator.prompt({
        type: 'input',
        name: 'displayName',
        message: 'What\'s the name of your tool?',
        default: nameFromFolder || 'My PPTB Tool'
    });
    
    toolConfig.displayName = answer.displayName;
}

/**
 * Ask for tool id ("name" in package.json)
 * @param {Generator} generator
 * @param {ToolConfig} toolConfig
 */
export async function askForToolId(generator, toolConfig) {
    const toolName = generator.options['toolId'];
    if (toolName) {
        toolConfig.name = toolName;
        return;
    }
    
    let def = toolConfig.name;
    if (!def && toolConfig.displayName) {
        def = 'pptb-' + toolConfig.displayName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    if (def && generator.options['quick']) {
        toolConfig.name = def;
        return;
    }

    const answer = await generator.prompt({
        type: 'input',
        name: 'name',
        message: 'What\'s the identifier of your tool?',
        default: def || 'pptb-tool',
        validate: validateToolId
    });
    
    toolConfig.name = answer.name;
}

/**
 * Ask for tool description
 * @param {Generator} generator
 * @param {ToolConfig} toolConfig
 */
export async function askForToolDescription(generator, toolConfig) {
    const toolDescription = generator.options['toolDescription'];
    if (toolDescription) {
        toolConfig.description = toolDescription;
        return;
    }
    
    if (generator.options['quick']) {
        toolConfig.description = '';
        return;
    }

    const answer = await generator.prompt({
        type: 'input',
        name: 'description',
        message: 'What\'s the description of your tool?',
        default: 'A Power Platform Tool Box tool'
    });
    
    toolConfig.description = answer.description;
}

/**
 * Ask for package manager
 * @param {Generator} generator
 * @param {ToolConfig} toolConfig
 */
export async function askForPackageManager(generator, toolConfig) {
    const pkgManager = generator.options['pkgManager'];
    if (pkgManager) {
        toolConfig.pkgManager = pkgManager;
        return;
    }
    
    if (generator.options['quick']) {
        toolConfig.pkgManager = 'npm';
        return;
    }

    const answer = await generator.prompt({
        type: 'list',
        name: 'pkgManager',
        message: 'Which package manager do you want to use?',
        choices: [
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
            { name: 'pnpm', value: 'pnpm' }
        ],
        default: 'npm'
    });
    
    toolConfig.pkgManager = answer.pkgManager;
}

/**
 * Ask for git initialization
 * @param {Generator} generator
 * @param {ToolConfig} toolConfig
 */
export async function askForGit(generator, toolConfig) {
    const gitInit = generator.options['gitInit'];
    if (gitInit !== undefined) {
        toolConfig.gitInit = gitInit;
        return;
    }
    
    if (generator.options['quick']) {
        toolConfig.gitInit = true;
        return;
    }

    const answer = await generator.prompt({
        type: 'confirm',
        name: 'gitInit',
        message: 'Initialize a git repository?',
        default: true
    });
    
    toolConfig.gitInit = answer.gitInit;
}
