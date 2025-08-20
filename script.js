// Basic SPA navigation + checklist persistence
const byId = id => document.getElementById(id);
const panels = [...document.querySelectorAll('.panel')];
const navItems = [...document.querySelectorAll('.nav-item')];
const menuCards = [...document.querySelectorAll('.card[data-target]')];
const backButtons = [...document.querySelectorAll('.back')];
const sectionTitle = document.getElementById('section-title');
document.getElementById('year').textContent = new Date().getFullYear();

function showPanel(id){
  panels.forEach(p=>p.classList.remove('active'));
  const el = byId(id);
  if(el){ el.classList.add('active'); sectionTitle.textContent = el.querySelector('h2')?.textContent || 'Main Menu'; }
  navItems.forEach(b=>b.classList.toggle('active', b.dataset.target===id));
  if(id==='menu') sectionTitle.textContent = 'Main Menu';
  window.scrollTo({top:0, behavior:'smooth'});
  localStorage.setItem('jp.last', id);
}
navItems.forEach(btn => btn.addEventListener('click', ()=>showPanel(btn.dataset.target)));
menuCards.forEach(card => card.addEventListener('click', ()=>showPanel(card.dataset.target)));
backButtons.forEach(btn => btn.addEventListener('click', ()=>showPanel('menu')));

// Restore last section
showPanel(localStorage.getItem('jp.last') || 'menu');

// Checklist persistence
document.querySelectorAll('#checklist input[type="checkbox"]').forEach(chk=>{
  const key = 'jp.chk.'+chk.dataset.key;
  chk.checked = localStorage.getItem(key) === '1';
  chk.addEventListener('change', ()=> localStorage.setItem(key, chk.checked ? '1' : '0'));
});

// Profile save (minimal demo)
const saveBtn = document.getElementById('saveProfile');
if(saveBtn){
  saveBtn.addEventListener('click', ()=>{
    const stageName = document.getElementById('stageName').value || 'Jae‑P';
    const email = document.getElementById('email').value || '';
    const website = document.getElementById('website').value || '';
    const tz = document.getElementById('timezone').value || '';
    const data = {stageName,email,website,tz};
    localStorage.setItem('jp.profile', JSON.stringify(data));
    alert('Profile saved.');
  });
  // load
  const raw = localStorage.getItem('jp.profile');
  if(raw){
    try{
      const d = JSON.parse(raw);
      if(d.stageName) document.getElementById('stageName').value = d.stageName;
      if(d.email) document.getElementById('email').value = d.email;
      if(d.website) document.getElementById('website').value = d.website;
      if(d.tz) document.getElementById('timezone').value = d.tz;
    }catch{}
  }
}

// Consult form (placeholder)
const form = document.getElementById('consultForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const obj = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('jp.consult.last', JSON.stringify(obj));
    alert('Thanks! We received your request. Payment integration coming next.');
    showPanel('menu');
  });
}
