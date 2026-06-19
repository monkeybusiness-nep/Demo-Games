// --- Header Scroll Effect ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    highlightNav();
});

// --- Active Link Highlighting ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function highlightNav() {
    let current = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// --- Mobile Navigation Toggle ---
const menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('mobile-nav-active');
});

// Smooth Scroll to Section
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.body.classList.remove('mobile-nav-active'); // Close mobile menu if open
    }
}

// --- Game Filtering ---
function filterGames(region) {
    const cards = document.querySelectorAll('#games-container .game-card');
    const tabs = document.querySelectorAll('.filter-tabs .filter-btn');
    
    // Update active tab
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (region === 'all' && tab.innerText.includes('All')) {
            tab.classList.add('active');
        } else if (region === 'china' && tab.innerText.includes('China')) {
            tab.classList.add('active');
        } else if (region === 'us' && tab.innerText.includes('US')) {
            tab.classList.add('active');
        }
    });

    // Animate filtering
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (region === 'all' || card.getAttribute('data-region') === region) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        }, 300);
    });
}

// --- Interactive Game Simulator & Modals ---
let currentActiveGame = '';
let currentBalance = 10000;
let isSimulatorRunning = false;

const gameConfigs = {
    'dragon-slots': {
        title: 'Majestic Dragon Slots',
        desc: 'Spin for free on our premium slot machine simulator. Land identical symbols to trigger jackpot multipliers!',
        rtp: '96.8%',
        volatility: 'High',
        btnText: 'Spin Reels ($100)'
    },
    'blackjack': {
        title: 'Vegas High-Roller Blackjack',
        desc: 'Simulate high-stakes card deals. Beat the dealer to double your stakes in this US-style casino simulator.',
        rtp: '99.5%',
        volatility: 'Medium',
        btnText: 'Deal Hand ($500)'
    },
    'crash': {
        title: 'Golden Rising Crash',
        desc: 'Watch the multiplier climb! Click CASH OUT before the rocket crashes to save your multiplier.',
        rtp: '97.2%',
        volatility: 'Dynamic',
        btnText: 'Launch Rocket ($200)'
    },
    'wheel': {
        title: 'Rolling Dice Wheel',
        desc: 'Spin the fortune wheel to hit jackpot slices and massive multipliers up to 1000x.',
        rtp: '96.5%',
        volatility: 'Low',
        btnText: 'Spin Wheel ($100)'
    }
};

function launchDemo(gameId) {
    currentActiveGame = gameId;
    const config = gameConfigs[gameId];
    
    // Update Modal Information
    document.getElementById('modal-game-title').innerHTML = `${config.title} <span>Live Play</span>`;
    document.getElementById('sidebar-game-title').innerText = config.title;
    document.getElementById('sidebar-game-desc').innerText = config.desc;
    document.getElementById('metric-rtp').innerText = config.rtp;
    document.getElementById('metric-volatility').innerText = config.volatility;
    document.getElementById('btn-spin').innerText = config.btnText;
    updateBalanceDisplay();
    
    // Load Game UI inside simulator pane
    const simulatorContainer = document.getElementById('simulator-content');
    simulatorContainer.innerHTML = buildGameSimulatorHtml(gameId);
    
    // Show Modal
    document.getElementById('demo-modal').classList.add('active');
}

function closeDemo() {
    document.getElementById('demo-modal').classList.remove('active');
    isSimulatorRunning = false;
}

