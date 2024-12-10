const apiKey = 'xai-mn4BKPDZiyx8uF34YJ30iKG2Xp3gNGyMneWwiAUcCxw903BWJLFIevu2rDumiNrmGXz0yFSI3OIpfXUd'; // Replace with your actual API key

async function testGrok() {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
          },
          {
            role: "user",
            content: "What is the meaning of life, the universe, and everything?"
          }
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0
      })
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testGrok();