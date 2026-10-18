let currentSceneId = 'start';
let isTyping = false;
let currentDialogueText = '';
let textSpeed = 30; // ms per char
let typeWriterTimeout;
let playerInventory = [];
let dialogueHistory = [];
let saveLoadMode = 'save'; // 'save' or 'load'
let isAutoPlay = false;
let autoPlayTimeout = null;
let isSkip = false;

// DOM Elements
const bgLayer1 = document.getElementById('background-1');
const bgLayer2 = document.getElementById('background-2');
let activeBgLayer = 1;
const weatherLayerEl = document.getElementById('weather-layer');
const fxOverlayEl = document.getElementById('fx-overlay');
const dialogueBoxEl = document.getElementById('dialogue-box');
const characterNameEl = document.getElementById('character-name');
const dialogueTextEl = document.getElementById('dialogue-text');
const choicesContainerEl = document.getElementById('choices-container');
const uiLayerEl = document.getElementById('ui-layer');
const inventoryItemsEl = document.getElementById('inventory-items');
const bgmPlayer = document.getElementById('bgm-player');
const sfxPlayer = document.getElementById('sfx-player');
const uiHoverSfx = document.getElementById('ui-hover-sfx');
const uiClickSfx = document.getElementById('ui-click-sfx');

// Setup UI Audio
function playUIHover() {
    if (uiHoverSfx) {
        uiHoverSfx.currentTime = 0;
        uiHoverSfx.play().catch(() => {});
    }
}
function playUIClick() {
    if (uiClickSfx) {
        uiClickSfx.currentTime = 0;
        uiClickSfx.play().catch(() => {});
    }
}

function bindUIAudio() {
    const buttons = document.querySelectorAll('button, .save-slot');
    buttons.forEach(btn => {
        // Prevent binding multiple times if called again
        btn.removeEventListener('mouseenter', playUIHover);
        btn.removeEventListener('click', playUIClick);
        btn.addEventListener('mouseenter', playUIHover);
        btn.addEventListener('click', playUIClick);
    });
}


function startGame() {
    // Attempt to play BGM (might require user interaction first)
    if (bgmPlayer.src) {
        bgmPlayer.play().catch(e => console.log("Audio autoplay prevented by browser"));
    }
    loadScene('start');
}

function autoSave(sceneId) {
    const scene = storyData[sceneId];
    if (sceneId === 'start' || scene.isEnding) return;

    let rawText = scene.text ? scene.text.replace(/<[^>]*>?/gm, '') : '';
    const autoSaveData = {
        sceneId: sceneId,
        inventory: playerInventory,
        history: dialogueHistory,
        timestamp: Date.now(),
        bgImage: scene.background || '',
        desc: scene.character ? scene.character + ': ' + rawText.substring(0, 30) + '...' : rawText.substring(0, 30) + '...'
    };
    localStorage.setItem('ecos_save_auto', JSON.stringify(autoSaveData));
    showToast('Progreso guardado (Auto)');
}

function loadScene(sceneId) {
    const scene = storyData[sceneId];

    // Check if it's an ending to unlock it
    if (scene && scene.isEnding && scene.endingId) {
        unlockEnding(scene.endingId);
    }
    if (!scene) {
        console.error(`Scene ${sceneId} not found!`);
        return;
    }

    // Autosave check
    if (scene.isCheckpoint) {
        autoSave(sceneId);
    }

    // Handle explicit transition
    if (scene.transition) {
        const transOverlay = document.getElementById('transition-overlay');
        if (scene.transition === 'white') transOverlay.classList.add('fade-white');
        else transOverlay.classList.remove('fade-white');

        transOverlay.classList.add('fade-in');
        setTimeout(() => {
            executeSceneLoad(sceneId, scene);
            setTimeout(() => {
                transOverlay.classList.remove('fade-in');
            }, 500); // give time for background to load behind
        }, 1000); // 1s fade to black/white
    } else {
        executeSceneLoad(sceneId, scene);
    }
}

