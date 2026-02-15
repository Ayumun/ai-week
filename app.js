/* =========================================================
   Instagram Clone – Single-page app (HTML/CSS/JS + localStorage)
   ========================================================= */

// ---------- SVG Icons ----------
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/><path d="M9 22V12h6v10"/></svg>`,
  homeFill: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  explore: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="3"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>`,
  heartFill: `<svg viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>`,
  bookmarkFill: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  tagged: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
};

// ---------- Data Store (localStorage) ----------
const Store = {
  _get(key, def) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; }
    catch { return def; }
  },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  get users() { return this._get('ig_users', []); },
  set users(v) { this._set('ig_users', v); },

  get posts() { return this._get('ig_posts', []); },
  set posts(v) { this._set('ig_posts', v); },

  get stories() { return this._get('ig_stories', []); },
  set stories(v) { this._set('ig_stories', v); },

  get currentUser() { return this._get('ig_current_user', null); },
  set currentUser(v) { this._set('ig_current_user', v); },

  findUser(username) { return this.users.find(u => u.username === username); },

  updateUser(username, data) {
    const users = this.users;
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) { Object.assign(users[idx], data); this.users = users; }
    if (this.currentUser && this.currentUser.username === username) {
      this.currentUser = { ...this.currentUser, ...data };
    }
  },

  init() {
    if (this.users.length === 0) {
      this._seedData();
    }
  },

  _seedData() {
    const sampleUsers = [
      { username: 'travel_photo', name: 'Travel Photography', bio: 'Exploring the world one photo at a time.', avatar: '', followers: ['foodie_japan', 'tech_daily'], following: ['foodie_japan', 'tech_daily', 'nature_vibes'], posts: [] },
      { username: 'foodie_japan', name: 'Japanese Food', bio: 'Delicious Japanese cuisine.', avatar: '', followers: ['travel_photo', 'tech_daily'], following: ['travel_photo'], posts: [] },
      { username: 'tech_daily', name: 'Tech News', bio: 'Latest in technology.', avatar: '', followers: ['travel_photo'], following: ['travel_photo', 'foodie_japan'], posts: [] },
      { username: 'nature_vibes', name: 'Nature Vibes', bio: 'Nature is beautiful.', avatar: '', followers: ['travel_photo'], following: [], posts: [] },
    ];
    this.users = sampleUsers;

    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];
    const captions = [
      'Beautiful sunset today!', 'Having a great time!', 'Nature is amazing',
      'Throwback to this view', 'Good vibes only', 'Weekend mood',
      'Can\'t get enough of this place', 'Life is beautiful'
    ];
    const posts = [];
    const usernames = ['travel_photo', 'foodie_japan', 'tech_daily', 'nature_vibes'];
    for (let i = 0; i < 12; i++) {
      const user = usernames[i % usernames.length];
      posts.push({
        id: 'p' + i,
        username: user,
        image: this._generatePlaceholder(colors[i % colors.length], 600),
        caption: captions[i % captions.length],
        likes: [],
        comments: [
          { username: usernames[(i + 1) % usernames.length], text: 'Looks amazing!', time: Date.now() - 3600000 * (i + 1) },
        ],
        bookmarks: [],
        createdAt: Date.now() - 3600000 * (i + 1) * 2,
      });
    }
    this.posts = posts;

    const stories = [];
    for (const u of usernames) {
      stories.push({
        username: u,
        items: [
          { image: this._generatePlaceholder(colors[Math.floor(Math.random()*colors.length)], 400), createdAt: Date.now() - 3600000 },
          { image: this._generatePlaceholder(colors[Math.floor(Math.random()*colors.length)], 400), createdAt: Date.now() - 1800000 },
        ],
        seenBy: [],
      });
    }
    this.stories = stories;
  },

  _generatePlaceholder(color, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    // Add some visual interest
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(size*0.3, size*0.4, size*0.25, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(size*0.7, size*0.6, size*0.35, 0, Math.PI*2);
    ctx.fill();
    return canvas.toDataURL('image/jpeg', 0.7);
  },

  _generateAvatar(username) {
    const canvas = document.createElement('canvas');
    canvas.width = 150; canvas.height = 150;
    const ctx = canvas.getContext('2d');
    const hue = [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    ctx.fillStyle = `hsl(${hue}, 60%, 70%)`;
    ctx.fillRect(0, 0, 150, 150);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(username[0].toUpperCase(), 75, 75);
    return canvas.toDataURL('image/png');
  },

  getAvatar(username) {
    const user = this.findUser(username);
    if (user && user.avatar) return user.avatar;
    return this._generateAvatar(username);
  }
};

// ---------- Router ----------
let currentPage = 'feed';
let currentParams = {};

function navigate(page, params = {}) {
  currentPage = page;
  currentParams = params;
  render();
}

// ---------- App Render ----------
function render() {
  const app = document.getElementById('app');
  if (!Store.currentUser) {
    app.innerHTML = renderAuth();
    bindAuth();
  } else {
    app.innerHTML = renderMain();
    bindMain();
  }
}

// ---------- Time Helpers ----------
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

// ===================== AUTH =====================
let authMode = 'login';

function renderAuth() {
  if (authMode === 'login') {
    return `
    <div class="auth-wrapper">
      <div class="auth-box">
        <div class="auth-card">
          <h1>Instagram</h1>
          <form id="login-form">
            <input type="text" id="login-user" placeholder="Username" autocomplete="off" required>
            <input type="password" id="login-pass" placeholder="Password" required>
            <button type="submit" class="btn-primary">Log In</button>
          </form>
          <div class="auth-separator"><div class="line"></div><span>OR</span><div class="line"></div></div>
          <div id="auth-error" class="auth-error"></div>
        </div>
        <div class="auth-switch">
          Don't have an account? <a id="goto-signup">Sign up</a>
        </div>
      </div>
    </div>`;
  }
  return `
  <div class="auth-wrapper">
    <div class="auth-box">
      <div class="auth-card">
        <h1>Instagram</h1>
        <p style="color:#8e8e8e;margin-bottom:16px;">Sign up to see photos and videos from your friends.</p>
        <form id="signup-form">
          <input type="text" id="signup-email" placeholder="Email" required>
          <input type="text" id="signup-name" placeholder="Full Name" required>
          <input type="text" id="signup-user" placeholder="Username" autocomplete="off" required>
          <input type="password" id="signup-pass" placeholder="Password" required>
          <button type="submit" class="btn-primary">Sign up</button>
        </form>
        <div id="auth-error" class="auth-error"></div>
      </div>
      <div class="auth-switch">
        Have an account? <a id="goto-login">Log in</a>
      </div>
    </div>
  </div>`;
}

function bindAuth() {
  const goSignup = document.getElementById('goto-signup');
  const goLogin = document.getElementById('goto-login');
  if (goSignup) goSignup.onclick = () => { authMode = 'signup'; render(); };
  if (goLogin) goLogin.onclick = () => { authMode = 'login'; render(); };

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('login-user').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;
    const user = Store.findUser(username);
    if (!user) {
      document.getElementById('auth-error').textContent = 'User not found. Please sign up first.';
      return;
    }
    if (user.password && user.password !== pass) {
      document.getElementById('auth-error').textContent = 'Incorrect password.';
      return;
    }
    Store.currentUser = user;
    navigate('feed');
  };

  const signupForm = document.getElementById('signup-form');
  if (signupForm) signupForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const username = document.getElementById('signup-user').value.trim().toLowerCase();
    const pass = document.getElementById('signup-pass').value;
    if (username.length < 3) {
      document.getElementById('auth-error').textContent = 'Username must be at least 3 characters.';
      return;
    }
    if (Store.findUser(username)) {
      document.getElementById('auth-error').textContent = 'Username already taken.';
      return;
    }
    const newUser = { username, name, bio: '', avatar: '', password: pass, followers: [], following: [], posts: [] };
    const users = Store.users;
    users.push(newUser);
    Store.users = users;
    Store.currentUser = newUser;
    navigate('feed');
  };
}

