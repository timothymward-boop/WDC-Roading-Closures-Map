import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, MapPin, Search, ChevronRight } from 'lucide-react';
import { Closure } from '../data/mockClosures';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingClosures: Closure[];
}

type Step = 'search' | 'check-existing' | 'full-form' | 'success' | 'already-aware';

export default function ReportIssueModal({ isOpen, onClose, existingClosures }: ReportIssueModalProps) {
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingClosures, setMatchingClosures] = useState<Closure[]>([]);
  
  // Form state
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('search');
      setSearchQuery('');
      setMatchingClosures([]);
      setIssueType('');
      setDescription('');
      setEmail('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matches = existingClosures.filter(c => 
      c.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matches.length > 0) {
      setMatchingClosures(matches);
      setStep('check-existing');
    } else {
      setStep('full-form');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call/email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send an email to the specified address
    console.log('Sending report to designated email address:', {
      location: searchQuery,
      issueType,
      description,
      email
    });
    
    setIsSubmitting(false);
    setStep('success');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Report an Issue</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {step === 'search' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-800 bg-blue-50 p-4 rounded-xl mb-6">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-medium">
                    Before you report, let's check if we already know about this issue.
                  </p>
                </div>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
                      Where is the issue?
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g. Ngunguru Road, State Highway 1..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00859B] focus:border-[#00859B] text-base"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Enter a road name or general area.</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#00859B] hover:bg-[#006A7C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00859B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Check Location
                  </button>
                </form>
              </div>
            )}

            {step === 'check-existing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">We found some issues nearby</h3>
                  <p className="text-gray-600 text-sm">
                    Are you reporting one of these existing issues?
                  </p>
                </div>

                <div className="space-y-3">
                  {matchingClosures.map(closure => (
                    <button
                      key={closure.id}
                      onClick={() => setStep('already-aware')}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#00859B] hover:bg-blue-50 transition-all group flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{closure.roadName}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            {closure.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{closure.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00859B] shrink-0 mt-1" />
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3 text-center">Not seeing your issue here?</p>
                  <button
                    onClick={() => setStep('full-form')}
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00859B] transition-colors"
                  >
                    Report a New Issue
                  </button>
                </div>
              </div>
            )}

            {step === 'already-aware' && (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">We're on it!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Thank you for checking. Our teams are already aware of this issue and are working to resolve it as quickly as possible.
                </p>
                <div className="pt-6">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#00859B] hover:bg-[#006A7C] transition-colors"
                  >
                    Return to Map
                  </button>
                </div>
              </div>
            )}

            {step === 'full-form' && (
              <form onSubmit={handleSubmitReport} className="space-y-5">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Location:</span> {searchQuery}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setStep('search')}
                    className="text-sm text-[#00859B] font-medium hover:underline mt-1"
                  >
                    Change location
                  </button>
                </div>

                <div>
                  <label htmlFor="issueType" className="block text-sm font-semibold text-gray-700 mb-1">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issueType"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                    className="block w-full py-3 px-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-[#00859B] focus:border-[#00859B] text-base"
                  >
                    <option value="" disabled>Select an issue type...</option>
                    <option value="Slip">Slip / Landslide</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Tree Down">Tree Down</option>
                    <option value="Pothole">Severe Pothole</option>
                    <option value="Accident">Accident / Crash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide details about the issue..."
                    required
                    className="block w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00859B] focus:border-[#00859B] text-base resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For updates on this issue"
                    className="block w-full py-3 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00859B] focus:border-[#00859B] text-base"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !issueType || !description.trim()}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#00859B] hover:bg-[#006A7C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00859B] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Report Submitted</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Thank you for reporting this issue. Your report has been sent to our team for review.
                </p>
                <div className="pt-6">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#00859B] hover:bg-[#006A7C] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
