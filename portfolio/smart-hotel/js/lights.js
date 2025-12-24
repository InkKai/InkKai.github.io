/* js/lights.js - 燈光控制邏輯 */

// 燈光資料 (模擬從資料庫抓取)
const lightsData = [
    { id: 'main', name: '主燈 (Main)', icon: 'fa-lightbulb' },
    { id: 'bed', name: '床頭燈 (Bed)', icon: 'fa-bed' },
    { id: 'bath', name: '浴室燈 (Bath)', icon: 'fa-bath' },
    { id: 'desk', name: '閱讀燈 (Desk)', icon: 'fa-book-open' }
];

const grid = document.getElementById('lightsGrid');

// 產生燈光卡片
function renderLights() {
    grid.innerHTML = '';
    lightsData.forEach(light => {
        const card = document.createElement('div');
        card.className = 'light-card';
        card.id = `card-${light.id}`;
        card.onclick = () => toggleLight(light.id);
        
        card.innerHTML = `
            <div class="icon-circle">
                <i class="fa-solid ${light.icon}"></i>
            </div>
            <div class="info">
                <div class="label">${light.name}</div>
                <div class="status" id="status-${light.id}">已關閉</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 單燈切換功能
function toggleLight(id) {
    const card = document.getElementById(`card-${id}`);
    const statusText = document.getElementById(`status-${id}`);
    
    // 切換 class
    card.classList.toggle('on');

    // 更新文字
    if (card.classList.contains('on')) {
        statusText.innerText = "已開啟";
    } else {
        statusText.innerText = "已關閉";
    }
}

// 全開 / 全關 功能
function toggleAll(turnOn) {
    lightsData.forEach(light => {
        const card = document.getElementById(`card-${light.id}`);
        const statusText = document.getElementById(`status-${light.id}`);
        
        if (turnOn) {
            if (!card.classList.contains('on')) {
                card.classList.add('on');
                statusText.innerText = "已開啟";
            }
        } else {
            card.classList.remove('on');
            statusText.innerText = "已關閉";
        }
    });
}

// 初始化畫面
renderLights();