document.addEventListener('DOMContentLoaded', () => {

    // --- Mapeamento de Elementos ---
    const chatWindow = document.getElementById('chat-window');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const chatInputArea = document.querySelector('.chat-input-area');
    const proficiencySelect = document.getElementById('proficiency-select');
    const correctionSelect = document.getElementById('correction-select');
    const languageSelect = document.getElementById('language-select');
    const suggestedScenariosList = document.getElementById('suggested-scenarios-list');
    const customScenarioInput = document.getElementById('custom-scenario-input');
    const startCustomScenarioBtn = document.getElementById('start-custom-scenario-btn');
    const mainTitleMobile = document.querySelector('.chat-header h1');
    const mainTitleDesktop = document.querySelector('.sidebar-header h1');
    
    // Modais
    const feedbackModal = document.getElementById('feedback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const feedbackContent = document.getElementById('feedback-content');
    const translateBtn = document.getElementById('translate-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const modalApiKeyInput = document.getElementById('modal-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const changeApiKeyBtn = document.getElementById('change-api-key-btn');
    const historyModal = document.getElementById('history-modal');
    const historyModalTitle = document.getElementById('history-modal-title');
    const historyModalContent = document.getElementById('history-modal-content');
    const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
    const historyList = document.getElementById('history-list');
    const missionModal = document.getElementById('mission-modal');
    const missionGoalText = document.getElementById('mission-goal-text');
    const startMissionBtn = document.getElementById('start-mission-btn');
    const missionModalCloseBtn = document.getElementById('mission-modal-close-btn');
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
    
    // NOVO: Mapeia o botão de configurações do desktop que será criado
    const openSettingsBtnDesktop = document.getElementById('open-settings-btn-desktop');

    // Menu Mobile
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const overlay = document.getElementById('overlay');

    // --- Variáveis de Estado ---
    let conversationHistory = [];
    let currentScenario = null;
    let originalFeedback = '';
    let translatedFeedback = '';
    let isTranslated = false;

    // --- Funções de Gerenciamento da API Key ---
    const getApiKey = () => localStorage.getItem('groqApiKey');
    function openApiKeyModal(isPersistent = false) { if (isPersistent) { apiKeyModal.classList.add('modal-persistent'); } else { apiKeyModal.classList.remove('modal-persistent'); } apiKeyModal.classList.remove('modal-hidden'); }
    const closeApiKeyModal = () => apiKeyModal.classList.add('modal-hidden');
    
    // CORRIGIDO: Chama renderScenarioPanel() após salvar a chave pela 1ª vez
    function saveApiKey() { 
        const key = modalApiKeyInput.value.trim(); 
        if (key) { 
            localStorage.setItem('groqApiKey', key); 
            closeApiKeyModal(); 
            // Se for a primeira vez, carrega o painel de cenários
            if (!currentScenario && !chatWindow.querySelector('.scenario-panel')) {
                renderScenarioPanel();
            }
        } else { 
            alert("Por favor, insira uma chave de API válida."); 
        } 
    }
    
    // --- Funções de Histórico ---
    function loadHistory() { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; historyList.innerHTML = ''; if (history.length === 0) { historyList.innerHTML = '<li><small>Nenhum diálogo no histórico.</small></li>'; return; } history.forEach((item, index) => { const li = document.createElement('li'); li.className = 'history-item'; const viewButton = document.createElement('div'); viewButton.className = 'history-item-view'; viewButton.innerHTML = `<span>${item.scenarioName}</span><small>${new Date(item.timestamp).toLocaleString()}</small>`; viewButton.dataset.index = index; const deleteButton = document.createElement('button'); deleteButton.className = 'history-item-delete'; deleteButton.innerHTML = '&times;'; deleteButton.title = 'Excluir este item'; deleteButton.dataset.index = index; li.appendChild(viewButton); li.appendChild(deleteButton); historyList.appendChild(li); }); }
    function showHistoryModal(index) { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; const item = history[index]; if (!item) return; historyModalTitle.textContent = item.scenarioName; historyModalContent.innerHTML = ''; item.transcript.forEach(msg => { const el = document.createElement('div'); el.classList.add('message', `${msg.role}-message`); const p = document.createElement('p'); p.textContent = msg.content; el.appendChild(p); historyModalContent.appendChild(el); }); if (item.feedback) { const separator = document.createElement('hr'); separator.className = 'history-feedback-separator'; const feedbackTitle = document.createElement('h3'); feedbackTitle.className = 'history-feedback-title'; feedbackTitle.textContent = 'Análise de Desempenho Salva'; const feedbackContainer = document.createElement('div'); feedbackContainer.className = 'history-feedback-content'; feedbackContainer.innerHTML = formatFeedbackText(item.feedback); historyModalContent.appendChild(separator); historyModalContent.appendChild(feedbackTitle); historyModalContent.appendChild(feedbackContainer); } historyModal.classList.remove('modal-hidden'); }
    function deleteHistoryItem(index) { if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) { return; } let history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.splice(index, 1); localStorage.setItem('conversationHistory', JSON.stringify(history)); loadHistory(); }

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleSendMessage);
    textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });
    
    suggestedScenariosList.addEventListener('click', (e) => {
        const scenarioItem = e.target.closest('li');
        const categoryHeader = e.target.closest('.category-header');
        if (scenarioItem) {
            const scenarioName = scenarioItem.dataset.scenarioName;
            const categoryName = scenarioItem.dataset.categoryName;
            const lang = languageSelect.value;
            const scenario = SCENARIOS[categoryName]?.[scenarioName]?.[lang];
            if (scenario) { startNewConversation(scenario, scenarioItem); } else { alert(`Cenário não disponível.`); }
        } else if (categoryHeader) {
            const categoryGroup = categoryHeader.parentElement;
            categoryGroup.classList.toggle('collapsed');
        }
    });

    startCustomScenarioBtn.addEventListener('click', () => { const goal = customScenarioInput.value.trim(); if (goal) startNewConversation({ name: "Cenário Personalizado", goal }); });
    
    chatWindow.addEventListener('click', (e) => {
        const scenarioCard = e.target.closest('.scenario-card');
        if (scenarioCard) {
            const scenarioName = scenarioCard.dataset.scenarioName;
            const categoryName = scenarioCard.dataset.categoryName;
            const lang = languageSelect.value;
            const scenario = SCENARIOS[categoryName]?.[scenarioName]?.[lang];
            const sidebarLi = document.querySelector(`#suggested-scenarios-list li[data-scenario-name="${scenarioName}"]`);
            if (scenario) { startNewConversation(scenario, sidebarLi); }
        }
    });

    if(mainTitleMobile) mainTitleMobile.addEventListener('click', returnToHomePanel);
    if(mainTitleDesktop) mainTitleDesktop.addEventListener('click', returnToHomePanel);

    modalCloseBtn.addEventListener('click', () => feedbackModal.classList.add('modal-hidden'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.add('modal-hidden'); });
    translateBtn.addEventListener('click', handleTranslateFeedback);
    historyModalCloseBtn.addEventListener('click', () => historyModal.classList.add('modal-hidden'));
    historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.classList.add('modal-hidden'); });
    startMissionBtn.addEventListener('click', () => { missionModal.classList.add('modal-hidden'); initiateChat(); });
    missionModalCloseBtn.addEventListener('click', () => missionModal.classList.add('modal-hidden'));
    missionModal.addEventListener('click', (e) => { if(e.target === missionModal) missionModal.classList.add('modal-hidden'); });
    
    openSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    // NOVO: Adiciona listener para o botão de configurações do desktop
    if(openSettingsBtnDesktop) openSettingsBtnDesktop.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));

    settingsModalCloseBtn.addEventListener('click', () => settingsModal.classList.add('modal-hidden'));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('modal-hidden'); });
    historyList.addEventListener('click', (e) => { const viewTarget = e.target.closest('.history-item-view'); const deleteTarget = e.target.closest('.history-item-delete'); if (viewTarget) showHistoryModal(viewTarget.dataset.index); else if (deleteTarget) deleteHistoryItem(deleteTarget.dataset.index); });
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    changeApiKeyBtn.addEventListener('click', () => { settingsModal.classList.add('modal-hidden'); openApiKeyModal(false); });
    apiKeyModal.addEventListener('click', (e) => { if (!apiKeyModal.classList.contains('modal-persistent') && e.target === apiKeyModal) closeApiKeyModal(); });
    menuToggleBtn.addEventListener('click', openSidebar);
    closeMenuBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // CORRIGIDO: Reintroduz o listener para as seções principais (Cenários e Histórico)
    document.querySelectorAll('.sidebar-section.collapsible .section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('collapsed');
        });
    });

    // --- Funções de Lógica Principal ---
    function startNewConversation(scenario, element = null) { const apiKey = getApiKey(); if (!apiKey) { openApiKeyModal(true); return; } currentScenario = { details: scenario, triggerElement: element }; missionGoalText.textContent = scenario.goal; missionModal.classList.remove('modal-hidden'); }
    async function initiateChat() { 
        if (!currentScenario) return; 
        const { details, triggerElement } = currentScenario; 
        closeSidebar(); 
        chatWindow.innerHTML = ''; 
        conversationHistory = []; 
        updateActiveScenario(triggerElement); 
        displayMessage(`🎯 Seu Objetivo: ${details.goal}`, 'system'); 
        chatInputArea.classList.remove('chat-input-hidden'); // MOSTRA a área de input
        setLoadingState(true, true, false); 
        try { 
            const apiKey = getApiKey(); 
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value, correction: correctionSelect.value }; 
            const aiResponse = await getAIResponse(null, [], apiKey, details, settings); 
            conversationHistory.push({ role: 'assistant', content: aiResponse }); 
            displayMessage(aiResponse, 'ai'); 
        } catch (error) { 
            displayMessage(`Erro ao iniciar o cenário: ${error.message}`, 'ai'); 
        } finally { 
            setLoadingState(false, true, true); 
        } 
    }
    async function handleSendMessage() { const apiKey = getApiKey(); if (!apiKey) { openApiKeyModal(true); return; } if (!currentScenario) { displayMessage("Por favor, selecione um cenário.", 'ai'); return; } const messageText = textInput.value.trim(); if (!messageText) return; displayMessage(messageText, 'user'); conversationHistory.push({ role: 'user', content: messageText }); textInput.value = ''; setLoadingState(true); try { const settings = { language: languageSelect.value, proficiency: proficiencySelect.value, correction: correctionSelect.value }; const aiResponse = await getAIResponse(messageText, conversationHistory, apiKey, currentScenario.details, settings); if (aiResponse.includes("[Scenario Complete]")) { const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim(); if (cleanResponse) displayMessage(cleanResponse, 'ai'); conversationHistory.push({ role: 'assistant', content: cleanResponse }); let finalScenarioName = currentScenario.details.name; if (currentScenario.details.name === "Cenário Personalizado") { try { finalScenarioName = await getScenarioTitle(currentScenario.details.goal, apiKey, languageSelect.value); } catch (error) { console.error("Não foi possível gerar o título customizado, usando o padrão.", error); finalScenarioName = "Custom Scenario"; } } const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.unshift({ scenarioName: finalScenarioName, scenarioGoal: currentScenario.details.goal, timestamp: new Date().getTime(), transcript: conversationHistory, feedback: '' }); localStorage.setItem('conversationHistory', JSON.stringify(history)); loadHistory(); displayCompletionScreen(); setLoadingState(false, false); } else { conversationHistory.push({ role: 'assistant', content: aiResponse }); displayMessage(aiResponse, 'ai'); setLoadingState(false, true); } } catch (error) { displayMessage(`Erro: ${error.message}`, 'ai'); setLoadingState(false, true); } }
    
    // --- Funções de Feedback e Modal ---
    function displayCompletionScreen() { const congrats = document.createElement('div'); congrats.className = 'message system-message'; congrats.innerHTML = `<p>🎉 Parabéns! Você completou o cenário.</p>`; const feedbackButton = document.createElement('button'); feedbackButton.id = 'feedback-btn'; feedbackButton.textContent = 'Ver Feedback do seu Desempenho'; feedbackButton.addEventListener('click', handleGetFeedback); chatWindow.appendChild(congrats); chatWindow.appendChild(feedbackButton); scrollToBottom(); }
    async function handleGetFeedback() { feedbackModal.classList.remove('modal-hidden'); feedbackContent.innerHTML = '<p>Analisando sua conversa, por favor, aguarde...</p>'; translateBtn.classList.add('translate-btn-hidden'); try { const apiKey = getApiKey(); if (!apiKey) throw new Error("Chave de API não encontrada. Configure no menu."); originalFeedback = await getFeedbackForConversation(conversationHistory, apiKey, languageSelect.value); const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; if (history.length > 0 && !history[0].feedback) { history[0].feedback = originalFeedback; localStorage.setItem('conversationHistory', JSON.stringify(history)); } displayFormattedFeedback(originalFeedback); translateBtn.classList.remove('translate-btn-hidden'); isTranslated = false; translateBtn.textContent = 'Traduzir para Português'; } catch (error) { feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}</p>`; } }
    async function handleTranslateFeedback() { translateBtn.disabled = true; if (isTranslated) { displayFormattedFeedback(originalFeedback); isTranslated = false; translateBtn.textContent = 'Traduzir para Português'; } else { feedbackContent.innerHTML = '<p>Traduzindo, por favor, aguarde...</p>'; try { if (!translatedFeedback) { const apiKey = getApiKey(); if (!apiKey) throw new Error("Chave de API não encontrada."); const protectedSnippets = []; const textToTranslate = originalFeedback.replace(/\*\*(.*?)\*\*/g, (match) => { protectedSnippets.push(match); return `%%PROTECTED_${protectedSnippets.length - 1}%%`; }); const translatedTextWithPlaceholders = await translateText(textToTranslate, apiKey, languageSelect.value); let finalTranslatedText = translatedTextWithPlaceholders; protectedSnippets.forEach((snippet, index) => { finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet); }); translatedFeedback = finalTranslatedText; } displayFormattedFeedback(translatedFeedback); isTranslated = true; translateBtn.textContent = 'Mostrar Original (English)'; } catch (error) { feedbackContent.innerHTML = `<p>Erro ao traduzir: ${error.message}</p>`; } } translateBtn.disabled = false; }
    function formatFeedbackText(text) { return text.replace(/### (.*)/g, '<h3>$1</h3>').replace(/^\*\s(.*?)$/gm, '<p class="feedback-item">$1</p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
    function displayFormattedFeedback(text) { feedbackContent.innerHTML = formatFeedbackText(text); }
    
    // --- Funções de Controle da UI ---
    function openSidebar() { sidebar.classList.add('sidebar-open'); overlay.classList.remove('overlay-hidden'); }
    function closeSidebar() { sidebar.classList.remove('sidebar-open'); overlay.classList.add('overlay-hidden'); }

    // ===== FUNÇÃO MODIFICADA =====
    function renderScenarioPanel() {
        chatWindow.innerHTML = '';
        const panelContainer = document.createElement('div');
        panelContainer.className = 'scenario-panel';

        // Mapeamento de nomes de categoria para classes CSS
        const categoryClassMap = {
            "🍔 Restaurantes e Cafés": "category-restaurantes",
            "✈️ Viagens e Transporte": "category-viagens",
            "🛒 Compras": "category-compras",
            "🤝 Situações Sociais": "category-sociais",
            "💼 Profissional": "category-profissional"
        };

        Object.keys(SCENARIOS).forEach(categoryName => {
            const categorySection = document.createElement('section');
            categorySection.className = 'panel-category-section';

            // Adiciona a classe específica da categoria
            const themeClass = categoryClassMap[categoryName];
            if (themeClass) {
                categorySection.classList.add(themeClass);
            }

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'panel-category-title';
            categoryTitle.textContent = categoryName;
            categorySection.appendChild(categoryTitle);

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'scenario-cards-container';
            Object.keys(SCENARIOS[categoryName]).forEach(scenarioName => {
                const card = document.createElement('button');
                card.className = 'scenario-card';
                card.textContent = scenarioName;
                card.dataset.categoryName = categoryName;
                card.dataset.scenarioName = scenarioName;
                cardsContainer.appendChild(card);
            });

            categorySection.appendChild(cardsContainer);
            panelContainer.appendChild(categorySection);
        });
        chatWindow.appendChild(panelContainer);
    }

    function returnToHomePanel() { 
        currentScenario = null; 
        updateActiveScenario(null); 
        renderScenarioPanel(); 
        closeSidebar(); 
        chatInputArea.classList.add('chat-input-hidden'); // ESCONDE a área de input
    }

    // --- Funções Auxiliares ---
    function populateSuggestedScenarios() { if (typeof SCENARIOS === 'undefined') { console.error("Objeto de cenários não encontrado!"); return; } suggestedScenariosList.innerHTML = ''; Object.keys(SCENARIOS).forEach(categoryName => { const categoryGroup = document.createElement('div'); categoryGroup.className = 'category-group collapsible collapsed'; categoryGroup.dataset.category = categoryName; const categoryHeader = document.createElement('h3'); categoryHeader.className = 'category-header'; categoryHeader.innerHTML = `${categoryName} <span class="toggle-icon">▼</span>`; const scenarioItems = document.createElement('ul'); scenarioItems.className = 'scenario-items'; Object.keys(SCENARIOS[categoryName]).forEach(scenarioName => { const li = document.createElement('li'); li.textContent = scenarioName; li.dataset.categoryName = categoryName; li.dataset.scenarioName = scenarioName; scenarioItems.appendChild(li); }); categoryGroup.appendChild(categoryHeader); categoryGroup.appendChild(scenarioItems); suggestedScenariosList.appendChild(categoryGroup); }); }
    function updateActiveScenario(el) { document.querySelectorAll('#suggested-scenarios-list li').forEach(li => li.classList.remove('active-scenario')); if (el) el.classList.add('active-scenario'); }
    function displayMessage(text, sender) { const el = document.createElement('div'); el.classList.add('message', `${sender}-message`); const p = document.createElement('p'); p.textContent = text; el.appendChild(p); chatWindow.appendChild(el); scrollToBottom(); }
    function scrollToBottom() { chatWindow.scrollTop = chatWindow.scrollHeight; }
    function setLoadingState(isLoading, isInputEnabled = false, shouldFocus = true) { textInput.disabled = isLoading || !isInputEnabled; sendBtn.disabled = isLoading || !isInputEnabled; if (isLoading) { showTypingIndicator(); } else { removeTypingIndicator(); if (isInputEnabled && shouldFocus) { textInput.focus(); } } }
    function showTypingIndicator() { if (!document.getElementById('typing-indicator')) { const el = document.createElement('div'); el.id = 'typing-indicator'; el.classList.add('message', 'ai-message'); el.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>'; chatWindow.appendChild(el); scrollToBottom(); } }
    function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

    // --- Inicialização da Aplicação ---
    function initializeApp() {
        populateSuggestedScenarios();
        if (!getApiKey()) {
            openApiKeyModal(true);
        } else {
            renderScenarioPanel();
        }
        loadHistory();
    }

    initializeApp();
});