/**
 * Commercial Intent Dataset (Extended Knowledge Base Matrix)
 * CodeAlpha assignment ke liye refined cloud commercial queries data.
 */
const knowledgeBase = [
    {
        intent: "pricing",
        patterns: ["price", "cost", "how much", "subscription", "plan", "rate", "free", "trial", "payment", "cheap"],
        response: "Our commercial cloud instances start at \$0.004/hr for the Basic Tier computing nodes. Scale up to Dedicated Clusters at \$1.20/hr with multi-region scaling capabilities. We also offer a 30-day Free Trial with \$200 cloud credits!",
        suggestions: ["Show cloud plans", "Free Trial options"]
    },
    {
        intent: "capabilities",
        patterns: ["deploy", "aws", "azure", "kubernetes", "hosting", "what can you do", "features", "gcp", "docker", "serverless", "function"],
        response: "CloudVibe natively supports high-availability Kubernetes auto-scaling clusters, instant Docker runtime serverless containers, and multi-cloud sync pipelines across AWS, GCP, and Azure. You can deploy any app in under 60 seconds.",
        suggestions: ["Supported platforms", "API Documentation"]
    },
    {
        intent: "security",
        patterns: ["secure", "encryption", "safeguard", "compliance", "iso", "ddos", "hack", "leak", "safety", "firewall"],
        response: "Security is built natively into our architectural framework. All nodes process data using automatic TLS 1.3 network transport tunnels, AES-256 data-at-rest encryption layers, and proactive Advanced DDoS shielding blocks with ISO 27001 compliance.",
        suggestions: ["Compliance metrics", "Encryption whitepaper"]
    },
    {
        intent: "support",
        patterns: ["contact", "human", "help", "phone", "email", "ticket", "support", "talk", "agent", "chat"],
        response: "Our engineering operations command center runs 24/7/365. You can submit structural log tickets straight through the DevOps Console or reach out to our team directly via email at ops@cloudvibe.tech.",
        suggestions: ["Open urgent ticket", "Call Operations line"]
    },
    {
        intent: "greetings",
        patterns: ["hi", "hello", "hey", "assalam", "aao", "good morning", "good afternoon", "sup"],
        response: "Hello there! Welcome to CloudVibe Smart Support. I am your AI assistant. How can I help you with your cloud infrastructure or deployment today?",
        suggestions: ["Check Pricing", "Explore Features"]
    }
];

// Fallback replies (Jab bilkul kuch match na ho)
const genericFallbacks = [
    "I understand your query regarding cloud infrastructure. To give you the exact technical configuration, could you please check our active Platform Documentation guide?",
    "That sounds like a specific setup configuration. Let me look up our architectural manuals, or you can open a quick support ticket for our engineering team.",
    "Interesting question! Our commercial cloud platform handles this via edge network nodes. Would you like to check our API Documentation for details?"
];

// Page load hote hi timestamps aur initial pills show karna
document.addEventListener("DOMContentLoaded", () => {
    const timestampEl = document.getElementById("initial-timestamp");
    if (timestampEl) {
        timestampEl.innerText = getCurrentFormattedTime();
    }
    renderSuggestionPills(["Pricing plans", "Cloud capabilities", "Security standard", "Contact Ops Support"]);
});

// Helper: Current time calculate karne ke liye
function getCurrentFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Chat Window ko hide/show karne ka logic
function toggleChatWindow() {
    const windowEl = document.getElementById("chat-window");
    if (!windowEl) return;
    
    windowEl.classList.toggle("hidden");
    
    if (!windowEl.classList.contains("hidden")) {
        const inputField = document.getElementById("user-msg-input");
        if (inputField) inputField.focus();
    }
}

// Dynamic suggestion pills render karne ka function
function renderSuggestionPills(pillsList) {
    const container = document.getElementById("suggestions-grid");
    if (!container) return;
    
    container.innerHTML = ""; 
    
    pillsList.forEach(pillText => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "pill-btn";
        button.innerText = pillText;
        button.onclick = function() {
            executeMessageRoute(pillText);
        };
        container.appendChild(button);
    });
}

// Form submit input hander
function handleMessageSubmit(event) {
    event.preventDefault();
    const inputEl = document.getElementById("user-msg-input");
    if (!inputEl) return;
    
    const userQuery = inputEl.value.trim();
    if (!userQuery) return;
    
    inputEl.value = ""; 
    executeMessageRoute(userQuery);
}

