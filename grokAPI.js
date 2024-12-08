// grokAPI.js
export async function getGrokInsights(bankName) {
    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer xai-hup5ItBkW5fI3Tuddsn0mFyEisekRsX1qlqLLyuFntsAtLhQGrK5eqS6tq5CESTtORXHzgMj2diciMXQ'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
                    },
                    {
                        role: "user",
                        content: `What are the latest GenAI initiatives and news for ${bankName}?`
                    }
                ],
                model: "grok-beta",
                stream: false,
                temperature: 0
            })
        });

        const data = await response.json();
        return data.choices[0].message;
    } catch (error) {
        console.error('Error details:', error);
        return { error: 'Unable to fetch insights at this time' };
    }
}