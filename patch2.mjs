import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

// Add aria labels for icon-only buttons
content = content.replace(/<button id="refreshBtn".*?>/g, '<button id="refreshBtn" aria-label="Refresh Map Data" class="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-slate-600" title="Refresh Map Data">');
content = content.replace(/<button id="closeAnalytics".*?>/g, '<button id="closeAnalytics" aria-label="Close Analytics Dashboard" class="text-slate-500 hover:text-slate-800 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">');
content = content.replace(/<button id="toggleSidebar".*?>/g, '<button id="toggleSidebar" aria-label="Toggle Sidebar Navigation" aria-expanded="true" aria-controls="sidebar" class="absolute top-1/2 -right-6 w-6 h-16 bg-white border border-l-0 border-slate-200 rounded-r-md shadow-[4px_0_10px_rgba(0,0,0,0.05)] items-center justify-center z-30 transform -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer hidden md:flex">');
content = content.replace(/<button id="cancelPinMode" class="ml-2 bg-white\/20 hover:bg-white\/30 rounded-full p-2 min-h-\[44px\] min-w-\[44px\] flex items-center justify-center transition-colors">/g, '<button id="cancelPinMode" aria-label="Cancel Map Pin Selection" class="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">');
content = content.replace(/<button id="toggleLegend".*?>/g, '<button id="toggleLegend" aria-expanded="false" aria-controls="legendContent" aria-label="Toggle Map Legend" class="flex items-center justify-between w-full md:hidden">');

// Focus trapping script
const focusTrapScript = `
        // --- Accessibility Focus Trapping ---
        function trapFocus(modalId, closeBtnId) {
            const modal = document.getElementById(modalId);
            const closeBtn = document.getElementById(closeBtnId);
            if(!modal) return;
            
            const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
            let focusableElements = Array.from(modal.querySelectorAll(focusableElementsString)).filter(el => !el.classList.contains('hidden') && el.offsetParent !== null);
            
            if(focusableElements.length === 0) return;
            
            const firstTabStop = focusableElements[0];
            const lastTabStop = focusableElements[focusableElements.length - 1];

            // Always focus the first element when opening
            firstTabStop.focus();

            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    // Refresh elements in case visibility changed
                    focusableElements = Array.from(modal.querySelectorAll(focusableElementsString)).filter(el => !el.classList.contains('hidden') && el.offsetParent !== null);
                    if(focusableElements.length === 0) return;
                    const first = focusableElements[0];
                    const last = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) { 
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
                if (e.key === 'Escape') {
                    if (closeBtn) closeBtn.click();
                }
            });
        }
`;

// Insert the trapFocus script at the top of the script tag
content = content.replace('<script>', '<script>' + focusTrapScript);

// Apply it to the modals in JavaScript
content = content.replace("reportModal.classList.add('flex');", "reportModal.classList.add('flex');\\n            setTimeout(() => trapFocus('reportModal', 'closeReportModal'), 50);");
content = content.replace("reportDisclaimerModal.classList.remove('hidden');", "reportDisclaimerModal.classList.remove('hidden');\\n            setTimeout(() => trapFocus('reportDisclaimerModal', 'closeDisclaimerModal'), 50);");

// Remove duplicate map pin mode banner at the bottom (lines 455-462)
content = content.replace(/<!-- Map Pin Mode Banner -->[\s\S]*?<div id="pinModeBanner"[\s\S]*?<\/div>\s*<!-- Loading Overlay -->/, '<!-- Loading Overlay -->');

fs.writeFileSync('index.html', content);
console.log('Applied script modifications');
