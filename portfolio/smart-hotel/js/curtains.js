/* js/curtains.js - 智慧窗簾邏輯 */

const slider = document.getElementById('curtainSlider');
const left = document.getElementById('curtainLeft');
const right = document.getElementById('curtainRight');
const text = document.getElementById('percentText');

function updateCurtains(value) {
    // value 是 0 (全關) 到 100 (全開)
    
    // 計算窗簾寬度: 0(開) -> 50%寬度, 100(開) -> 0%寬度
    const widthPercentage = 50 - (value / 2);
    
    left.style.width = widthPercentage + "%";
    right.style.width = widthPercentage + "%";
    
    text.innerText = value + "% 開啟";
    slider.value = value;
}

// 快捷按鈕用的函式
function setCurtain(value) {
    updateCurtains(value);
}