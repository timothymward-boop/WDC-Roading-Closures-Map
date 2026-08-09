import fs from 'fs';

const legendAndBannerHTML = `
            <!-- Map Pin Mode Banner -->
            <div id="pinModeBanner" class="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-[60] hidden items-center gap-3 transition-all">
                <i aria-hidden="true" data-lucide="map-pin" class="w-5 h-5 animate-bounce"></i>
                <span class="font-medium text-sm sm:text-base whitespace-nowrap">Click map to drop pin</span>
                <button id="cancelPinMode" aria-label="Cancel Map Pin Selection" class="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
                    <i aria-hidden="true" data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Legend -->
            <div id="mapLegend" class="absolute top-4 left-4 md:top-auto md:bottom-6 md:left-auto md:right-6 bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-xl shadow-lg z-[50] border border-slate-200 transition-all duration-300 w-auto min-w-[120px]">
                <button id="toggleLegend" aria-expanded="false" aria-controls="legendContent" aria-label="Toggle Map Legend" class="flex items-center justify-between w-full md:hidden">
                    <h4 class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Map Legend</h4>
                    <i aria-hidden="true" data-lucide="chevron-down" id="legendChevron" class="w-3 h-3 ml-2 transition-transform"></i>
                </button>
                <div id="legendContent" class="hidden md:block space-y-2 mt-2 md:mt-0">
                    <h4 class="hidden md:block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Map Legend</h4>
                    
                    <!-- Issue Status Markers -->
                    <div class="mb-3">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-100">Status</div>
                        <div class="flex items-center gap-2 mb-1.5"><div class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div><span class="text-xs text-slate-600 font-medium">Open</span></div>
                        <div class="flex items-center gap-2 mb-1.5"><div class="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div><span class="text-xs text-slate-600 font-medium">Restricted (Caution/Detour)</span></div>
                        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div><span class="text-xs text-slate-600 font-medium">Closed</span></div>
                    </div>

                    <!-- State Highway / NZTA Data -->
                    <div id="nztaLegend" class="mt-2 pt-2 border-t border-slate-100 transition-all duration-300">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NZTA Context</div>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rotate-45 bg-[#E65100]"></div><span class="text-[10px] text-slate-600">State Highway Issue</span>
                        </div>
                    </div>
                </div>
            </div>
`;

let content = fs.readFileSync('index.html', 'utf8');

// Insert it right before <!-- Loading Overlay -->
content = content.replace('<!-- Loading Overlay -->', legendAndBannerHTML + '\\n    <!-- Loading Overlay -->');
fs.writeFileSync('index.html', content);
console.log('Restored map pin and legend!');
