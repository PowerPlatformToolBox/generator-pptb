import Generator from 'yeoman-generator';
import * as prompts from './prompts.js';

/**
 * @typedef {import('./index.js').ToolConfig} ToolConfig
 */

/**
 * @type {import('./index.js').ToolGenerator}
 */
export default {
    id: 'tool-vue',
    aliases: ['vue'],
    name: 'Vue',
    
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
            generator.templatePath('vue/package.json'),
            generator.destinationPath('package.json'),
            toolConfig
        );

        // Copy tsconfig.json
        generator.fs.copy(
            generator.templatePath('vue/tsconfig.json'),
            generator.destinationPath('tsconfig.json')
        );

        // Copy tsconfig.node.json
        generator.fs.copy(
            generator.templatePath('vue/tsconfig.node.json'),
            generator.destinationPath('tsconfig.node.json')
        );

        // Copy vite.config.ts
        generator.fs.copy(
            generator.templatePath('vue/vite.config.ts'),
            generator.destinationPath('vite.config.ts')
        );

        // Copy .gitignore if git is initialized
        if (toolConfig.gitInit) {
            generator.fs.copy(
                generator.templatePath('vue/gitignore'),
                generator.destinationPath('.gitignore')
            );
        }

        // Copy .npmignore
        generator.fs.copy(
            generator.templatePath('vue/npmignore'),
            generator.destinationPath('.npmignore')
        );

        // Copy README
        generator.fs.copyTpl(
            generator.templatePath('vue/README.md'),
            generator.destinationPath('README.md'),
            toolConfig
        );

        // Copy index.html
        generator.fs.copyTpl(
            generator.templatePath('vue/index.html'),
            generator.destinationPath('index.html'),
            toolConfig
        );

        // Copy source files
        generator.fs.copy(
            generator.templatePath('vue/src/main.ts'),
            generator.destinationPath('src/main.ts')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/App.vue'),
            generator.destinationPath('src/App.vue')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/style.css'),
            generator.destinationPath('src/style.css')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/vite-env.d.ts'),
            generator.destinationPath('src/vite-env.d.ts')
        );

        // Copy components
        generator.fs.copy(
            generator.templatePath('vue/src/components/ConnectionStatus.vue'),
            generator.destinationPath('src/components/ConnectionStatus.vue')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/components/DataverseAPIDemo.vue'),
            generator.destinationPath('src/components/DataverseAPIDemo.vue')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/components/EventLog.vue'),
            generator.destinationPath('src/components/EventLog.vue')
        );

        generator.fs.copy(
            generator.templatePath('vue/src/components/ToolboxAPIDemo.vue'),
            generator.destinationPath('src/components/ToolboxAPIDemo.vue')
        );

        // Copy composables
        generator.fs.copy(
            generator.templatePath('vue/src/composables/useToolboxAPI.ts'),
            generator.destinationPath('src/composables/useToolboxAPI.ts')
        );
    },
    
    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    endMessage: (generator, toolConfig) => {
        generator.log('Your Vue tool is ready!');
        generator.log('Build your tool with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run build' : toolConfig.pkgManager + ' build'));
        generator.log('Start dev server with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run dev' : toolConfig.pkgManager + ' dev'));
    }
};
