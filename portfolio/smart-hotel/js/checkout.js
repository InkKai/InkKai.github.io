/* js/checkout.js - 退房功能邏輯 */

// 星星評分邏輯
const stars = document.querySelectorAll('.stars i');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        currentRating = value;
        updateStars(value);
    });
});

function updateStars(value) {
    stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        if (starVal <= value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// 退房流程模擬
function startCheckout() {
    if (currentRating === 0) {
        alert("請幫我們評分後再退房喔！");
        return;
    }

    if(!confirm("確定要現在退房嗎？\n房間電源將會自動關閉。")) return;

    const overlay = document.getElementById('overlay');
    const msg = document.getElementById('msg');
    const subMsg = document.getElementById('subMsg');
    const spinner = document.getElementById('spinner');
    const successIcon = document.getElementById('successIcon');

    // 1. 顯示遮罩
    overlay.classList.add('show');

    // 2. 模擬一連串的系統動作
    setTimeout(() => {
        msg.innerText = "付款確認成功";
        subMsg.innerText = "電子發票已寄至您的信箱";
    }, 1500);

    setTimeout(() => {
        msg.innerText = "正在關閉房間電源...";
        subMsg.innerText = "IOT System Shutting Down";
    }, 3000);

    setTimeout(() => {
        msg.innerText = "正在鎖定門鎖...";
        subMsg.innerText = "Locking Door...";
    }, 4500);

    // 3. 完成
    setTimeout(() => {
        spinner.style.display = 'none';
        successIcon.style.display = 'block';
        msg.innerText = "退房完成";
        subMsg.innerText = "感謝您的入住，期待再次光臨";
        
        // 3秒後自動跳轉回首頁 (因為已經退房了嘛)
        setTimeout(() => { 
            window.location.href = 'index.html'; 
        }, 3000);
    }, 6000);
}