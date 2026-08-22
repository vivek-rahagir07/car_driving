// UniSphere Student Super App - Core Application Logic

// ==========================================
// 1. STATE MANAGEMENT
// ==========================================
const appState = {
  activeTabId: 'dashboard',
  openTabs: ['dashboard'],
  isMaximized: false,
  studentProfile: {
    name: 'Aarav Mehta',
    rollNo: '2026BT0482',
    course: 'B.Tech CSE - Yr 2',
    room: 'H3-304',
    cgpa: '8.45'
  },
  attendance: {
    math: { attended: 24, total: 28 },
    dbms: { attended: 21, total: 24 },
    python: { attended: 18, total: 25 }
  },
  assignments: [
    { id: 1, title: 'DBMS Assignment 2', subject: 'DBMS', dueDate: '2026-08-25', priority: 'high', status: 'pending' },
    { id: 2, title: 'Python Mini-Project Proposal', subject: 'Python', dueDate: '2026-08-27', priority: 'medium', status: 'pending' },
    { id: 3, title: 'Maths Tutorial Sheet 4', subject: 'Mathematics II', dueDate: '2026-08-30', priority: 'low', status: 'completed' }
  ],
  exams: [
    { id: 1, subject: 'DBMS Mid-Term', date: '2026-09-02', time: '10:00 AM', room: 'B-204' },
    { id: 2, subject: 'Mathematics II Internal', date: '2026-09-05', time: '02:00 PM', room: 'B-201' }
  ],
  calendarEvents: [
    { date: '2026-08-22', title: 'CodeBlitz Hackathon Registration Closes', type: 'event' },
    { date: '2026-08-25', title: 'DBMS Assignment 2 Submission', type: 'due' },
    { date: '2026-08-27', title: 'Python Mini-Project Proposal Submission', type: 'due' },
    { date: '2026-09-02', title: 'DBMS Mid-Term Exam', type: 'exam' }
  ],
  laundry: {
    status: 'none', // none, submitted, washing, drying, ready
    bagWeight: 0,
    itemCount: 0,
    slot: '',
    reminderEnabled: false,
    history: [
      { date: '14 Aug 2026', weight: '4.5 kg', status: 'Picked Up' },
      { date: '08 Aug 2026', weight: '5.2 kg', status: 'Picked Up' }
    ]
  },
  printQueue: [
    { id: 1, name: 'dbms_cheatsheet.pdf', pages: 4, type: 'Grayscale', copies: 1, cost: '₹8', status: 'Completed' }
  ],
  complaints: [
    { id: 1, category: 'Electrical', desc: 'Room fan regulator not working.', date: '2026-08-19', status: 'Assigned' }
  ],
  clubs: {
    joined: ['Robotics Club', 'ACM Student Chapter'],
    available: ['Music Society', 'Sports Club (Cricket)', 'Photography Club', 'Debate Society']
  },
  facilityBookings: [
    { id: 1, facility: 'Badminton Court 2', date: '2026-08-22', time: '05:00 PM - 06:00 PM' }
  ],
  studySummaries: {}
};

// Metadata for Tab titles and subtitles
const tabMeta = {
  dashboard: { title: 'Student Dashboard', sub: 'Overview of your university daily schedule and activities.' },
  calendar: { title: 'University Calendar', sub: 'Exams, assignments, holidays, and campus events.' },
  academics: { title: 'Academics & Timetable', sub: 'Course syllabus, your visual timetable, and attendance tracker.' },
  tasks: { title: 'Assignment & Exam Tracker', sub: 'Log and monitor due dates, study progress, and projects.' },
  grades: { title: 'Grade Calculator', sub: 'Simulate and calculate your potential CGPA and grades.' },
  laundry: { title: 'Laundry Hub', sub: 'Track and book campus laundry pickup/dropoff slots.' },
  printing: { title: 'CopySpace & Unisphere', sub: 'Submit print jobs, preview costs, and track printing status.' },
  hostel: { title: 'Hostel Maintenance', sub: 'Lodge room complaints, view warden contacts, and house guidelines.' },
  clubs: { title: 'Sports & Clubs Portal', sub: 'Book campus facilities and join sports clubs/societies.' },
  study: { title: 'AI Study Tool', sub: 'Analyze study materials, access papers, and test yourself with mock quizzes.' },
  help: { title: 'Help & Support', sub: 'Direct emergency numbers, FAQ, and ticketing portal.' }
};

// ==========================================
// 2. SPLASH SCREEN & SETUP
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Check if splash screen should load
  setTimeout(() => {
    // Reveal profile selector in splash
    document.querySelector('.splash-loading-bar').style.display = 'none';
  }, 2200);

  // Initialize UI components
  renderOpenTabs();
  renderDashboard();
  renderAttendance();
  renderAssignments();
  renderExams();
  renderCalendar();
  renderPrinting();
  renderHostel();
  renderClubs();

  // Handle Drag & Drop for Study Tool
  setupStudyUploader();

  // Setup Notification permission check
  setupNotifications();
});

function selectProfile(name, cgpa, role) {
  appState.studentProfile.name = name;
  appState.studentProfile.cgpa = cgpa;
  appState.studentProfile.course = role;
  
  // Update header and badge
  document.querySelector('.badge-info h4').textContent = name;
  document.querySelector('.badge-info p').textContent = role;
  document.getElementById('dashboard-greeting').innerHTML = `Welcome back, ${name.split(' ')[0]} 👋`;
  
  // Hide splash
  const splash = document.getElementById('splash-screen');
  splash.classList.add('fade-out');
  showToast(`Logged in as ${name}`);
}

