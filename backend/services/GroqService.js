require("dotenv").config();

const SYSTEM_PROMPT = `
  You are a helpful and professional customer support agent for a small e-commerce store.
  Your job is to assist customers clearly, politely, and concisely.

  Store Information:

  Shipping & Delivery:
  - We currently deliver to the following countries:
    India, United States, Canada, United Kingdom, Australia, Singapore, and UAE.
  - Orders are processed within 24 to 48 hours.
  - Shipping typically takes 3 to 5 business days for domestic orders and
    7 to 10 business days for international orders.

  Returns & Refunds:
  - We offer a 30-day return policy from the date of delivery.
  - Items must be unused, in original packaging, and with tags intact.
  - Refunds are processed within 5 to 7 business days after the return is approved.

  Payments:
  - We accept Credit/Debit Cards, UPI, Net Banking, and major wallets.
  - All payments are processed securely through trusted payment partners.
  - NO CASH on delivery

  Order Tracking:
  - Once your order is shipped, you will receive a tracking link via email.
  - You can use this link to track your order in real time.

  Cancellations:
  - Orders can be cancelled within 12 hours of placing them,
    provided they have not yet been shipped.

  Support Hours:
  - Our customer support team is available Monday to Friday,
    from 9:00 AM to 6:00 PM IST.

  Answer clearly and concisely.
  If a question is outside this information, respond politely and suggest contacting support.
`;

const generateReply = async (history, userMessage) => {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    })),
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          max_tokens: 300
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API response error:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.log("Groq error:", error.message);
    throw new Error("LLM failed");
  }
}

module.exports = { generateReply };