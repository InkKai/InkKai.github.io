/* js/camera.js - 監控畫面邏輯 */

// 實時更新時間
function updateTime() {
    const now = new Date();
    // 格式化時間字串 YYYY-MM-DD HH:MM:SS
    const str = now.getFullYear() + "-" + 
                String(now.getMonth()+1).padStart(2, '0') + "-" + 
                String(now.getDate()).padStart(2, '0') + " " + 
                String(now.getHours()).padStart(2, '0') + ":" + 
                String(now.getMinutes()).padStart(2, '0') + ":" + 
                String(now.getSeconds()).padStart(2, '0');
    
    const display = document.getElementById('timeDisplay');
    if(display) {
        display.innerText = str;
    }
}

// 啟動計時器 (每秒跑一次)
setInterval(updateTime, 1000);
updateTime(); // 網頁一打開先跑一次，避免第一秒是空的

// 快速解鎖功能
function quickUnlock() {
    if(confirm("確定要遠端開啟房門嗎？")) {
        alert("門鎖已開啟 (Quick Access)");
    }
}

// 通話功能
function toggleMic() {
    alert('通話功能開啟 (模擬)');
}

// 警報功能
function triggerAlarm() {
    alert('警衛室已收到通報');
}