// ==========================================
// 3. TAB & WORKSPACE NAVIGATION
// ==========================================
function openTab(tabId) {
  if (!appState.openTabs.includes(tabId)) {
    appState.openTabs.push(tabId);
  }
  appState.activeTabId = tabId;
  
  // Update active sidebar nav styling
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Update tabs bar UI
  renderOpenTabs();

  // Switch panels
  document.querySelectorAll('.page-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });

  // Update Header text
  if (tabMeta[tabId]) {
    document.getElementById('workspace-title').textContent = tabMeta[tabId].title;
    document.getElementById('workspace-subtitle').textContent = tabMeta[tabId].sub;
  }

  // Smooth scroll main content to top
  document.querySelector('.workspace-content').scrollTo({ top: 0, behavior: 'smooth' });
}

function closeTab(tabId, event) {
  if (event) event.stopPropagation(); // Prevent opening tab when closing
  
  // Prevent closing the last tab (or dashboard)
  if (appState.openTabs.length === 1 && appState.openTabs[0] === 'dashboard') {
    showToast('Dashboard cannot be closed.');
    return;
  }

  appState.openTabs = appState.openTabs.filter(id => id !== tabId);
  
  if (appState.activeTabId === tabId) {
    // Switch to the previous tab or dashboard
    const nextTab = appState.openTabs[appState.openTabs.length - 1] || 'dashboard';
    openTab(nextTab);
  } else {
    renderOpenTabs();
  }
}

function renderOpenTabs() {
  const container = document.getElementById('tab-bar-container');
  if (!container) return;

  container.innerHTML = '';
  appState.openTabs.forEach(tabId => {
    const tabName = tabMeta[tabId] ? tabMeta[tabId].title.split(' ')[0] : tabId;
    const btn = document.createElement('button');
    btn.className = `tab-button ${appState.activeTabId === tabId ? 'active' : ''}`;
    btn.onclick = () => openTab(tabId);
    
    // Icon mapping
    const icons = {
      dashboard: '🏠', calendar: '📅', academics: '📚', tasks: '✅',
      grades: '🧮', laundry: '🧺', printing: '🖨️', hostel: '🛏️',
      clubs: '🏅', study: '📖', help: '❓'
    };
    const icon = icons[tabId] || '📄';

    btn.innerHTML = `
      <span>${icon} ${tabName}</span>
      <span class="tab-close" onclick="closeTab('${tabId}', event)">×</span>
    `;
    container.appendChild(btn);
  });
}

function toggleWorkspaceMaximize() {
  appState.isMaximized = !appState.isMaximized;
  document.body.classList.toggle('workspace-maximized', appState.isMaximized);
  
  const toggleBtn = document.getElementById('btn-max-toggle');
  if (appState.isMaximized) {
    toggleBtn.innerHTML = '🗗';
    toggleBtn.title = 'Restore layout';
    showToast('Workspace maximized (Full screen mode)');
  } else {
    toggleBtn.innerHTML = '🗖';
    toggleBtn.title = 'Maximize active tab';
    showToast('Workspace layout restored');
  }
}

function toggleMobileSidebar() {
  document.body.classList.toggle('sidebar-open');
}

// ==========================================
// 4. TOASTS & NOTIFICATIONS
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.innerHTML = `<span>🔔</span> ${message}`;
  toast.classList.add('active');
  
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

function setupNotifications() {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      // Don't auto-popup on load, ask when they click laundry reminder
    }
  }
}

function triggerNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  } else {
    showToast(`${title}: ${body}`);
  }
}

// ==========================================
// 5. DASHBOARD & QUICK ACTIONS
// ==========================================
function renderDashboard() {
  // Update GPA badge
  document.getElementById('dash-cgpa-val').textContent = appState.studentProfile.cgpa;
  
  // Calculate average attendance
  let totalAttended = 0, totalClasses = 0;
  Object.values(appState.attendance).forEach(subj => {
    totalAttended += subj.attended;
    totalClasses += subj.total;
  });
  const avgAttendance = Math.round((totalAttended / totalClasses) * 100);
  const attendanceBadge = document.getElementById('dash-attendance-badge');
  document.getElementById('dash-attendance-val').textContent = `${avgAttendance}%`;
  
  if (avgAttendance >= 75) {
    attendanceBadge.textContent = 'Healthy';
    attendanceBadge.className = 'badge badge-green';
  } else {
    attendanceBadge.textContent = 'Defaulter Risk';
    attendanceBadge.className = 'badge badge-red';
  }

  // Pending Tasks Count
  const pendingCount = appState.assignments.filter(a => a.status === 'pending').length;
  document.getElementById('dash-tasks-val').textContent = pendingCount;
  
  // Update next class status
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[d.getDay()];
  
  // Simple check for today's class
  const classStatus = document.getElementById('dash-class-sub');
  if (dayName === 'Sunday' || dayName === 'Saturday') {
    document.getElementById('dash-class-val').textContent = 'No classes today';
    classStatus.textContent = 'Weekend - Enjoy your off day!';
  } else {
    document.getElementById('dash-class-val').textContent = 'DBMS (B-204)';
    classStatus.textContent = 'Next class at 10:00 AM';
  }
}

// ==========================================
// 6. ACADEMICS & TIMETABLE & ATTENDANCE
// ==========================================
function renderAttendance() {
  Object.keys(appState.attendance).forEach(subj => {
    const data = appState.attendance[subj];
    const percentage = Math.round((data.attended / data.total) * 100);
    
    // Update raw logs
    const container = document.getElementById(`att-${subj}-logs`);
    if (container) {
      container.textContent = `${data.attended}/${data.total} classes`;
    }

    // Update progress ring dashboard/academics
    const circle = document.getElementById(`circle-${subj}`);
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
      
      // Update color based on defaulter limits (75%)
      if (percentage >= 75) {
        circle.style.stroke = 'var(--accent-green)';
      } else {
        circle.style.stroke = 'var(--accent-red)';
      }
    }

    const text = document.getElementById(`text-${subj}`);
    if (text) {
      text.textContent = `${percentage}%`;
    }
  });

  // Re-run dashboard calculator
  renderDashboard();
}

