/**
 * Obtém uma resposta da API da Groq para continuar o diálogo do cenário.
 * ... (a função getAIResponse permanece a mesma da etapa anterior) ...
 */
async function getAIResponse(userMessage, history, apiKey, scenario, settings) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const languageMap = { "en-US": "English" };
    const targetLanguage = languageMap[settings.language] || "English";
    const systemPrompt = `You are a role-playing assistant for a language student. Your role is to act as a character (waiter, receptionist, etc.) in a specific scenario. The user wants to practice speaking ${targetLanguage}. ALL of your responses MUST be in ${targetLanguage}. CURRENT SCENARIO: "${scenario.name}". USER'S GOAL: "${scenario.goal}". USER'S PROFICIENCY LEVEL: "${settings.proficiency}". YOUR CORRECTION LEVEL: "${settings.correction}". YOUR RULES ARE ABSOLUTE: 1. GUIDE, DON'T GIVE AWAY: Your job is to guide the user step-by-step until they complete the goal. Do not give them the answer or state the goal directly. 2. ALWAYS END WITH AN ACTION: At the end of EVERY response, you MUST ask a direct question or present a clear choice to prompt the user to continue the dialogue. 3. STAY IN CHARACTER: Act like the character in the scenario. 4. INITIATE THE DIALOGUE: If this is the first message (no user history), start the conversation with a greeting appropriate for the scenario, IN ${targetLanguage}. 5. ACKNOWLEDGE SUCCESS: When the user successfully completes the goal, end the dialogue with a congratulatory message and include "[Scenario Complete]" at the end of your message. Your entire response, including this, must be in ${targetLanguage}.`;
    const messages = [{ role: 'system', content: systemPrompt }, ...history];
    if (userMessage) messages.push({ role: 'user', content: userMessage });
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return a valid response.");
    } catch (error) { console.error("Error in getAIResponse:", error); throw error; }
}

/**
 * Obtém um feedback detalhado sobre a performance do usuário.
 * ... (prompt atualizado para solicitar melhor formatação) ...
 */
async function getFeedbackForConversation(history, apiKey) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const systemPrompt = `You are an expert English language tutor. A student has just completed a role-playing conversation. Your task is to provide constructive, detailed, and encouraging feedback. Your response MUST be in English. Analyze ONLY the user's messages.

    Please structure your feedback in three sections using Markdown:
    
    ### 👍 What You Did Well
    Start with a positive comment.
    
    ### ✒️ Grammar & Spelling Corrections
    For each correction, use a bullet point (*). Show the user's original phrase, then the corrected version, and briefly explain why. Use **bold** for the corrected part. If no errors, state "No corrections needed, fantastic work!".

    ### ✨ Better & More Natural Phrases
    For each suggestion, use a bullet point (*). Suggest more natural phrases. Explain why they are better. Use **bold** for the suggested phrase.

    Your response must be ONLY the feedback, formatted clearly.`;
    const conversationText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Analyze this transcript:\n\n${conversationText}` }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) });
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return valid feedback.");
    } catch (error) { console.error("Error in getFeedbackForConversation:", error); throw error; }
}

/**
 * Traduz um texto para Português do Brasil. (NOVA FUNÇÃO)
 * @param {string} textToTranslate O texto a ser traduzido.
 * @param {string} apiKey A chave de API do usuário.
 * @returns {Promise<string>} O texto traduzido.
 */
async function translateText(textToTranslate, apiKey) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const systemPrompt = `You are an expert translator. Translate the following English text to Brazilian Portuguese. Do not add any commentary, notes, or explanations. Provide only the direct translation of the text.`;
    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: textToTranslate }];
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages, model: 'llama-3.3-70b-versatile' }) }); // Modelo mais rápido para tradução simples
        if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.error.message}`); }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        else throw new Error("The API did not return a valid translation.");
    } catch (error) { console.error("Error in translateText:", error); throw error; }
}