// ===================== MAIN LAYOUT =====================
function renderMain() {
  const user = Store.currentUser;
  let content = '';
  switch (currentPage) {
    case 'feed': content = renderFeed(); break;
    case 'explore': content = renderExplore(); break;
    case 'profile': content = renderProfile(); break;
    case 'likes': content = renderLikes(); break;
    default: content = renderFeed();
  }
  return `
    ${renderTopNav()}
    <div class="content-area">${content}</div>
    ${renderBottomNav()}
    <div id="modal-root"></div>
  `;
}

function renderTopNav() {
  const user = Store.currentUser;
  return `
  <nav class="top-nav">
    <div class="top-nav-inner">
      <span class="logo" id="nav-logo">Instagram</span>
      <div class="nav-icons">
        <button class="nav-icon" id="nav-home" title="Home">${ICONS.home}</button>
        <button class="nav-icon" id="nav-search" title="Search">${ICONS.search}</button>
        <button class="nav-icon" id="nav-explore" title="Explore">${ICONS.explore}</button>
        <button class="nav-icon" id="nav-create" title="Create">${ICONS.create}</button>
        <button class="nav-icon" id="nav-heart" title="Notifications">${ICONS.heart}</button>
        <img class="nav-avatar" id="nav-profile" src="${Store.getAvatar(user.username)}" alt="profile">
      </div>
    </div>
  </nav>`;
}

