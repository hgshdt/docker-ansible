import { type BuildOptions, build, context } from 'esbuild';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);
const isDev = NODE_ENV === 'development';

const define: BuildOptions['define'] = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.npm_package_version': JSON.stringify(
    process.env.npm_package_version,
  ),
};

const common: BuildOptions = {
  outdir: 'build',
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  define,
  loader: { '.node': 'file' },
};

const main: BuildOptions = {
  ...common,
  entryPoints: ['index.ts'],
  platform: 'node',
};

const watch = async () => {
  const mainCtx = await context({ ...main });
  await mainCtx.watch();
};

const prod = async () => {
  await build({ ...main });
};

isDev ? watch() : prod();
