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
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();

window.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        document.querySelector('[data-search-trigger]')?.click();
    }
});
