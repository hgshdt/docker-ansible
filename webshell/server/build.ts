import { type BuildOptions, build } from 'esbuild';

const green = (message: string) => `\u001b[32m${message}\u001b[0m`;
const cyan = (message: string) => `\u001b[36m${message}\u001b[0m`;

const NODE_ENV = process.env.NODE_ENV ?? 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);
const isDev = NODE_ENV === 'development';

console.info(`${green('>')} Mode ${cyan(`${NODE_ENV}`)}`);

const define: BuildOptions['define'] = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.WS_URL': JSON.stringify(process.env.WS_URL),
  'process.env.WS_PORT': JSON.stringify(process.env.WS_PORT),
};

const common: BuildOptions = {
  outdir: '../build',
  format: 'cjs',
  minify: !isDev,
  define,
};

const main: BuildOptions = {
  ...common,
  entryPoints: ['main.ts'],
  platform: 'node',
};

// const watch = async () => {
//   const mainCtx = await context({ ...main });
//   await mainCtx.watch();
// };

const prod = async () => {
  await build({ ...main });
};

// isDev ? watch() : prod();
prod();
