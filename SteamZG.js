// ==UserScript==
// @name         SteamZG 二维码链接自动解码
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动解码 xj.steamzg.com 页面上的 data-qr-url 并显示明文链接，优化性能和用户体验
// @author       GYXS
// @match        https://xj.steamzg.com/*
// @match        https://acfb.top/*
// @grant        GM_setClipboard
// @license      Private
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const styles = {
        container: {
            marginTop: '10px',
            padding: '8px',
            background: '#f9f9f9',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#333',
            wordBreak: 'break-all'
        },
        link: {
            color: '#007bff',
            textDecoration: 'underline'
        },
        button: {
            marginLeft: '10px',
            cursor: 'pointer',
            padding: '2px 8px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            background: '#fff',
            fontSize: '12px'
        },
        buttonHover: {
            background: '#f0f0f0'
        },
        error: {
            color: '#dc3545',
            fontWeight: 'bold'
        }
    };

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 应用样式
    function applyStyles(element, styleObject) {
        for (const [property, value] of Object.entries(styleObject)) {
            element.style[property] = value;
        }
    }

    // 检查链接是否有效
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 解码并处理单个元素
    function processElement(el) {
        // 防止重复处理
        if (el.dataset.decoded === 'true') return;

        const encodedData = el.getAttribute('data-qr-url');
        if (!encodedData) return;

        try {
            // 解码 Base64
            const decodedUrl = atob(encodedData);

            // 创建显示容器
            const container = document.createElement('div');
            applyStyles(container, styles.container);

            // 检查链接有效性
            if (isValidUrl(decodedUrl)) {
                // 链接文本
                container.innerHTML = `<strong>资源链接：</strong><br><a href="${decodedUrl}" target="_blank" style="color: ${styles.link.color}; text-decoration: ${styles.link.textDecoration};">${decodedUrl}</a>`;

                // 复制按钮
                const copyBtn = document.createElement('button');
                copyBtn.innerText = '复制链接';
                applyStyles(copyBtn, styles.button);
                
                // 添加悬停效果
                copyBtn.addEventListener('mouseover', () => applyStyles(copyBtn, styles.buttonHover));
                copyBtn.addEventListener('mouseout', () => applyStyles(copyBtn, styles.button));
                
                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    GM_setClipboard(decodedUrl);
                    copyBtn.innerText = '已复制！';
                    setTimeout(() => copyBtn.innerText = '复制链接', 2000);
                };

                container.appendChild(copyBtn);
            } else {
                // 无效链接提示
                container.innerHTML = `<span style="color: ${styles.error.color}; font-weight: ${styles.error.fontWeight};">解码失败：无效的链接格式</span>`;
            }

            el.appendChild(container);

            // 标记已处理
            el.dataset.decoded = 'true';

        } catch (e) {
            console.error('Base64 解码失败:', e);
            
            // 显示错误信息
            const container = document.createElement('div');
            applyStyles(container, styles.container);
            container.innerHTML = `<span style="color: ${styles.error.color}; font-weight: ${styles.error.fontWeight};">解码失败：${e.message}</span>`;
            el.appendChild(container);
            el.dataset.decoded = 'true';
        }
    }

    // 初始化解码器
    function initDecoder() {
        // 找到所有包含 data-qr-url 属性的元素
        const qrElements = document.querySelectorAll('[data-qr-url]');
        qrElements.forEach(processElement);
    }

    // 防抖处理的初始化函数
    const debouncedInitDecoder = debounce(initDecoder, 200);

    // 页面加载完成后运行
    window.addEventListener('load', initDecoder);

    // 针对动态加载的内容（如下拉加载），使用观察器
    const observer = new MutationObserver(debouncedInitDecoder);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        // 只观察可能包含 data-qr-url 的元素变化
        attributes: false
    });

})();