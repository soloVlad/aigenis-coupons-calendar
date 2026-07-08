import { spawnSync } from 'node:child_process';
import { chmodSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { stdin as input, stdout as output } from 'node:process';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID_DIR = join(ROOT_DIR, 'android');
const GRADLEW = join(ANDROID_DIR, 'gradlew');

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? ROOT_DIR,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function promptChoice(rl, prompt, option1, option2, value1, value2) {
  while (true) {
    console.log();
    console.log(prompt);
    console.log(`  1) ${option1}`);
    console.log(`  2) ${option2}`);

    const choice = (await rl.question('Choice [1-2]: ')).trim().toLowerCase();

    if (choice === '1' || choice === value1 || choice === option1.toLowerCase()) {
      return value1;
    }

    if (choice === '2' || choice === value2 || choice === option2.toLowerCase()) {
      return value2;
    }

    console.log('Invalid choice. Enter 1, 2, or the option name.');
  }
}

const rl = createInterface({ input, output });

try {
  const bundleType = await promptChoice(rl, 'Bundle type:', 'APK', 'AAB', 'apk', 'aab');
  const buildType = await promptChoice(rl, 'Build type:', 'debug', 'release', 'debug', 'release');

  const buildTypeCapitalized = capitalize(buildType);
  const gradleTask =
    bundleType === 'apk' ? `assemble${buildTypeCapitalized}` : `bundle${buildTypeCapitalized}`;
  const outputPath =
    bundleType === 'apk'
      ? join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', buildType, `app-${buildType}.apk`)
      : join(ANDROID_DIR, 'app', 'build', 'outputs', 'bundle', buildType, `app-${buildType}.aab`);

  console.log();
  console.log('==> Building web app');
  run('pnpm', ['build']);

  console.log();
  console.log('==> Syncing Capacitor Android project');
  run('npx', ['cap', 'sync', 'android']);

  console.log();
  console.log(`==> Building Android ${bundleType.toUpperCase()} (${buildType})`);
  chmodSync(GRADLEW, 0o755);
  run(GRADLEW, [gradleTask], { cwd: ANDROID_DIR });

  console.log();
  console.log('Build complete:');
  console.log(`  ${outputPath}`);
} finally {
  rl.close();
}
