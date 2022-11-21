import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'

export default [
  {
    input: 'packages/SkuSelect/index.ts',
    output: {
      file: 'lib/es/index.js',
      format: 'esm',
    },
    external: ['react'],
    plugins: [
      postcss(),
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          include: ['packages/SkuSelect'],
        },
      }),
    ],
  },
]
