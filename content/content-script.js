console.log('TrenchTech: Content script starting to load...');

const BTN = '.c-btn';

function apply(settings) {
  try {
    console.log('TrenchTech: Attempting to apply styles with settings:', settings);

    const css = `
      ${BTN} {
        line-height: ${settings.lineHeight};
      }
      ${BTN} .u-w-100 {
        width: auto !important;
      } 
      .WONu4jRBwJmFo3FD6XwP {
        max-width: 140px;
        position: relative;
        z-index: 2;
        width: ${settings.width}vw;
      }
      .l-row-gap--3xs>.l-col,.l-row-gap--3xs>.l-col-base,.l-row-gap--3xs>[class*="l-col-"] {
        padding-right: 2px;
        padding-left: 2px;
        margin-top: 20px;
      }
    `;

    // Remove any existing style element
    const existingStyle = document.getElementById('trenchtech-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and append new style element
    const style = document.createElement('style');
    style.id = 'trenchtech-styles';
    style.textContent = css;
    document.head.appendChild(style);

    console.log('TrenchTech: Style element added to document');

  } catch (error) {
    console.error('TrenchTech: Error applying styles:', error);
  }
}

// Initial load
try {
  console.log('TrenchTech: Attempting to get initial storage values');
  chrome.storage.sync.get(
    { lineHeight: 1.25, width: 5 },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error('TrenchTech: Error getting initial storage:', chrome.runtime.lastError);
      } else {
        console.log('TrenchTech: Initial storage values:', result);
        apply(result);
      }
    }
  );
} catch (error) {
  console.error('TrenchTech: Error in initial load:', error);
}

// Listen for changes
try {
  console.log('TrenchTech: Setting up storage change listener');
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log('TrenchTech: Storage changed:', changes, area);
    if (area === 'sync') {
      // Get current values first
      chrome.storage.sync.get(
        { lineHeight: 1.25, width: 5 },
        (current) => {
          if (chrome.runtime.lastError) {
            console.error('TrenchTech: Error getting current storage:', chrome.runtime.lastError);
            return;
          }

          // Update with new values
          const newSettings = {
            ...current,
            ...Object.fromEntries(
              Object.entries(changes).map(([key, change]) => [key, change.newValue])
            )
          };

          console.log('TrenchTech: Applying new settings:', newSettings);
          apply(newSettings);
        }
      );
    }
  });
} catch (error) {
  console.error('TrenchTech: Error setting up storage listener:', error);
}

// Verify the script is loaded
console.log('TrenchTech: Content script fully loaded'); 