function adjustAttendance(subject, isAttended, delta) {
  const subjData = appState.attendance[subject];
  if (!subjData) return;

  if (isAttended) {
    subjData.attended = Math.max(0, subjData.attended + delta);
    // Auto-adjust total classes if attended exceeds total
    if (subjData.attended > subjData.total) {
      subjData.total = subjData.attended;
    }
  } else {
    subjData.total = Math.max(subjData.attended, subjData.total + delta);
  }

  renderAttendance();
  showToast(`Updated attendance log for ${subject.toUpperCase()}`);
}

// ==========================================
// 7. ASSIGNMENT & EXAM TRACKER
// ==========================================
function renderAssignments() {
  const list = document.getElementById('assignment-list');
  if (!list) return;

  list.innerHTML = '';
  if (appState.assignments.length === 0) {
    list.innerHTML = '<p class="text-muted" style="font-size:0.8rem;text-align:center;padding:1rem;">No assignments logged.</p>';
    return;
  }

  appState.assignments.forEach(task => {
    const card = document.createElement('div');
    card.className = 'list-row';
    
    const priBadgeMap = {
      high: '<span class="badge badge-red">High</span>',
      medium: '<span class="badge badge-orange">Medium</span>',
      low: '<span class="badge badge-blue">Low</span>'
    };

    const isChecked = task.status === 'completed' ? 'checked' : '';
    const labelStyle = task.status === 'completed' ? 'style="text-decoration: line-through; opacity: 0.5;"' : '';

    card.innerHTML = `
      <div class="list-row-info" ${labelStyle}>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <input type="checkbox" ${isChecked} onchange="toggleTaskStatus(${task.id})">
          <h5>${task.title}</h5>
        </div>
        <p>${task.subject} • Due: ${task.dueDate}</p>
      </div>
      <div style="display:flex;align-items:center;gap:0.75rem">
        ${priBadgeMap[task.priority]}
        <button class="btn-secondary btn-sm" onclick="deleteAssignment(${task.id})" style="padding: 0.2rem 0.5rem; background:none; border:0; color:var(--accent-red)">🗑️</button>
      </div>
    `;
    list.appendChild(card);
  });
  renderDashboard();
}

function toggleTaskStatus(id) {
  const task = appState.assignments.find(a => a.id === id);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    showToast(`Marked ${task.title} as ${task.status}`);
    renderAssignments();
  }
}

function openAddAssignmentModal() {
  document.getElementById('assignment-modal').classList.add('active');
}

function closeAssignmentModal() {
  document.getElementById('assignment-modal').classList.remove('active');
}

function saveAssignment() {
  const title = document.getElementById('task-title-input').value.trim();
  const subject = document.getElementById('task-subject-input').value;
  const dueDate = document.getElementById('task-date-input').value;
  const priority = document.getElementById('task-priority-input').value;

  if (!title || !dueDate) {
    showToast('Please fill out all required fields.');
    return;
  }

  const newId = appState.assignments.length > 0 ? Math.max(...appState.assignments.map(a => a.id)) + 1 : 1;
  const newAssignment = { id: newId, title, subject, dueDate, priority, status: 'pending' };
  
  appState.assignments.push(newAssignment);
  
  // Add to calendar automatically
  appState.calendarEvents.push({ date: dueDate, title: `${title} (Due)`, type: 'due' });

  renderAssignments();
  renderCalendar();
  closeAssignmentModal();
  showToast('Assignment added successfully!');
  
  // Reset form
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-date-input').value = '';
}

function deleteAssignment(id) {
  appState.assignments = appState.assignments.filter(a => a.id !== id);
  renderAssignments();
  showToast('Assignment deleted.');
}

function renderExams() {
  const examList = document.getElementById('exam-list');
  if (!examList) return;

  examList.innerHTML = '';
  if (appState.exams.length === 0) {
    examList.innerHTML = '<p class="text-muted" style="font-size:0.8rem;text-align:center;padding:1rem;">No exams logged.</p>';
    return;
  }

  appState.exams.forEach(exam => {
    const card = document.createElement('div');
    card.className = 'list-row';
    card.innerHTML = `
      <div class="list-row-info">
        <h5>${exam.subject}</h5>
        <p>Location: ${exam.room} • Time: ${exam.time}</p>
      </div>
      <div>
        <span class="badge badge-purple">${exam.date}</span>
      </div>
    `;
    examList.appendChild(card);
  });
}