function executeSceneLoad(sceneId, scene) {
    currentSceneId = sceneId;

    // Handle giving items
    if (scene.giveItem && !playerInventory.includes(scene.giveItem)) {
        playerInventory.push(scene.giveItem);
        updateInventoryUI();
        showToast('Obtuviste: ' + scene.giveItem);
    }


    // Clear previous choices
    choicesContainerEl.innerHTML = '';

    // Handle Audio
    if (scene.bgm) {
        if (scene.bgm === "stop") {
            bgmPlayer.pause();
            bgmPlayer.currentTime = 0;
            bgmPlayer.src = '';
        } else if (bgmPlayer.src !== scene.bgm) {
            bgmPlayer.src = scene.bgm;
            bgmPlayer.play().catch(() => {});
        }
    }
    if (scene.sfx) {
        sfxPlayer.src = scene.sfx;
        sfxPlayer.play().catch(() => {});
    }

    if (scene.background) {
        const currentLayer = activeBgLayer === 1 ? bgLayer1 : bgLayer2;
        const nextLayer = activeBgLayer === 1 ? bgLayer2 : bgLayer1;

        const currentBg = currentLayer.style.backgroundImage.slice(5, -2).replace(/['"]/g, '');

        if (currentBg !== scene.background) {
            // Apply new background to hidden layer
            nextLayer.style.backgroundImage = `url('${scene.background}')`;

            // Toggle active classes to trigger CSS crossfade
            nextLayer.classList.add('active');
            currentLayer.classList.remove('active');

            activeBgLayer = activeBgLayer === 1 ? 2 : 1;
        }

        // Handle ken burns on the new active layer
        const newActive = activeBgLayer === 1 ? bgLayer1 : bgLayer2;
        if (scene.kenburns) {
            newActive.classList.add('kenburns');
        } else {
            newActive.classList.remove('kenburns');
        }

        // Ensure old layer loses kenburns so it resets when faded out
        const oldLayer = activeBgLayer === 1 ? bgLayer2 : bgLayer1;
        oldLayer.classList.remove('kenburns');
    }

    if (scene.weather === 'rain') {
        if (weatherLayerEl.children.length === 0) {
            for (let i = 0; i < 50; i++) {
                let drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = Math.random() * 100 + 'vw';
                drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
                drop.style.animationDelay = Math.random() * 2 + 's';
                weatherLayerEl.appendChild(drop);
            }
        }
    } else {
        weatherLayerEl.innerHTML = '';
    }

    if (scene.effect === 'static') {
        fxOverlayEl.className = 'fx-static';
    } else {
        fxOverlayEl.className = '';
    }

    if (scene.shake) {
        document.body.classList.add('shake-effect');
        setTimeout(() => document.body.classList.remove('shake-effect'), 500);
    }

    if (scene.flash) {
        fxOverlayEl.classList.add(`flash-${scene.flash}`);
        setTimeout(() => {
            fxOverlayEl.classList.remove(`flash-${scene.flash}`);
        }, 150);
    }

    // Handle Sprite
    const spriteContainer = document.getElementById('character-sprite');
    const spriteImg = document.getElementById('sprite-img');

    // Force reflow to reset animation
    spriteContainer.classList.remove('show');
    void spriteContainer.offsetWidth;

    if (scene.sprite) {
        spriteImg.src = scene.sprite;
        spriteContainer.classList.add('show');
    } else {
        spriteImg.src = '';
    }

    // Update Dialogue
    if (scene.character) {
        characterNameEl.textContent = scene.character;
        characterNameEl.classList.remove('hidden');
        characterNameEl.style.display = ''; // Clear inline style to let CSS take over
    } else {
        characterNameEl.textContent = '';
        characterNameEl.classList.add('hidden');
        characterNameEl.style.display = ''; // Clear inline style
    }

    if (scene.text) {
        if (isSkip) {
            dialogueTextEl.innerHTML = scene.text;
            finishTyping(scene);
            return;
        } else if (scene.minigame) {
            // Minigames don't use typewriter, they just show instructions
            dialogueTextEl.innerHTML = scene.text || "";
            isTyping = false;
            setupMinigame(scene.minigame, scene);
        } else {
            playTypewriterEffect(scene.text, scene);
        }

        // Add to history
        dialogueHistory.push({
            character: scene.character,
            text: scene.text
        });
    } else {
        dialogueTextEl.innerHTML = '';
    }
}

function playTypewriterEffect(text, scene) {
    clearTimeout(typeWriterTimeout);
    isTyping = true;
    currentDialogueText = text;
    dialogueTextEl.innerHTML = '';
    dialogueTextEl.classList.add('typing');

    let i = 0;

    function typeWriter() {
        if (isSkip) {
            finishTyping(scene); // Skip typing instantly
        } else if (i < text.length) {
            // Handle HTML tags instantly
            if (text.charAt(i) === '<') {
                let tag = '';
                while (i < text.length && text.charAt(i) !== '>') {
                    tag += text.charAt(i);
                    i++;
                }
                tag += '>'; // add the closing bracket
                dialogueTextEl.innerHTML += tag;
                i++; // advance past '>'
                typeWriter(); // Skip delay for tags
            } else {
                dialogueTextEl.innerHTML += text.charAt(i);
                i++;
                typeWriterTimeout = setTimeout(typeWriter, textSpeed);
            }
        } else {
            finishTyping(scene);
        }
    }

    typeWriter();
}

function finishTyping(scene) {
    clearTimeout(typeWriterTimeout);
    isTyping = false;
    dialogueTextEl.innerHTML = currentDialogueText;
    dialogueTextEl.classList.remove('typing');

    // Show choices after text finishes
    if (scene.choices && scene.choices.length > 0) {
        // Auto/Skip should stop if there are choices to prevent skipping choices
        if (isSkip) toggleSkip();
        if (isAutoPlay) toggleAuto();
        showChoices(scene.choices);
    } else if (scene.next) {
        // If no choices but has next, handle Auto/Skip
        if (isSkip) {
            autoPlayTimeout = setTimeout(() => {
                loadScene(scene.next);
            }, 100); // Super fast
        } else if (isAutoPlay) {
            // Auto play delay based on text length
            const delay = Math.max(1000, currentDialogueText.length * 30);
            autoPlayTimeout = setTimeout(() => {
                loadScene(scene.next);
            }, delay);
        }
    }
}

// Click to advance dialogue or fast forward

let lastClickTime = 0;
dialogueBoxEl.addEventListener('click', (e) => {
    // Prevent double clicking rapidly from skipping scenes
    const now = Date.now();
    if (now - lastClickTime < 200) return;
    lastClickTime = now;

    const scene = storyData[currentSceneId];

    // If choices are present, do not allow clicking to advance
    if (scene && scene.choices && scene.choices.length > 0 && !isTyping) {
        return;
    }

    if (isTyping) {
        // Skip typing
        finishTyping(scene);
    } else {
        // If it's done typing and has a linear 'next' (no choices), proceed
        if (scene && scene.next) {
            loadScene(scene.next);
        }
    }
});


function showChoices(choices) {
    choicesContainerEl.innerHTML = '';
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.classList.add('choice-btn');

        // Check requirements for visual feedback
        let isLocked = false;
        if (choice.requiredItem && !playerInventory.includes(choice.requiredItem)) {
            isLocked = true;
        }

        if (isLocked) {
            btn.classList.add('locked');
            btn.innerHTML = `${choice.text} <span class="locked-reason">(Requiere: ${choice.requiredItem})</span>`;
            btn.onclick = (e) => {
                e.stopPropagation();
                // Play error sound or just do nothing
                playUIClick();
            };
        } else {
            btn.innerHTML = choice.text; // Allow rich text in choices
            btn.onclick = (e) => {
                e.stopPropagation();
                loadScene(choice.next);
            };
        }

        choicesContainerEl.appendChild(btn);
    });
    bindUIAudio(); // Bind audio to new choices
}

