import Generator from 'yeoman-generator';
import * as prompts from './prompts.js';

/**
 * @typedef {import('./index.js').ToolConfig} ToolConfig
 */

/**
 * @type {import('./index.js').ToolGenerator}
 */
export default {
    id: 'tool-svelte',
    aliases: ['svelte'],
    name: 'Svelte',
    
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
            generator.templatePath('svelte/package.json'),
            generator.destinationPath('package.json'),
            toolConfig
        );

        // Copy tsconfig.json
        generator.fs.copy(
            generator.templatePath('svelte/tsconfig.json'),
            generator.destinationPath('tsconfig.json')
        );

        // Copy tsconfig.node.json
        generator.fs.copy(
            generator.templatePath('svelte/tsconfig.node.json'),
            generator.destinationPath('tsconfig.node.json')
        );

        // Copy vite.config.ts
        generator.fs.copy(
            generator.templatePath('svelte/vite.config.js'),
            generator.destinationPath('vite.config.js')
        );

        // Copy svelte.config.js
        generator.fs.copy(
            generator.templatePath('svelte/svelte.config.js'),
            generator.destinationPath('svelte.config.js')
        );

        // Copy .gitignore if git is initialized
        if (toolConfig.gitInit) {
            generator.fs.copy(
                generator.templatePath('svelte/gitignore'),
                generator.destinationPath('.gitignore')
            );
        }

        // Copy .npmignore
        generator.fs.copy(
            generator.templatePath('svelte/npmignore'),
            generator.destinationPath('.npmignore')
        );

        // Copy README
        generator.fs.copyTpl(
            generator.templatePath('svelte/README.md'),
            generator.destinationPath('README.md'),
            toolConfig
        );

        // Copy index.html
        generator.fs.copyTpl(
            generator.templatePath('svelte/index.html'),
            generator.destinationPath('index.html'),
            toolConfig
        );

        // Copy source files
        generator.fs.copy(
            generator.templatePath('svelte/src/main.ts'),
            generator.destinationPath('src/main.ts')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/App.svelte'),
            generator.destinationPath('src/App.svelte')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/app.css'),
            generator.destinationPath('src/app.css')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/vite-env.d.ts'),
            generator.destinationPath('src/vite-env.d.ts')
        );

        // Copy lib components
        generator.fs.copy(
            generator.templatePath('svelte/src/lib/components/ConnectionStatus.svelte'),
            generator.destinationPath('src/lib/components/ConnectionStatus.svelte')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/lib/components/DataverseAPIDemo.svelte'),
            generator.destinationPath('src/lib/components/DataverseAPIDemo.svelte')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/lib/components/EventLog.svelte'),
            generator.destinationPath('src/lib/components/EventLog.svelte')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/lib/components/ToolboxAPIDemo.svelte'),
            generator.destinationPath('src/lib/components/ToolboxAPIDemo.svelte')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/lib/stores/connection-store.svelte.ts'),
            generator.destinationPath('src/lib/stores/connection-store.svelte.ts')
        );

        generator.fs.copy(
            generator.templatePath('svelte/src/lib/stores/event-log-store.svelte.ts'),
            generator.destinationPath('src/lib/stores/event-log-store.svelte.ts')
        );
    },
    
    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    endMessage: (generator, toolConfig) => {
        generator.log('Your Svelte tool is ready!');
        generator.log('Build your tool with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run build' : toolConfig.pkgManager + ' build'));
        generator.log('Start dev server with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run dev' : toolConfig.pkgManager + ' dev'));
    }
};
