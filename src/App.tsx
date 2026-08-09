/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import MapView from './components/MapView';
import ReportIssueModal from './components/ReportIssueModal';
import { Closure, mockClosures } from './data/mockClosures';

export default function App() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [closures, setClosures] = useState<Closure[]>(mockClosures);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchClosures = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/closures');
      if (response.ok) {
        const data = await response.json();
        setClosures(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch closures:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClosures();
  }, [fetchClosures]);

  useEffect(() => {
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchClosures();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchClosures]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      <header className="bg-white py-3 px-4 md:py-4 md:px-6 flex items-center justify-between border-b border-gray-200 relative z-50 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <svg width="100" height="32" viewBox="0 0 140 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00859B] md:w-[140px] md:h-[45px]">
            <path d="M 10 15 Q 35 15 45 5 Q 60 5 80 15 Q 60 15 45 20 Q 25 20 10 15 Z" fill="currentColor"/>
            <path d="M 20 25 Q 45 25 55 15 Q 70 15 90 25 Q 70 25 55 30 Q 35 30 20 25 Z" fill="currentColor"/>
            <path d="M 30 35 Q 55 35 65 25 Q 80 25 100 35 Q 80 35 65 40 Q 45 40 30 35 Z" fill="currentColor"/>
            <path d="M 105 20 Q 115 15 120 20 Q 115 25 105 25 Z" fill="currentColor"/>
          </svg>
          <div className="flex flex-col items-end">
            <span className="text-xl md:text-4xl font-extrabold text-[#3A444C] leading-none tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>Whangarei</span>
            <span className="text-xs md:text-2xl italic font-semibold text-[#3A444C] leading-tight mt-0.5 md:mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>District Council</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex flex-col items-end text-[10px] text-gray-500 mr-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            {autoRefresh && <span className="text-green-600 font-medium">Auto-refresh active (30s)</span>}
          </div>

          <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              onClick={() => fetchClosures()}
              disabled={isRefreshing}
              className={`p-1.5 md:p-2 rounded-full transition-all ${isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
              title="Refresh Map Data"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${autoRefresh ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
            >
              {autoRefresh ? 'AUTO ON' : 'AUTO OFF'}
            </button>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 md:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-full font-bold shadow-md transition-colors text-sm md:text-base whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 relative z-0">
        <MapView closures={closures} />
      </main>

      <ReportIssueModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        existingClosures={closures}
      />
    </div>
  );
}