function updateInventoryUI() {
    inventoryItemsEl.innerHTML = '';
    if (playerInventory.length === 0) {
        inventoryItemsEl.innerHTML = '<span style="color:#aaa;">(Vacío)</span>';
        return;
    }
    playerInventory.forEach(item => {
        const span = document.createElement('span');
        span.classList.add('inv-item');
        span.textContent = item;
        span.onclick = () => showItemDescription(item);
        inventoryItemsEl.appendChild(span);
    });
}

// Minimal descriptions for items, fallback to default text
const itemDescriptions = {
    "Tarjeta de Acceso": "Una tarjeta con banda magnética azul, parece abrir la puerta de seguridad principal.",
    "Batería Pequeña": "Una batería de 9V, algo gastada pero aún con carga.",
    "Documento Confidencial": "Notas del Dr. Aris sobre el proyecto Sombra. Habla de fallos de contención y sacrificios necesarios.",
    "Kit de Hackeo": "Un terminal portátil con herramientas para saltarse sistemas de seguridad estándar."
};

function showItemDescription(itemName) {
    const overlay = document.getElementById('item-description-overlay');
    const nameEl = document.getElementById('item-name');
    const descEl = document.getElementById('item-desc');

    if (overlay && nameEl && descEl) {
        nameEl.textContent = itemName;
        descEl.textContent = itemDescriptions[itemName] || "Un objeto de tu inventario. Podría ser útil más adelante.";
        overlay.classList.remove('hidden');
        playUIClick();
    }
}

