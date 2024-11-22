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
  bundle: true,
  minify: !isDev,
  sourcemap: isDev ? 'inline' : false,
  treeShaking: true,
  define,
};

const renderer: BuildOptions = {
  ...common,
  entryPoints: ['xterm-profile.ts'],
  platform: 'browser',
  metafile: true,
  plugins: [],
};

// const watch = async () => {
//   const rendererCtx = await context({ ...renderer });
//   await rendererCtx.watch();
// };

const prod = async () => {
  await build({ ...renderer });
};

// isDev ? watch() : prod();
prod();
