// ios-install-prompt.js

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && window.navigator.standalone;
}

function isIos() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipod|ipad/.test(ua);
}

if (isIos() && !isInStandaloneMode()) {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.background = '#22081E';
  banner.style.color = 'white';
  banner.style.textAlign = 'center';
  banner.style.padding = '1rem 0.5rem';
  banner.style.fontFamily = 'Inter, sans-serif';
  banner.style.zIndex = '99999';
  banner.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.2)';
  banner.style.fontSize = '14px';

  banner.innerHTML = `
    <span>TAP THE SHARE ICON</span>
    <img src="/icons/share-ios.png" width="16" alt="Share icon" style="vertical-align: middle; margin: 0 4px;">
    <span>THEN SELECT "<strong>ADD TO HOME SCREEN</strong>"</span>
  `;
  document.body.appendChild(banner);
}