// Also need this function to be on the window to be callable from HTML
window.closeItemDescription = function() {
    const overlay = document.getElementById('item-description-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        playUIClick();
    }
}

// Dialog History
function toggleHistory() {
    const historyOverlay = document.getElementById('history-overlay');
    if (!historyOverlay) return;

    const isHidden = historyOverlay.classList.contains('hidden');

    if (isHidden) {
        // Show history
        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = '';

        if (dialogueHistory.length === 0) {
            historyContent.innerHTML = '<p style="color:#777; text-align:center;">No hay historial aún.</p>';
        } else {
            dialogueHistory.forEach(entry => {
                const div = document.createElement('div');
                div.className = 'history-entry';

                if (entry.character) {
                    const nameSpan = document.createElement('div');
                    nameSpan.className = 'history-name';
                    nameSpan.textContent = entry.character;
                    div.appendChild(nameSpan);
                }

                const textSpan = document.createElement('div');
                textSpan.className = 'history-text';
                textSpan.innerHTML = entry.text;
                div.appendChild(textSpan);

                historyContent.appendChild(div);
            });
        }

        historyOverlay.classList.remove('hidden');
        // Scroll to bottom
        historyContent.scrollTop = historyContent.scrollHeight;
    } else {
        historyOverlay.classList.add('hidden');
    }
}

// Settings System
function toggleSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
        saveSettings();
    }
}

function saveSettings() {
    const settings = {
        bgmVolume: parseFloat(document.getElementById('bgm-volume').value),
        sfxVolume: parseFloat(document.getElementById('sfx-volume').value),
        textSpeed: parseInt(document.getElementById('text-speed').value, 10)
    };
    localStorage.setItem('ecos_settings', JSON.stringify(settings));
    applySettings(settings);
}

function loadSettings() {
    const saved = localStorage.getItem('ecos_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            document.getElementById('bgm-volume').value = settings.bgmVolume;
            document.getElementById('sfx-volume').value = settings.sfxVolume;
            document.getElementById('text-speed').value = settings.textSpeed;
            applySettings(settings);
        } catch (e) {
            console.error("Error loading settings:", e);
        }
    }
}

function applySettings(settings) {
    bgmPlayer.volume = settings.bgmVolume;
    sfxPlayer.volume = settings.sfxVolume;
    textSpeed = settings.textSpeed;
}

document.getElementById('bgm-volume').addEventListener('input', (e) => {
    bgmPlayer.volume = e.target.value;
});
document.getElementById('sfx-volume').addEventListener('input', (e) => {
    sfxPlayer.volume = e.target.value;
});

