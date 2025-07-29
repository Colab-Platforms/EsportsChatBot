
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
// const productKnowledge = require('./product_knowledge');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("working");
});

app.post('/chat', async (req, res) => {
    const userQuery = req.body.text || '';  // Ensure you capture the user's input dynamically
    
    const prompt = `
You are a customer support chatbot for Colab Esports – a competitive gaming platform by Colab Platforms Ltd., a BSE-listed company focused on building India's next esports ecosystem.

Platform Information:

How to Join a Match:
- Click "Play Now" on homepage
- Must be logged in with ₹1 in wallet
- Automatically placed into 5v5 lobby

Pricing:
- Each match costs ₹1 to enter

Wallet & Payments:
- If insufficient funds, recharge pop-up appears
- Payment methods: UPI or Debit Card
- Manual recharge: Profile > Check balance > "Recharge Wallet"

Match Format:
- Solo-friendly lobbies (no team required)
- 5v5 CS2 matches currently available
- More formats and games coming soon
- No skill-based matchmaking yet (open beta)

Account Setup:
- Sign Up: Full name, gamer nickname, contact, email, country
- Upload square avatar
- Agree to privacy policy and age terms
- KYC mandatory for playing and withdrawals
- Must link Steam and Discord accounts

Account Management:
- Username is fixed (cannot change)
- Display name can be updated in profile settings
- Platform free to sign up and use

Support Contact:
- 📧 support@colabesports.in
- 📱 WhatsApp: +91XXXXXXXXXX

Company:
- Colab Esports is by Colab Platforms Ltd.
- BSE-listed company building India's esports ecosystem

Language: Respond in English (or user's preferred language).
Tone: Short, professional, and informative.

Only respond to queries related to Colab Esports. For unrelated questions, reply:
"I'm here to help you with queries related to Colab Esports and its gaming platform!"

Now answer this question: ${userQuery}
`;

    
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log(response.data.candidates[0].content.parts[0]);  // Log the full response for debugging

        if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0] && response.data.candidates[0].content.parts[0].text) {
            res.json({ message: response.data.candidates[0].content.parts[0].text }) ;
        } else {
            console.error('Error: No generated text in response:', response.data);
            res.json({ message: 'Sorry, please try one more time' });
        }
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.json({ message: 'Sorry, please try one more time' });
    }
});


app.listen(4500, () => {
    console.log(`Chatbot server running on port 4500`);
});
