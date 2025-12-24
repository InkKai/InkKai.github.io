/**
 * dashboard.js
 * 負責首頁的所有互動邏輯：
 * 1. 學習進度追蹤 (Progress Tracking)
 * 2. AI 學習助教 (Gemini Chatbot - Real Integration)
 */

// ==========================================
// Part 1: 進度追蹤邏輯 (Progress Tracking)
// ==========================================

const TOTAL_DAYS = 30;
let completedDays = JSON.parse(localStorage.getItem('rh_progress')) || [];

function updateUI() {
    // 1. 更新文字計數
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.innerText = `${completedDays.length} / ${TOTAL_DAYS}`;
    }
    
    // 2. 更新進度條寬度
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const percentage = (completedDays.length / TOTAL_DAYS) * 100;
        progressFill.style.width = `${percentage}%`;
    }

    // 3. 更新每一張卡片的視覺狀態
    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const card = document.getElementById(`card-${i}`);
        if (card) {
            if (completedDays.includes(i)) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        }
    }
}

function toggleDay(dayId) {
    if (completedDays.includes(dayId)) {
        completedDays = completedDays.filter(d => d !== dayId);
    } else {
        completedDays.push(dayId);
    }
    localStorage.setItem('rh_progress', JSON.stringify(completedDays));
    updateUI();
}

function resetProgress() {
    if (confirm('確定要清除所有進度嗎？此動作無法復原。')) {
        completedDays = [];
        localStorage.setItem('rh_progress', JSON.stringify(completedDays));
        updateUI();
    }
}

// ==========================================
// Part 2: AI 學習助教邏輯 (Gemini Chatbot)
// ==========================================

// ★★★ 重要：請在此處填入你的 API Key ★★★
// 為了安全起見，建議在實際部署時使用環境變數或後端代理
const apiKey = ""; 

function toggleAIChat() {
    const modal = document.getElementById('ai-chat-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        // 如果打開對話框，自動聚焦到輸入框
        if (!modal.classList.contains('hidden')) {
            setTimeout(() => document.getElementById('user-input').focus(), 100);
        }
    }
}

// 簡單的 Markdown 格式化函數
function formatAIResponse(text) {
    // 處理程式碼區塊 (```code```)
    let formatted = text.replace(/```([\s\S]*?)```/g, '<div class="bg-slate-900 p-2 rounded my-1 text-xs font-mono overflow-x-auto text-emerald-300">$1</div>');
    // 處理粗體 (**text**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
    // 處理單行程式碼 (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="bg-slate-700 px-1 rounded text-emerald-200 font-mono text-xs">$1</span>');
    // 處理換行
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const history = document.getElementById('chat-history');
    const userText = input.value.trim();

    if (!userText) return;

    // 1. 顯示使用者訊息
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = "text-right";
    userMsgDiv.innerHTML = `<span class="bg-emerald-600 text-white px-3 py-2 rounded-lg rounded-tr-none inline-block text-left shadow-md">${userText}</span>`;
    history.appendChild(userMsgDiv);
    
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // 2. 顯示思考中動畫
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "text-left";
    loadingDiv.innerHTML = `<span class="bg-slate-700 text-slate-300 px-3 py-2 rounded-lg rounded-tl-none inline-block shadow-md"><i class="fas fa-circle-notch fa-spin mr-2"></i> 思考中...</span>`;
    history.appendChild(loadingDiv);
    history.scrollTop = history.scrollHeight;

    // 檢查 API Key
    if (!apiKey) {
        history.removeChild(loadingDiv);
        const errorDiv = document.createElement('div');
        errorDiv.className = "text-left";
        errorDiv.innerHTML = `<span class="bg-red-900/80 text-white px-3 py-2 rounded-lg rounded-tl-none inline-block shadow-md border border-red-700">⚠️ 請先設定 Gemini API Key 喔！<br><span class="text-xs text-red-200">請編輯 assets/js/dashboard.js 檔案。</span></span>`;
        history.appendChild(errorDiv);
        history.scrollTop = history.scrollHeight;
        return;
    }

    try {
        // 設定系統提示詞 (System Prompt)
        const systemPrompt = "你是一位資深的 Linux 講師，專精於 RHCSA (Red Hat Certified System Administrator) 與 RHCE 認證教學。你的名字是「Linux 助教」。請用繁體中文回答學生的問題。回答要簡潔、準確，並多給予鼓勵。如果涉及指令，請提供範例。";

        // 呼叫 Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userText }]
                }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                }
            })
        });

        const data = await response.json();
        
        // 移除載入動畫
        history.removeChild(loadingDiv);

        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我現在有點忙，請稍後再試。";

        // 3. 顯示 AI 回覆 (經過格式化)
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = "text-left";
        aiMsgDiv.innerHTML = `<span class="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg rounded-tl-none inline-block shadow-md leading-relaxed">${formatAIResponse(aiText)}</span>`;
        history.appendChild(aiMsgDiv);

    } catch (error) {
        console.error("AI Error:", error);
        // 確保移除 loading (如果發生錯誤時還在)
        if(loadingDiv.parentNode === history) history.removeChild(loadingDiv);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = "text-left";
        errorDiv.innerHTML = `<span class="bg-red-900/80 text-white px-3 py-2 rounded-lg rounded-tl-none inline-block shadow-md">連線發生錯誤，請檢查網路或 API Key。<br><span class="text-xs text-red-300">${error.message || ""}</span></span>`;
        history.appendChild(errorDiv);
    }
    
    history.scrollTop = history.scrollHeight;
}

// ==========================================
// Part 3: 初始化與事件監聽
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化進度介面
    updateUI();

    // 綁定 AI 聊天室的 Enter 鍵發送功能
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
