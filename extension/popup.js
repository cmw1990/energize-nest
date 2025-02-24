// Popup script for Well-Charged Blocker

document.addEventListener('DOMContentLoaded', () => {
  const blockingToggle = document.getElementById('blocking-toggle');
  const focusModeBtn = document.getElementById('focus-mode');
  const breakTimeBtn = document.getElementById('break-time');
  const openDashboardBtn = document.getElementById('open-dashboard');
  const openSettingsBtn = document.getElementById('open-settings');
  const distractionsCount = document.getElementById('distractions-count');
  const adsCount = document.getElementById('ads-count');
  const scheduleInfo = document.getElementById('schedule-info');

  // Initialize popup state
  chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
    blockingToggle.checked = response.isActive;
    updateScheduleDisplay(response.schedule);
    updateStats();
  });

  // Toggle blocking
  blockingToggle.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      type: 'toggleBlocking',
      value: blockingToggle.checked
    });
  });

  // Focus Mode
  focusModeBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'startFocusMode',
      duration: 25 // 25-minute focus session
    }, () => {
      focusModeBtn.textContent = 'Focus Mode Active';
      focusModeBtn.disabled = true;
      breakTimeBtn.disabled = true;
    });
  });

  // Break Time
  breakTimeBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'startBreak',
      duration: 5 // 5-minute break
    }, () => {
      breakTimeBtn.textContent = 'Break Active';
      breakTimeBtn.disabled = true;
      focusModeBtn.disabled = true;
    });
  });

  // Open Dashboard
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://well-charged.com/app/energy/distractions'
    });
  });

  // Open Settings
  openSettingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Update stats display
  function updateStats() {
    chrome.storage.local.get(['todayStats'], (result) => {
      const stats = result.todayStats || { distractions: 0, ads: 0 };
      distractionsCount.textContent = stats.distractions;
      adsCount.textContent = stats.ads;
    });
  }

  // Update schedule display
  function updateScheduleDisplay(schedule) {
    if (!schedule) {
      scheduleInfo.innerHTML = '<p class="text-gray-500">No active schedule</p>';
      return;
    }

    const days = schedule.days.map(day => day.slice(0, 3)).join(', ');
    scheduleInfo.innerHTML = `
      <p class="text-gray-500 dark:text-gray-400">${schedule.start_time} - ${schedule.end_time}</p>
      <p class="text-xs text-gray-400 dark:text-gray-500">${days}</p>
    `;
  }

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case 'statsUpdate':
        updateStats();
        break;
      case 'scheduleUpdate':
        updateScheduleDisplay(message.schedule);
        break;
      case 'focusModeEnd':
        focusModeBtn.textContent = 'Start Focus Mode';
        focusModeBtn.disabled = false;
        breakTimeBtn.disabled = false;
        break;
      case 'breakEnd':
        breakTimeBtn.textContent = 'Take a Break';
        breakTimeBtn.disabled = false;
        focusModeBtn.disabled = false;
        break;
    }
  });
});
