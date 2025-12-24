// 初始資料
let data = [];
const GRID_SIZE = 12; // 產生幾個數字
// 一些 DOM 元素
const displayArea = document.getElementById('display-area');
const statusText = document.getElementById('status-text');
const sortBtn = document.getElementById('sortBtn');
const searchBtn = document.getElementById('searchBtn');

// --- 工具函式 ---

// 魔法函式：讓程式暫停指定的毫秒數 (ms)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 更新狀態文字
function setStatus(text, isSystem = false) {
    statusText.innerHTML = (isSystem ? "SYSTEM: " : "") + text + "<span class='blinking-cursor'></span>";
}

// 產生隨機陣列
function generateRandomData() {
    data = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        // 產生 1 到 99 的隨機數字
        data.push(Math.floor(Math.random() * 99) + 1);
    }
}

// 渲染畫面：把 data 陣列畫成方塊
// currentComparing: 正在比較的兩個索引 [i, j]
// sortedIndices: 已經排好序的索引列表
// midIndex: 二元搜尋的中間點
// searchRange: 二元搜尋的範圍 [left, right]
function render(currentComparing = [], sortedIndices = [], midIndex = -1, searchRange = []) {
    displayArea.innerHTML = ''; // 清空
    for (let i = 0; i < data.length; i++) {
        const box = document.createElement('div');
        box.className = 'num-box';
        box.innerText = data[i];
        box.id = `box-${i}`;
        
        // --- 根據狀態加入 CSS 特效類別 ---

        // 1. 如果是正在比較的兩個數字 -> 變黃色
        if (currentComparing.includes(i)) {
            box.classList.add('comparing');
        }
        
        // 2. 如果是已經排好的數字 -> 變綠色
        if (sortedIndices.includes(i)) {
            box.classList.add('sorted');
        }

        // --- 二元搜尋相關特效 ---
        if (searchRange.length > 0) {
             // 如果不在搜尋範圍內 -> 變暗
            if (i < searchRange[0] || i > searchRange[1]) {
                box.classList.add('dimmed');
            }
             // 如果是中間點 -> 變亮白
            if (i === midIndex) {
                 box.classList.add('mid-point');
            }
        }
        displayArea.appendChild(box);
    }
}

// --- 主要功能函式 ---

// 初始化
window.onload = function() {
    resetArray();
};

function resetArray() {
    generateRandomData();
    render();
    setStatus("系統重置完成。資料已重新生成。");
    enableControls();
    // 清除搜尋結果特效
    document.querySelectorAll('.num-box').forEach(box => box.classList.remove('found'));
}

// 鎖定按鈕，防止動畫中途被干擾
function disableControls() {
    sortBtn.disabled = true;
    searchBtn.disabled = true;
}
// 解鎖按鈕
function enableControls() {
    sortBtn.disabled = false;
    searchBtn.disabled = false;
}

// 打散 (帶一點簡單動畫)
async function shuffleArrayAnimated() {
    disableControls();
    setStatus("正在執行 Fisher-Yates 洗牌演算法...");
    let n = data.length;
    // 快速閃爍特效
    for (let k = 0; k < 5; k++) {
        displayArea.style.opacity = 0.5;
        await sleep(50);
        displayArea.style.opacity = 1;
        await sleep(50);
    }

    // 邏輯同之前的 Python 版本
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // 交換
        [data[i], data[j]] = [data[j], data[i]];
    }
    render();
    setStatus("洗牌完成！資料已隨機化。");
    enableControls();
}

// ==========================================
// 重點一：視覺化氣泡排序 (Visualized Bubble Sort)
// ==========================================
async function visualizeBubbleSort() {
    disableControls();
    setStatus("氣泡排序程序啟動...");
    let n = data.length;
    let sortedIndices = []; // 紀錄哪些已經排好了

    // 外層迴圈
    for (let i = 0; i < n; i++) {
        // 內層迴圈
        for (let j = 0; j < n - 1 - i; j++) {
            
            // 【視覺化步驟 1】：標記正在比較的兩個方塊 (變黃色)
            setStatus(`正在比較索引 [${j}] 和 [${j+1}] 的數值...`);
            render([j, j+1], sortedIndices); 
            await sleep(600); // 暫停 0.6 秒讓你稍微看一下

            // 比較
            if (data[j] > data[j + 1]) {
                // 【視覺化步驟 2】：需要交換！加上紅色閃爍特效
                setStatus(`發現 ${data[j]} > ${data[j+1]}，執行交換！`);
                const boxJ = document.getElementById(`box-${j}`);
                const boxJPlus1 = document.getElementById(`box-${j+1}`);
                boxJ.classList.add('swapping');
                boxJPlus1.classList.add('swapping');
                await sleep(400); // 暫停讓你看紅色閃爍

                // 執行資料交換
                let temp = data[j];
                data[j] = data[j + 1];
                data[j + 1] = temp;
                
                // 交換後重新渲染，保持比較狀態
                render([j, j+1], sortedIndices);
                await sleep(300); 
            }
        }
        // 這一輪最大的泡泡已經浮到最右邊了 (n-1-i)
        sortedIndices.push(n - 1 - i);
        render([], sortedIndices); // 更新綠色狀態
        setStatus(`已確認索引 [${n - 1 - i}] 的位置。`);
        await sleep(200);
    }
    
    setStatus("排序程序完成。所有資料已索引。");
    render([], Array.from(Array(n).keys())); // 全部變綠
    enableControls();
}

// ==========================================
// 重點二：視覺化二元搜尋 (Visualized Binary Search)
// ==========================================
async function visualizeBinarySearch() {
    const targetInput = document.getElementById('searchInput');
    const target = parseInt(targetInput.value);

    if (isNaN(target)) {
        setStatus("錯誤：請輸入有效的目標數字。", true);
        targetInput.focus();
        return;
    }

    disableControls();
    setStatus(`搜尋目標鎖定：[ ${target} ]。啟動二元掃描...`);
    await sleep(500);

    let left = 0;
    let right = data.length - 1;
    let foundIndex = -1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        // 【視覺化步驟】：顯示目前的搜尋範圍 (left到right) 和中間點 (mid)
        setStatus(`掃描範圍：索引 [${left}] 到 [${right}]。檢查中間點 [${mid}] (數值: ${data[mid]})...`);
        render([], [], mid, [left, right]);
        await sleep(1500); // 這裡要停久一點，讓你觀察範圍

        if (data[mid] === target) {
            foundIndex = mid;
            setStatus(`目標鎖定！在索引 [${mid}] 找到數值 ${target}。`);
            break; // 找到了
        } else if (data[mid] < target) {
            setStatus(`中間值 ${data[mid]} 太小。目標在右半區。忽略左側。`);
            left = mid + 1; // 往右邊找
        } else {
            setStatus(`中間值 ${data[mid]} 太大。目標在左半區。忽略右側。`);
            right = mid - 1; // 往左邊找
        }
        await sleep(1000);
    }

    // 搜尋結束後的處理
    render(); // 清除搜尋過程的特效
    if (foundIndex !== -1) {
        // 找到了！加上超級綠光特效
        const foundBox = document.getElementById(`box-${foundIndex}`);
        foundBox.classList.add('found');
    } else {
        setStatus(`掃描結束。未在資料中發現目標 ${target}。(請確認是否已排序)`);
    }
    enableControls();
}