function renderBottomNav() {
  return `
  <div class="bottom-nav">
    <button id="bnav-home">${ICONS.home}</button>
    <button id="bnav-search">${ICONS.search}</button>
    <button id="bnav-create">${ICONS.create}</button>
    <button id="bnav-heart">${ICONS.heart}</button>
    <button id="bnav-profile"><img class="nav-avatar" src="${Store.getAvatar(Store.currentUser.username)}" alt="profile"></button>
  </div>`;
}

function bindMain() {
  // Top nav
  const logo = document.getElementById('nav-logo');
  if (logo) logo.onclick = () => navigate('feed');

  document.getElementById('nav-home')?.addEventListener('click', () => navigate('feed'));
  document.getElementById('nav-explore')?.addEventListener('click', () => navigate('explore'));
  document.getElementById('nav-create')?.addEventListener('click', () => openCreateModal());
  document.getElementById('nav-profile')?.addEventListener('click', () => navigate('profile', { username: Store.currentUser.username }));
  document.getElementById('nav-search')?.addEventListener('click', () => toggleSearch());

  // Bottom nav
  document.getElementById('bnav-home')?.addEventListener('click', () => navigate('feed'));
  document.getElementById('bnav-search')?.addEventListener('click', () => navigate('explore'));
  document.getElementById('bnav-create')?.addEventListener('click', () => openCreateModal());
  document.getElementById('bnav-profile')?.addEventListener('click', () => navigate('profile', { username: Store.currentUser.username }));

  // Nav heart = show liked posts
  document.getElementById('nav-heart')?.addEventListener('click', () => navigate('likes'));
  document.getElementById('bnav-heart')?.addEventListener('click', () => navigate('likes'));

  // Page-specific bindings
  switch (currentPage) {
    case 'feed': bindFeed(); break;
    case 'explore': bindExplore(); break;
    case 'profile': bindProfile(); break;
    case 'likes': bindLikes(); break;
  }
}

// ===================== SEARCH =====================
let searchOpen = false;
function toggleSearch() {
  searchOpen = !searchOpen;
  if (searchOpen) {
    const area = document.querySelector('.content-area');
    const existing = document.querySelector('.search-panel');
    if (existing) { existing.remove(); searchOpen = false; return; }
    const panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.innerHTML = `<input type="text" id="search-input" placeholder="Search" autofocus><div class="search-results" id="search-results"></div>`;
    area.prepend(panel);
    document.getElementById('search-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const results = document.getElementById('search-results');
      if (!q) { results.innerHTML = ''; return; }
      const users = Store.users.filter(u => u.username.includes(q) || u.name.toLowerCase().includes(q));
      results.innerHTML = users.map(u => `
        <div class="search-result-item" data-user="${u.username}">
          <img src="${Store.getAvatar(u.username)}" alt="">
          <div class="search-result-info">
            <div class="sr-username">${u.username}</div>
            <div class="sr-name">${u.name}</div>
          </div>
        </div>
      `).join('');
      results.querySelectorAll('.search-result-item').forEach(item => {
        item.onclick = () => { searchOpen = false; navigate('profile', { username: item.dataset.user }); };
      });
    });
  } else {
    document.querySelector('.search-panel')?.remove();
  }
}

// ===================== FEED =====================
function renderFeed() {
  const user = Store.currentUser;
  const posts = Store.posts.sort((a, b) => b.createdAt - a.createdAt);
  const stories = Store.stories;

  const storiesHtml = `
    <div class="stories-bar">
      <div class="story-item" id="add-story">
        <div class="story-ring add-story">
          <div class="story-placeholder" style="width:100%;height:100%;border-radius:50%;border:3px solid #fff;background:#efefef;display:flex;align-items:center;justify-content:center;">
            <img src="${Store.getAvatar(user.username)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
          </div>
          <div class="add-story-badge">+</div>
        </div>
        <span class="story-name">Your story</span>
      </div>
      ${stories.map(s => `
        <div class="story-item story-trigger" data-user="${s.username}">
          <div class="story-ring ${s.seenBy.includes(user.username) ? 'seen' : ''}">
            <img src="${Store.getAvatar(s.username)}" alt="${s.username}">
          </div>
          <span class="story-name">${s.username}</span>
        </div>
      `).join('')}
    </div>`;

  const postsHtml = posts.map(p => renderPostCard(p)).join('');

  return `<div class="feed-container">${storiesHtml}${postsHtml}</div>`;
}

