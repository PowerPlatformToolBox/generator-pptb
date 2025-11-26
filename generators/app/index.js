import Generator from 'yeoman-generator';
import yosay from 'yosay';
import * as path from 'path';
import html from './generate-html.js';
import react from './generate-react.js';
import reactant from './generate-reactant.js';
import reactfluent from './generate-reactfluent.js';
import reactmui from './generate-reactmui.js';
import vue from './generate-vue.js';
import svelte from './generate-svelte.js';

/**
 * @typedef {{
 * type: string,
 * name: string,
 * description: string,
 * displayName: string,
 * pkgManager: 'npm' | 'yarn' | 'pnpm',
 * gitInit: boolean,
 * }} ToolConfig
 *
 * @typedef {{
 * id: string,
 * aliases: string[],
 * name: string,
 * prompting: (generator: Generator, toolConfig: ToolConfig) => Promise<void>,
 * writing: (generator: Generator, toolConfig: ToolConfig) => void,
 * endMessage?: (generator: Generator, toolConfig: ToolConfig) => void,
 * }} ToolGenerator
 */

/**
 * @type {ToolGenerator[]}
 */
const toolGenerators = [html, react, reactant, reactfluent, reactmui, vue, svelte];

export default class extends Generator {
    /**
     * @type {ToolConfig}
     */
    toolConfig;

    constructor(args, opts) {
        super(args, opts);
        this.description = 'Generates a Power Platform Tool Box tool ready for development.';

        this.argument('destination', {
            type: String,
            required: false,
            description: `\n    The folder to create the tool in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the tool display name.\n  `,
        });

        this.option('quick', {
            type: Boolean,
            alias: 'q',
            description: 'Quick mode, skip all optional prompts and use defaults',
        });
        this.option('toolType', {
            type: String,
            alias: 't',
            description: toolGenerators.map((g) => g.aliases[0]).join(', '),
        });
        this.option('toolDisplayName', {
            type: String,
            alias: 'n',
            description: 'Display name of the tool',
        });
        this.option('toolId', { type: String, description: 'Id of the tool' });
        this.option('toolDescription', {
            type: String,
            description: 'Description of the tool',
        });
        this.option('pkgManager', {
            type: String,
            description: `'npm', 'yarn' or 'pnpm'`,
        });
        this.option('gitInit', {
            type: Boolean,
            description: `Initialize a git repo`,
        });

        this.toolConfig = Object.create(null);
        this.toolGenerator = undefined;
        this.abort = false;
    }

    async initializing() {
        // Welcome
        this.log(yosay('Welcome to the Power Platform Tool Box generator!'));

        const destination = this.options['destination'];
        if (destination) {
            const folderPath = path.resolve(this.destinationPath(), destination);
            this.destinationRoot(folderPath);
        }
    }

    async prompting() {
        // Ask for tool type
        const toolType = this.options['toolType'];
        if (toolType) {
            const toolGenerator = toolGenerators.find((g) => g.aliases.indexOf(toolType) !== -1);
            if (toolGenerator) {
                this.toolConfig.type = toolGenerator.id;
                this.toolGenerator = toolGenerator;
            } else {
                this.log('Invalid tool type: ' + toolType + '\nPossible types are: ' + toolGenerators.map((g) => g.aliases.join(', ')).join(', '));
                this.abort = true;
            }
        } else {
            const choices = [];
            for (const g of toolGenerators) {
                choices.push({ name: g.name, value: g.id });
            }

            const answers = await this.prompt({
                type: 'list',
                name: 'type',
                message: 'What type of tool do you want to create?',
                choices: choices,
            });

            this.toolConfig.type = answers.type;
            this.toolGenerator = toolGenerators.find((g) => g.id === answers.type);
        }

        if (!this.abort) {
            await this.toolGenerator.prompting(this, this.toolConfig);
        }
    }

    writing() {
        if (this.abort) {
            return;
        }

        this.toolGenerator.writing(this, this.toolConfig);
    }

    install() {
        if (this.abort) {
            return;
        }

        const installCommand = this.toolConfig.pkgManager === 'yarn' ? 'yarn' : this.toolConfig.pkgManager === 'pnpm' ? 'pnpm install' : 'npm install';

        this.log('\nInstalling dependencies with ' + installCommand + '...\n');

        this.spawnCommandSync(this.toolConfig.pkgManager, this.toolConfig.pkgManager === 'yarn' ? [] : ['install']);
    }

    end() {
        if (this.abort) {
            return;
        }

        // Initialize git if requested
        if (this.toolConfig.gitInit) {
            this.spawnCommandSync('git', ['init', '--quiet']);
        }

        this.log('\n');
        this.log('Your tool has been created!\n');
        this.log('To get started:\n');

        if (this.destinationRoot() !== process.cwd()) {
            this.log(`  cd ${path.basename(this.destinationRoot())}`);
        }

        this.log(`  ${this.toolConfig.pkgManager === 'npm' ? 'npm run' : this.toolConfig.pkgManager} build`);
        this.log('\n');

        if (this.toolGenerator.endMessage) {
            this.toolGenerator.endMessage(this, this.toolConfig);
        }
    }
}
