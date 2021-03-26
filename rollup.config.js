import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import multi from '@rollup/plugin-multi-entry';

const pkg = require('./package.json');

const rollupConfig = [
    {
        input: 'elements/**/index.js',
        treeshake: {
            moduleSideEffects: false
        },
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            multi(),
            external({
                includeDependencies: true
            }),
            resolve(),
            babel({
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-proposal-class-properties'
                ],
                exclude: 'node_modules/**',
                runtimeHelpers: true
            })
        ]
    }
];

export default rollupConfig;
