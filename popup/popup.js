console.log('TrenchTech Popup: Script starting...');

const fields = ['lineHeight', 'width'];
const defaults = { lineHeight: 1.25, width: 5 };

function updateUI(settings) {
  console.log('TrenchTech Popup: Updating UI with settings:', settings);
  fields.forEach(f => {
    const element = document.getElementById(f);
    const valueElement = document.getElementById(f + 'Val');
    if (element && valueElement) {
      // Ensure the value is within the slider's range
      const min = parseFloat(element.min);
      const max = parseFloat(element.max);
      const value = Math.min(Math.max(parseFloat(settings[f]), min), max);
      
      element.value = value;
      valueElement.textContent = value;
      console.log(`TrenchTech Popup: Updated ${f} to ${value}`);
    } else {
      console.error(`TrenchTech Popup: Could not find elements for ${f}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('TrenchTech Popup: DOM loaded');
  
  // initialize
  chrome.storage.sync.get(defaults, (result) => {
    console.log('TrenchTech Popup: Initial storage values:', result);
    updateUI(result);
  });

  // slider events
  fields.forEach(f => {
    const element = document.getElementById(f);
    if (!element) {
      console.error(`TrenchTech Popup: Could not find slider for ${f}`);
      return;
    }
    
    console.log(`TrenchTech Popup: Adding listener to ${f} slider`);
    
    element.addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      console.log(`TrenchTech Popup: Slider ${f} changed to ${v}`);
      
      const valueElement = document.getElementById(f + 'Val');
      if (valueElement) {
        valueElement.textContent = v;
      }
      
      chrome.storage.sync.set({ [f]: v }, () => {
        if (chrome.runtime.lastError) {
          console.error('TrenchTech Popup: Storage error:', chrome.runtime.lastError);
        } else {
          console.log(`TrenchTech Popup: Storage updated for ${f}:`, v);
        }
      });
    });
  });

  // reset
  const resetButton = document.getElementById('reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      console.log('TrenchTech Popup: Reset clicked');
      // First update the UI
      updateUI(defaults);
      // Then update storage
      chrome.storage.sync.set(defaults, () => {
        if (chrome.runtime.lastError) {
          console.error('TrenchTech Popup: Reset storage error:', chrome.runtime.lastError);
        } else {
          console.log('TrenchTech Popup: Reset complete');
        }
      });
    });
  } else {
    console.error('TrenchTech Popup: Could not find reset button');
  }
}); 