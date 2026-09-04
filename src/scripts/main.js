import Alpine from 'alpinejs';
import Fuse from 'fuse.js';

const normalize = value => String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const scrollToHash = (behavior = 'auto') => {
    const rawHash = window.location.hash;
    if (!rawHash) return false;
    const id = decodeURIComponent(rawHash.slice(1));
    const target = document.getElementById(id);
    if (!target) return false;
    const header = document.querySelector('header');
    const offset = (header?.getBoundingClientRect().height || 0) + 24;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
    return true;
};

const restoreHashPosition = (behavior = 'auto') => {
    if (!window.location.hash) return;
    requestAnimationFrame(() => {
        if (scrollToHash(behavior)) return;
        setTimeout(() => scrollToHash(behavior), 50);
        setTimeout(() => scrollToHash(behavior), 250);
    });
};

window.searchState = () => ({
    open: false,
    query: '',
    results: [],
    items: [],
    fuse: null,
    async init() {
        const response = await fetch('/search-index.json');
        this.items = await response.json();
        this.fuse = new Fuse(this.items, { keys: ['title', 'summary', 'content', 'category'], threshold: 0.34, ignoreLocation: true });
    },
    show() { this.open = true; this.$nextTick(() => this.$refs.input?.focus()); },
    hide() { this.open = false; this.query = ''; this.results = []; },
    search() {
        const query = normalize(this.query);
        this.results = query && this.fuse ? this.fuse.search(query, { limit: 12 }).map(result => result.item) : [];
    }
});

const init = () => {
    document.body.setAttribute('x-data', '{ mobileOpen: false }');
    document.querySelector('#mobile-navigation')?.removeAttribute('x-data');
    Alpine.start();
    restoreHashPosition();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.hash) return;
    if (url.pathname !== window.location.pathname) return;
    const id = decodeURIComponent(url.hash.slice(1));
    if (!document.getElementById(id)) return;
    event.preventDefault();
    history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    scrollToHash('smooth');
});

window.addEventListener('hashchange', () => restoreHashPosition('smooth'));

window.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        document.querySelector('[data-search-trigger]')?.click();
    }
});
