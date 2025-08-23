// =========
// Script for Jae‑P Music Management App
// - Single-page navigation
// - Layout switcher (side-nav <-> dashboard), persisted
// - Profile avatar upload persisted to localStorage
// - Profile fields persisted to localStorage
// - Checklist persisted to localStorage
// =========

(function(){
  const panels = document.querySelectorAll('.panel');
  const navButtons = document.querySelectorAll('.nav-item');
  const cards = document.querySelectorAll('.card[data-target]');
  const backButtons = document.querySelectorAll('.back');
  const sectionTitle = document.getElementById('section-title');
  const yearEl = document.getElementById('year');
  const layoutToggle = document.getElementById('layoutToggle');

  // Footer year
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // Navigation handler
  function activatePanel(id){
    panels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(id);
    if(panel){ panel.classList.add('active'); }
    sectionTitle.textContent = id === 'menu' ? 'Main Menu' : panel?.querySelector('h2')?.textContent || 'Section';
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
    // In dashboard layout, ensure there is a path back to menu via back buttons (already present)
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => activatePanel(btn.dataset.target));
  });
  cards.forEach(card => {
    card.addEventListener('click', () => activatePanel(card.dataset.target));
  });
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => activatePanel('menu'));
  });

  // ===== Layout toggle (persisted) =====
  function applyLayoutFromStorage(){
    const saved = localStorage.getItem('jp_layout') || 'side';
    if(saved === 'dashboard'){
      document.body.classList.add('layout-dashboard');
      if(layoutToggle) layoutToggle.textContent = '↔ Switch to Side Layout';
    }else{
      document.body.classList.remove('layout-dashboard');
      if(layoutToggle) layoutToggle.textContent = '↔ Switch Layout';
    }
  }
  applyLayoutFromStorage();

  if(layoutToggle){
    layoutToggle.addEventListener('click', () => {
      const isDashboard = document.body.classList.toggle('layout-dashboard');
      localStorage.setItem('jp_layout', isDashboard ? 'dashboard' : 'side');
      layoutToggle.textContent = isDashboard ? '↔ Switch to Side Layout' : '↔ Switch Layout';
    });
  }

  // ===== Profile avatar upload (persisted) =====
  const profileUpload = document.getElementById('profileUpload');
  const profileImage = document.getElementById('profileImage');

  function loadAvatar(){
    const dataUrl = localStorage.getItem('jp_profile_image');
    if(dataUrl && profileImage){
      profileImage.src = dataUrl;
    }
  }
  loadAvatar();

  if(profileUpload && profileImage){
    profileUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        const dataUrl = ev.target.result;
        profileImage.src = dataUrl;
        try{
          localStorage.setItem('jp_profile_image', dataUrl);
        }catch(err){
          console.warn('Could not store image in localStorage (maybe too large).', err);
          alert('Image is too large to save for persistence. Consider a smaller file.');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // ===== Profile fields (persisted) =====
  const profileFields = ['stageName','email','website','timezone'];
  function loadProfile(){
    profileFields.forEach(id => {
      const el = document.getElementById(id);
      const val = localStorage.getItem('jp_profile_'+id);
      if(el && val !== null) el.value = val;
    });
  }
  loadProfile();

  const saveProfileBtn = document.getElementById('saveProfile');
  if(saveProfileBtn){
    saveProfileBtn.addEventListener('click', () => {
      profileFields.forEach(id => {
        const el = document.getElementById(id);
        if(el) localStorage.setItem('jp_profile_'+id, el.value || '');
      });
      alert('Profile saved!');
    });
  }

  // ===== Checklist (persisted) =====
  const checklistInputs = document.querySelectorAll('#checklist input[type="checkbox"][data-key]');
  function loadChecklist(){
    checklistInputs.forEach(chk => {
      const key = chk.getAttribute('data-key');
      const stored = localStorage.getItem('jp_check_'+key);
      if(stored !== null) chk.checked = stored === '1';
      chk.addEventListener('change', () => {
        localStorage.setItem('jp_check_'+key, chk.checked ? '1' : '0');
      });
    });
  }
  loadChecklist();

  // ===== Consultation form (demo submit) =====
  const consultForm = document.getElementById('consultForm');
  if(consultForm){
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(consultForm));
      alert(`Thanks ${data.name}! We'll reach out at ${data.email} to confirm your ${data.platform} session on ${data.datetime} at $${data.rate}/hr.`);
      consultForm.reset();
    });
  }

  // Start at menu on load
  activatePanel('menu');
})();
