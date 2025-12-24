/* js/service.js - 機器人服務邏輯 */

const panel = document.getElementById('trackPanel');
const fill = document.getElementById('progFill');
const title = document.getElementById('statusTitle');
const desc = document.getElementById('statusDesc');

function order(item) {
    if(confirm(`確定要呼叫機器人配送「${item}」嗎？`)) {
        panel.classList.add('active');
        startSimulation();
    }
}

function updateStep(width, t, d, stepId) {
    fill.style.width = width + "%";
    title.innerText = t;
    desc.innerText = d;
    
    // 清除舊的亮燈
    const steps = ['step1', 'step2', 'step3', 'step4'];
    steps.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('active');
    });

    // 亮起目前的燈
    if(stepId) {
        document.getElementById(stepId).classList.add('active');
    }
}

function startSimulation() {
    // 1. 初始狀態
    updateStep(10, "訂單已確認", "機器人正在前往倉庫...", "step1");

    // 2. 取物 (2秒後)
    setTimeout(() => {
        updateStep(40, "物品裝載中", "機器人已取得物品", "step2");
    }, 2000);

    // 3. 搭梯 (5秒後)
    setTimeout(() => {
        updateStep(70, "正在搭乘電梯", "機器人正在前往 7 樓", "step3");
    }, 5000);

    // 4. 送達 (8秒後)
    setTimeout(() => {
        updateStep(100, "機器人已抵達", "請開門領取您的物品", "step4");
    }, 8000);
    
    // 5. 結束 (12秒後)
    setTimeout(() => {
        panel.classList.remove('active');
        alert("配送完成！祝您使用愉快");
    }, 12000);
}