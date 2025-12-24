/* js/lock.js - 智慧門鎖邏輯 */

let isLocked = true; // 預設狀態：鎖定
const btn = document.getElementById('lockBtn');
const icon = document.getElementById('icon');
const text = document.getElementById('statusText');

function toggleLock() {
    // 1. 模擬網路延遲 (讓它感覺像是在連線雲端)
    btn.classList.add('loading');
    text.innerText = "連線中...";

    setTimeout(() => {
        isLocked = !isLocked; // 切換狀態

        // 2. 根據狀態改變外觀
        if (isLocked) {
            // 變回紅色鎖定
            btn.classList.remove('unlocked');
            btn.classList.add('locked');
            
            // 換圖示
            icon.classList.remove('fa-lock-open');
            icon.classList.add('fa-lock');
            
            text.innerText = "已上鎖";
        } else {
            // 變成綠色解鎖
            btn.classList.remove('locked');
            btn.classList.add('unlocked');
            
            // 換圖示
            icon.classList.remove('fa-lock');
            icon.classList.add('fa-lock-open');
            
            text.innerText = "房間已解鎖";
        }
        
        // 3. 移除讀取動畫
        btn.classList.remove('loading');

    }, 800); // 設定 0.8 秒的延遲，更有感
}