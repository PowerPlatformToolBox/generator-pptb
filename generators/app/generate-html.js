import Generator from 'yeoman-generator';
import * as prompts from './prompts.js';

/**
 * @typedef {import('./index.js').ToolConfig} ToolConfig
 */

/**
 * @type {import('./index.js').ToolGenerator}
 */
export default {
    id: 'tool-html',
    aliases: ['html', 'typescript', 'ts'],
    name: 'HTML with TypeScript',
    
    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    prompting: async (generator, toolConfig) => {
        await prompts.askForToolDisplayName(generator, toolConfig);
        await prompts.askForToolId(generator, toolConfig);
        await prompts.askForToolDescription(generator, toolConfig);
        await prompts.askForGit(generator, toolConfig);
        await prompts.askForPackageManager(generator, toolConfig);
    },
    
    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    writing: (generator, toolConfig) => {
        // Copy package.json template
        generator.fs.copyTpl(
            generator.templatePath('html/package.json'),
            generator.destinationPath('package.json'),
            toolConfig
        );

        // Copy tsconfig.json
        generator.fs.copy(
            generator.templatePath('html/tsconfig.json'),
            generator.destinationPath('tsconfig.json')
        );

        // Copy .gitignore if git is initialized
        if (toolConfig.gitInit) {
            generator.fs.copy(
                generator.templatePath('html/gitignore'),
                generator.destinationPath('.gitignore')
            );
        }

        // Copy .npmignore
        generator.fs.copy(
            generator.templatePath('html/npmignore'),
            generator.destinationPath('.npmignore')
        );

        // Copy README
        generator.fs.copyTpl(
            generator.templatePath('html/README.md'),
            generator.destinationPath('README.md'),
            toolConfig
        );

        // Copy source files
        generator.fs.copy(
            generator.templatePath('html/src/index.html'),
            generator.destinationPath('src/index.html')
        );

        generator.fs.copy(
            generator.templatePath('html/src/app.ts'),
            generator.destinationPath('src/app.ts')
        );

        generator.fs.copy(
            generator.templatePath('html/src/styles.css'),
            generator.destinationPath('src/styles.css')
        );
    },
    
    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    endMessage: (generator, toolConfig) => {
        generator.log('Your HTML/TypeScript tool is ready!');
        generator.log('Build your tool with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run build' : toolConfig.pkgManager + ' build'));
    }
};
