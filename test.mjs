import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const idsToFind = [
  'closeWelcome', 'refreshBtn', 'autoRefreshBtn', 'toggleSidebar',
  'navToggleViewBtn', 'navRefreshBtnMobile', 'navReportBtnMobile', 
  'navAnalyticsBtn', 'navLinksBtn', 'searchInput', 'sortSelect',
  'toggleAnalytics', 'closeAnalytics', 'linksBtn', 'toggleNzta',
  'reportIssueBtn', 'closeDisclaimerModal', 'proceedToReportBtn',
  'toggleLegend', 'reportLocation', 'closeReportModal', 'dropPinBtn',
  'useLocationBtn', 'cancelPinMode', 'closeSuccessBtn', 'reportModal',
  'triggerReportSubmitBtn', 'reportForm', 'welcomeModal'
];
const missing = idsToFind.filter(id => !html.includes('id=\"' + id + '\"'));
console.log('Missing IDs:', missing);