function renderPostCard(p) {
  const user = Store.currentUser;
  const liked = p.likes.includes(user.username);
  const bookmarked = p.bookmarks.includes(user.username);
  const commentsCount = p.comments.length;

  return `
  <div class="post-card" data-post-id="${p.id}">
    <div class="post-header">
      <img class="post-avatar" src="${Store.getAvatar(p.username)}" alt="">
      <span class="post-username" data-goto-user="${p.username}">${p.username}</span>
      <button class="post-more">${ICONS.more}</button>
    </div>
    <div class="post-image-wrap">
      <img src="${p.image}" alt="post" loading="lazy">
    </div>
    <div class="post-actions">
      <div class="left-actions">
        <button class="like-btn ${liked ? 'liked' : ''}" data-id="${p.id}">${liked ? ICONS.heartFill : ICONS.heart}</button>
        <button class="comment-open-btn" data-id="${p.id}">${ICONS.comment}</button>
        <button>${ICONS.share}</button>
      </div>
      <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-id="${p.id}">${bookmarked ? ICONS.bookmarkFill : ICONS.bookmark}</button>
    </div>
    <div class="post-likes">${p.likes.length > 0 ? p.likes.length + ' likes' : ''}</div>
    <div class="post-caption"><span class="cap-user" data-goto-user="${p.username}">${p.username}</span>${escHtml(p.caption)}</div>
    ${commentsCount > 0 ? `<div class="post-comments-link" data-id="${p.id}">View all ${commentsCount} comments</div>` : ''}
    <div class="post-time">${timeAgo(p.createdAt)}</div>
    <div class="post-add-comment">
      <input type="text" placeholder="Add a comment..." class="comment-input" data-id="${p.id}">
      <button class="btn-post post-comment-btn" data-id="${p.id}" disabled>Post</button>
    </div>
  </div>`;
}

function bindFeed() {
  // Stories
  document.querySelectorAll('.story-trigger').forEach(el => {
    el.onclick = () => openStoryViewer(el.dataset.user);
  });
  document.getElementById('add-story')?.addEventListener('click', () => openCreateStoryModal());

  bindPostActions();
}

function bindPostActions() {
  // Like
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.onclick = () => toggleLike(btn.dataset.id);
  });
  // Double-click like on image
  document.querySelectorAll('.post-image-wrap').forEach(wrap => {
    wrap.ondblclick = () => {
      const postId = wrap.closest('.post-card').dataset.postId;
      const posts = Store.posts;
      const post = posts.find(p => p.id === postId);
      if (post && !post.likes.includes(Store.currentUser.username)) {
        toggleLike(postId);
      }
      // Heart animation
      const heart = document.createElement('div');
      heart.innerHTML = ICONS.heartFill;
      heart.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:10;opacity:1;transition:all 0.4s;';
      heart.querySelector('svg').style.cssText = 'width:80px;height:80px;';
      wrap.style.position = 'relative';
      wrap.appendChild(heart);
      requestAnimationFrame(() => { heart.style.transform = 'translate(-50%,-50%) scale(1)'; });
      setTimeout(() => { heart.style.opacity = '0'; heart.style.transform = 'translate(-50%,-50%) scale(1.3)'; }, 600);
      setTimeout(() => heart.remove(), 1000);
    };
  });

  // Bookmark
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.onclick = () => toggleBookmark(btn.dataset.id);
  });

  // Comment input enable
  document.querySelectorAll('.comment-input').forEach(input => {
    const btn = document.querySelector(`.post-comment-btn[data-id="${input.dataset.id}"]`);
    input.oninput = () => { btn.disabled = !input.value.trim(); };
    input.onkeydown = (e) => { if (e.key === 'Enter' && input.value.trim()) { addComment(input.dataset.id, input.value.trim()); } };
  });
  document.querySelectorAll('.post-comment-btn').forEach(btn => {
    btn.onclick = () => {
      const input = document.querySelector(`.comment-input[data-id="${btn.dataset.id}"]`);
      if (input.value.trim()) addComment(btn.dataset.id, input.value.trim());
    };
  });

  // View comments -> open post detail
  document.querySelectorAll('.post-comments-link, .comment-open-btn').forEach(el => {
    el.onclick = () => openPostDetail(el.dataset.id);
  });

  // Go to user profile
  document.querySelectorAll('[data-goto-user]').forEach(el => {
    el.onclick = (e) => { e.stopPropagation(); navigate('profile', { username: el.dataset.gotoUser }); };
  });
}

function toggleLike(postId) {
  const posts = Store.posts;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const user = Store.currentUser.username;
  const idx = post.likes.indexOf(user);
  if (idx === -1) post.likes.push(user); else post.likes.splice(idx, 1);
  Store.posts = posts;
  render();
}

function toggleBookmark(postId) {
  const posts = Store.posts;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const user = Store.currentUser.username;
  const idx = post.bookmarks.indexOf(user);
  if (idx === -1) post.bookmarks.push(user); else post.bookmarks.splice(idx, 1);
  Store.posts = posts;
  render();
}

function addComment(postId, text) {
  const posts = Store.posts;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.comments.push({ username: Store.currentUser.username, text, time: Date.now() });
  Store.posts = posts;
  render();
}

