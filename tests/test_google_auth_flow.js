/**
 * Automated Test Suite for Google Authentication Flow & Post-Auth Website Rendering
 */

import { strict as assert } from 'assert';

// Setup Mock DOM
const mockStorage = {};
global.window = {
  innerWidth: 1200,
  innerHeight: 800,
  devicePixelRatio: 2,
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { hash: '#/', pathname: '/', search: '' },
  history: { replaceState: (state, title, url) => { window.location.hash = url.split('#')[1] ? '#' + url.split('#')[1] : '#/'; } },
  localStorage: {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; }
  }
};

const domNodes = {};
function createMockElement(id, tagName = 'div') {
  return {
    id,
    tagName,
    innerHTML: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c) { if (this._classes.has(c)) { this._classes.delete(c); return false; } else { this._classes.add(c); return true; } },
      contains(c) { return this._classes.has(c); }
    },
    querySelector: (sel) => null,
    querySelectorAll: (sel) => [],
    addEventListener: () => {},
    remove: () => {},
    appendChild: () => {},
    prepend: () => {},
    getContext: () => ({
      scale: () => {},
      setTransform: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {}
    })
  };
}

global.document = {
  readyState: 'complete',
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'light'
  },
  body: createMockElement('body', 'body'),
  getElementById: (id) => {
    if (!domNodes[id]) domNodes[id] = createMockElement(id);
    return domNodes[id];
  },
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: (tag) => createMockElement('created_' + Date.now(), tag)
};
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.MutationObserver = class {
  observe() {}
  disconnect() {}
};

async function runTests() {
  console.log('🧪 Starting CALQIO Google Auth & Website Post-Auth Rendering Test...\n');

  const { state } = await import('../js/state.js');
  const { GoogleAuthService } = await import('../js/services/googleAuth.js');
  const { Navbar } = await import('../js/ui/navbar.js');
  const { Dashboard } = await import('../js/ui/dashboard.js');
  const { Router } = await import('../js/router.js');

  const headerEl = document.getElementById('app-header');
  const mainEl = document.getElementById('app-main');

  // Test 1: Initial Unauthenticated State
  console.log('--- Test 1: Unauthenticated State ---');
  Navbar.render(headerEl);
  assert.ok(headerEl.innerHTML.includes('Sign In'), 'Navbar must show Sign In button');
  assert.ok(!headerEl.innerHTML.includes('nav-user-avatar'), 'Navbar must not show user avatar yet');

  Dashboard.render(mainEl);
  assert.ok(mainEl.innerHTML.includes('Precision Solvers for'), 'Dashboard shows default unauthenticated hero title');
  console.log('✅ PASS: Initial unauthenticated view rendered correctly.');

  // Test 2: Simulating Google Authentication
  console.log('\n--- Test 2: Simulating Real Google Auth Completion ---');
  const mockGoogleUser = {
    googleId: '108482049284029482049',
    email: 'alex.developer@gmail.com',
    name: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/a/mockavatar',
    provider: 'google'
  };

  state.set('authModalOpen', true);
  assert.equal(state.get('authModalOpen'), true, 'Modal was opened');

  const signedInUser = await GoogleAuthService.completeSignIn(mockGoogleUser);
  assert.equal(signedInUser.email, 'alex.developer@gmail.com', 'User email matches');
  assert.equal(state.get('authModalOpen'), false, 'Modal is automatically closed after sign-in');
  assert.equal(state.get('currentUser').name, 'Alex Rivera', 'Current user state updated');
  console.log('✅ PASS: GoogleAuthService.completeSignIn completed and state updated.');

  // Test 3: Authenticated Post-Auth Website Rendering
  console.log('\n--- Test 3: Authenticated Post-Auth Website Rendering ---');
  Navbar.render(headerEl);
  assert.ok(headerEl.innerHTML.includes('Alex'), 'Navbar displays user first name');
  assert.ok(headerEl.innerHTML.includes('https://lh3.googleusercontent.com/a/mockavatar'), 'Navbar displays Google user avatar');
  assert.ok(!headerEl.innerHTML.includes('nav-signin-pill'), 'Sign In pill replaced by user profile pill');
  console.log('✅ PASS: Navbar updated with authenticated user avatar and name.');

  Dashboard.render(mainEl);
  assert.ok(mainEl.innerHTML.includes('Welcome back, <strong style="color: #4285F4;">Alex</strong>!'), 'Dashboard hero shows personalized welcome greeting');
  assert.ok(mainEl.innerHTML.includes('● Cloud Synced'), 'Dashboard displays Cloud Synced status badge');
  assert.ok(mainEl.innerHTML.includes('Welcome, <span class="hero-highlight-text">Alex Rivera</span>'), 'Dashboard title shows full name');
  console.log('✅ PASS: Dashboard displays personalized welcome banner & Cloud Synced state.');

  // Test 4: OAuth URL Redirect Hash Parser
  console.log('\n--- Test 4: OAuth URL Hash Token Callback Processing ---');
  window.location.hash = '#access_token=ya29.mocktoken12345&id_token=mock_id_token&token_type=Bearer';
  
  let redirectDetected = false;
  GoogleAuthService.fetchGoogleUserInfo = async (token) => {
    assert.equal(token, 'ya29.mocktoken12345', 'Access token extracted correctly from URL');
    redirectDetected = true;
    return mockGoogleUser;
  };

  await GoogleAuthService.checkUrlForOAuthCallback();
  assert.ok(redirectDetected, 'checkUrlForOAuthCallback successfully processed hash token');
  assert.equal(window.location.hash, '#/', 'URL hash cleaned back to #/ website route');
  console.log('✅ PASS: OAuth URL callback processed and URL cleaned back to #/.');

  // Test 5: Sign Out Behavior
  console.log('\n--- Test 5: Sign Out Behavior ---');
  GoogleAuthService.signOut();
  assert.equal(state.get('currentUser'), null, 'User cleared on sign-out');
  Navbar.render(headerEl);
  assert.ok(headerEl.innerHTML.includes('Sign In'), 'Navbar reverted to Sign In button');
  Dashboard.render(mainEl);
  assert.ok(mainEl.innerHTML.includes('Precision Solvers for'), 'Dashboard reverted to default unauthenticated hero');
  console.log('✅ PASS: Sign out cleanly restored unauthenticated state.');

  console.log('\n========================================================');
  console.log('🎉 ALL AUTHENTICATION & POST-AUTH UI TESTS PASSED (100%)');
  console.log('========================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
