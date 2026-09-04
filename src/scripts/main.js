import Alpine from 'alpinejs';
import Fuse from 'fuse.js';
window.Alpine = Alpine;
window.Fuse = Fuse;
window.normalizeFa = value => String(value || '').replaceAll('ي', 'ی').replaceAll('ى', 'ی').replace(/[\u200c\u200d]/g, '').toLowerCase().trim();
window.searchState = () => ({
    open: false,
    query: '',
    results: [],
    index: [],
    fuse: null,
    async init() {
        try {
            const response = await fetch('/search-index.json');
            this.index = await response.json();
            const normalized = this.index.map(item => ({ ...item, title: window.normalizeFa(item.title), summary: window.normalizeFa(item.summary), tags: item.tags.map(window.normalizeFa), content: window.normalizeFa(item.content) }));
            this.fuse = new Fuse(normalized, { keys: ['title', 'summary', 'tags', 'content'], threshold: 0.35, ignoreLocation: true });
        } catch (error) {
            this.index = [];
        }
    },
    search() {
        const query = window.normalizeFa(this.query);
        this.results = query && this.fuse ? this.fuse.search(query).slice(0, 12).map(item => item.item) : [];
    },
    show() { this.open = true; this.$nextTick(() => this.$refs.input?.focus()); },
    hide() { this.open = false; this.query = ''; this.results = []; }
});
document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        document.querySelector('[data-search-trigger]')?.click();
    }
});
Alpine.start();
