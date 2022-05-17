const fs = require('fs');
const { resolve } = require('path');

console.log('Cleaning webpack build');
try {
  fs.rmSync(resolve(__dirname, '../.webpack'), { recursive: true });
} catch (err) { handle(err, 'Failed to delete webpack build: ') }

console.log('Cleaning webpack cache');
try {
  fs.rmSync(resolve(__dirname, '../.cache'), { recursive: true });
} catch (err) { handle(err, 'Failed to delete webpack cache: ') }

console.log('Cleaning electron forge output');
try {
  fs.rmSync(resolve(__dirname, '../out'), { recursive: true });
} catch (err) { handle(err, 'Failed to delete electron-forge output: ') }

function handle(err, prefix) {
  if (err.code !== 'ENOENT') console.log(prefix + err.message);
}