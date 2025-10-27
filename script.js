// CÓDIGO ATUALIZADO PARA script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mapeamento de Elementos ---
    const mainContentArea = document.getElementById('main-content-area');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const chatInputArea = document.querySelector('.chat-input-area');
    const proficiencySelect = document.getElementById('proficiency-select');
    const languageSelect = document.getElementById('language-select');
    const bottomNavBar = document.getElementById('bottom-nav-bar');
    const navHomeBtn = document.getElementById('nav-home-btn');
    const navCustomBtn = document.getElementById('nav-custom-btn');
    const navHistoryBtn = document.getElementById('nav-history-btn');
    const navSettingsBtn = document.getElementById('nav-settings-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const feedbackContent = document.getElementById('feedback-content');
    const translateBtn = document.getElementById('translate-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const modalGoogleApiKeyInput = document.getElementById('modal-google-api-key-input');
    const modalElevenLabsApiKeyInput = document.getElementById('modal-elevenlabs-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const changeApiKeyBtn = document.getElementById('change-api-key-btn');
    const historyModal = document.getElementById('history-modal');
    const historyModalTitle = document.getElementById('history-modal-title');
    const historyModalContent = document.getElementById('history-modal-content');
    const historyModalCloseBtn = document.getElementById('history-modal-close-btn');
    const missionModal = document.getElementById('mission-modal');
    const missionGoalText = document.getElementById('mission-goal-text');
    const missionModalCloseBtn = document.getElementById('mission-modal-close-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
    const micBtn = document.getElementById('mic-btn');
    const startTextMissionBtn = document.getElementById('start-text-mission-btn');
    const startVoiceMissionBtn = document.getElementById('start-voice-mission-btn');
    
    // Mapeamento do cabeçalho global e seus componentes
    const contextBar = document.getElementById('context-bar');
    const langIndicatorBtn = document.getElementById('lang-indicator-btn');
    const proficiencyIndicatorBtn = document.getElementById('proficiency-indicator-btn');
    const exitChatBtn = document.getElementById('exit-chat-btn');
    const scoreIndicator = document.getElementById('score-indicator');
    const headerBackBtn = document.getElementById('header-back-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn'); // NOVO: Mapeamento do botão de tela cheia


    // --- Variáveis de Estado e Constantes ---
    const AVATAR_AI_URL = 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png';
    const AVATAR_USER_URL = 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    const TYPING_SIMULATION_DELAY = 1000;

    let conversationHistory = [];
    let currentScenario = null;
    let originalFeedback = '';
    let translatedFeedback = '';
    let isTranslated = false;
    
    let currentInteractionMode = null; // 'text' ou 'voice'
    let conversationState = 'IDLE';    // 'IDLE', 'AI_SPEAKING', 'USER_LISTENING', 'PROCESSING'
    let isConversationActive = false; 
    const synthesis = window.speechSynthesis;
    let voices = [];
    let currentAudioPlayer = null;

    let mediaRecorder; 
    let audioChunks = []; 

    // --- Funções de Inicialização da API de Voz ---
    function initializeSpeechAPI() {
        function populateVoiceList() {
            if (synthesis.getVoices().length > 0) {
                voices = synthesis.getVoices();
            }
        }
        populateVoiceList();
        if (synthesis.onvoiceschanged !== undefined) {
            synthesis.onvoiceschanged = populateVoiceList;
        }
    }

    // --- Funções de Gerenciamento da API Key ---
    const getGoogleApiKey = () => localStorage.getItem('googleApiKey');
    const getElevenLabsApiKey = () => localStorage.getItem('elevenLabsApiKey');
    function openApiKeyModal(isPersistent = false) { if (isPersistent) { apiKeyModal.classList.add('modal-persistent'); } else { apiKeyModal.classList.remove('modal-persistent'); } apiKeyModal.classList.remove('modal-hidden'); }
    const closeApiKeyModal = () => apiKeyModal.classList.add('modal-hidden');
    function saveApiKey() { 
        const googleKey = modalGoogleApiKeyInput.value.trim(); 
        const elevenLabsKey = modalElevenLabsApiKeyInput.value.trim();
        if (googleKey && elevenLabsKey) { 
            localStorage.setItem('googleApiKey', googleKey); 
            localStorage.setItem('elevenLabsApiKey', elevenLabsKey);
            closeApiKeyModal(); 
            initializeApp();
        } else { 
            alert("Por favor, insira as duas chaves de API para continuar."); 
        } 
    }
    
    // --- Funções de Gerenciamento de Configurações e Cabeçalho ---
    function loadSettings() {
        const savedLanguage = localStorage.getItem('language');
        const savedProficiency = localStorage.getItem('proficiency');
        if (savedLanguage) languageSelect.value = savedLanguage;
        if (savedProficiency) proficiencySelect.value = savedProficiency;
    }

    function updateHeaderIndicators() {
        const langMap = { "en-US": "🇺🇸" };
        const currentLang = languageSelect.value;
        langIndicatorBtn.innerHTML = langMap[currentLang] || '🌐';

        const profMap = {
            basic: '★<span class="star-off">★★</span>',
            intermediate: '★★<span class="star-off">★</span>',
            advanced: '★★★'
        };
        const currentProf = proficiencySelect.value;
        proficiencyIndicatorBtn.innerHTML = profMap[currentProf] || '★★★';
    }

    // --- Funções do Sistema de Pontuação ---
    function getScore() {
        return parseInt(localStorage.getItem('userScore') || '0', 10);
    }

    function saveScore(newScore) {
        localStorage.setItem('userScore', newScore);
    }

    function addPointsForLevel(level) {
        const pointsMap = {
            basic: 1,
            intermediate: 2,
            advanced: 3
        };
        const pointsToAdd = pointsMap[level] || 0;
        const currentScore = getScore();
        const newScore = currentScore + pointsToAdd;
        saveScore(newScore);
    }
    
    function updateScoreDisplay() {
        scoreIndicator.innerHTML = `🦉 ${getScore()}`;
    }


    // --- Funções de Histórico ---
    function populateHistoryList(listElement) { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; listElement.innerHTML = ''; if (history.length === 0) { listElement.innerHTML = '<li><small>Nenhum diálogo no histórico.</small></li>'; return; } history.forEach((item, index) => { const li = document.createElement('li'); li.className = 'history-item'; const viewButton = document.createElement('div'); viewButton.className = 'history-item-view'; viewButton.innerHTML = `<span>${item.scenarioName}</span><small>${new Date(item.timestamp).toLocaleString()}</small>`; viewButton.dataset.index = index; const deleteButton = document.createElement('button'); deleteButton.className = 'history-item-delete'; deleteButton.innerHTML = '&times;'; deleteButton.title = 'Excluir este item'; deleteButton.dataset.index = index; li.appendChild(viewButton); li.appendChild(deleteButton); listElement.appendChild(li); }); }
    function showHistoryModal(index) { const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; const item = history[index]; if (!item) return; historyModalTitle.textContent = item.scenarioName; historyModalContent.innerHTML = ''; item.transcript.forEach(msg => { const el = document.createElement('div'); el.classList.add('message', `${msg.role}-message`); const p = document.createElement('p'); p.textContent = msg.content; el.appendChild(p); historyModalContent.appendChild(el); }); if (item.feedback) { const separator = document.createElement('hr'); separator.className = 'history-feedback-separator'; const feedbackTitle = document.createElement('h3'); feedbackTitle.className = 'history-feedback-title'; feedbackTitle.textContent = 'Análise de Desempenho Salva'; const feedbackContainer = document.createElement('div'); feedbackContainer.className = 'history-feedback-content'; feedbackContainer.innerHTML = formatFeedbackText(item.feedback); historyModalContent.appendChild(separator); historyModalContent.appendChild(feedbackTitle); historyModalContent.appendChild(feedbackContainer); } historyModal.classList.remove('modal-hidden'); }
    function deleteHistoryItem(index) { if (!confirm('Tem certeza de que deseja excluir este diálogo do seu histórico?')) { return; } let history = JSON.parse(localStorage.getItem('conversationHistory')) || []; history.splice(index, 1); localStorage.setItem('conversationHistory', JSON.stringify(history)); renderHistoryPage(); }

    // --- Event Listeners ---
    navHomeBtn.addEventListener('click', renderHomePage);
    navCustomBtn.addEventListener('click', renderCustomScenarioPage);
    navHistoryBtn.addEventListener('click', renderHistoryPage);
    navSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    sendBtn.addEventListener('click', handleSendMessage);
    textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } });
    micBtn.addEventListener('click', handleMicButtonClick);
    exitChatBtn.addEventListener('click', handleExitChat);
    headerBackBtn.addEventListener('click', renderHomePage);
    
    langIndicatorBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));
    proficiencyIndicatorBtn.addEventListener('click', () => settingsModal.classList.remove('modal-hidden'));

    // NOVO: Listeners para tela cheia
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);

    languageSelect.addEventListener('change', () => {
        localStorage.setItem('language', languageSelect.value);
        updateHeaderIndicators();
    });
    proficiencySelect.addEventListener('change', () => {
        localStorage.setItem('proficiency', proficiencySelect.value);
        updateHeaderIndicators();
    });

    mainContentArea.addEventListener('click', async (e) => {
        const suggestionBtn = e.target.closest('#start-suggestion-btn');
        if (suggestionBtn) {
            const categoryName = suggestionBtn.dataset.categoryName;
            const scenarioName = suggestionBtn.dataset.scenarioName;
            const lang = languageSelect.value;
            const scenario = SCENARIOS[categoryName]?.[scenarioName]?.[lang];
            if (scenario) {
                startNewConversation(scenario);
            }
            return;
        }

        const scenarioCard = e.target.closest('.scenario-card');
        if (scenarioCard) {
            const scenarioName = scenarioCard.dataset.scenarioName;
            const categoryName = scenarioCard.dataset.categoryName;
            const lang = languageSelect.value;
            const scenario = SCENARIOS[categoryName]?.[scenarioName]?.[lang];
            if (scenario) { startNewConversation(scenario); }
            return;
        }
        
        const categoryTitle = e.target.closest('.panel-category-title');
        if (categoryTitle) {
            const section = categoryTitle.closest('.panel-category-section');
            const content = section.querySelector('.collapsible-content');
            const icon = categoryTitle.querySelector('.category-toggle-icon');
            
            if (content) {
                const isExpanded = content.classList.contains('expanded');
                content.classList.toggle('expanded');
                categoryTitle.classList.toggle('expanded');
                
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.textContent = '▾';
                } else {
                    content.style.maxHeight = '0px';
                    if (icon) icon.textContent = '▸';
                }
            }
            return;
        }

        const viewAllBtn = e.target.closest('.view-all-btn');
        if (viewAllBtn) {
            const categoryName = viewAllBtn.dataset.categoryName;
            renderCategoryPage(categoryName);
            return;
        }

        const customBtn = e.target.closest('#start-custom-scenario-btn');
        if (customBtn) {
            const customInput = document.getElementById('custom-scenario-input');
            const goal = customInput.value.trim();
            const apiKey = getGoogleApiKey();
            if (!apiKey) { openApiKeyModal(true); return; }
            if (!goal) {
                showCustomScenarioError("Por favor, descreva o cenário que você quer praticar.");
                return;
            }
            clearCustomScenarioError();
            customBtn.disabled = true;
            customInput.disabled = true;
            customBtn.textContent = 'Validando...';
            try {
                const validation = await validateScenarioGoal(goal, apiKey);
                if (validation.isValid) {
                    startNewConversation({ name: "Cenário Personalizado", goal });
                } else {
                    showCustomScenarioError(validation.reason || "Ocorreu um erro ao validar o cenário.");
                }
            } catch (error) {
                console.error("Validation failed:", error);
                showCustomScenarioError("Não foi possível validar o cenário. Tente novamente.");
            } finally {
                customBtn.disabled = false;
                customInput.disabled = false;
                customBtn.textContent = 'Iniciar Cenário';
            }
            return;
        }
        const viewTarget = e.target.closest('.history-item-view');
        if (viewTarget) {
            showHistoryModal(viewTarget.dataset.index);
            return;
        }
        const deleteTarget = e.target.closest('.history-item-delete');
        if (deleteTarget) {
            deleteHistoryItem(deleteTarget.dataset.index);
            return;
        }
    });

    modalCloseBtn.addEventListener('click', () => feedbackModal.classList.add('modal-hidden'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.add('modal-hidden'); });
    translateBtn.addEventListener('click', handleTranslateFeedback);
    historyModalCloseBtn.addEventListener('click', () => historyModal.classList.add('modal-hidden'));
    historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.classList.add('modal-hidden'); });
    missionModalCloseBtn.addEventListener('click', () => missionModal.classList.add('modal-hidden'));
    missionModal.addEventListener('click', (e) => { if (e.target === missionModal) missionModal.classList.add('modal-hidden'); });
    settingsModalCloseBtn.addEventListener('click', () => settingsModal.classList.add('modal-hidden'));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('modal-hidden'); });
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    changeApiKeyBtn.addEventListener('click', () => { settingsModal.classList.add('modal-hidden'); openApiKeyModal(false); });
    apiKeyModal.addEventListener('click', (e) => { if (!apiKeyModal.classList.contains('modal-persistent') && e.target === apiKeyModal) closeApiKeyModal(); });

    startTextMissionBtn.addEventListener('click', () => {
        currentInteractionMode = 'text';
        missionModal.classList.add('modal-hidden');
        initiateChat();
    });

    startVoiceMissionBtn.addEventListener('click', () => {
        currentInteractionMode = 'voice';
        missionModal.classList.add('modal-hidden');
        initiateVoiceChat();
    });

    // --- Funções de Renderização de "Páginas" ---
    function renderHomePage() {
        updateActiveNavIcon('nav-home-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area';
        chatInputArea.classList.add('chat-input-hidden');
        bottomNavBar.classList.remove('nav-hidden');
        
        // Lógica de visibilidade do cabeçalho
        scoreIndicator.classList.remove('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.add('back-btn-hidden');

        renderHomePageContent();
    }
    function renderCustomScenarioPage() {
        updateActiveNavIcon('nav-custom-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area custom-scenario-page';
        chatInputArea.classList.add('chat-input-hidden');
        bottomNavBar.classList.remove('nav-hidden');

        // Lógica de visibilidade do cabeçalho
        scoreIndicator.classList.remove('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.add('back-btn-hidden');
        
        const customScenarioContainer = document.createElement('div');
        customScenarioContainer.className = 'custom-scenario-container';
        customScenarioContainer.innerHTML = `
            <h2>Cenário Personalizado</h2>
            <p>Descreva uma situação ou objetivo que você gostaria de praticar em inglês.</p>
            <textarea id="custom-scenario-input" rows="6" placeholder="Ex: Pedir o reembolso de um produto com defeito em uma loja de eletrônicos..."></textarea>
            <div id="custom-scenario-feedback" class="custom-scenario-feedback"></div>
            <button id="start-custom-scenario-btn" class="primary-btn">Iniciar Cenário</button>
        `;
        mainContentArea.appendChild(customScenarioContainer);
    }
    function showCustomScenarioError(message) { const feedbackArea = document.getElementById('custom-scenario-feedback'); if (feedbackArea) { feedbackArea.textContent = message; feedbackArea.style.display = 'block'; } }
    function clearCustomScenarioError() { const feedbackArea = document.getElementById('custom-scenario-feedback'); if (feedbackArea) { feedbackArea.textContent = ''; feedbackArea.style.display = 'none'; } }
    
    function renderHistoryPage() {
        updateActiveNavIcon('nav-history-btn');
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area history-page';
        chatInputArea.classList.add('chat-input-hidden');
        bottomNavBar.classList.remove('nav-hidden');
        
        // Lógica de visibilidade do cabeçalho
        scoreIndicator.classList.remove('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.add('back-btn-hidden');
        
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';
        historyContainer.innerHTML = '<h2>Histórico de Diálogos</h2>';
        const list = document.createElement('ul');
        list.id = 'history-list';
        populateHistoryList(list);
        historyContainer.appendChild(list);
        mainContentArea.appendChild(historyContainer);
    }
    function renderChatInterface() {
        mainContentArea.innerHTML = '';
        mainContentArea.className = 'main-content-area chat-window';
        chatInputArea.classList.remove('chat-input-hidden');
        updateActiveNavIcon(null);
        bottomNavBar.classList.add('nav-hidden');
        
        // Lógica de visibilidade do cabeçalho
        scoreIndicator.classList.add('score-indicator-hidden');
        exitChatBtn.classList.remove('exit-chat-btn-hidden');
        headerBackBtn.classList.add('back-btn-hidden');
    }

    // --- Funções de Lógica Principal de Conversa ---
    function startNewConversation(scenario) { if (!getGoogleApiKey() || !getElevenLabsApiKey()) { openApiKeyModal(true); return; } currentScenario = { details: scenario }; missionGoalText.textContent = scenario.goal; missionModal.classList.remove('modal-hidden'); }

    async function initiateChat() {
        if (!currentScenario) return;
        isConversationActive = true; 
        currentInteractionMode = 'text';
        renderChatInterface();
        micBtn.style.display = 'none';
        textInput.style.display = 'block';
        sendBtn.style.display = 'flex';

        conversationHistory = [];
        displayMessage(`Cenário: ${currentScenario.details.name}`, 'system');
        displayMessage(`🎯 Seu Objetivo: ${currentScenario.details.goal}`, 'system');
        setProcessingState(true);
        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada");
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, currentScenario.details, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            setTimeout(() => { removeTypingIndicator(); displayMessage(aiResponse, 'ai'); setUserTurnState(true); }, TYPING_SIMULATION_DELAY);
        } catch (error) { const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API do Google está configurada corretamente em Configurações ⚙️."; displayMessage(userFriendlyError, 'ai'); setUserTurnState(true); }
    }

    async function handleSendMessage() {
        const messageText = textInput.value.trim();
        if (!messageText) return;

        setProcessingState(true);
        textInput.value = '';

        if (currentInteractionMode === 'voice' && conversationState === 'USER_LISTENING' && mediaRecorder) {
            mediaRecorder.stop();
        }

        await processUserMessage(messageText);
    }

    function handleExitChat() {
        if (isConversationActive) {
            if (!confirm('Tem certeza de que deseja sair? O progresso deste diálogo não será salvo.')) {
                return;
            }
        }

        isConversationActive = false;
        conversationState = 'IDLE';

        if (currentAudioPlayer && !currentAudioPlayer.paused) {
            currentAudioPlayer.pause();
        }
        if (synthesis.speaking) {
            synthesis.cancel();
        }
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }

        conversationHistory = [];
        currentScenario = null;
        renderHomePage();
    }
    
    // --- LÓGICA DE VOZ HÍBRIDA ---

    function setupVoiceUI() {
        chatInputArea.classList.remove('chat-input-hidden');
        textInput.style.display = 'block';
        sendBtn.style.display = 'flex';
        micBtn.style.display = 'flex';
    }

    async function initiateVoiceChat() {
        if (!currentScenario) return;
        if (!checkBrowserCompatibility()) { renderHomePage(); return; }
        isConversationActive = true; 
        currentInteractionMode = 'voice';
        renderChatInterface();
        setupVoiceUI();
        conversationHistory = [];
        displayMessage(`Cenário: ${currentScenario.details.name}`, 'system');
        displayMessage(`🎯 Seu Objetivo: ${currentScenario.details.goal}`, 'system');
        setProcessingState(true);
        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada");
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(null, [], apiKey, currentScenario.details, settings);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            await speakText(aiResponse);
        } catch (error) {
            console.error("Error initiating voice chat:", error);
            const userFriendlyError = `Erro: ${error.message}. A sessão foi encerrada.`;
            displayMessage(userFriendlyError, 'ai');
            setProcessingState(false);
        }
    }

    function handleMicButtonClick() {
        if (currentInteractionMode !== 'voice') return;

        if (currentAudioPlayer && !currentAudioPlayer.paused) {
            currentAudioPlayer.pause();
        }
        if (synthesis.speaking) {
            synthesis.cancel();
        }

        if (conversationState === 'USER_LISTENING' && mediaRecorder) {
            mediaRecorder.stop();
            updateMicButtonState('processing');
            conversationState = 'PROCESSING';
        }
    }
    
    async function handleAIResponse(text) {
        if (currentInteractionMode === 'voice') {
            await speakText(text);
        } else {
            setTimeout(() => {
                removeTypingIndicator();
                displayMessage(text, 'ai');
                setUserTurnState(true);
            }, TYPING_SIMULATION_DELAY);
        }
    }
    
    function checkBrowserCompatibility() {
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            alert("Desculpe, seu navegador não suporta gravação de áudio (MediaRecorder). Você pode continuar usando o modo de texto.");
            return false;
        }
        return true;
    }
    
    // --- LÓGICA DE ESTADO DA INTERFACE ---

    function setProcessingState(isProcessing) {
        if (isProcessing) {
            showTypingIndicator();
            textInput.disabled = true;
            sendBtn.disabled = true;
            micBtn.disabled = true;
            updateMicButtonState('processing');
        } else {
            removeTypingIndicator();
        }
    }

    function setUserTurnState(isUserTurn) {
        if (!isConversationActive) return;

        textInput.disabled = !isUserTurn;
        sendBtn.disabled = !isUserTurn;
        micBtn.disabled = !isUserTurn;
        
        if (isUserTurn) {
            updateMicButtonState('default');
            textInput.focus();
            if (currentInteractionMode === 'voice') {
                startRecording();
            }
        }
    }

    // --- SISTEMA DE VOZ (TTS e STT) ---

    async function speakText(text) {
        text = text.replace(/[*_#]/g, '').replace(/<eng>|<\/eng>/g, '');
        if (!text || text.trim() === '') {
            setUserTurnState(true);
            return;
        }
        displayMessage(text, 'ai');
        removeTypingIndicator();

        const elevenLabsApiKey = getElevenLabsApiKey();
        if (!elevenLabsApiKey) {
            return speakTextNative(text);
        }

        try {
            const audioBlob = await getAudioFromElevenLabs(text, elevenLabsApiKey);
            const audioUrl = URL.createObjectURL(audioBlob);
            currentAudioPlayer = new Audio(audioUrl);

            return new Promise((resolve) => {
                currentAudioPlayer.onplay = () => { conversationState = 'AI_SPEAKING'; };
                currentAudioPlayer.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    setUserTurnState(true);
                    resolve();
                };
                currentAudioPlayer.onerror = () => {
                    console.error('Audio playback error');
                    URL.revokeObjectURL(audioUrl);
                    setUserTurnState(true);
                    resolve();
                };
                currentAudioPlayer.play();
            });

        } catch (error) {
            console.warn("ElevenLabs API failed, falling back to native TTS.", error);
            showFallbackNotification();
            return speakTextNative(text);
        }
    }

    function speakTextNative(text) {
        return new Promise((resolve) => {
            synthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const bestVoice = findBestEnglishVoice();
            if (bestVoice) utterance.voice = bestVoice;

            utterance.onstart = () => { conversationState = 'AI_SPEAKING'; };
            utterance.onend = () => {
                setUserTurnState(true);
                resolve();
            };
            utterance.onerror = () => {
                console.error('SpeechSynthesis error');
                setUserTurnState(true);
                resolve();
            };
            synthesis.speak(utterance);
        });
    }

    async function startRecording() {
        if (conversationState === 'USER_LISTENING') return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = handleRecordingStop;

            mediaRecorder.start();
            conversationState = 'USER_LISTENING';
            updateMicButtonState('listening');

        } catch (error) {
            console.error('Microphone access denied or error:', error);
            alert("Não foi possível acessar o microfone. Verifique as permissões do seu navegador.");
            setUserTurnState(false);
            updateMicButtonState('default');
        }
    }

    async function handleRecordingStop() {
        setProcessingState(true);
        
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

        try {
            const apiKey = getGoogleApiKey();
            if (!apiKey) throw new Error("Chave de API do Google não encontrada.");
            
            const transcript = await getTranscriptionFromAudio(audioBlob, apiKey);
            
            if (!transcript || transcript.trim() === '') {
                displayMessage("Não foi possível detectar fala. Tente novamente.", 'system');
                setUserTurnState(true);
                return;
            }

            await processUserMessage(transcript);

        } catch (error) {
            console.error("Transcription or API error:", error);
            const userFriendlyError = "Ocorreu um erro na transcrição de voz. Tente novamente ou use o modo texto.";
            displayMessage(userFriendlyError, 'ai');
            setUserTurnState(true);
        }
    }

    async function processUserMessage(messageText) {
        displayMessage(messageText, 'user');
        conversationHistory.push({ role: 'user', content: messageText });

        try {
            const apiKey = getGoogleApiKey();
            const settings = { language: languageSelect.value, proficiency: proficiencySelect.value };
            const aiResponse = await getAIResponse(messageText, conversationHistory, apiKey, currentScenario.details, settings);
            
            if (aiResponse.includes("[Scenario Complete]")) {
                const cleanResponse = aiResponse.replace("[Scenario Complete]", "").trim();
                
                await finalizeConversation(); 

                if (cleanResponse) { 
                    conversationHistory.push({ role: 'assistant', content: cleanResponse });
                    await handleAIResponse(cleanResponse); 
                }
                
                displayCompletionScreen();

            } else {
                conversationHistory.push({ role: 'assistant', content: aiResponse });
                await handleAIResponse(aiResponse);
            }
        } catch (error) {
            const userFriendlyError = "Ocorreu um erro. Verifique sua conexão ou se sua Chave de API do Google está configurada corretamente em Configurações ⚙️.";
            await handleAIResponse(userFriendlyError);
        }
    }
    
    function showFallbackNotification() {
        if (!sessionStorage.getItem('fallbackNotified')) {
            alert("Seus créditos de voz premium da ElevenLabs podem ter acabado. O aplicativo continuará com a voz padrão do seu dispositivo. A qualidade da voz pode ser diferente.");
            sessionStorage.setItem('fallbackNotified', 'true');
        }
    }

    function findBestEnglishVoice() {
        if (voices.length === 0) voices = synthesis.getVoices();
        if (voices.length === 0) return null;
        let bestVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google'));
        if (bestVoice) return bestVoice;
        bestVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Microsoft'));
        if (bestVoice) return bestVoice;
        bestVoice = voices.find(voice => voice.lang === 'en-US');
        if (bestVoice) return bestVoice;
        return voices.find(voice => voice.lang.startsWith('en-'));
    }

    function updateMicButtonState(state) {
        micBtn.classList.remove('mic-listening', 'mic-processing');
        switch (state) {
            case 'listening':
                micBtn.classList.add('mic-listening');
                micBtn.innerHTML = '⏹️'; 
                micBtn.title = "Falando... Clique para enviar";
                break;
            case 'processing':
                micBtn.classList.add('mic-processing');
                micBtn.innerHTML = '🎤'; 
                micBtn.title = "Processando...";
                break;
            default: // idle
                micBtn.innerHTML = '🎤'; 
                micBtn.title = "Aguarde sua vez";
                break;
        }
    }

    // --- LÓGICA DE FINALIZAÇÃO E FEEDBACK ---
    async function finalizeConversation() {
        isConversationActive = false; 
        setProcessingState(false);
        textInput.disabled = true;
        sendBtn.disabled = true;
        micBtn.disabled = true;
        updateMicButtonState('default');
        
        addPointsForLevel(proficiencySelect.value);
        updateScoreDisplay();

        const apiKey = getGoogleApiKey();
        let finalScenarioName = currentScenario.details.name;
        if (currentScenario.details.name === "Cenário Personalizado") {
            try { finalScenarioName = await getScenarioTitle(currentScenario.details.goal, apiKey, languageSelect.value); } catch (error) { finalScenarioName = "Custom Scenario"; }
        }
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        history.unshift({ scenarioName: finalScenarioName, scenarioGoal: currentScenario.details.goal, timestamp: new Date().getTime(), transcript: conversationHistory, feedback: '' });
        localStorage.setItem('conversationHistory', JSON.stringify(history));
    }

    function displayCompletionScreen() {
        const completionContainer = document.createElement('div');
        completionContainer.className = 'completion-container';
        completionContainer.innerHTML = `<div class="message system-message"><p>🎉 Parabéns! Você completou o cenário.</p></div>`;
        
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'completion-actions';
        actionsContainer.innerHTML = `<button id="feedback-btn">Ver Feedback</button><button id="next-challenge-btn">Próximo Desafio</button>`;
        
        actionsContainer.querySelector('#feedback-btn').addEventListener('click', handleGetFeedback);
        actionsContainer.querySelector('#next-challenge-btn').addEventListener('click', startNextChallenge);
        
        completionContainer.appendChild(actionsContainer);
        mainContentArea.appendChild(completionContainer);
        scrollToBottom();

        if (exitChatBtn) {
            exitChatBtn.textContent = 'Voltar ao Início';
        }
    }
    function startNextChallenge() { const allScenarios = Object.values(SCENARIOS).flatMap(category => Object.values(category).map(scenario => scenario[languageSelect.value])); const currentGoal = currentScenario.details.goal; const availableScenarios = allScenarios.filter(s => s.goal !== currentGoal); if (availableScenarios.length > 0) { const randomIndex = Math.floor(Math.random() * availableScenarios.length); startNewConversation(availableScenarios[randomIndex]); } else { renderHomePage(); alert("Você praticou todos os cenários disponíveis!"); } }
    async function handleGetFeedback() { feedbackModal.classList.remove('modal-hidden'); feedbackContent.innerHTML = '<p>Analisando sua conversa, por favor, aguarde...</p>'; translateBtn.classList.add('translate-btn-hidden'); try { const apiKey = getGoogleApiKey(); if (!apiKey) throw new Error("Chave de API do Google não encontrada."); const settings = { language: languageSelect.value, proficiency: proficiencySelect.value }; originalFeedback = await getFeedbackForConversation(conversationHistory, apiKey, languageSelect.value, settings, currentInteractionMode); const history = JSON.parse(localStorage.getItem('conversationHistory')) || []; if (history.length > 0 && !history[0].feedback) { history[0].feedback = originalFeedback; localStorage.setItem('conversationHistory', JSON.stringify(history)); } displayFormattedFeedback(originalFeedback); translateBtn.classList.remove('translate-btn-hidden'); isTranslated = false; translatedFeedback = ''; translateBtn.textContent = 'Traduzir para Português'; } catch (error) { feedbackContent.innerHTML = `<p>Erro ao gerar feedback: ${error.message}</p>`; } }
    
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
                    const apiKey = getGoogleApiKey(); 
                    if (!apiKey) throw new Error("Chave de API do Google não encontrada."); 
                    const protectedSnippets = []; 
                    const textToTranslate = originalFeedback.replace(/<eng>(.*?)<\/eng>/g, (match, content) => { 
                        protectedSnippets.push(content); 
                        return `%%PROTECTED_${protectedSnippets.length - 1}%%`; 
                    }); 
                    const translatedTextWithPlaceholders = await translateText(textToTranslate, apiKey, languageSelect.value); 
                    let finalTranslatedText = translatedTextWithPlaceholders; 
                    protectedSnippets.forEach((snippet, index) => { 
                        finalTranslatedText = finalTranslatedText.replace(`%%PROTECTED_${index}%%`, snippet); 
                    }); 
                    translatedFeedback = finalTranslatedText; 
                } 
                displayFormattedFeedback(translatedFeedback); 
                isTranslated = true; 
                translateBtn.textContent = 'Mostrar Original (English)'; 
            } catch (error) { 
                feedbackContent.innerHTML = `<p>Erro ao traduzir: ${error.message}</p>`; 
            } 
        } 
        translateBtn.disabled = false; 
    }
    
    function formatFeedbackText(text) { 
        return text.replace(/### (.*)/g, '<h3>$1</h3>')
                   .replace(/^\*\s(.*?)$/gm, '<p class="feedback-item">$1</p>')
                   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/\n/g, '<br>')
                   .replace(/<eng>|<\/eng>/g, '');
    }

    function displayFormattedFeedback(text) { feedbackContent.innerHTML = formatFeedbackText(text); }

    // --- Funções de Tela Cheia ---
    function isFullscreen() {
        return !!document.fullscreenElement;
    }

    function toggleFullscreen() {
        if (!isFullscreen()) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Não foi possível entrar em modo de tela cheia: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    function updateFullscreenIcon() {
        if (isFullscreen()) {
            fullscreenBtn.innerHTML = '<span>↘↙</span>'; // Ícone de recolher
            fullscreenBtn.title = "Sair da Tela Cheia";
        } else {
            fullscreenBtn.innerHTML = '<span>⛶</span>'; // Ícone de expandir
            fullscreenBtn.title = "Alternar Tela Cheia";
        }
    }
    
    // --- FUNÇÕES UTILITÁRIAS ---
    function updateActiveNavIcon(activeBtnId) {
        [navHomeBtn, navCustomBtn, navHistoryBtn, navSettingsBtn].forEach(btn => {
            if (btn.id === activeBtnId) {
                btn.classList.add('active-nav-icon');
            } else {
                btn.classList.remove('active-nav-icon');
            }
        });
    }
    
    // SUBSTITUA A FUNÇÃO 'renderHomePageContent' INTEIRA POR ESTA:
    // SUBSTITUA A FUNÇÃO 'renderHomePageContent' INTEIRA POR ESTA NOVA VERSÃO:
    function renderHomePageContent() {
        mainContentArea.innerHTML = '';

        const title = document.createElement('h1');
        title.className = 'main-page-title';
        title.textContent = "Odete's English Class";
        mainContentArea.appendChild(title);

        const lang = languageSelect.value;
        const allScenarios = Object.entries(SCENARIOS).flatMap(([categoryName, scenarios]) =>
            Object.entries(scenarios).map(([scenarioName, scenarioData]) => ({
                ...scenarioData[lang],
                categoryName: categoryName,
                scenarioName: scenarioName
            }))
        ).filter(Boolean);

        const suggestionSection = document.createElement('section');
        suggestionSection.className = 'suggestion-section';
        // MUDANÇA AQUI: Removemos o botão de atualizar e envolvemos a imagem e o título em um novo 'div' clicável.
        suggestionSection.innerHTML = `
            <div class="suggestion-card">
                <div id="new-suggestion-trigger" class="suggestion-header" title="Clique para gerar uma nova sugestão">
                    <img src="assets/odete.png" alt="Mascote Odete" class="suggestion-avatar">
                    <h3 id="suggestion-title"></h3>
                </div>
                <button id="start-suggestion-btn" class="primary-btn">
                    Começar a Praticar
                </button>
            </div>
        `;
        mainContentArea.appendChild(suggestionSection);

        const renderNewSuggestion = () => {
            const suggestedScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
            const suggestionTitleEl = document.getElementById('suggestion-title');
            const startSuggestionBtn = document.getElementById('start-suggestion-btn');

            if (suggestionTitleEl && startSuggestionBtn) {
                suggestionTitleEl.textContent = suggestedScenario.name;
                startSuggestionBtn.dataset.categoryName = suggestedScenario.categoryName;
                startSuggestionBtn.dataset.scenarioName = suggestedScenario.scenarioName;
            }
        };

        renderNewSuggestion();

        // MUDANÇA AQUI: O listener agora está no 'div' que envolve a imagem e o título.
        document.getElementById('new-suggestion-trigger').addEventListener('click', renderNewSuggestion);

        const panelContainer = document.createElement('div');
        panelContainer.className = 'scenario-panel';
        Object.keys(SCENARIOS).forEach(categoryName => {
            const categorySection = document.createElement('section');
            categorySection.className = 'panel-category-section';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'panel-category-title';
            categoryTitle.innerHTML = `
                <span class="category-title-text">${categoryName}</span>
                <span class="category-toggle-icon">▸</span>
            `;
            categorySection.appendChild(categoryTitle);

            const collapsibleContent = document.createElement('div');
            collapsibleContent.className = 'collapsible-content';

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'scenario-cards-container';
            const scenariosToShow = Object.keys(SCENARIOS[categoryName]).slice(0, 4);
            scenariosToShow.forEach(scenarioName => {
                const card = document.createElement('button');
                card.className = 'scenario-card';
                card.textContent = scenarioName;
                card.dataset.categoryName = categoryName;
                card.dataset.scenarioName = scenarioName;
                cardsContainer.appendChild(card);
            });

            const viewAllButton = document.createElement('button');
            viewAllButton.className = 'view-all-btn';
            viewAllButton.textContent = 'Ver todos →';
            viewAllButton.dataset.categoryName = categoryName;

            collapsibleContent.appendChild(cardsContainer);
            collapsibleContent.appendChild(viewAllButton);
            
            categorySection.appendChild(collapsibleContent);
            panelContainer.appendChild(categorySection);
        });
        mainContentArea.appendChild(panelContainer);
    }
    
    // ATUALIZADO: Função renderCategoryPage
    function renderCategoryPage(categoryName) {
        // Lógica de visibilidade do cabeçalho
        scoreIndicator.classList.add('score-indicator-hidden');
        exitChatBtn.classList.add('exit-chat-btn-hidden');
        headerBackBtn.classList.remove('back-btn-hidden');
        
        mainContentArea.innerHTML = ''; 
        mainContentArea.className = 'main-content-area category-page'; 
        
        const categoryContainer = document.createElement('div'); 
        categoryContainer.className = 'category-page-container'; 
        
        const header = document.createElement('div'); 
        header.className = 'category-page-header'; 
        // O botão voltar foi removido daqui
        const title = document.createElement('h2'); 
        title.textContent = categoryName; 
        header.appendChild(title); 
        
        const cardsContainer = document.createElement('div'); 
        cardsContainer.className = 'scenario-cards-container full-view'; 
        Object.keys(SCENARIOS[categoryName]).forEach(scenarioName => { 
            const card = document.createElement('button'); 
            card.className = 'scenario-card'; 
            card.textContent = scenarioName; 
            card.dataset.categoryName = categoryName; 
            card.dataset.scenarioName = scenarioName; 
            cardsContainer.appendChild(card); 
        }); 
        
        categoryContainer.appendChild(header); 
        categoryContainer.appendChild(cardsContainer); 
        mainContentArea.appendChild(categoryContainer); 
    }

    function scrollToBottom() { mainContentArea.scrollTop = mainContentArea.scrollHeight; }
    function removeTypingIndicator() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }
    
    function initializeApp() { 
        loadSettings();
        updateHeaderIndicators();
        updateScoreDisplay();
        if (!getGoogleApiKey() || !getElevenLabsApiKey()) { 
            openApiKeyModal(true); 
        } else { 
            renderHomePage(); 
        } 
        initializeSpeechAPI(); 
    }
    
    initializeApp();

    function displayMessage(text, sender) { if (sender === 'ai') { removeTypingIndicator(); } if (sender === 'system') { const systemEl = document.createElement('div'); systemEl.className = 'message system-message'; systemEl.innerHTML = `<p>${text}</p>`; mainContentArea.appendChild(systemEl); } else { const wrapper = document.createElement('div'); wrapper.className = 'message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message'; messageBubble.innerHTML = `<p>${text}</p>`; if (sender === 'user') { wrapper.classList.add('user-message-wrapper'); avatar.src = AVATAR_USER_URL; avatar.alt = 'User Avatar'; messageBubble.classList.add('user-message'); } else { wrapper.classList.add('ai-message-wrapper'); avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; messageBubble.classList.add('ai-message'); } wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); } scrollToBottom(); }
    function showTypingIndicator() { if (document.getElementById('typing-indicator')) return; const wrapper = document.createElement('div'); wrapper.id = 'typing-indicator'; wrapper.className = 'message-wrapper ai-message-wrapper'; const avatar = document.createElement('img'); avatar.className = 'avatar'; avatar.src = AVATAR_AI_URL; avatar.alt = 'AI Avatar'; const messageBubble = document.createElement('div'); messageBubble.className = 'message ai-message'; messageBubble.innerHTML = '<p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>'; wrapper.appendChild(avatar); wrapper.appendChild(messageBubble); mainContentArea.appendChild(wrapper); }

});