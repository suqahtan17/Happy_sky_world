
// Basic JS for responsive menu, iframe navigation and a simple simulated login
(function(){
  // Toggle mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle && menuToggle.addEventListener('click', () => {
    mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Iframe navigation: when nav links are clicked, load pages in the iframe
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    // external/anchor link bails out
    if(!href  .startsWith('#')  .startsWith('mailto:')) return;

    // If clicked within the main nav of index.html, load into iframe and prevent default
    if(a.closest && a.closest('#mainNav')){
      e.preventDefault();
      const frame = document.getElementById('pageFrame');
      if(frame) frame.src = href;
      // Close mobile menu
      if(window.innerWidth <= 900) mainNav.style.display = 'none';
    }
  });

  // Simple auth simulation stored in localStorage
  function isLoggedIn(){ return localStorage.getItem('hsw_user') !== null }
  function updateAuthUI(){
    const authLink = document.getElementById('authLink');
    const myGamesLinks = document.querySelectorAll('.requires-auth');
    if(!authLink) return;
    if(isLoggedIn()){
      authLink.textContent = 'Logout';
      authLink.href = '#';
      myGamesLinks.forEach(a=>a.classList.remove('hidden'));
    } else {
      authLink.textContent = 'Login';
      authLink.href = 'login.html';
      myGamesLinks.forEach(a=>a.classList.add('hidden'));
    }
  }

  updateAuthUI();

  // Handle login form inside iframe (if any) via messaging or direct access
  window.addEventListener('message', (ev)=>{
    if(ev.data && ev.data.type === 'hsw-login'){
      localStorage.setItem('hsw_user', JSON.stringify({username: ev.data.username}));
      updateAuthUI();
      // navigate to mygames
      const frame = document.getElementById('pageFrame');
      if(frame) frame.src = 'mygames.html';
    }
  });

  // If index page contains login form (edge case) intercept and login
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (ev)=>{
        ev.preventDefault();
      const username = document.getElementById('username').value || 'player';
      // Simulate login
      localStorage.setItem('hsw_user', JSON.stringify({username}));
      updateAuthUI();
      // redirect to mygames
      window.location.href = 'mygames.html';
    });
  }

  // Set year in footer if present
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});

/* assets/scripts.js */
function loadPage(page) {
  document.getElementById('pageFrame').src = 'pages/' + page;
}
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