// ==========================================
// 8. GRADE CALCULATOR
// ==========================================
function calculateGPA() {
  const mid = parseFloat(document.getElementById('calc-mid').value) || 0;
  const end = parseFloat(document.getElementById('calc-end').value) || 0;
  const ass = parseFloat(document.getElementById('calc-assign').value) || 0;
  const att = parseFloat(document.getElementById('calc-att').value) || 0;

  // Mid = 25%, Assign = 15%, Att = 10%, End = 50%
  const totalMarks = (mid * 0.25) + (ass * 0.15) + (att * 0.1) + (end * 0.5);
  
  // Letter grade mapping
  let grade = 'F';
  let points = 0;
  
  if (totalMarks >= 90) { grade = 'O (Outstanding)'; points = 10; }
  else if (totalMarks >= 80) { grade = 'A+ (Excellent)'; points = 9; }
  else if (totalMarks >= 70) { grade = 'A (Very Good)'; points = 8; }
  else if (totalMarks >= 60) { grade = 'B+ (Good)'; points = 7; }
  else if (totalMarks >= 50) { grade = 'B (Above Average)'; points = 6; }
  else if (totalMarks >= 40) { grade = 'C (Pass)'; points = 5; }

  const resultContainer = document.getElementById('calc-results');
  resultContainer.innerHTML = `
    <h4 style="color:var(--accent-purple)">Weighted score: ${totalMarks.toFixed(1)} / 100</h4>
    <p style="margin-top:0.25rem;">Predicted Grade: <b>${grade}</b></p>
    <p>GPA Points: <b>${points} / 10</b></p>
  `;

  // Compute targets
  const targetCGPA = parseFloat(document.getElementById('calc-target-cgpa').value) || 8.5;
  const currentTotal = (mid * 0.25) + (ass * 0.15) + (att * 0.1);
  
  // To get target points (8.5 is roughly 85% average required)
  const targetMarksNeeded = targetCGPA * 10;
  const neededInEndSem = (targetMarksNeeded - currentTotal) / 0.5;

  const targetInfo = document.getElementById('calc-target-info');
  if (neededInEndSem > 100) {
    targetInfo.innerHTML = `<span class="badge badge-red">Critical</span> Even a 100% in the End-Sem won't reach your CGPA target. Increase mid-sem or assignments next time.`;
  } else if (neededInEndSem <= 0) {
    targetInfo.innerHTML = `<span class="badge badge-green">Safe</span> You have already achieved the marks needed for your CGPA target!`;
  } else {
    targetInfo.innerHTML = `To maintain a CGPA of <b>${targetCGPA}</b>, you need at least <b>${neededInEndSem.toFixed(1)}%</b> in your End-Semester Exam.`;
  }
}

// ==========================================
// 9. UNIVERSITY CALENDAR
// ==========================================
function renderCalendar() {
  const list = document.getElementById('calendar-events-list');
  if (!list) return;

  list.innerHTML = '';
  
  // Sort events chronologically
  const sorted = [...appState.calendarEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'list-row';
    
    let typeBadge = '<span class="badge badge-blue">Event</span>';
    if (ev.type === 'due') typeBadge = '<span class="badge badge-red">Submission</span>';
    if (ev.type === 'exam') typeBadge = '<span class="badge badge-purple">Exam</span>';

    card.innerHTML = `
      <div class="list-row-info">
        <h5>${ev.title}</h5>
        <p>Date: ${ev.date}</p>
      </div>
      <div>
        ${typeBadge}
      </div>
    `;
    list.appendChild(card);
  });
}

function openAddEventModal() {
  document.getElementById('event-modal').classList.add('active');
}

function closeEventModal() {
  document.getElementById('event-modal').classList.remove('active');
}

function saveCalendarEvent() {
  const title = document.getElementById('event-title-input').value.trim();
  const date = document.getElementById('event-date-input').value;
  const type = document.getElementById('event-type-input').value;

  if (!title || !date) {
    showToast('Please fill out all required fields.');
    return;
  }

  appState.calendarEvents.push({ date, title, type });
  renderCalendar();
  closeEventModal();
  showToast('Calendar event created!');

  // Reset form
  document.getElementById('event-title-input').value = '';
  document.getElementById('event-date-input').value = '';
}

// ==========================================
// 10. LAUNDRY TRACKER
// ==========================================
function bookLaundry() {
  const weight = parseFloat(document.getElementById('laundry-weight-input').value) || 0;
  const items = parseInt(document.getElementById('laundry-items-input').value) || 0;
  const slot = document.getElementById('laundry-slot-input').value;

  if (weight <= 0 || items <= 0 || !slot) {
    showToast('Please enter valid laundry details.');
    return;
  }

  appState.laundry.status = 'submitted';
  appState.laundry.bagWeight = weight;
  appState.laundry.itemCount = items;
  appState.laundry.slot = slot;

  updateLaundryUI();
  showToast('Laundry bag checked-in successfully!');
}

function toggleLaundryReminder() {
  if (!('Notification' in window)) {
    showToast('System notifications not supported in this browser.');
    return;
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        appState.laundry.reminderEnabled = true;
        document.getElementById('btn-laundry-reminder').textContent = 'Reminder Configured ✓';
        showToast('Notifications enabled!');
      } else {
        showToast('Notifications permission denied.');
      }
    });
  } else {
    appState.laundry.reminderEnabled = !appState.laundry.reminderEnabled;
    const btn = document.getElementById('btn-laundry-reminder');
    if (appState.laundry.reminderEnabled) {
      btn.textContent = 'Reminder Configured ✓';
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-secondary');
      showToast('Notifications activated.');
    } else {
      btn.textContent = 'Set Laundry Notification';
      btn.classList.add('btn-secondary');
      btn.classList.remove('btn-primary');
      showToast('Notifications deactivated.');
    }
  }
}

function simulateLaundryStep() {
  const states = ['none', 'submitted', 'washing', 'drying', 'ready'];
  let currentIdx = states.indexOf(appState.laundry.status);
  
  if (currentIdx === -1 || appState.laundry.status === 'none') {
    showToast('Please check-in a laundry bag first.');
    return;
  }

  if (appState.laundry.status === 'ready') {
    // Pick up bag
    appState.laundry.history.unshift({
      date: 'Today',
      weight: `${appState.laundry.bagWeight} kg`,
      status: 'Picked Up'
    });
    appState.laundry.status = 'none';
    appState.laundry.bagWeight = 0;
    appState.laundry.itemCount = 0;
    appState.laundry.slot = '';
    
    if (appState.laundry.reminderEnabled) {
      triggerNotification('Laundry Picked Up', 'Your laundry bag cycle is completed and picked up.');
    }
    showToast('Laundry bag picked up. Session finished!');
  } else {
    // Go to next step
    currentIdx++;
    appState.laundry.status = states[currentIdx];
    
    if (appState.laundry.reminderEnabled) {
      const messages = {
        washing: 'Your laundry has started washing 🫧',
        drying: 'Your laundry is in the tumble dryer 💨',
        ready: 'Your laundry is clean, folded, and ready for pickup! 🧺'
      };
      triggerNotification('Laundry Tracker Alert', messages[appState.laundry.status]);
    }
    showToast(`Laundry state updated: ${appState.laundry.status.toUpperCase()}`);
  }

  updateLaundryUI();
}

