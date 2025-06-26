// webPatch.js - Direct DOM manipulation for web compatibility
// This file handles web-specific behaviors that don't work well with React Native Web

export function applyWebPatches() {
  // Only run on web platform
  if (typeof document === 'undefined') return;
  
  console.log('Applying web-specific patches with stronger approach...');
  
  // Add a direct script to the head that will execute as soon as the page loads
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = `
    (function() {
      // Function to create a hardcoded button at the bottom of the page
      function createDirectButton() {
        console.log('Creating direct button');
        
        // Create a button element that looks like the native one
        const btn = document.createElement('button');
        btn.textContent = 'New Session (Web)'; 
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '9999';
        btn.style.backgroundColor = '#7851a9';
        btn.style.color = '#f8f0d8';
        btn.style.border = 'none';
        btn.style.borderRadius = '30px';
        btn.style.padding = '15px 30px';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        // Create a direct handler to navigate to the Swipe screen
        btn.onclick = function() {
          try {
            // Create session data
            const userId = localStorage.getItem('userId') || 
              'web-user-' + Math.random().toString(36).substring(2, 10);
              
            // Generate session code
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
              code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            const timestamp = new Date().toISOString();
            const sessionData = {
              id: code,
              createdAt: timestamp,
              createdBy: userId,
              members: [userId],
              movies: [],
              matches: [],
              status: 'active'
            };
            
            // Store data
            localStorage.setItem('userId', userId);
            localStorage.setItem('sessionId', code);
            localStorage.setItem('sessionData', JSON.stringify(sessionData));
            
            // Store additional data needed for SwipeScreen
            // This ensures SwipeScreen can find the session data even when using hash navigation
            sessionStorage.setItem('currentSession', code);
            sessionStorage.setItem('currentSessionData', JSON.stringify(sessionData));
            sessionStorage.setItem('isCreator', 'true');
            
            // Also set it as URL parameters to help SwipeScreen find it
            const navParams = new URLSearchParams();
            navParams.set('sessionCode', code);
            navParams.set('isCreator', 'true');
            
            // Alert with session code
            alert('Session Created! Your session code is: ' + code + '\n\nShare this code with your friends to start matching!');
            
            // Navigate directly to Swipe page with parameters
            console.log('Navigating to Swipe screen with session:', code);
            window.location.href = '#/Swipe?' + navParams.toString();
          } catch (error) {
            console.error('Error:', error);
            alert('Failed to create session, please try again.');
          }
        };
        
        // Only add the button on the Home screen
        if (window.location.hash !== '#/Swipe' && 
            window.location.hash !== '#/Result') {
          document.body.appendChild(btn);
          return btn;
        }
        
        return null;
      }
      
      // Setup a MutationObserver to detect route changes
      let button = null;
      const observer = new MutationObserver(function(mutations) {
        // Check if we're on the home screen
        const isHome = window.location.hash === '' || 
                      window.location.hash === '#/' || 
                      window.location.hash === '#/Home';
        
        if (isHome && !button) {
          // Create the button if we're on home and it doesn't exist
          button = createDirectButton();
        } else if (!isHome && button) {
          // Remove the button if we're not on home anymore
          if (button.parentNode) {
            button.parentNode.removeChild(button);
          }
          button = null;
        }
      });
      
      // Start observing the document body for DOM changes
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true
      });
      
      // Initial check
      setTimeout(function() {
        const isHome = window.location.hash === '' || 
                      window.location.hash === '#/' || 
                      window.location.hash === '#/Home';
        if (isHome && !button) {
          button = createDirectButton();
        }
      }, 500);
      
      // Track hash changes
      window.addEventListener('hashchange', function() {
        const isHome = window.location.hash === '' || 
                      window.location.hash === '#/' || 
                      window.location.hash === '#/Home';
        
        if (isHome && !button) {
          button = createDirectButton();
        } else if (!isHome && button) {
          if (button.parentNode) {
            button.parentNode.removeChild(button);
          }
          button = null;
        }
      });
    })();
  `;
  
  // Add the script to the document
  document.head.appendChild(script);
}
