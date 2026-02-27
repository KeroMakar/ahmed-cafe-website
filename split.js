const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let headerEnd = html.indexOf('  <!-- ===================== HERO ===================== -->');
let heroEnd = html.indexOf('  <!-- ===================== MENU SECTION ===================== -->');
let menuEnd = html.indexOf('  <!-- ===================== ABOUT SECTION ===================== -->');
let contactEnd = html.indexOf('  <!-- ===================== FOOTER ===================== -->');
let aboutContactEnd = html.indexOf('  <!-- Initialization for Circular Gallery -->');

let headAndHeader = html.substring(0, headerEnd);
let hero = html.substring(headerEnd, heroEnd);
let menu = html.substring(heroEnd, menuEnd);
let aboutContact = html.substring(menuEnd, contactEnd);
let footerAndBackToTop = html.substring(contactEnd, aboutContactEnd);
let scripts = html.substring(aboutContactEnd);

let menuHeader = headAndHeader
    .replace('<a href="#hero" class="nav-link active"', '<a href="index.html#hero" class="nav-link"')
    .replace('<a href="#menu" class="nav-link"', '<a href="menu.html" class="nav-link active"')
    .replace('<a href="#about" class="nav-link"', '<a href="index.html#about" class="nav-link"')
    .replace('<a href="#contact" class="nav-link"', '<a href="index.html#contact" class="nav-link"');

let mainHeader = headAndHeader
    .replace('<a href="#menu" class="nav-link" data-section="menu">Menu</a>', '<a href="menu.html" class="nav-link" data-section="menu">Menu</a>');

let mainHero = hero.replace('<a href="#menu" class="hero-btn"', '<a href="menu.html" class="hero-btn"');

let mainScripts = '\n  <script src="script.js"></script>\n</body>\n</html>\n';

let menuHtml = menuHeader + '\n  <div style="height: 100px; background: var(--cream);"></div>\n' + menu + footerAndBackToTop + scripts;
let indexHtml = mainHeader + mainHero + aboutContact + footerAndBackToTop + mainScripts;

fs.writeFileSync('menu.html', menuHtml);
fs.writeFileSync('index.html', indexHtml);