function updateLaundryUI() {
  const currentStatus = appState.laundry.status;
  
  // Show active order details
  const detailsPanel = document.getElementById('laundry-active-details');
  if (currentStatus === 'none') {
    detailsPanel.innerHTML = '<p class="text-muted" style="font-size:0.8rem;">No active laundry bags. Book below to start tracking.</p>';
    document.getElementById('laundry-line-fill').style.width = '0%';
    document.querySelectorAll('.laundry-step').forEach(step => {
      step.className = 'laundry-step';
    });
    document.getElementById('btn-simulate-laundry').textContent = 'Advance Cycle Status';
  } else {
    detailsPanel.innerHTML = `
      <div style="font-size:0.85rem;line-height:1.5;">
        <p>🛍️ <b>Bag Details:</b> ${appState.laundry.bagWeight} kg (${appState.laundry.itemCount} items)</p>
        <p>🕒 <b>Drop-off Slot:</b> ${appState.laundry.slot}</p>
        <p style="margin-top:0.5rem;">Current stage: <b style="color:var(--accent-blue);text-transform:uppercase;">${currentStatus}</b></p>
      </div>
    `;

    // Update path lines & steps
    const fillMap = { submitted: '0%', washing: '33%', drying: '66%', ready: '100%' };
    document.getElementById('laundry-line-fill').style.width = fillMap[currentStatus];

    const stepOrder = ['submitted', 'washing', 'drying', 'ready'];
    const currentWeightIdx = stepOrder.indexOf(currentStatus);

    stepOrder.forEach((stepName, idx) => {
      const element = document.getElementById(`step-${stepName}`);
      if (element) {
        if (idx < currentWeightIdx) {
          element.className = 'laundry-step completed';
        } else if (idx === currentWeightIdx) {
          element.className = 'laundry-step active';
        } else {
          element.className = 'laundry-step';
        }
      }
    });

    if (currentStatus === 'ready') {
      document.getElementById('btn-simulate-laundry').textContent = 'Verify Pickup (Finish)';
    } else {
      document.getElementById('btn-simulate-laundry').textContent = 'Simulate Next Cycle Stage';
    }
  }

  // Render History
  const historyList = document.getElementById('laundry-history-list');
  if (historyList) {
    historyList.innerHTML = '';
    appState.laundry.history.forEach(item => {
      const card = document.createElement('div');
      card.className = 'list-row';
      card.innerHTML = `
        <div class="list-row-info">
          <h5>Pickup Complete</h5>
          <p>Logged: ${item.date} • ${item.weight}</p>
        </div>
        <span class="badge badge-green">${item.status}</span>
      `;
      historyList.appendChild(card);
    });
  }
}

// ==========================================
// 11. COPY SPACEBASIC & UNISPHERE PRINTING
// ==========================================
function renderPrinting() {
  const queue = document.getElementById('print-queue');
  if (!queue) return;

  queue.innerHTML = '';
  if (appState.printQueue.length === 0) {
    queue.innerHTML = '<p class="text-muted" style="font-size:0.8rem;text-align:center;">Queue is empty.</p>';
    return;
  }

  appState.printQueue.forEach(job => {
    const item = document.createElement('div');
    item.className = 'print-queue-item';
    
    let statusClass = 'badge-blue';
    if (job.status === 'Completed') statusClass = 'badge-green';
    if (job.status === 'Printing') statusClass = 'badge-orange';

    item.innerHTML = `
      <div class="print-file-meta">
        <span>📄 ${job.name}</span>
        <p>${job.pages} pages • ${job.type} • ${job.copies} copy</p>
      </div>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <b style="font-size:0.85rem;">${job.cost}</b>
        <span class="badge ${statusClass}">${job.status}</span>
      </div>
    `;
    queue.appendChild(item);
  });
}

function setupStudyUploader() {
  const dropzone = document.getElementById('print-dropzone');
  const fileInput = document.getElementById('print-file-input');
  
  if (!dropzone) return;

  dropzone.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
      handlePrintFileUpload(e.target.files[0].name);
    }
  };

  dropzone.ondragover = (e) => {
    e.preventDefault();
    dropzone.classList.add('dragging');
  };

  dropzone.ondragleave = () => {
    dropzone.classList.remove('dragging');
  };

  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragging');
    if (e.dataTransfer.files.length > 0) {
      handlePrintFileUpload(e.dataTransfer.files[0].name);
    }
  };
}

function handlePrintFileUpload(fileName) {
  const progressBar = document.getElementById('print-progress-container');
  const progressFill = document.getElementById('print-progress-fill');
  
  progressBar.style.display = 'block';
  progressFill.style.width = '0%';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressBar.style.display = 'none';
        
        // Add to state queue
        const pages = Math.floor(Math.random() * 8) + 2;
        const colorType = document.getElementById('print-color-select').value;
        const doubleSided = document.getElementById('print-side-select').value === 'double';
        const copies = parseInt(document.getElementById('print-copies-input').value) || 1;
        
        // Cost: Grayscale = ₹2/page, Color = ₹10/page
        const pageCost = colorType === 'Color' ? 10 : 2;
        const totalCost = pageCost * pages * copies;

        const newJob = {
          id: appState.printQueue.length + 1,
          name: fileName,
          pages,
          type: colorType,
          copies,
          cost: `₹${totalCost}`,
          status: 'Queued'
        };

        appState.printQueue.unshift(newJob);
        renderPrinting();
        showToast('Document uploaded to printing queue!');
      }, 300);
    }
  }, 100);
}

