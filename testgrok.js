// testGrok.js
import { getGrokInsights } from './grokAPI.js';

console.log('Starting Grok API test...');

async function testGrokConnection() {
    try {
        const result = await getGrokInsights('JPMorgan Chase');
        console.log('Grok API Response:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testGrokConnection();