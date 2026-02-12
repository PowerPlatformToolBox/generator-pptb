import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

// Ensure DOM is ready and app element exists
const appElement = document.getElementById('app');
let app;

if (appElement && !appElement.hasAttribute('data-svelte-initialized')) {
    // Mark as initialized to prevent double initialization
    appElement.setAttribute('data-svelte-initialized', 'true');

    app = mount(App, { target: appElement });
} else if (!appElement) {
    console.error('App element not found. Make sure the HTML contains <div id="app"></div>');
}

export default app;
