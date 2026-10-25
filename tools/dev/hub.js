import { ZD_DEV_MODULES } from './registry.js';
import { ZD_DEV_CONTRACT } from './contract.js';

const KEY = 'zdash.dev.tools.v1';

function readStore() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch (err) { return {}; }
}

function writeStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export async function mountUrl(url, title, host, ctx) {
  host.replaceChildren();
  try {
    const mod = await import(url);
    if (typeof mod.createModule !== 'function') throw new Error('createModule missing');
    const api = mod.createModule();
    await api.mount(host, ctx || { onSave() {} });
    return api;
  } catch (err) {
    const card = document.createElement('div');
    card.className = 'zfail';
    card.setAttribute('role', 'alert');
    const b = document.createElement('b');
    b.textContent = title || 'Tool';
    const p = document.createElement('p');
    p.textContent = String((err && err.message) || err);
    const note = document.createElement('p');
    note.textContent = 'The other tools are still available.';
    card.append(b, p, note);
    host.replaceChildren(card);
    return {
      id: 'broken',
      failed: true,
      title,
      unmount() {},
      save() { return null; },
      load() {},
    };
  }
}

export async function showModule(id, host, ctx) {
  const spec = ZD_DEV_MODULES.find((m) => m.id === id);
  if (!spec) return mountUrl(new URL('./dist/missing-' + id + '.js', import.meta.url).href, id, host, ctx);
  return mountUrl(new URL(spec.url, import.meta.url).href, spec.title, host, ctx);
}

function boot() {
  const params = new URLSearchParams(location.search);
  const root = document.getElementById('zapp');
  root.innerHTML = '';
  const head = document.createElement('header');
  head.className = 'zhead';
  const title = document.createElement('h1');
  title.textContent = 'DEV TEST TOOLS';
  const tabs = document.createElement('nav');
  tabs.id = 'ztabs';
  tabs.className = 'ztabs';
  head.append(title, tabs);
  const mount = document.createElement('main');
  mount.id = 'zmount';
  mount.className = 'zmount';
  const foot = document.createElement('p');
  foot.className = 'zfoot';
  foot.textContent = 'Test page only. For a single file, the three.js editor, a glTF viewer, or Mixamo still work. They cannot apply this catalog, the Ellie / 370Z scale, or these check bars.';
  root.append(head, mount, foot);

  let current = null;
  let currentId = '';

  function remember() {
    if (!current || current.failed) return;
    const store = readStore();
    try { store[currentId] = current.save(); } catch (err) { store[currentId] = null; }
    store.last = currentId;
    writeStore(store);
  }

  const ctx = { onSave: remember };

  async function activate(id) {
    if (current) {
      try { remember(); } catch (err) { /* keep the hub up */ }
      try { current.unmount(); } catch (err) { /* a bad unmount still switches */ }
      current = null;
    }
    currentId = id;
    for (const btn of tabs.querySelectorAll('button')) btn.classList.toggle('on', btn.dataset.id === id);
    const store = readStore();
    current = await showModule(id, mount, ctx);
    if (!current.failed && store[id]) {
      try { current.load(store[id]); } catch (err) { /* settings are optional */ }
    }
    const q = new URLSearchParams(location.search);
    q.set('m', id);
    history.replaceState(null, '', location.pathname + '?' + q.toString());
    return current;
  }

  for (const spec of ZD_DEV_MODULES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ztab';
    btn.dataset.id = spec.id;
    btn.textContent = spec.title;
    btn.addEventListener('click', () => { activate(spec.id); });
    tabs.appendChild(btn);
  }

  window.__SPIN = {
    contract: ZD_DEV_CONTRACT,
    modules: ZD_DEV_MODULES.map((m) => m.id),
    ready: false,
    async open(id) {
      const api = await activate(id);
      return { id, failed: !!api.failed };
    },
    async mountBroken() {
      if (current) {
        try { current.unmount(); } catch (err) { /* the hub still switches */ }
        current = null;
      }
      const api = await mountUrl(new URL('./dist/no-such-module.js', import.meta.url).href, 'BROKEN', mount, ctx);
      return {
        failed: !!api.failed,
        card: !!mount.querySelector('.zfail'),
        tabs: tabs.children.length,
      };
    },
    current() { return { id: currentId, failed: !!(current && current.failed) }; },
  };

  const first = params.get('m') || readStore().last || ZD_DEV_MODULES[0].id;
  activate(first).then(() => { window.__SPIN.ready = true; });
}

boot();