// ===================== LIKES (いいねした投稿一覧) =====================
function renderLikes() {
  const user = Store.currentUser;
  const likedPosts = Store.posts.filter(p => p.likes.includes(user.username)).sort((a, b) => b.createdAt - a.createdAt);

  return `
  <div class="explore-container">
    <h2 style="margin-bottom:16px;font-size:18px;font-weight:600;">Liked posts</h2>
    ${likedPosts.length === 0 ? '<div style="text-align:center;padding:60px;color:#8e8e8e;">No liked posts yet</div>' : `
    <div class="explore-grid">
      ${likedPosts.map(p => `
        <div class="explore-item" data-id="${p.id}">
          <img src="${p.image}" alt="" loading="lazy">
          <div class="explore-overlay">
            <span>${ICONS.heartFill} ${p.likes.length}</span>
            <span>${ICONS.comment} ${p.comments.length}</span>
          </div>
        </div>
      `).join('')}
    </div>`}
  </div>`;
}

function bindLikes() {
  document.querySelectorAll('.explore-item').forEach(item => {
    item.onclick = () => openPostDetail(item.dataset.id);
  });
}

// ===================== EXPLORE =====================
function renderExplore() {
  const posts = Store.posts.sort(() => Math.random() - 0.5);
  return `
  <div class="explore-container">
    <div class="explore-grid">
      ${posts.map(p => `
        <div class="explore-item" data-id="${p.id}">
          <img src="${p.image}" alt="" loading="lazy">
          <div class="explore-overlay">
            <span>${ICONS.heartFill} ${p.likes.length}</span>
            <span>${ICONS.comment} ${p.comments.length}</span>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function bindExplore() {
  document.querySelectorAll('.explore-item').forEach(item => {
    item.onclick = () => openPostDetail(item.dataset.id);
  });
}

// ===================== PROFILE =====================
function renderProfile() {
  const username = currentParams.username || Store.currentUser.username;
  const user = Store.findUser(username);
  if (!user) return '<div style="text-align:center;padding:60px;">User not found</div>';
  const isSelf = username === Store.currentUser.username;
  const isFollowing = Store.currentUser.following?.includes(username);
  const userPosts = Store.posts.filter(p => p.username === username).sort((a, b) => b.createdAt - a.createdAt);

  return `
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-pic-wrap">
        <img class="profile-pic" src="${Store.getAvatar(username)}" alt="${username}" id="profile-pic-main">
      </div>
      <div class="profile-info">
        <div class="profile-top">
          <h2>${username}</h2>
          ${isSelf
            ? `<button class="btn-edit-profile" id="edit-profile-btn">Edit profile</button>
               <button class="btn-logout" id="logout-btn">Log out</button>`
            : `<button class="btn-follow ${isFollowing ? 'following' : ''}" id="follow-btn">${isFollowing ? 'Following' : 'Follow'}</button>`}
        </div>
        <div class="profile-stats">
          <span><strong>${userPosts.length}</strong> posts</span>
          <span><strong>${user.followers?.length || 0}</strong> followers</span>
          <span><strong>${user.following?.length || 0}</strong> following</span>
        </div>
        <div class="profile-bio">
          <div class="bio-name">${escHtml(user.name)}</div>
          <div>${escHtml(user.bio || '')}</div>
        </div>
      </div>
    </div>
    <div class="profile-tabs">
      <button class="active" id="tab-posts">${ICONS.grid} POSTS</button>
      ${isSelf ? `<button id="tab-saved">${ICONS.bookmark} SAVED</button>` : ''}
    </div>
    <div class="profile-grid" id="profile-grid-content">
      ${userPosts.map(p => `
        <div class="profile-grid-item" data-id="${p.id}">
          <img src="${p.image}" alt="" loading="lazy">
          <div class="explore-overlay">
            <span>${ICONS.heartFill} ${p.likes.length}</span>
            <span>${ICONS.comment} ${p.comments.length}</span>
          </div>
        </div>
      `).join('')}
      ${userPosts.length === 0 ? '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#8e8e8e;">No Posts Yet</div>' : ''}
    </div>
  </div>`;
}

function bindProfile() {
  // Edit profile
  document.getElementById('edit-profile-btn')?.addEventListener('click', () => openEditProfileModal());
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Log out?')) { Store.currentUser = null; render(); }
  });
  // Follow/Unfollow
  document.getElementById('follow-btn')?.addEventListener('click', () => {
    const target = currentParams.username;
    const me = Store.currentUser.username;
    const users = Store.users;
    const meUser = users.find(u => u.username === me);
    const targetUser = users.find(u => u.username === target);
    if (!meUser || !targetUser) return;
    if (!meUser.following) meUser.following = [];
    if (!targetUser.followers) targetUser.followers = [];
    const idx = meUser.following.indexOf(target);
    if (idx === -1) {
      meUser.following.push(target);
      targetUser.followers.push(me);
    } else {
      meUser.following.splice(idx, 1);
      const fi = targetUser.followers.indexOf(me);
      if (fi !== -1) targetUser.followers.splice(fi, 1);
    }
    Store.users = users;
    Store.currentUser = meUser;
    render();
  });

  // Tab switching (POSTS / SAVED)
  const tabPosts = document.getElementById('tab-posts');
  const tabSaved = document.getElementById('tab-saved');
  const gridContent = document.getElementById('profile-grid-content');

  if (tabPosts) tabPosts.onclick = () => {
    tabPosts.classList.add('active');
    if (tabSaved) tabSaved.classList.remove('active');
    const username = currentParams.username || Store.currentUser.username;
    const userPosts = Store.posts.filter(p => p.username === username).sort((a, b) => b.createdAt - a.createdAt);
    gridContent.innerHTML = renderGridItems(userPosts, 'No Posts Yet');
    bindGridItems();
  };

  if (tabSaved) tabSaved.onclick = () => {
    tabSaved.classList.add('active');
    tabPosts.classList.remove('active');
    const savedPosts = Store.posts.filter(p => p.bookmarks.includes(Store.currentUser.username)).sort((a, b) => b.createdAt - a.createdAt);
    gridContent.innerHTML = renderGridItems(savedPosts, 'No saved posts yet');
    bindGridItems();
  };

  // Post grid click
  bindGridItems();
}

