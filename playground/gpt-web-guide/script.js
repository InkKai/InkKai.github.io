document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. 平滑滾動功能 (確保導航點擊體驗流暢)
    // ----------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // 確保目標元素存在
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----------------------------------------------------------------
    // 2. QNA 彈窗功能
    // ----------------------------------------------------------------
    const modal = document.getElementById("qna-modal");
    const closeBtn = document.querySelector(".close-button");
    const qnaCards = document.querySelectorAll(".qna-card");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    // 開啟彈窗的函數
    const openModal = (title, content) => {
        modalTitle.textContent = title;
        // 將內容以 HTML 格式插入，確保 code 標籤能正確顯示
        modalBody.innerHTML = content; 
        modal.style.display = "block";
        // 阻止背景滾動
        document.body.style.overflow = "hidden"; 
    }

    // 關閉彈窗的函數
    const closeModal = () => {
        modal.style.display = "none";
        // 恢復背景滾動
        document.body.style.overflow = "auto";
    }

    // 綁定點擊卡片事件
    qnaCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const content = card.getAttribute('data-content');
            // 只有當 content 存在時才開啟彈窗
            if (content) {
                openModal(title, content);
            }
        });
    });

    // 綁定關閉按鈕事件
    closeBtn.addEventListener('click', closeModal);

    // 點擊視窗外部關閉彈窗
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // ----------------------------------------------------------------
    // 3. 互動遊戲邏輯 (CSS 屬性猜猜樂)
    // ----------------------------------------------------------------
    const gameOptions = document.querySelectorAll('.game-option');
    const targetBox = document.getElementById('target-box');
    const feedback = document.getElementById('game-feedback');
    const resetButton = document.getElementById('reset-game');

    gameOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            // 點擊後，禁用所有按鈕
            gameOptions.forEach(btn => btn.disabled = true);
            resetButton.style.display = 'block';

            const isCorrect = e.target.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                // 正確答案：添加居中 class，這是樣式表裡定義的 margin: 0 auto;
                targetBox.classList.add('centered-box');
                e.target.classList.add('correct');
                feedback.innerHTML = '✅ **太棒了！** <code>margin: 0 auto;</code> 是讓區塊水平居中的經典方法。';
                feedback.style.color = '#00BF63';
            } else {
                // 錯誤答案：給予反饋
                e.target.classList.add('incorrect');
                feedback.innerHTML = '❌ **再想想！** 這個屬性無法讓區塊**水平居中**。請點擊再來一題試試。';
                feedback.style.color = '#E74C3C';
            }
        });
    });

    // 重設遊戲
    resetButton.addEventListener('click', () => {
        gameOptions.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
        targetBox.classList.remove('centered-box');
        feedback.textContent = '';
        feedback.style.color = '';
        resetButton.style.display = 'none';
    });
});