// Minigames Handlers
function setupMinigame(type, scene) {
    const minigameContainer = document.getElementById('minigame-container');
    minigameContainer.innerHTML = ''; // clear previous
    minigameContainer.classList.remove('hidden');

    const title = document.createElement('h2');
    title.textContent = scene.minigamePrompt || "Minijuego";
    minigameContainer.appendChild(title);

    if (type === 'hacking') {
        const targetSequence = scene.targetSequence || ['A', 'B', 'C'];
        const gridValues = scene.gridValues || ['A','X','B','Y', 'C','Z','A','W', 'B','C','X','Y', 'Z','W','A','B'];
        let currentSequence = [];

        // Sequence display
        const seqDisplay = document.createElement('div');
        seqDisplay.className = 'hack-sequence-display';
        for (let i = 0; i < targetSequence.length; i++) {
            const seqItem = document.createElement('div');
            seqItem.className = 'hack-seq-item';
            seqItem.textContent = targetSequence[i];
            seqDisplay.appendChild(seqItem);
        }
        minigameContainer.appendChild(seqDisplay);

        // Grid
        const grid = document.createElement('div');
        grid.id = 'hack-grid';

        const statusText = document.createElement('div');
        statusText.id = 'hack-status';
        statusText.textContent = "INICIA SECUENCIA";

        gridValues.forEach((val, index) => {
            const node = document.createElement('div');
            node.className = 'hack-node';
            node.textContent = val;

            node.onclick = () => {
                if (node.classList.contains('locked-in')) return;
                playUIClick();

                const expected = targetSequence[currentSequence.length];
                if (val === expected) {
                    node.classList.add('locked-in');
                    currentSequence.push(val);
                    seqDisplay.children[currentSequence.length - 1].classList.add('filled');

                    if (currentSequence.length === targetSequence.length) {
                        statusText.textContent = "ACCESO CONCEDIDO";
                        statusText.style.color = "#0f0";
                        setTimeout(() => {
                            minigameContainer.classList.add('hidden');
                            loadScene(scene.successNext);
                        }, 1500);
                    } else {
                        statusText.textContent = "COINCIDENCIA ENCONTRADA";
                    }
                } else {
                    // Reset
                    playUIClick(); // maybe error sound in future
                    statusText.textContent = "SECUENCIA INCORRECTA. REINICIANDO.";
                    statusText.style.color = "#f00";
                    setTimeout(() => {
                        statusText.style.color = "#0f0";
                        statusText.textContent = "INICIA SECUENCIA";
                        currentSequence = [];
                        document.querySelectorAll('.hack-node.locked-in').forEach(n => n.classList.remove('locked-in'));
                        document.querySelectorAll('.hack-seq-item.filled').forEach(n => n.classList.remove('filled'));
                    }, 1000);
                }
            };
            grid.appendChild(node);
        });

        minigameContainer.appendChild(grid);
        minigameContainer.appendChild(statusText);

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'sys-btn';
        cancelBtn.style.marginTop = '15px';
        cancelBtn.textContent = 'ABORTAR';
        cancelBtn.onclick = () => {
            minigameContainer.classList.add('hidden');
            loadScene(currentSceneId);
        };
        minigameContainer.appendChild(cancelBtn);

    }
    else if (type === 'hiddenObject') {
        const bgDiv = document.createElement('div');
        bgDiv.style.position = 'relative';
        bgDiv.style.width = '100%';
        bgDiv.style.height = '300px';
        bgDiv.style.backgroundImage = `url('${scene.background}')`;
        bgDiv.style.backgroundSize = 'cover';
        bgDiv.style.backgroundPosition = 'center';

        const hotspot = document.createElement('div');
        hotspot.className = 'mg-hotspot';
        hotspot.style.left = scene.hotspot.x;
        hotspot.style.top = scene.hotspot.y;
        hotspot.style.width = scene.hotspot.w;
        hotspot.style.height = scene.hotspot.h;

        hotspot.onclick = () => {
            alert("¡Objeto encontrado!");
            minigameContainer.classList.add('hidden');
            loadScene(scene.successNext);
        };

        bgDiv.appendChild(hotspot);
        minigameContainer.appendChild(bgDiv);
    }
    else if (type === 'safeCracking') {
        let currentInput = "";

        const display = document.createElement('div');
        display.id = 'safe-display';
        display.textContent = "----";
        minigameContainer.appendChild(display);

        const keypad = document.createElement('div');
        keypad.id = 'safe-keypad';

        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'keypad-btn';
            btn.textContent = i;
            btn.onclick = () => handleSafeInput(i);
            keypad.appendChild(btn);
        }

        const clearBtn = document.createElement('button');
        clearBtn.className = 'keypad-btn';
        clearBtn.textContent = 'C';
        clearBtn.onclick = () => {
            currentInput = "";
            display.textContent = "----";
        };
        keypad.appendChild(clearBtn);

        const btn0 = document.createElement('button');
        btn0.className = 'keypad-btn';
        btn0.textContent = '0';
        btn0.onclick = () => handleSafeInput(0);
        keypad.appendChild(btn0);

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'keypad-btn';
        cancelBtn.textContent = 'X';
        cancelBtn.onclick = () => {
            minigameContainer.classList.add('hidden');
            // Give option to leave
            loadScene(currentSceneId); // reload scene to show standard choices again
        };
        keypad.appendChild(cancelBtn);

        minigameContainer.appendChild(keypad);

        function handleSafeInput(num) {
            playUIClick();
            if (currentInput.length < 4) {
                currentInput += num;
                display.textContent = currentInput.padEnd(4, '-');
            }
            if (currentInput.length === 4) {
                if (currentInput === scene.correctCode) {
                    display.style.color = '#fff';
                    display.style.backgroundColor = '#0f0';
                    display.textContent = "OPEN";
                    setTimeout(() => {
                        minigameContainer.classList.add('hidden');
                        loadScene(scene.successNext);
                    }, 1000);
                } else {
                    display.style.color = '#f00';
                    display.textContent = "ERR!";
                    setTimeout(() => {
                        display.style.color = '#0f0';
                        currentInput = "";
                        display.textContent = "----";
                    }, 800);
                }
            }
        }
    }
    else if (type === 'wirePuzzle') {
        const board = document.createElement('div');
        board.id = 'wire-board';

        const colLeft = document.createElement('div');
        colLeft.className = 'wire-col';
        const colRight = document.createElement('div');
        colRight.className = 'wire-col';

        const colors = ['#f00', '#0f0', '#00f', '#ff0'];
        let leftNodes = [...colors].sort(() => Math.random() - 0.5);
        let rightNodes = [...colors].sort(() => Math.random() - 0.5);

        let selectedNode = null;
        let connections = 0;

        leftNodes.forEach((color, index) => {
            const node = document.createElement('div');
            node.className = 'wire-node left-node';
            node.style.backgroundColor = color;
            node.dataset.color = color;
            node.onclick = () => selectNode(node, 'left');
            colLeft.appendChild(node);
        });

        rightNodes.forEach((color, index) => {
            const node = document.createElement('div');
            node.className = 'wire-node right-node';
            node.style.backgroundColor = color;
            node.dataset.color = color;
            node.onclick = () => selectNode(node, 'right');
            colRight.appendChild(node);
        });

        board.appendChild(colLeft);
        board.appendChild(colRight);
        minigameContainer.appendChild(board);

        function selectNode(node, side) {
            playUIClick();
            if (node.classList.contains('connected')) return;

            if (!selectedNode) {
                if (side !== 'left') return; // Must start from left
                selectedNode = node;
                node.classList.add('selected');
            } else {
                if (side !== 'right') {
                    // Changed mind on left side
                    selectedNode.classList.remove('selected');
                    selectedNode = node;
                    node.classList.add('selected');
                    return;
                }

                // Check match
                if (node.dataset.color === selectedNode.dataset.color) {
                    node.classList.add('connected');
                    selectedNode.classList.remove('selected');
                    selectedNode.classList.add('connected');
                    selectedNode = null;
                    connections++;

                    if (connections === 4) {
                        setTimeout(() => {
                            minigameContainer.classList.add('hidden');
                            loadScene(scene.successNext);
                        }, 500);
                    }
                } else {
                    // Wrong match
                    selectedNode.classList.remove('selected');
                    selectedNode = null;
                    // Flash red
                    board.style.backgroundColor = '#500';
                    setTimeout(() => board.style.backgroundColor = '#222', 200);
                }
            }
        }
    }
}

