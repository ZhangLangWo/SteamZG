// ==UserScript==
// @name         SteamZG 二维码链接自动解码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动解码 xj.steamzg.com 页面上的 data-qr-url 并显示明文链接
// @author       GYXS
// @match        https://xj.steamzg.com/*
// @match        https://acfb.top/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function initDecoder() {
        // 找到所有包含 data-qr-url 属性的元素
        const qrElements = document.querySelectorAll('[data-qr-url]');

        qrElements.forEach(el => {
            // 防止重复处理
            if (el.dataset.decoded === 'true') return;

            const encodedData = el.getAttribute('data-qr-url');
            if (!encodedData) return;

            try {
                // 解码 Base64
                const decodedUrl = atob(encodedData);

                // 创建显示容器
                const container = document.createElement('div');
                container.style.marginTop = '10px';
                container.style.padding = '8px';
                container.style.background = '#f9f9f9';
                container.style.border = '1px dashed #ccc';
                container.style.borderRadius = '4px';
                container.style.fontSize = '13px';
                container.style.color = '#333';
                container.style.wordBreak = 'break-all';

                // 链接文本
                container.innerHTML = `<strong>资源链接：</strong><br><a href="${decodedUrl}" target="_blank" style="color: #007bff; text-decoration: underline;">${decodedUrl}</a>`;

                // 复制按钮
                const copyBtn = document.createElement('button');
                copyBtn.innerText = '复制链接';
                copyBtn.style.marginLeft = '10px';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.padding = '2px 8px';
                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    GM_setClipboard(decodedUrl);
                    copyBtn.innerText = '已复制！';
                    setTimeout(() => copyBtn.innerText = '复制链接', 2000);
                };

                container.appendChild(copyBtn);
                el.appendChild(container);

                // 标记已处理
                el.dataset.decoded = 'true';

            } catch (e) {
                console.error('Base64 解码失败:', e);
            }
        });
    }

    // 页面加载完成后运行
    window.addEventListener('load', initDecoder);

    // 针对动态加载的内容（如下拉加载），使用观察器
    const observer = new MutationObserver(() => initDecoder());
    observer.observe(document.body, { childList: true, subtree: true });

})();