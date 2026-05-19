const args = new Set(process.argv.slice(2));

const isWatch = args.has('--watch');
const isProduction = args.has('--mode=production') || args.has('--production');

await Bun.write(
  './build/js/index.html',
  [
    '<!doctype html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    '    <title>React extension</title>',
    '    <link rel="stylesheet" href="./index.css" />',
    '  </head>',
    '  <body>',
    '    <div id="root"></div>',
    '    <script src="./index.js"></script>',
    '  </body>',
    '</html>',
  ].join('\n')
);

const command = [
  'bun',
  'build',
  './src/index.tsx',
  './src/background.ts',
  './src/content_script.ts',
  './src/redirect.ts',
  './src/toolbar.ts',
  '--outdir',
  './build/js',
  '--target',
  'browser',
  '--format',
  'iife',
];

if (isProduction) {
  command.push('--minify');
} else {
  command.push('--sourcemap=inline');
}

if (isWatch) {
  command.push('--watch');
}

const processResult = Bun.spawn(command, {
  stdout: 'inherit',
  stderr: 'inherit',
});

const exitCode = await processResult.exited;
if (exitCode !== 0) {
  process.exit(exitCode);
}
