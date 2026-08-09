import fs from 'fs';

const legendHTML = `
                <div id="legendContent" class="hidden md:block space-y-3 mt-2 md:mt-0 p-1">
                    <h4 class="hidden md:block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Map Legend</h4>
                    
                    <!-- WDC Local Roads -->
                    <div class="mb-3">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">Local Roads</div>
                        
                        <div class="flex items-center gap-3 mb-2">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-red-600 shrink-0">
                                <i aria-hidden="true" data-lucide="alert-triangle" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">Closed</span>
                        </div>
                        
                        <div class="flex items-center gap-3 mb-2">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-amber-500 shrink-0">
                                <i aria-hidden="true" data-lucide="alert-circle" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">Partial / Caution</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-emerald-600 shrink-0">
                                <i aria-hidden="true" data-lucide="check-circle" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">Open</span>
                        </div>
                    </div>

                    <!-- State Highway / NZTA Data -->
                    <div id="nztaLegend" class="mt-3 pt-3 border-t border-slate-100 transition-all duration-300">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">NZTA Context (State Highways)</div>
                        
                        <div class="flex items-center gap-3 mb-2">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-red-600 shrink-0">
                                <i aria-hidden="true" data-lucide="alert-triangle" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">SH Closure</span>
                        </div>
                        
                        <div class="flex items-center gap-3 mb-2">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-amber-500 shrink-0">
                                <i aria-hidden="true" data-lucide="alert-circle" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">SH Hazard</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full shadow-sm border border-white bg-indigo-600 shrink-0">
                                <i aria-hidden="true" data-lucide="megaphone" class="w-3.5 h-3.5 text-white"></i>
                            </div>
                            <span class="text-xs text-slate-600 font-medium">SH Information</span>
                        </div>
                    </div>
                </div>
`;

let content = fs.readFileSync('index.html', 'utf8');

// Replace the legend content
content = content.replace(/<div id="legendContent"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Loading Overlay -->/gm, legendHTML + '            </div>\\n    <!-- Loading Overlay -->');

fs.writeFileSync('index.html', content);
console.log('Fixed Legend formatting!');