function simulatePrinting() {
  const activeJob = appState.printQueue.find(j => j.status === 'Queued');
  if (!activeJob) {
    const printingJob = appState.printQueue.find(j => j.status === 'Printing');
    if (printingJob) {
      printingJob.status = 'Completed';
      renderPrinting();
      showToast(`Document "${printingJob.name}" has printed!`);
    } else {
      showToast('No active print jobs in the queue.');
    }
    return;
  }

  activeJob.status = 'Printing';
  renderPrinting();
  showToast(`Printing "${activeJob.name}"...`);
  
  // Auto complete printing after 4 seconds
  setTimeout(() => {
    activeJob.status = 'Completed';
    renderPrinting();
    showToast(`Document "${activeJob.name}" is ready for pickup!`);
  }, 4000);
}

// ==========================================
// 12. HOSTEL & COMPLAINTS
// ==========================================
function renderHostel() {
  const list = document.getElementById('maintenance-list');
  if (!list) return;

  list.innerHTML = '';
  if (appState.complaints.length === 0) {
    list.innerHTML = '<p class="text-muted" style="font-size:0.8rem;text-align:center;">No pending maintenance orders.</p>';
    return;
  }

  appState.complaints.forEach(item => {
    const card = document.createElement('div');
    card.className = 'complaint-card';
    
    let statusClass = 'badge-orange';
    if (item.status === 'Resolved') statusClass = 'badge-green';
    if (item.status === 'Assigned') statusClass = 'badge-blue';

    card.innerHTML = `
      <div class="complaint-card-header">
        <h5>🔧 Complaint #${item.id} (${item.category})</h5>
        <span class="badge ${statusClass}">${item.status}</span>
      </div>
      <p style="font-size:0.8rem;">${item.desc}</p>
      <p style="font-size:0.7rem;color:var(--text-muted);margin-top:0.35rem;">Filed: ${item.date}</p>
    `;
    list.appendChild(card);
  });
}

function lodgeComplaint() {
  const category = document.getElementById('complaint-category').value;
  const desc = document.getElementById('complaint-desc').value.trim();
  
  if (!desc) {
    showToast('Please enter a description of the issue.');
    return;
  }

  const newId = appState.complaints.length + 1;
  const today = new Date().toISOString().split('T')[0];
  
  appState.complaints.unshift({
    id: newId,
    category,
    desc,
    date: today,
    status: 'Registered'
  });

  renderHostel();
  showToast('Maintenance complaint registered.');
  document.getElementById('complaint-desc').value = '';
}

function simulateComplaintStatus() {
  const activeComp = appState.complaints.find(c => c.status !== 'Resolved');
  if (!activeComp) {
    showToast('No active complaints to progress.');
    return;
  }

  const steps = ['Registered', 'Assigned', 'Resolved'];
  const curIdx = steps.indexOf(activeComp.status);
  
  if (curIdx < steps.length - 1) {
    activeComp.status = steps[curIdx + 1];
    renderHostel();
    showToast(`Complaint #${activeComp.id} is now ${activeComp.status}.`);
  }
}

// ==========================================
// 13. SPORTS & CLUBS PORTAL
// ==========================================
function renderClubs() {
  // Renders Joined Clubs
  const joinedContainer = document.getElementById('joined-clubs');
  if (joinedContainer) {
    joinedContainer.innerHTML = '';
    if (appState.clubs.joined.length === 0) {
      joinedContainer.innerHTML = '<p class="text-muted" style="font-size:0.75rem;">You haven\'t joined any clubs.</p>';
    } else {
      appState.clubs.joined.forEach(club => {
        const item = document.createElement('div');
        item.className = 'list-row';
        item.innerHTML = `
          <span><b>${club}</b></span>
          <button class="btn-secondary btn-sm" onclick="leaveClub('${club}')">Leave</button>
        `;
        joinedContainer.appendChild(item);
      });
    }
  }

  // Renders Available Clubs
  const availableContainer = document.getElementById('available-clubs');
  if (availableContainer) {
    availableContainer.innerHTML = '';
    if (appState.clubs.available.length === 0) {
      availableContainer.innerHTML = '<p class="text-muted" style="font-size:0.75rem;">No clubs left to join.</p>';
    } else {
      appState.clubs.available.forEach(club => {
        const item = document.createElement('div');
        item.className = 'list-row';
        item.innerHTML = `
          <span>${club}</span>
          <button class="btn-primary btn-sm" onclick="joinClub('${club}')">Join</button>
        `;
        availableContainer.appendChild(item);
      });
    }
  }

  // Bookings list
  const bookingsContainer = document.getElementById('bookings-list');
  if (bookingsContainer) {
    bookingsContainer.innerHTML = '';
    if (appState.facilityBookings.length === 0) {
      bookingsContainer.innerHTML = '<p class="text-muted" style="font-size:0.75rem;">No active facility bookings.</p>';
    } else {
      appState.facilityBookings.forEach(book => {
        const item = document.createElement('div');
        item.className = 'list-row';
        item.innerHTML = `
          <div class="list-row-info">
            <h5>${book.facility}</h5>
            <p>${book.time}</p>
          </div>
          <span class="badge badge-green">${book.date}</span>
        `;
        bookingsContainer.appendChild(item);
      });
    }
  }
}

