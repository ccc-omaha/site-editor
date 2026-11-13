// Builds index.html from src/template.html + content/*.json (edited in Pages CMS).
const fs = require('fs');
const path = require('path');
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'content', f + '.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tie = s => s.replace(/ ([^\s<>]{1,14})((?:<\/[a-z]+>)*)$/i, '&nbsp;$1$2');   // no orphaned last word
const fmt = s => tie(esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2">$1</a>'));
const editUrl = repo => `https://app.pagescms.org/ccc-omaha/${encodeURIComponent(repo)}/main`;
const pencil = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';

const page = read('page'), sites = read('sites');
const cards = sites.map((s, i) => `
      <article class="site" style="--c:${esc(s.color || '#0083E0')}" data-i="${i}" data-name="${esc(s.name)}" data-repo="${esc(s.repo)}" data-search="${esc([s.name, s.purpose, s.url, s.repo].join(' ').toLowerCase())}">
        <h2>${esc(s.name)}</h2>
        <p class="purpose">${esc(s.purpose)}</p>
        <p class="url">${esc(String(s.url || '').replace(/^https?:\/\//, ''))}</p>
        <p class="updated" hidden></p>
        <div class="actions">
          <a class="btn edit" href="${editUrl(s.repo)}" target="_blank" rel="noopener">${pencil}Edit</a>
          <a class="btn view" href="${esc(s.url)}" target="_blank" rel="noopener">View ${arrow}</a>
        </div>
      </article>`).join('');
const steps = (page.steps || []).map(t => `
          <li>${fmt(t)}</li>`).join('');

let html = fs.readFileSync(path.join(__dirname, 'src', 'template.html'), 'utf8')
  .replace('{{heading}}', tie(esc(page.heading)))
  .replace('{{intro}}', fmt(page.intro))
  .replace('{{sites}}', cards)
  .replace('{{steps}}', steps)
  .replace('{{helpName}}', esc(page.helpName))
  .replace(/{{helpEmail}}/g, esc(page.helpEmail))
  .replace('{{selfEdit}}', editUrl('site-editor'));
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log(`Built index.html with ${sites.length} sites`);
