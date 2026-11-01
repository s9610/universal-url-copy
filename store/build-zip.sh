#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 - <<'PY'
from pathlib import Path
import hashlib
import json
import zipfile

root = Path.cwd()
manifest = json.loads((root / 'manifest.json').read_text())
assert manifest['version'] == '1.3', 'Expected version 1.3'
files = [
    'LICENSE', 'manifest.json', 'background.js', 'content.js', 'popup.html', 'popup.js',
    'options.html', 'options.js', 'style.css',
    'images/icon16.png', 'images/icon32.png', 'images/icon48.png', 'images/icon128.png',
]
target = root / 'store' / 'universal-url-copy-1.3.zip'
with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name in sorted(files):
        data = (root / name).read_bytes()
        entry = zipfile.ZipInfo(name, date_time=(2026, 10, 31, 0, 0, 0))
        entry.create_system = 3
        entry.external_attr = 0o100644 << 16
        entry.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(entry, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
with zipfile.ZipFile(target) as archive:
    assert archive.testzip() is None, 'ZIP checksum failure'
    assert sorted(archive.namelist()) == sorted(files)
    for entry in archive.infolist():
        print(f'{entry.file_size:8d}  {entry.filename}')
print(f'ZIP {target}')
print(f'Size {target.stat().st_size} bytes')
print(f'SHA256 {hashlib.sha256(target.read_bytes()).hexdigest()}')
PY
