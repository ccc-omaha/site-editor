# edit.cccomaha.org

Staff hub for editing CCC sites in Pages CMS. Each card links straight to that site's editor (Edit) and the live site (View).

- `content/sites.json`: the list of sites. Add a site here (or in Pages CMS under "1. Sites") when it moves onto Pages CMS.
- `content/page.json`: heading, intro, how-to steps, help contact.
- `src/template.html` + `build.js` build `index.html`. Netlify runs `node build.js` on every deploy.
