document.addEventListener('DOMContentLoaded', () => {

    // --- Mapeamento de Elementos ---
    const chatWindow = document.getElementById('chat-window');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const proficiencySelect = document.getElementById('proficiency-select');
    const correctionSelect = document.getElementById('correction-select');
    const languageSelect = document.getElementById('language-select');
    const suggestedScenariosList = document.getElementById('suggested-scenarios-list');
    const customScenarioInput = document.getElementById('custom-scenario-input');
    const startCustomScenarioBtn = document.getElementById('start-custom-scenario-btn');
    
    // Elementos do Modal de Feedback
    const feedbackModal = document.getElementById('feedback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const feedbackContent = document.getElementById('feedback-content');
    const translateBtn = document.getElementById('translate-btn');

    // Elementos do Modal de Chave de API
    const apiKeyModal = document.getElementById('api-key-modal');
    const modalApiKeyInput = document.getElementById('modal-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const changeApiKeyBtn = document.getElementById('change-api-key-btn');

    // Elementos do Modal de Histórico (NOVO)
    const historyModal = document.getElementById('history-modal');
    const historyModalTitle = document.getElementById('history-modal-title');
    const historyModalContent = document.getElementById('history-modal-content');
    const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
    const historyList = document.getElementById('history-list');

    // Elementos do Menu Mobile
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const overlay = document.getElementById('overlay');

    // --- Banco de Dados de Cenários ---
    const SCENARIOS = { "Pedindo um café": { "en-US": { name: "Ordering a coffee", goal: "Order one black coffee and one croissant to go." }}, "Check-in no hotel": { "en-US": { name: "Checking into a hotel", goal: "Check into the hotel with a reservation under the name 'Alex Smith' for two nights." }}, "Comprando um ingresso de trem": { "en-US": { name: "Buying a train ticket", goal: "Buy one adult round-trip ticket to Grand Central Station for tomorrow." }} };

    // --- Variáveis de Estado ---
    let conversationHistory = [];
    let currentScenario = null;
    let originalFeedback = '';
    let translatedFeedback = '';
    let isTranslated = false;

    // --- Funções de Gerenciamento da API Key ---
    const getApiKey = () => localStorage.getItem('groqApiKey');

    function openApiKeyModal(isPersistent = false) {
        if (isPersistent) {
            apiKeyModal.classList.add('modal-persistent');
        } else {
            apiKeyModal.classList.remove('modal-persistent');
        }
        apiKeyModal.classList.remove('modal-hidden');
    }

    const closeApiKeyModal = () => apiKeyModal.classList.add('modal-hidden');

    function saveApiKey() {
        const key = modalApiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('groqApiKey', key);
            closeApiKeyModal();
            if (!currentScenario) {
                 displayMessage("Chave de API salva! Agora selecione um cenário para começar.", 'system');
            }
        } else {
            alert("Por favor, insira uma chave de API válida.");
        }
    }
    
    // --- Funções de Histórico (NOVO) ---
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        historyList.innerHTML = ''; // Limpa a lista atual
        if (history.length === 0) {
            historyList.innerHTML = '<li><small>Nenhum diálogo no histórico.</small></li>';
            return;
        }

        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const viewButton = document.createElement('div');
            viewButton.className = 'history-item-view';
            viewButton.innerHTML = `<span>${item.scenarioName}</span><small>${new Date(item.timestamp).toLocaleString()}</small>`;
            viewButton.dataset.index = index;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'history-item-delete';
            deleteButton.innerHTML = '&times;';
            deleteButton.title = 'Excluir este item';
            deleteButton.dataset.index = index;
            
            li.appendChild(viewButton);
            li.appendChild(deleteButton);
            historyList.appendChild(li);
        });
    }

    function showHistoryModal(index) {
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        const item = history[index];
        if (!item) return;

        historyModalTitle.textContent = item.scenarioName;
        historyModalContent.innerHTML = ''; // Limpa conteúdo anterior

        item.transcript.forEach(msg => {
            const el = document.createElement('div');
            el.classList.add('message', `${msg.role}-message`);
            const p = document.createElement('p');
            p.textContent = msg.content;
            el.appendChild(p);
            historyModalContent.appendChild(el);
        });
        
        historyModal.classList.remove('modal-hidden');
    }

    function deleteHistoryItem(index) {
        if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) {
            return;
        }
        let history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        history.splice(index, 1);
        localStorage.setItem('conversationHistory', JSON.stringify(history));
        loadHistory(); // Atualiza a lista na UI
    }

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleSendMessage);
    textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });
    suggestedScenariosList.addEventListener('click', (e) => { if (e.target.tagName === 'LI') { const key = e.target.textContent, lang = languageSelect.value, scenario = SCENARIOS[key]?.[lang]; if (scenario) startNewConversation(scenario, e.target); else alert(`Cenário não disponível.`); } });
    startCustomScenarioBtn.addEventListener('click', () => { const goal = customScenarioInput.value.trim(); if (goal) startNewConversation({ name: "Cenário Personalizado", goal }); });
    
    // Listeners dos Modais
    modalCloseBtn.addEventListener('click', () => feedbackModal.classList.add('modal-hidden'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.add('modal-hidden'); });
    translateBtn.addEventListener('click', handleTranslateFeedback);
    historyModalCloseBtn.addEventListener('click', () => historyModal.classList.add('modal-hidden'));
    historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.classList.add('modal-hidden'); });

    // Listener de delegação para o histórico (NOVO)
    historyList.addEventListener('click', (e) => {
        const viewTarget = e.target.closest('.history-item-view');
        const deleteTarget = e.target.closest('.history-item-delete');

        if (viewTarget) {
            showHistoryModal(viewTarget.dataset.index);
        } else if (deleteTarget) {
            deleteHistoryItem(deleteTarget.dataset.index);
        }
    });

    // Listeners do Modal de API Key
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    changeApiKeyBtn.addEventListener('click', () => openApiKeyModal(false));
    apiKeyModal.addEventListener('click', (e) => { if (!apiKeyModal.classList.contains('modal-persistent') && e.target === apiKeyModal) closeApiKeyModal(); });
    
    // Listeners do Menu Mobile
    menuToggleBtn.addEventListener('click', openSidebar);
    closeMenuBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => header.parentElement.classList.toggle('collapsed'));
    });

    // --- Funções de Lógica Principal ---
    async function startNewConversation(scenario, element = null) {
        const apiKey = getApiKey();
        if (!apiKey) {
            openApiKeyModal(true);
            return;
        }

        closeSidebar();
        currentScenario = scenario;
        chatWindow.innerHTML = '';
        conversationHistory = [];
        updateActiveScenario(element);
        displayMessage(`🎯 Seu Objetivo: ${scenario.goal}`, 'system');
        
        setLoadingState(true, true);
        try {
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value, correction: correctionSelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, currentScenario, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            displayMessage(aiResponse, 'ai');
        } catch (error) { displayMessage(`Erro: ${error.message}`, 'ai'); } finally { setLoadingState(false, true, false); /* MODIFICADO */ }
    }

    async function handleSendMessage() {
        const apiKey = getApiKey();
        if (!apiKey) {
            openApiKeyModal(true);
            return;
        }
        if (!currentScenario) { displayMessage("Por favor, selecione um cenário.", 'ai'); return; }

        const messageText = textInput.value.trim();
        if (!messageText) return;
        
        displayMessage(messageText, 'user');
        conversationHistory.push({ role: 'user', content: messageText });
        textInput.value = '';
        setLoadingState(true);
        try {
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value, correction: correctionSelect.value };
            const aiResponse = await getAIResponse(messageText, conversationHistory, apiKey, currentScenario, settings);
            
            if (aiResponse.includes("[Scenario Complete]")) {
                const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim();
                conversationHistory.push({ role: 'assistant', content: cleanResponse });
                if (cleanResponse) displayMessage(cleanResponse, 'ai');
                
                // Salvar no Histórico (NOVO)
                const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
                history.unshift({
                    scenarioName: currentScenario.name,
                    scenarioGoal: currentScenario.goal,
                    timestamp: new Date().getTime(),
                    transcript: conversationHistory
                });
                localStorage.setItem('conversationHistory', JSON.stringify(history));
                loadHistory(); // Atualiza a lista na UI

                displayCompletionScreen();
                setLoadingState(false, false);
            } else {
                conversationHistory.push({ role: 'assistant', content: aiResponse });
                displayMessage(aiResponse, 'ai');
                setLoadingState(false, true);

            }
        } catch (error) { displayMessage(`Erro: ${error.message}`, 'ai'); setLoadingState(false, true); }
    }

    // --- Funções de Feedback e Modal ---
    function displayCompletionScreen() {
        const congrats = document.createElement('div');
        congrats.className = 'message system-message';
        congrats.innerHTML = `<p>🎉 Parabéns! Você completou o cenário.</p>`;
        const feedbackButton = document.createElement('button');
        feedbackButton.id = 'feedback-btn';
        feedbackButton.textContent = 'Ver Feedback do seu Desempenho';
        feedbackButton.addEventListener('click', handleGetFeedback);
        chatWindow.appendChild(congrats);
        chatWindow.appendChild(feedbackButton);
        scrollToBottom();
    }
    
    async function handleGetFeedback() {
        feedbackModal.classList.remove('modal-hidden');
        feedbackContent.innerHTML = '<p>Analisando sua conversa, por favor, aguarde...</p>';
        translateBtn.classList.add('translate-btn-hidden');
        try {
            const apiKey = getApiKey();
            if (!apiKey) throw new Error("Chave de API não encontrada. Configure no menu.");
            originalFeedback = await getFeedbackForConversation(conversationHistory, apiKey);
            displayFormattedFeedback(originalFeedback);
            translateBtn.classList.remove('translate-btn-hidden');
            isTranslated = false;
            translateBtn.textContent = 'Traduzir para Português';
        } catch (error) { feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}</p>`; }
    }

    async function handleTranslateFeedback() {
        translateBtn.disabled = true;
        if (isTranslated) {
            displayFormattedFeedback(originalFeedback);
            isTranslated = false;
            translateBtn.textContent = 'Traduzir para Português';
        } else {
            feedbackContent.innerHTML = '<p>Traduzindo, por favor, aguarde...</p>';
            try {
                if (!translatedFeedback) {
                    const apiKey = getApiKey();
                    if (!apiKey) throw new Error("Chave de API não encontrada.");
                    const protectedSnippets = [];
                    const textToTranslate = originalFeedback.replace(/\*\*(.*?)\*\*/g, (match) => {
                        protectedSnippets.push(match);
                        return `%%PROTECTED_${protectedSnippets.length - 1}%%`;
                    });
                    const translatedTextWithPlaceholders = await translateText(textToTranslate, apiKey);
                    let finalTranslatedText = translatedTextWithPlaceholders;
                    protectedSnippets.forEach((snippet, index) => { finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet); });
                    translatedFeedback = finalTranslatedText;
                }
                displayFormattedFeedback(translatedFeedback);
                isTranslated = true;
                translateBtn.textContent = 'Mostrar Original (English)';
            } catch (error) { feedbackContent.innerHTML = `<p>Erro ao traduzir: ${error.message}</p>`; }
        }
        translateBtn.disabled = false;
    }

    function displayFormattedFeedback(text) {
        const formatted = text.replace(/### (.*)/g, '<h3>$1</h3>').replace(/\*\s(.*?)(?=\n\*|\n\n| $)/g, '<p class="feedback-item">$1</p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        feedbackContent.innerHTML = formatted;
    }

    // --- Funções de Controle da UI (Menu Mobile) ---
    function openSidebar() { sidebar.classList.add('sidebar-open'); overlay.classList.remove('overlay-hidden'); }
    function closeSidebar() { sidebar.classList.remove('sidebar-open'); overlay.classList.add('overlay-hidden'); }

    // --- Funções Auxiliares ---
    function updateActiveScenario(el) { document.querySelectorAll('#suggested-scenarios-list li').forEach(li => li.classList.remove('active-scenario')); if (el) el.classList.add('active-scenario'); }
    function displayMessage(text, sender) { const el = document.createElement('div'); el.classList.add('message', `${sender}-message`); const p = document.createElement('p'); p.textContent = text; el.appendChild(p); chatWindow.appendChild(el); scrollToBottom(); }
    function scrollToBottom() { chatWindow.scrollTop = chatWindow.scrollHeight; }
    
    // MODIFICADO para não focar no input ao iniciar cenário
    function setLoadingState(isLoading, isInputEnabled = false, shouldFocus = true) {
        textInput.disabled = isLoading || !isInputEnabled;
        sendBtn.disabled = isLoading || !isInputEnabled;
        if (isLoading) {
            showTypingIndicator();
        } else {
            removeTypingIndicator();
            if (isInputEnabled && shouldFocus) {
                textInput.focus();
            }
        }
    }
    
    function showTypingIndicator() { if (!document.getElementById('typing-indicator')) { const el = document.createElement('div'); el.id = 'typing-indicator'; el.classList.add('message', 'ai-message'); el.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>'; chatWindow.appendChild(el); scrollToBottom(); } }
    function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

    // --- Inicialização da Aplicação ---
    function initializeApp() {
        if (!getApiKey()) {
            openApiKeyModal(true);
        }
        loadHistory(); // Carrega o histórico ao iniciar
    }

    initializeApp();
});