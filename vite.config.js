import dts from 'vite-dts';

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
    plugins: [
        dts()
    ],
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
