import Generator from 'yeoman-generator';
import * as prompts from './prompts.js';

/**
 * @typedef {import('./index.js').ToolConfig} ToolConfig
 */

/**
 * @type {import('./index.js').ToolGenerator}
 */
export default {
    id: 'tool-reactmui',
    aliases: ['reactmui'],
    name: 'React Material UI',

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
        generator.fs.copyTpl(generator.templatePath('reactmui/package.json'), generator.destinationPath('package.json'), toolConfig);

        // Copy tsconfig.json
        generator.fs.copy(generator.templatePath('reactmui/tsconfig.json'), generator.destinationPath('tsconfig.json'));

        // Copy tsconfig.node.json
        generator.fs.copy(generator.templatePath('reactmui/tsconfig.node.json'), generator.destinationPath('tsconfig.node.json'));

        // Copy vite.config.ts
        generator.fs.copy(generator.templatePath('reactmui/vite.config.ts'), generator.destinationPath('vite.config.ts'));

        // Copy .gitignore if git is initialized
        if (toolConfig.gitInit) {
            generator.fs.copy(generator.templatePath('reactmui/gitignore'), generator.destinationPath('.gitignore'));
        }

        // Copy .npmignore
        generator.fs.copy(generator.templatePath('reactmui/npmignore'), generator.destinationPath('.npmignore'));

        // Copy README
        generator.fs.copyTpl(generator.templatePath('reactmui/README.md'), generator.destinationPath('README.md'), toolConfig);

        // Copy index.html
        generator.fs.copyTpl(generator.templatePath('reactmui/index.html'), generator.destinationPath('index.html'), toolConfig);

        // Copy source files
        generator.fs.copy(generator.templatePath('reactmui/src/main.tsx'), generator.destinationPath('src/main.tsx'));

        generator.fs.copy(generator.templatePath('reactmui/src/App.tsx'), generator.destinationPath('src/App.tsx'));

        generator.fs.copy(generator.templatePath('reactmui/src/index.css'), generator.destinationPath('src/index.css'));

        generator.fs.copy(generator.templatePath('reactmui/src/vite-env.d.ts'), generator.destinationPath('src/vite-env.d.ts'));

        // Copy components
        generator.fs.copy(
            generator.templatePath('reactmui/src/components/ConnectionStatus.tsx'),
            generator.destinationPath('src/components/ConnectionStatus.tsx')
        );

        generator.fs.copy(
            generator.templatePath('reactmui/src/components/DataverseAPIDemo.tsx'),
            generator.destinationPath('src/components/DataverseAPIDemo.tsx')
        );

        generator.fs.copy(generator.templatePath('reactmui/src/components/EventLog.tsx'), generator.destinationPath('src/components/EventLog.tsx'));

        generator.fs.copy(generator.templatePath('reactmui/src/components/ToolboxAPIDemo.tsx'), generator.destinationPath('src/components/ToolboxAPIDemo.tsx'));

        // Copy hooks
        generator.fs.copy(generator.templatePath('reactmui/src/hooks/useToolboxAPI.ts'), generator.destinationPath('src/hooks/useToolboxAPI.ts'));
    },

    /**
     * @param {Generator} generator
     * @param {ToolConfig} toolConfig
     */
    endMessage: (generator, toolConfig) => {
        generator.log('Your React tool is ready!');
        generator.log('Build your tool with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run build' : toolConfig.pkgManager + ' build'));
        generator.log('Start dev server with: ' + (toolConfig.pkgManager === 'npm' ? 'npm run dev' : toolConfig.pkgManager + ' dev'));
    },
};