function joinClub(name) {
  appState.clubs.available = appState.clubs.available.filter(c => c !== name);
  appState.clubs.joined.push(name);
  renderClubs();
  showToast(`Welcome to the ${name}!`);
}

function leaveClub(name) {
  appState.clubs.joined = appState.clubs.joined.filter(c => c !== name);
  appState.clubs.available.push(name);
  renderClubs();
  showToast(`Left ${name}.`);
}

function bookFacility() {
  const facility = document.getElementById('sports-facility-select').value;
  const time = document.getElementById('sports-time-select').value;
  const date = document.getElementById('sports-date-select').value;

  if (!date) {
    showToast('Please select a booking date.');
    return;
  }

  appState.facilityBookings.unshift({
    id: appState.facilityBookings.length + 1,
    facility,
    time,
    date
  });

  renderClubs();
  showToast(`${facility} slot booked for ${date}!`);
}

// ==========================================
// 14. AI STUDY TOOL & RESOURCE ANALYZER
// ==========================================
function setupStudyUploader() {
  const zone = document.getElementById('study-dropzone');
  const input = document.getElementById('study-file-input');
  
  if (!zone) return;

  zone.onclick = () => input.click();

  input.onchange = (e) => {
    if (e.target.files.length > 0) {
      simulateStudyAnalysis(e.target.files[0].name);
    }
  };

  zone.ondragover = (e) => {
    e.preventDefault();
    zone.classList.add('dragging');
  };

  zone.ondragleave = () => {
    zone.classList.remove('dragging');
  };

  zone.ondrop = (e) => {
    e.preventDefault();
    zone.classList.remove('dragging');
    if (e.dataTransfer.files.length > 0) {
      simulateStudyAnalysis(e.dataTransfer.files[0].name);
    }
  };
}

function simulateStudyAnalysis(fileName) {
  const loader = document.getElementById('study-analysis-loader');
  const results = document.getElementById('study-analysis-results');
  
  loader.style.display = 'block';
  results.style.display = 'none';

  // Mock analysis delay
  setTimeout(() => {
    loader.style.display = 'none';
    results.style.display = 'block';

    // Generate mock content based on matching tags
    let subject = 'Academics General';
    let summary = 'This document covers fundamental academic principles, project workflows, and syllabus outlines for college students.';
    let questions = [
      'What are the core deliverables in the semester project?',
      'How does continuous assessment factor into the final CGPA?',
      'What is the threshold attendance required for examinations?'
    ];
    let books = ['University Life Guide Vol 1', 'Engineering Core Syllabus'];

    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('dbms') || lowerName.includes('database') || lowerName.includes('sql')) {
      subject = 'DBMS';
      summary = 'Focuses on relational databases, normalization rules (1NF, 2NF, 3NF, BCNF), transaction protocols, and SQL optimization metrics.';
      questions = [
        'Explain the difference between 3NF and BCNF with a suitable schema.',
        'Why are ACID properties essential in commercial transaction engines?',
        'Describe left, right, full, and cross joins with query examples.'
      ];
      books = ['Database System Concepts (Silberschatz)', 'Fundamentals of Database Systems (Elmasri)'];
    } else if (lowerName.includes('python') || lowerName.includes('code') || lowerName.includes('programming')) {
      subject = 'Python Programming';
      summary = 'Explores Object-Oriented design, dictionary structures, decorators, generator loops, and file operations in Python.';
      questions = [
        'How do lists and tuples differ in memory footprint and behavior?',
        'Write a custom Python decorator that logs function execution latency.',
        'Explain structural pattern matching in Python 3.10+.'
      ];
      books = ['Python Crash Course (Eric Matthes)', 'Fluent Python (Luciano Ramalho)'];
    } else if (lowerName.includes('math') || lowerName.includes('calc') || lowerName.includes('algebra')) {
      subject = 'Mathematics II';
      summary = 'Discusses matrix algebra, vector spaces, Fourier transforms, eigenvalues, and multivariable integrals.';
      questions = [
        'Define linear independence in vector subspaces.',
        'State the Cayley-Hamilton theorem and compute the inverse of a 3x3 matrix.',
        'Calculate the Fourier series for a periodic square wave.'
      ];
      books = ['Advanced Engineering Mathematics (Erwin Kreyszig)', 'Linear Algebra and Its Applications (Gilbert Strang)'];
    }

    // Save summary in state
    appState.studySummaries[fileName] = { subject, summary, questions, books };

    // Fill results UI
    document.getElementById('study-doc-title').textContent = fileName;
    document.getElementById('study-doc-sub').textContent = `AI analysis category: ${subject}`;
    document.getElementById('study-summary-text').textContent = summary;
    
    const quizContainer = document.getElementById('study-quiz-list');
    quizContainer.innerHTML = '';
    questions.forEach((q, idx) => {
      const qBox = document.createElement('div');
      qBox.className = 'list-row';
      qBox.innerHTML = `
        <div style="font-size:0.8rem;line-height:1.4;">
          <b>Q${idx + 1}:</b> ${q}
        </div>
        <button class="btn-secondary btn-sm" onclick="showQuizAnswer(${idx}, '${subject}')">Show Hint</button>
      `;
      quizContainer.appendChild(qBox);
    });

    const bookList = document.getElementById('study-book-recommendations');
    bookList.innerHTML = '';
    books.forEach(b => {
      const li = document.createElement('li');
      li.style.fontSize = '0.8rem';
      li.style.marginLeft = '1rem';
      li.style.marginBottom = '0.35rem';
      li.textContent = b;
      bookList.appendChild(li);
    });

    showToast('AI analysis completed!');
  }, 2000);
}

