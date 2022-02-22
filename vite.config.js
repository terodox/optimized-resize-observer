import pkg from './package.json';

const config = {
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'OptimizedResizeObserver',
            fileName: (format) => `optimized-resize-observer.${format}.js`
        },
        rollupOptions: {
            output: {
                format: 'es'
            }
        }
    },
    server: {
        open: '/demo/index.html'
    },
    test: {
        environment: 'jsdom',
        reporters: 'dot'
    }
};

console.log(`Rollup Config: ${JSON.stringify(config, null, 2)}`);

export default config;