// Start game when page loads
window.onload = () => {
    loadSettings();
    bindUIAudio(); // Initial bind

    document.getElementById('btn-new-game').onclick = () => {
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('background-1').classList.remove('hidden');
        document.getElementById('background-2').classList.remove('hidden');
        document.getElementById('ui-layer').classList.remove('hidden');
        startGame();
    };


};

// Save / Load System UI
function toggleSaveLoad() {
    const overlay = document.getElementById('saveload-overlay');
    if (overlay.classList.contains('hidden')) {
        renderSaveSlots();
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function openSaveMenu() {
    saveLoadMode = 'save';
    document.getElementById('saveload-title').innerText = 'Guardar Partida';
    toggleSaveLoad();
}

function openLoadMenu() {
    saveLoadMode = 'load';
    document.getElementById('saveload-title').innerText = 'Cargar Partida';
    toggleSaveLoad();
}

function renderSaveSlots() {
    const container = document.getElementById('saveload-slots');
    container.innerHTML = '';

    if (saveLoadMode === 'load') {
        renderSingleSlot('auto', 'ecos_save_auto', 'Auto-Guardado');
    }

    for (let i = 1; i <= 6; i++) {
        renderSingleSlot(i, 'ecos_save_' + i, 'Ranura ' + i);
    }
}

function renderSingleSlot(id, slotKey, titleText) {
    const container = document.getElementById('saveload-slots');
    const saveStr = localStorage.getItem(slotKey);
    const slotDiv = document.createElement('div');
    slotDiv.className = 'save-slot';

    if (saveStr) {
        try {
            const saveData = JSON.parse(saveStr);
            const dateStr = new Date(saveData.timestamp).toLocaleString('es-ES');
            const bgUrl = saveData.bgImage || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300';

            slotDiv.innerHTML = `
                <div class="save-slot-bg" style="background-image: url('${bgUrl}')"></div>
                <div class="save-slot-info">
                    <span class="save-slot-title">${titleText}</span>
                    <span class="save-slot-desc">${saveData.desc || '...'}</span>
                    <span class="save-slot-date">${dateStr}</span>
                </div>
            `;
            slotDiv.classList.add('has-data');

            if (id !== 'auto') {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-save-btn';
                deleteBtn.textContent = 'Borrar';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if(confirm(`¿Seguro que deseas borrar la ${titleText}?`)) {
                        localStorage.removeItem(slotKey);
                        renderSaveSlots();
                    }
                };
                slotDiv.appendChild(deleteBtn);
            }
        } catch(e) {
            slotDiv.innerHTML = `<span class="save-slot-empty">${titleText} - Error</span>`;
        }
    } else {
        slotDiv.innerHTML = `<span class="save-slot-empty">${titleText} - Vacía</span>`;
    }

    slotDiv.onclick = () => handleSlotClick(id);
    container.appendChild(slotDiv);
}

function handleSlotClick(slotIndex) {
    const slotKey = slotIndex === 'auto' ? 'ecos_save_auto' : 'ecos_save_' + slotIndex;

    if (saveLoadMode === 'save') {
        if (slotIndex === 'auto') return; // Cannot manually save to auto
        const scene = storyData[currentSceneId];
        // Strip HTML tags for clean description
        let rawText = scene.text ? scene.text.replace(/<[^>]*>?/gm, '') : '';
        const saveData = {
            sceneId: currentSceneId,
            inventory: playerInventory,
            history: dialogueHistory,
            timestamp: Date.now(),
            bgImage: scene.background || '',
            desc: scene.character ? scene.character + ': ' + rawText.substring(0, 30) + '...' : rawText.substring(0, 30) + '...'
        };
        localStorage.setItem(slotKey, JSON.stringify(saveData));
        toggleSaveLoad();

        // Brief visual feedback
        const btnSave = document.getElementById('btn-save');
        if (btnSave) {
            const originalText = btnSave.textContent;
            btnSave.textContent = "¡Guardado!";
            setTimeout(() => {
                btnSave.textContent = originalText;
            }, 1500);
        }
    } else if (saveLoadMode === 'load') {
        const saveStr = localStorage.getItem(slotKey);
        if (saveStr) {
            try {
                const saveData = JSON.parse(saveStr);
                playerInventory = saveData.inventory || [];
                dialogueHistory = saveData.history || [];

                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('saveload-overlay').classList.add('hidden');
                document.getElementById('ui-layer').classList.remove('hidden');

                updateInventoryUI();
                loadScene(saveData.sceneId || 'start');

                // Brief visual feedback
                const btnLoad = document.getElementById('btn-load');
                if (btnLoad) {
                    const originalText = btnLoad.textContent;
                    btnLoad.textContent = "¡Cargado!";
                    setTimeout(() => {
                        btnLoad.textContent = originalText;
                    }, 1500);
                }
            } catch (e) {
                console.error("Error loading save data:", e);
                alert("Error al cargar la partida.");
            }
        } else {
            alert("No hay partida guardada en esta ranura.");
        }
    }
}

// Auto Play & Skip Controls
function toggleAuto() {
    isAutoPlay = !isAutoPlay;
    const btn = document.getElementById('btn-auto');
    if (btn) btn.textContent = `Auto: ${isAutoPlay ? 'ON' : 'OFF'}`;

    // Disable skip if auto is turned on
    if (isAutoPlay && isSkip) toggleSkip();

    // If currently not typing and there's a next scene, trigger it
    if (isAutoPlay && !isTyping && storyData[currentSceneId].next && (!storyData[currentSceneId].choices || storyData[currentSceneId].choices.length === 0)) {
        finishTyping(storyData[currentSceneId]); // This will trigger the delay logic
    } else if (!isAutoPlay && autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
    }
}

function toggleSkip() {
    isSkip = !isSkip;
    const btn = document.getElementById('btn-skip');
    if (btn) btn.textContent = `Skip: ${isSkip ? 'ON' : 'OFF'}`;

    // Disable auto if skip is turned on
    if (isSkip && isAutoPlay) toggleAuto();

    if (isSkip && !isTyping && storyData[currentSceneId].next && (!storyData[currentSceneId].choices || storyData[currentSceneId].choices.length === 0)) {
        // If not typing and there's a next scene without choices, we should just load the next scene,
        // as finishTyping only advances if it was in the middle of typing
        loadScene(storyData[currentSceneId].next);
    } else if (isSkip && isTyping) {
        finishTyping(storyData[currentSceneId]); // Instantly finish typing
    }
}

// Fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


// FOR TESTING ONLY
window.forceScene = function(sceneId) {
    if (typeof loadScene === 'function') {
        loadScene(sceneId);
    }
};

// ==========================================
// GLOBAL PROGRESSION & GALLERY
// ==========================================

function unlockEnding(endingId) {
    let unlocked = JSON.parse(localStorage.getItem('ecos_unlocked_endings')) || [];
    if (!unlocked.includes(endingId)) {
        unlocked.push(endingId);
        localStorage.setItem('ecos_unlocked_endings', JSON.stringify(unlocked));
        console.log("Unlocked ending:", endingId);

        // Optional: show a small toast or notification
        showToast('¡Nuevo final desbloqueado!');
    }
}

function toggleGallery() {
    const galleryOverlay = document.getElementById('gallery-overlay');
    if (!galleryOverlay) return;

    if (galleryOverlay.classList.contains('hidden')) {
        renderGallery();
        galleryOverlay.classList.remove('hidden');
        playUIClick();
    } else {
        galleryOverlay.classList.add('hidden');
        playUIClick();
    }
}

function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    container.innerHTML = '';

    const unlocked = JSON.parse(localStorage.getItem('ecos_unlocked_endings')) || [];

    if (window.endingsData) {
        window.endingsData.forEach((ending, index) => {
            const isUnlocked = unlocked.includes(ending.id);
            const card = document.createElement('div');
            card.className = 'gallery-card ' + (isUnlocked ? 'unlocked' : 'locked');

            if (isUnlocked) {
                // Find scene data to get background if we want, or just show text
                // Search for the scene that has this endingId
                let bgImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300";
                let desc = "";
                for (let key in storyData) {
                    if (storyData[key].endingId === ending.id) {
                        if (storyData[key].background) bgImage = storyData[key].background;
                        desc = storyData[key].endingDesc || "";
                        break;
                    }
                }

                card.innerHTML = `
                    <div class="gallery-img-container">
                        <img src="${bgImage}" alt="${ending.name}">
                    </div>
                    <div class="gallery-info">
                        <h3>${ending.name}</h3>
                        <p>${desc}</p>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="gallery-img-container locked-img">
                        <span>?</span>
                    </div>
                    <div class="gallery-info">
                        <h3>Final ${index + 1}</h3>
                        <p>Aún no descubierto.</p>
                    </div>
                `;
            }
            container.appendChild(card);
        });

        // Update stats
        const stats = document.getElementById('gallery-stats');
        if (stats) {
            stats.innerText = `Desbloqueados: ${unlocked.length} / ${window.endingsData.length}`;
        }
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'ending-toast';
    toast.style.zIndex = '9999';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}
