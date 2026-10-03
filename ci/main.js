(function () {
  'use strict';

  const toast = document.querySelector('#copy-toast');
  let toastTimer;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      notify('클립보드에 복사했습니다.');
    } catch (_) {
      notify('복사할 수 없습니다. 텍스트를 직접 선택해 주세요.');
    }
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyText(button.dataset.copy));
  });

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (target) copyText(target.textContent.trim());
    });
  });

  function shortHash(hash) {
    return `${hash.slice(0, 12)}…${hash.slice(-8)}`;
  }

  fetch('brand-manifest.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((manifest) => {
      document.querySelector('#manifest-version').textContent = manifest.version;
      document.querySelector('#approved-count').textContent = String(manifest.release.approvedAssetCount);
      const body = document.querySelector('#asset-table-body');
      body.replaceChildren();
      manifest.assets.forEach((asset) => {
        const row = document.createElement('tr');
        const cells = [asset.assetId, asset.semanticRole, asset.status, `${asset.dimensions.width}×${asset.dimensions.height}`];
        cells.forEach((value, index) => {
          const cell = document.createElement('td');
          if (index === 2) {
            const badge = document.createElement('span');
            badge.className = 'badge hold';
            badge.textContent = value;
            cell.appendChild(badge);
          } else {
            cell.textContent = value;
          }
          row.appendChild(cell);
        });
        const hashCell = document.createElement('td');
        const hash = document.createElement('code');
        hash.title = asset.sha256;
        hash.textContent = shortHash(asset.sha256);
        hashCell.appendChild(hash);
        row.appendChild(hashCell);
        const downloadCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = asset.path;
        link.download = '';
        link.textContent = '파일';
        downloadCell.appendChild(link);
        row.appendChild(downloadCell);
        body.appendChild(row);
      });
    })
    .catch((error) => {
      document.querySelector('#asset-table-body').innerHTML = `<tr><td colspan="6">Manifest를 불러오지 못했습니다: ${String(error.message)}</td></tr>`;
    });
})();
