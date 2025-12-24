/* js/ac.js - 冷氣控制邏輯 */

let powerOn = true;
let temperature = 26;
let modes = ['冷氣模式', '除濕模式', '送風模式'];
let modeIcons = ['fa-snowflake', 'fa-droplet', 'fa-wind'];
let currentModeIndex = 0;

const controller = document.getElementById('controller');
const tempText = document.getElementById('tempText');
const modeText = document.getElementById('modeText');

// 切換電源
function togglePower() {
    powerOn = !powerOn;
    if (powerOn) {
        controller.classList.remove('off');
    } else {
        controller.classList.add('off');
    }
}

// 調整溫度
function changeTemp(amount) {
    if (!powerOn) return; // 關機時不能按

    temperature += amount;

    // 限制溫度範圍
    if (temperature > 30) temperature = 30;
    if (temperature < 16) temperature = 16;

    updateDisplay();
}

// 切換模式 (純視覺)
function changeMode() {
    if (!powerOn) return;
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    updateDisplay();
}

// 模擬切換風速 (純視覺提示)
function toggleFan() {
    if (!powerOn) return;
    // 這裡可以加一些動畫，目前先簡單彈出提示
    // 實際專案可以做一個風速圖示變化
    alert("風速已調整 (模擬)"); 
}

function updateDisplay() {
    // 更新數字
    tempText.innerHTML = `${temperature}<span class="unit">°C</span>`;
    
    // 更新模式文字與圖示
    modeText.innerHTML = `<i class="fa-solid ${modeIcons[currentModeIndex]}"></i> ${modes[currentModeIndex]}`;
}