function updateBalanceDisplay() {
    document.getElementById('simulator-balance').innerText = `$${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function resetSimulatorBalance() {
    currentBalance = 10000;
    updateBalanceDisplay();
    // Reset specific simulator states if needed
    launchDemo(currentActiveGame);
}

// Generate the specific HTML view for each mini-game
function buildGameSimulatorHtml(gameId) {
    if (gameId === 'dragon-slots') {
        return `
            <div class="casino-game-frame" style="text-align:center;">
                <div class="slots-mock">
                    <div class="slot-reel" id="reel-1">🐉</div>
                    <div class="slot-reel" id="reel-2">🐉</div>
                    <div class="slot-reel" id="reel-3">🐉</div>
                </div>
                <div id="game-status" style="margin-top:16px; font-weight:700; color:var(--gold-primary);">Ready to spin!</div>
            </div>
        `;
    } else if (gameId === 'blackjack') {
        return `
            <div class="casino-game-frame" style="text-align:center; width: 100%; max-width: 320px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:16px; margin-bottom:16px;">
                    <div style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:4px;">Dealer Hand</div>
                    <div id="dealer-cards" style="font-size:1.8rem; font-weight:bold; letter-spacing:8px;">🎴 🎴</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:16px;">
                    <div style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:4px;">Player Hand</div>
                    <div id="player-cards" style="font-size:1.8rem; font-weight:bold; letter-spacing:8px;">🎴 🎴</div>
                </div>
                <div id="game-status" style="margin-top:16px; font-weight:700; color:var(--gold-primary);">Place your bet to deal!</div>
            </div>
        `;
    } else if (gameId === 'crash') {
        return `
            <div class="casino-game-frame" style="text-align:center; position:relative; width: 100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <div id="crash-multiplier" style="font-size:3.5rem; font-weight:800; font-family:var(--font-heading); color:#fff; transition: scale 0.1s ease;">1.00x</div>
                <div id="game-status" style="margin-top:12px; font-size:0.9rem; color:var(--text-secondary);">Rocket Launch Ready</div>
                <div id="crash-action-container" style="margin-top:20px; display:none;">
                    <button class="btn-primary" id="btn-cashout" onclick="cashOutCrash()" style="background:#ff5252; color:#fff; box-shadow:none;">CASH OUT</button>
                </div>
            </div>
        `;
    } else if (gameId === 'wheel') {
        return `
            <div class="casino-wheel-game">
                <div style="position:relative;">
                    <div class="wheel-pointer"></div>
                    <div class="wheel-outer" id="wheel-spinner">
                        <div class="wheel-center"></div>
                    </div>
                </div>
                <div id="game-status" style="font-weight:700; color:var(--gold-primary);">Spin the wheel of fortune!</div>
            </div>
        `;
    }
}

// Executes when "Spin / Deal" button is clicked in the sidebar
function playSimulatorStep() {
    if (isSimulatorRunning) return; // Prevent double trigger
    
    const statusText = document.getElementById('game-status');
    
    if (currentActiveGame === 'dragon-slots') {
        if (currentBalance < 100) {
            statusText.innerText = "Insufficient Balance! Reset wallet.";
            return;
        }
        isSimulatorRunning = true;
        currentBalance -= 100;
        updateBalanceDisplay();
        
        statusText.innerText = "Reels are spinning...";
        
        const symbols = ['🐉', '🪙', '🏮', '💰', '💎', '🍒'];
        const reel1 = document.getElementById('reel-1');
        const reel2 = document.getElementById('reel-2');
        const reel3 = document.getElementById('reel-3');
        
        // Spin animations using intervals
        let spinCount = 0;
        const interval = setInterval(() => {
            reel1.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            reel2.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            reel3.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            spinCount++;
            if (spinCount > 15) {
                clearInterval(interval);
                
                // Final symbols
                const f1 = symbols[Math.floor(Math.random() * symbols.length)];
                const f2 = symbols[Math.floor(Math.random() * symbols.length)];
                const f3 = symbols[Math.floor(Math.random() * symbols.length)];
                
                reel1.innerText = f1;
                reel2.innerText = f2;
                reel3.innerText = f3;
                
                // Calculate Win
                if (f1 === f2 && f2 === f3) {
                    let winAmount = 0;
                    if (f1 === '🐉') winAmount = 5000;
                    else if (f1 === '💎') winAmount = 2500;
                    else winAmount = 1000;
                    
                    currentBalance += winAmount;
                    statusText.innerHTML = `<span style="color:#25d366">JACKPOT! Won $${winAmount}!</span>`;
                } else if (f1 === f2 || f2 === f3 || f1 === f3) {
                    currentBalance += 150;
                    statusText.innerHTML = `<span style="color:#25d366">Two Matching! Won $150!</span>`;
                } else {
                    statusText.innerHTML = `<span style="color:#ff5252">No match. Spin again!</span>`;
                }
                updateBalanceDisplay();
                isSimulatorRunning = false;
            }
        }, 80);
        
    } else if (currentActiveGame === 'blackjack') {
        if (currentBalance < 500) {
            statusText.innerText = "Insufficient Balance! Reset wallet.";
            return;
        }
        isSimulatorRunning = true;
        currentBalance -= 500;
        updateBalanceDisplay();
        
        statusText.innerText = "Dealing cards...";
        
        setTimeout(() => {
            const playerVal = Math.floor(Math.random() * 10) + 12; // 12-21
            const dealerVal = Math.floor(Math.random() * 10) + 12; // 12-21
            
            document.getElementById('player-cards').innerText = `🎴 ${playerVal}`;
            document.getElementById('dealer-cards').innerText = `🎴 ${dealerVal}`;
            
            if (playerVal > 21) {
                statusText.innerHTML = `<span style="color:#ff5252">Bust! You score: ${playerVal}. Lost Bet.</span>`;
            } else if (dealerVal > 21 || playerVal > dealerVal) {
                currentBalance += 1000;
                statusText.innerHTML = `<span style="color:#25d366">Win! Score: ${playerVal} vs ${dealerVal}. Won $1,000!</span>`;
            } else if (playerVal === dealerVal) {
                currentBalance += 500;
                statusText.innerText = `Push! Scores: ${playerVal}. Bet returned.`;
            } else {
                statusText.innerHTML = `<span style="color:#ff5252">Lost! Score: ${playerVal} vs ${dealerVal}.</span>`;
            }
            updateBalanceDisplay();
            isSimulatorRunning = false;
        }, 1000);
        
    } else if (currentActiveGame === 'crash') {
        if (currentBalance < 200) {
            statusText.innerText = "Insufficient Balance! Reset wallet.";
            return;
        }
        isSimulatorRunning = true;
        currentBalance -= 200;
        updateBalanceDisplay();
        
        const multEl = document.getElementById('crash-multiplier');
        const actionCont = document.getElementById('crash-action-container');
        const mainBtn = document.getElementById('btn-spin');
        
        actionCont.style.display = 'block';
        mainBtn.disabled = true;
        
        let crashMultiplier = 1.00;
        const crashPoint = (Math.random() * 3.5 + 1.01).toFixed(2); // Random crash point 1.01 to 4.5
        
        statusText.innerText = "Rocket Ascending...";
        
        const interval = setInterval(() => {
            if (!isSimulatorRunning) {
                // User cashed out successfully
                clearInterval(interval);
                return;
            }
            
            crashMultiplier += 0.05;
            multEl.innerText = crashMultiplier.toFixed(2) + 'x';
            
            if (parseFloat(crashMultiplier.toFixed(2)) >= parseFloat(crashPoint)) {
                // Rocket Crashed
                clearInterval(interval);
                multEl.style.color = '#ff5252';
                statusText.innerHTML = `<span style="color:#ff5252">CRASHED at ${crashPoint}x!</span>`;
                actionCont.style.display = 'none';
                mainBtn.disabled = false;
                isSimulatorRunning = false;
            }
        }, 100);
        
    } else if (currentActiveGame === 'wheel') {
        if (currentBalance < 100) {
            statusText.innerText = "Insufficient Balance! Reset wallet.";
            return;
        }
        isSimulatorRunning = true;
        currentBalance -= 100;
        updateBalanceDisplay();
        
        statusText.innerText = "Spinning wheel...";
        
        const wheel = document.getElementById('wheel-spinner');
        const randomDegree = Math.floor(Math.random() * 360) + 1440; // Spin at least 4 full rotations
        
        wheel.style.transform = `rotate(${randomDegree}deg)`;
        
        setTimeout(() => {
            // Determine result slice based on final angle
            const normalizedDegree = randomDegree % 360;
            let winMultiplier = 1;
            
            // 8 segments wheel
            const slice = Math.floor(normalizedDegree / 45);
            const multipliers = [1.5, 0.5, 10, 0, 5, 2, 20, 0.25];
            winMultiplier = multipliers[slice];
            
            const winAmount = 100 * winMultiplier;
            currentBalance += winAmount;
            
            if (winMultiplier > 1) {
                statusText.innerHTML = `<span style="color:#25d366">Landed on ${winMultiplier}x! Won $${winAmount}!</span>`;
            } else if (winMultiplier === 1 || winMultiplier === 0.5 || winMultiplier === 0.25) {
                statusText.innerText = `Landed on ${winMultiplier}x. Got back $${winAmount}.`;
            } else {
                statusText.innerHTML = `<span style="color:#ff5252">Landed on 0x! Try again!</span>`;
            }
            
            updateBalanceDisplay();
            isSimulatorRunning = false;
        }, 3100);
    }
}

// Cash Out logic for Crash Game
function cashOutCrash() {
    if (!isSimulatorRunning || currentActiveGame !== 'crash') return;
    
    const multText = document.getElementById('crash-multiplier').innerText;
    const finalMult = parseFloat(multText);
    const winAmount = Math.round(200 * finalMult);
    
    currentBalance += winAmount;
    updateBalanceDisplay();
    
    const statusText = document.getElementById('game-status');
    statusText.innerHTML = `<span style="color:#25d366">CASHED OUT! Won $${winAmount} (${finalMult}x)!</span>`;
    
    document.getElementById('crash-multiplier').style.color = '#25d366';
    document.getElementById('crash-action-container').style.display = 'none';
    document.getElementById('btn-spin').disabled = false;
    isSimulatorRunning = false;
}

// --- Contact Agent Modal Trigger ---
function openContactModal() {
    scrollToSection('contacts');
}

// --- Dynamic Prefilled messaging Link generator & Form Handler ---
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const market = document.getElementById('form-platform').value;
    const msg = document.getElementById('form-msg').value;
    
    // Construct Telegram / WhatsApp text
    const text = `Hello Rolling Dice Agent!%0A%0ACompany: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ATarget Market: ${encodeURIComponent(market)}%0APlan Details: ${encodeURIComponent(msg)}`;
    
    alert(`Thank you, ${name}! Redirecting you to Telegram support with your pre-filled inquiry...`);
    
    // Redirect to Telegram
    window.open(`https://t.me/grand_million_support?text=${text}`, '_blank');
}