function renderGridItems(posts, emptyMsg) {
  if (posts.length === 0) return `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#8e8e8e;">${emptyMsg}</div>`;
  return posts.map(p => `
    <div class="profile-grid-item" data-id="${p.id}">
      <img src="${p.image}" alt="" loading="lazy">
      <div class="explore-overlay">
        <span>${ICONS.heartFill} ${p.likes.length}</span>
        <span>${ICONS.comment} ${p.comments.length}</span>
      </div>
    </div>
  `).join('');
}

function bindGridItems() {
  document.querySelectorAll('.profile-grid-item').forEach(item => {
    item.onclick = () => openPostDetail(item.dataset.id);
  });
}

// ===================== CREATE POST MODAL =====================
function openCreateModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
  <div class="modal-overlay" id="create-overlay">
    <div class="create-modal">
      <div class="create-modal-header">
        <button id="create-close">Cancel</button>
        <span>Create new post</span>
        <button id="create-share" style="display:none">Share</button>
      </div>
      <div class="create-modal-body">
        <div class="create-drop-area" id="create-drop">
          ${ICONS.camera}
          <p>Drag photos here or click to select</p>
          <button class="btn-select">Select from computer</button>
          <input type="file" accept="image/*" id="create-file" style="display:none">
        </div>
        <img class="create-preview hidden" id="create-preview">
        <textarea class="create-caption hidden" id="create-caption" placeholder="Write a caption..."></textarea>
      </div>
    </div>
  </div>`;

  document.getElementById('create-overlay').onclick = (e) => { if (e.target.id === 'create-overlay') root.innerHTML = ''; };
  document.getElementById('create-close').onclick = () => root.innerHTML = '';

  const fileInput = document.getElementById('create-file');
  document.getElementById('create-drop').onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('create-drop').classList.add('hidden');
      const preview = document.getElementById('create-preview');
      preview.src = ev.target.result;
      preview.classList.remove('hidden');
      document.getElementById('create-caption').classList.remove('hidden');
      document.getElementById('create-share').style.display = '';
    };
    reader.readAsDataURL(file);
  };

  document.getElementById('create-share').onclick = () => {
    const image = document.getElementById('create-preview').src;
    const caption = document.getElementById('create-caption').value.trim();
    const posts = Store.posts;
    posts.unshift({
      id: 'p' + Date.now(),
      username: Store.currentUser.username,
      image,
      caption,
      likes: [],
      comments: [],
      bookmarks: [],
      createdAt: Date.now(),
    });
    Store.posts = posts;
    root.innerHTML = '';
    navigate('feed');
  };
}

// ===================== CREATE STORY MODAL =====================
function openCreateStoryModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
  <div class="modal-overlay" id="story-create-overlay">
    <div class="create-modal">
      <div class="create-modal-header">
        <button id="story-create-close">Cancel</button>
        <span>Add to your story</span>
        <button id="story-create-share" style="display:none">Share</button>
      </div>
      <div class="create-modal-body">
        <div class="create-drop-area" id="story-create-drop">
          ${ICONS.camera}
          <p>Select a photo for your story</p>
          <button class="btn-select">Select from computer</button>
          <input type="file" accept="image/*" id="story-create-file" style="display:none">
        </div>
        <img class="create-preview hidden" id="story-create-preview">
      </div>
    </div>
  </div>`;

  document.getElementById('story-create-overlay').onclick = (e) => { if (e.target.id === 'story-create-overlay') root.innerHTML = ''; };
  document.getElementById('story-create-close').onclick = () => root.innerHTML = '';

  const fileInput = document.getElementById('story-create-file');
  document.getElementById('story-create-drop').onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('story-create-drop').classList.add('hidden');
      const preview = document.getElementById('story-create-preview');
      preview.src = ev.target.result;
      preview.classList.remove('hidden');
      document.getElementById('story-create-share').style.display = '';
    };
    reader.readAsDataURL(file);
  };

  document.getElementById('story-create-share').onclick = () => {
    const image = document.getElementById('story-create-preview').src;
    const stories = Store.stories;
    const existing = stories.find(s => s.username === Store.currentUser.username);
    const item = { image, createdAt: Date.now() };
    if (existing) {
      existing.items.push(item);
    } else {
      stories.unshift({ username: Store.currentUser.username, items: [item], seenBy: [] });
    }
    Store.stories = stories;
    root.innerHTML = '';
    navigate('feed');
  };
}

