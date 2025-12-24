// 自動抓取當前年份，並填入 id="current-year" 的位置
document.getElementById('current-year').textContent = new Date().getFullYear();

// 可以在這裡加一句 Console Log 證明 JS 有在運作
console.log("Ink Chronicle System Loaded. Welcome, Kai.");