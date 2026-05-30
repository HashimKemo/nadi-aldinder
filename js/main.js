document.addEventListener('DOMContentLoaded', () => {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      var isOpen = nav.classList.contains('nav--open');
      nav.classList.toggle('nav--open');
      toggle.classList.toggle('menu-toggle--active');
      document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });
    document.querySelectorAll('.nav__link').forEach(function (l) {
      l.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.classList.remove('menu-toggle--active');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
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
});

async function checkUserSession() {
  var headerInner = document.querySelector('.header__inner');
  if (!headerInner) return;
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
  var roleLabel = roleNames[p.role] || p.role;
  var isAdminOrEditor = (p.role === 'admin' || p.role === 'editor' || p.role === 'publisher');

  var badge = document.createElement('div');
  badge.id = 'user-badge';
  badge.className = 'user-badge';
  badge.innerHTML =
    '<div class="user-badge__info">' +
      '<span class="user-badge__name">' + p.name + '</span>' +
      '<span class="user-badge__role">' + roleLabel + '</span>' +
    '</div>' +
    (isAdminOrEditor ? '<a href="admin.html" class="user-badge__link"><i class="fas fa-tachometer-alt"></i> لوحة التحكم</a>' : '') +
    '<a href="#" class="user-badge__logout" id="user-logout"><i class="fas fa-sign-out-alt"></i></a>';

  var toggleBtn = document.querySelector('.menu-toggle');
  if (toggleBtn) {
    headerInner.insertBefore(badge, toggleBtn.nextSibling);
  } else {
    headerInner.appendChild(badge);
  }
  badge.style.display = 'flex';

  document.getElementById('user-logout').addEventListener('click', async function (e) {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  var loginBtn = document.querySelector('.nav__list a[href="login.html"]');
  if (loginBtn) loginBtn.style.display = 'none';
}