// ===================== POST DETAIL MODAL =====================
function openPostDetail(postId) {
  const post = Store.posts.find(p => p.id === postId);
  if (!post) return;
  const user = Store.currentUser;
  const liked = post.likes.includes(user.username);
  const bookmarked = post.bookmarks.includes(user.username);

  const root = document.getElementById('modal-root');
  root.innerHTML = `
  <div class="modal-overlay" id="detail-overlay">
    <div class="post-detail-modal">
      <div class="post-detail-image">
        <img src="${post.image}" alt="">
      </div>
      <div class="post-detail-side">
        <div class="post-detail-header">
          <img class="post-avatar" src="${Store.getAvatar(post.username)}" alt="">
          <span class="post-username" style="font-weight:600;cursor:pointer;" data-goto-user="${post.username}">${post.username}</span>
        </div>
        <div class="post-detail-comments" id="detail-comments">
          <div class="comment-item">
            <img class="comment-avatar" src="${Store.getAvatar(post.username)}" alt="">
            <div class="comment-body">
              <span class="comment-user">${post.username}</span>
              <span class="comment-text">${escHtml(post.caption)}</span>
              <div class="comment-time">${timeAgo(post.createdAt)}</div>
            </div>
          </div>
          ${post.comments.map(c => `
            <div class="comment-item">
              <img class="comment-avatar" src="${Store.getAvatar(c.username)}" alt="">
              <div class="comment-body">
                <span class="comment-user" data-goto-user="${c.username}">${c.username}</span>
                <span class="comment-text">${escHtml(c.text)}</span>
                <div class="comment-time">${timeAgo(c.time)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="post-detail-actions">
          <div class="post-actions" style="padding:0;">
            <div class="left-actions">
              <button class="like-btn-detail ${liked ? 'liked' : ''}" data-id="${post.id}">${liked ? ICONS.heartFill : ICONS.heart}</button>
              <button>${ICONS.comment}</button>
              <button>${ICONS.share}</button>
            </div>
            <button class="bookmark-btn-detail ${bookmarked ? 'bookmarked' : ''}" data-id="${post.id}">${bookmarked ? ICONS.bookmarkFill : ICONS.bookmark}</button>
          </div>
          <div class="post-likes" style="padding:8px 0 4px;">${post.likes.length > 0 ? post.likes.length + ' likes' : ''}</div>
          <div class="post-time" style="padding:0 0 8px;">${timeAgo(post.createdAt)}</div>
        </div>
        <div class="post-detail-add-comment">
          <input type="text" placeholder="Add a comment..." id="detail-comment-input">
          <button id="detail-comment-btn" disabled>Post</button>
        </div>
      </div>
    </div>
  </div>`;

  document.getElementById('detail-overlay').onclick = (e) => { if (e.target.id === 'detail-overlay') root.innerHTML = ''; };

  document.querySelector('.like-btn-detail')?.addEventListener('click', () => {
    toggleLike(postId);
    openPostDetail(postId);
  });

  document.querySelector('.bookmark-btn-detail')?.addEventListener('click', () => {
    toggleBookmark(postId);
    openPostDetail(postId);
  });

  const input = document.getElementById('detail-comment-input');
  const btn = document.getElementById('detail-comment-btn');
  input.oninput = () => { btn.disabled = !input.value.trim(); };
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      addComment(postId, input.value.trim());
      openPostDetail(postId);
    }
  };
  btn.onclick = () => {
    if (input.value.trim()) {
      addComment(postId, input.value.trim());
      openPostDetail(postId);
    }
  };

  document.querySelectorAll('[data-goto-user]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      root.innerHTML = '';
      navigate('profile', { username: el.dataset.gotoUser });
    };
  });
}

// ===================== STORY VIEWER =====================
function openStoryViewer(username) {
  const stories = Store.stories;
  const storyIdx = stories.findIndex(s => s.username === username);
  if (storyIdx === -1) return;

  let currentStoryUser = storyIdx;
  let currentItem = 0;
  let timer = null;
  const DURATION = 5000;

  function renderStory() {
    const story = stories[currentStoryUser];
    if (!story) { closeViewer(); return; }
    const item = story.items[currentItem];
    if (!item) { closeViewer(); return; }

    const root = document.getElementById('modal-root');
    root.innerHTML = `
    <div class="stories-viewer" id="stories-viewer">
      <button class="close-btn" id="story-close">&times;</button>
      <div class="story-card">
        <div class="story-progress">
          ${story.items.map((_, i) => `
            <div class="story-progress-bar">
              <div class="fill" id="prog-${i}" style="width:${i < currentItem ? '100' : '0'}%"></div>
            </div>
          `).join('')}
        </div>
        <div class="story-user-info">
          <img src="${Store.getAvatar(story.username)}" alt="">
          <span>${story.username}</span>
          <span class="story-time">${timeAgo(item.createdAt)}</span>
        </div>
        <div class="story-content">
          <img src="${item.image}" alt="">
        </div>
        <div class="story-nav">
          <button class="story-prev" id="story-prev"></button>
          <button class="story-next" id="story-next"></button>
        </div>
      </div>
    </div>`;

    // Mark as seen
    if (!story.seenBy.includes(Store.currentUser.username)) {
      story.seenBy.push(Store.currentUser.username);
      Store.stories = stories;
    }

    // Animate progress
    startProgress();

    document.getElementById('story-close').onclick = closeViewer;
    document.getElementById('story-prev').onclick = () => {
      clearInterval(timer);
      if (currentItem > 0) { currentItem--; renderStory(); }
      else if (currentStoryUser > 0) { currentStoryUser--; currentItem = stories[currentStoryUser].items.length - 1; renderStory(); }
    };
    document.getElementById('story-next').onclick = () => {
      clearInterval(timer);
      nextItem();
    };
  }

  function startProgress() {
    const bar = document.getElementById(`prog-${currentItem}`);
    if (!bar) return;
    let progress = 0;
    const step = 100 / (DURATION / 50);
    timer = setInterval(() => {
      progress += step;
      bar.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(timer);
        nextItem();
      }
    }, 50);
  }

  function nextItem() {
    const story = stories[currentStoryUser];
    if (currentItem < story.items.length - 1) {
      currentItem++;
      renderStory();
    } else if (currentStoryUser < stories.length - 1) {
      currentStoryUser++;
      currentItem = 0;
      renderStory();
    } else {
      closeViewer();
    }
  }

  function closeViewer() {
    clearInterval(timer);
    document.getElementById('modal-root').innerHTML = '';
    render();
  }

  renderStory();
}

// ===================== EDIT PROFILE MODAL =====================
function openEditProfileModal() {
  const user = Store.currentUser;
  const root = document.getElementById('modal-root');
  root.innerHTML = `
  <div class="modal-overlay" id="edit-overlay">
    <div class="edit-profile-modal">
      <div class="edit-profile-header">
        <button id="edit-close">Cancel</button>
        <span>Edit profile</span>
        <button class="save-btn" id="edit-save">Done</button>
      </div>
      <div class="edit-profile-body">
        <div class="edit-avatar-section">
          <img src="${Store.getAvatar(user.username)}" id="edit-avatar-preview">
          <div>
            <div style="font-weight:600;">${user.username}</div>
            <button class="change-photo" id="edit-avatar-btn">Change profile photo</button>
            <input type="file" accept="image/*" id="edit-avatar-file" style="display:none">
          </div>
        </div>
        <div class="edit-field">
          <label>Name</label>
          <input type="text" id="edit-name" value="${escAttr(user.name)}">
        </div>
        <div class="edit-field">
          <label>Bio</label>
          <textarea id="edit-bio">${escHtml(user.bio || '')}</textarea>
        </div>
      </div>
    </div>
  </div>`;

  document.getElementById('edit-overlay').onclick = (e) => { if (e.target.id === 'edit-overlay') root.innerHTML = ''; };
  document.getElementById('edit-close').onclick = () => root.innerHTML = '';

  const avatarFile = document.getElementById('edit-avatar-file');
  document.getElementById('edit-avatar-btn').onclick = () => avatarFile.click();
  avatarFile.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { document.getElementById('edit-avatar-preview').src = ev.target.result; };
    reader.readAsDataURL(file);
  };

  document.getElementById('edit-save').onclick = () => {
    const name = document.getElementById('edit-name').value.trim();
    const bio = document.getElementById('edit-bio').value.trim();
    const avatar = document.getElementById('edit-avatar-preview').src;
    Store.updateUser(user.username, { name, bio, avatar });
    root.innerHTML = '';
    navigate('profile', { username: user.username });
  };
}

// ===================== Helpers =====================
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ===================== Init =====================
Store.init();
render();