// Core Execution Routing Engine
function executeMessageRoute(textMessage) {
    appendMessageCard(textMessage, "user");
    setBotStatusMode("typing");
    
    const logsContainer = document.getElementById("chat-logs");
    if (!logsContainer) return;
    
    const loaderWrapper = document.createElement("div");
    loaderWrapper.className = "message-wrapper bot temp-loader-node";
    loaderWrapper.innerHTML = `
        <div class="msg-bubble" style="display: flex; gap: 4px; padding: 0.75rem 1rem;">
            <span class="typing-dot" style="width:6px; height:6px; background:#94a3b8; border-radius:50%; display:inline-block;"></span>
            <span class="typing-dot" style="width:6px; height:6px; background:#94a3b8; border-radius:50%; display:inline-block;"></span>
            <span class="typing-dot" style="width:6px; height:6px; background:#94a3b8; border-radius:50%; display:inline-block;"></span>
        </div>
    `;
    logsContainer.appendChild(loaderWrapper);
    logsContainer.scrollTop = logsContainer.scrollHeight;

    setTimeout(() => {
        const activeLoader = document.querySelector(".temp-loader-node");
        if (activeLoader) activeLoader.remove();
        
        const botResponseData = evaluateRetrievalModel(textMessage);
        appendMessageCard(botResponseData.response, "bot");
        renderSuggestionPills(botResponseData.suggestions);
        setBotStatusMode("online");
    }, 600 + Math.random() * 500);
}

/**
 * Intelligent Scoring Matcher Engine
 * Yeh user ke pure sentence mein se words ko scan karke highest score nikalta hai.
 */
function evaluateRetrievalModel(rawQuery) {
    // Punctuation saaf karke words ki array banana
    const words = rawQuery.toLowerCase().split(/[^\w\s]/g).join("").split(/\s+/);
    
    let bestMatch = null;
    let highestScore = 0;
    
    // Pure dataset ko search karna
    for (let i = 0; i < knowledgeBase.length; i++) {
        const item = knowledgeBase[i];
        let currentScore = 0;
        
        // Match scan loop
        words.forEach(word => {
            if (word.length > 1 && item.patterns.includes(word)) {
                currentScore++; // Har match keyword par score barhega
            }
        });
        
        if (currentScore > highestScore) {
            highestScore = currentScore;
            bestMatch = item;
        }
    }
    
    // Agar koi matching keyword mil gaya to uska solution return karo
    if (highestScore > 0 && bestMatch) {
        return {
            response: bestMatch.response,
            suggestions: bestMatch.suggestions
        };
    }
    
    // Agar bilkul match na ho to fallback return karo
    const randomFallbackMsg = genericFallbacks[Math.floor(Math.random() * genericFallbacks.length)];
    return {
        response: randomFallbackMsg,
        suggestions: ["Pricing plans", "Cloud capabilities", "Security standard", "Contact Ops Support"]
    };
}

// Logs screen mein new message insert karne ka function
function appendMessageCard(textContent, identityRole) {
    const logsContainer = document.getElementById("chat-logs");
    if (!logsContainer) return;
    
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${identityRole}`;
    
    wrapper.innerHTML = `
        <div class="msg-bubble"></div>
        <span class="msg-timestamp">${getCurrentFormattedTime()}</span>
    `;
    
    wrapper.querySelector(".msg-bubble").textContent = textContent;
    logsContainer.appendChild(wrapper);
    logsContainer.scrollTop = logsContainer.scrollHeight; 
}

// Bot header status manager
function setBotStatusMode(targetStatus) {
    const label = document.querySelector(".bot-profile-info p");
    if (!label) return;
    
    if (targetStatus === "typing") {
        label.innerText = "Typing response...";
    } else {
        label.innerText = "Commercial Assistant";
    }
}

// Explore Console Button auto-link click integration
document.addEventListener("DOMContentLoaded", () => {
    const ctaBtn = document.querySelector(".cta-btn");
    if (ctaBtn) {
        ctaBtn.addEventListener("click", () => {
            const windowEl = document.getElementById("chat-window");
            if (windowEl && windowEl.classList.contains("hidden")) {
                toggleChatWindow();
                windowEl.scrollIntoView({ behavior: 'smooth' }); 
            }
        });
    }
});
