// React 和 ReactDOM 都是透過 CDN 全域引入的。

/**
 * 計數器元件
 */
function Counter() {
    // 使用 React.useState 呼叫 Hook
    const [count, setCount] = React.useState(0); 

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    return (
        <div className="counter-container">
            <h2>React 狀態計數器</h2>
            
            <p className="count-display">
                {count}
            </p>

            <button 
                onClick={decrement} 
                className="counter-button decrement-btn"
                disabled={count === 0}
            >
                減少 (-1)
            </button>

            <button 
                onClick={increment} 
                className="counter-button increment-btn"
            >
                增加 (+1)
            </button>
        </div>
    );
}

// ******************************************************
// ** 渲染區塊：將元件掛載到 HTML 的 #root 上 **
// ******************************************************

// 找到 HTML 中的掛載點
const rootElement = document.getElementById('root');

if (rootElement) {
    // 建立 React 根節點
    const root = ReactDOM.createRoot(rootElement);

    // 渲染 Counter 元件到掛載點上
    root.render(
        <React.StrictMode>
            {/* 將整個 Counter 元件渲染到 root 區塊 */}
            <Counter />
        </React.StrictMode>
    );
}
