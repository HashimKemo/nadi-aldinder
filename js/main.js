document.addEventListener('DOMContentLoaded', () => {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  var overlay = null;

  function openMenu() {
    nav.classList.add('nav--open');
    toggle.classList.add('menu-toggle--active');
    document.body.classList.add('nav-open');
    document.documentElement.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
  }

  function closeMenu() {
    nav.classList.remove('nav--open');
    toggle.classList.remove('menu-toggle--active');
    document.body.classList.remove('nav-open');
    document.documentElement.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      if (nav.classList.contains('nav--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    document.querySelectorAll('.nav__link, .nav__drawer-login').forEach(function (l) {
      l.addEventListener('click', closeMenu);
    });
  }

  window.revealObserver = new IntersectionObserver(function (e) {
    e.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        window.revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { window.revealObserver.observe(el); });

  checkUserSession();
  applyTheme();
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });
  window.addEventListener('resize', applyTheme);
});

/* ——— الوضع الليلي ——— */
function getPreferredTheme() {
  if (window.innerWidth < 768) return 'light';
  var stored = localStorage.getItem('theme');
  if (stored) return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function applyTheme() {
  var theme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    var icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    btn.setAttribute('aria-label', theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي');
  });
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme();
}

async function checkUserSession() {
  if (window.location.pathname.indexOf('login.html') !== -1) return;

  var sessionRes = await supabaseClient.auth.getSession();
  if (!sessionRes.data || !sessionRes.data.session) return;

  var profileRes = await supabaseClient.from('profiles')
    .select('name, role, is_approved')
    .eq('id', sessionRes.data.session.user.id)
    .maybeSingle();

  if (!profileRes.data || !profileRes.data.is_approved) return;

  var p = profileRes.data;
  var roleNames = { admin: 'أدمن', editor: 'محرر', publisher: 'ناشر', viewer: 'مشاهد' };

  var dashItem = document.getElementById('nav-dashboard');
  var userInfo = document.getElementById('nav-user-info');
  var userName = document.getElementById('nav-user-name');
  var loginItem = document.getElementById('nav-login-btn');

  if (p.role === 'admin' || p.role === 'editor' || p.role === 'publisher') {
    if (dashItem) dashItem.style.display = '';
  }
  if (userName) userName.textContent = p.name + ' (' + (roleNames[p.role] || p.role) + ')';
  if (userInfo) userInfo.style.display = '';
  if (loginItem) loginItem.style.display = 'none';

  var logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.style.display = '';
    logoutBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      await supabaseClient.auth.signOut();
      window.location.reload();
    });
  }
}