function showQuizAnswer(qIdx, subject) {
  const hints = {
    'DBMS': [
      'Normal forms check structural redundancy. BCNF is stricter: every functional dependency X -> Y requires X to be a super key.',
      'ACID is Atomicity (all or nothing), Consistency, Isolation (separate execution), and Durability (permanently saved).',
      'Joins merge rows. Inner gets intersections, Left gets all left + matching right, Full gets all rows from both tables.'
    ],
    'Python Programming': [
      'Tuples are immutable and fixed size, which allows compiler optimizations. Lists are dynamic arrays.',
      'Decorators wrap a callable. Use time.time() inside wrapper() around func(*args, **kwargs).',
      'Use "match variable:" block with nested case declarations (e.g., case [head, *tail]:).'
    ],
    'Mathematics II': [
      'A set of vectors is independent if no vector can be expressed as a linear combination of others.',
      'Every square matrix satisfies its own characteristic equation, det(A - λI) = 0.',
      'The Fourier series breaks periodic curves into a summation of sine and cosine components.'
    ]
  };

  const hintText = (hints[subject] && hints[subject][qIdx]) || 'Review relevant textbook chapter.';
  alert(`AI Study Hint: ${hintText}`);
}

function askStudyQuestion() {
  const input = document.getElementById('study-chat-input');
  const query = input.value.trim();
  if (!query) return;

  const responses = [
    'According to the analyzed syllabus, this topic has high weightage in Mid-Term exams.',
    'Refer to Section 4.2 in the recommended book listed on this page for detailed formulas.',
    'This concept is related to the laboratory practice sheets available in the LMS portal.',
    'To master this, try solving previous year papers from 2024 (available in library index).'
  ];

  const randomRes = responses[Math.floor(Math.random() * responses.length)];
  
  // Show in study answer box
  const box = document.getElementById('study-chat-response');
  box.style.display = 'block';
  box.innerHTML = `
    <p style="font-size:0.75rem;color:var(--text-muted);font-style:italic;">You asked: "${query}"</p>
    <p style="font-size:0.8rem;margin-top:0.25rem;">🤖 <b>Study Assistant:</b> ${randomRes}</p>
  `;
  input.value = '';
}

// ==========================================
// 15. AI ASSISTANT CHATBOT (UNIBOT)
// ==========================================
function toggleAIChat() {
  const panel = document.getElementById('ai-chat-panel');
  panel.classList.toggle('active');
}

function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const text = input.value.trim();
  if (!text) return;

  // Add User bubble
  addChatBubble(text, 'user');
  input.value = '';

  // Bot response simulation
  setTimeout(() => {
    const reply = getAIResponse(text);
    addChatBubble(reply, 'bot');
  }, 800);
}

function quickQuery(topic) {
  addChatBubble(topic, 'user');
  setTimeout(() => {
    const reply = getAIResponse(topic);
    addChatBubble(reply, 'bot');
  }, 600);
}

function addChatBubble(msg, sender) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = msg;
  container.appendChild(bubble);

  // Auto scroll
  container.scrollTop = container.scrollHeight;
}

function getAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return `Hello! I'm UniBot, your campus helper. Ask me about your <b>timetable, laundry, printers, maintenance, or attendance</b>.`;
  }
  
  if (q.includes('laundry')) {
    if (appState.laundry.status === 'none') {
      return `You don't have any active laundry orders. Head over to the <b>Laundry Hub</b> tab to log one. Default dropoff schedules are listed there.`;
    }
    return `Your laundry status is currently: <b>${appState.laundry.status.toUpperCase()}</b>. Weight: ${appState.laundry.bagWeight} kg. Click "Advance Cycle Status" in the laundry tab to simulate completion!`;
  }

  if (q.includes('attendance')) {
    let output = `Here is your current class attendance:<br>`;
    Object.keys(appState.attendance).forEach(s => {
      const data = appState.attendance[s];
      const pct = Math.round((data.attended / data.total) * 100);
      const alertStr = pct < 75 ? ' ⚠️ Low' : ' ✓';
      output += `- <b>${s.toUpperCase()}</b>: ${pct}% (${data.attended}/${data.total} classes)${alertStr}<br>`;
    });
    return output;
  }

  if (q.includes('timetable') || q.includes('class') || q.includes('schedule')) {
    return `Your next scheduled lecture is <b>DBMS</b> in Room <b>B-204</b> at <b>10:00 AM</b>. You can view your full weekly schedule in the <b>Academics</b> tab.`;
  }

  if (q.includes('exam') || q.includes('mid') || q.includes('test')) {
    if (appState.exams.length === 0) return `You have no upcoming exams registered in your tracker.`;
    let output = `Upcoming exams in your tracker:<br>`;
    appState.exams.forEach(ex => {
      output += `- <b>${ex.subject}</b>: ${ex.date} at ${ex.time} (Room ${ex.room})<br>`;
    });
    return output;
  }

  if (q.includes('print') || q.includes('copy')) {
    if (appState.printQueue.length === 0) return `Your print queue is empty. You can drag and drop PDFs in the <b>CopySpace</b> tab to submit them.`;
    return `You have <b>${appState.printQueue.length}</b> print job(s) in the queue. Next file: "${appState.printQueue[0].name}" (${appState.printQueue[0].status}).`;
  }

  if (q.includes('hostel') || q.includes('maintenance')) {
    return `You live in room <b>${appState.studentProfile.room}</b>. You have <b>${appState.complaints.length}</b> logged maintenance request(s). Lodge new complaints in the <b>Hostel</b> tab.`;
  }

  if (q.includes('club') || q.includes('sport')) {
    return `You are currently a member of: <b>${appState.clubs.joined.join(', ')}</b>. Book sports courts in the <b>Clubs & Sports</b> tab.`;
  }

  return `I'm not sure about that. Try asking questions containing keywords like <i>laundry, timetable, attendance, exams, printing, or hostel maintenance</i>.`;
}
