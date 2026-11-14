// Browser QA for this local prototype. No network integration or test lead.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
const { createServer } = require('../server.cjs');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'preview');
fs.mkdirSync(output, { recursive: true });
const server = createServer();
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port + '/';
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage(), errors = [], unexpectedRequests = [], layouts = [];
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setRequestInterception(true);
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.method() !== 'GET' || !request.url().startsWith(base)) { unexpectedRequests.push({ method: request.method(), url: request.url() }); request.abort(); }
      else request.continue();
    });
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewport({ width, height: width < 700 ? 844 : 1000 });
      const response = await page.goto(base, { waitUntil: 'networkidle0' }); assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const cta = document.querySelector('.hero-cta').getBoundingClientRect();
        return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1, ctaBottom: cta.bottom, viewport: innerHeight, brandReady: document.querySelector('.brand img').complete && document.querySelector('.brand img').naturalWidth > 0, height: document.documentElement.scrollHeight };
      });
      assert.equal(layout.overflow, false, 'No horizontal overflow at ' + width);
      assert.ok(layout.ctaBottom < layout.viewport, 'Primary CTA is visible on the first screen at ' + width);
      assert.equal(layout.brandReady, true);
      assert.equal(await page.$$eval('h1', elements => elements.length), 1);
      assert.equal(await page.$eval('meta[name=robots]', element => element.content), 'noindex, nofollow');
      assert.equal(await page.$eval('#business-link', element => element.type === 'text' && !element.required && !element.hasAttribute('maxlength')), true);
      const sizes = await page.evaluate(() => ({
        headline: parseFloat(getComputedStyle(document.querySelector('.hero h1')).fontSize),
        sectionHeading: parseFloat(getComputedStyle(document.querySelector('.pricing h2')).fontSize),
        body: parseFloat(getComputedStyle(document.querySelector('.section-intro')).fontSize),
        formLabel: parseFloat(getComputedStyle(document.querySelector('.assessment-card label')).fontSize),
        formInput: parseFloat(getComputedStyle(document.querySelector('#full-name')).fontSize),
        faq: parseFloat(getComputedStyle(document.querySelector('.faq-list summary')).fontSize),
        process: parseFloat(getComputedStyle(document.querySelector('.process-step > p')).fontSize)
      }));
      assert.ok(sizes.body === 16 && sizes.formLabel === 16 && sizes.formInput === 16 && sizes.faq === 16 && sizes.process === 16, 'Normal, readable 16px text throughout at ' + width);
      assert.ok(sizes.headline >= 40 && sizes.headline <= 66 && sizes.sectionHeading >= 30 && sizes.sectionHeading <= 44, 'Balanced heading scale at ' + width);
      assert.equal(await page.$$eval('[data-step]', elements => elements.every(element => element.getBoundingClientRect().width >= 44 && element.getBoundingClientRect().height >= 44)), true, 'Comfortable quantity tap targets at ' + width);
      assert.equal(await page.$$eval('script[src*="googletagmanager"], script[src*="challenges.cloudflare"], iframe', elements => elements.length), 0);
      for (const href of await page.$$eval('a[href^="#"]', elements => elements.map(element => element.getAttribute('href')))) assert.ok(await page.$(href), 'Existing target ' + href);
      layouts.push({ ...layout, typography: sizes });
      if ([1440, 390].includes(width)) {
        await page.screenshot({ path: path.join(output, 'homepage-' + width + '.png'), fullPage: true });
        await page.screenshot({ path: path.join(output, 'first-screen-' + width + '.png') });
        await (await page.$('#assessment')).screenshot({ path: path.join(output, 'assessment-' + width + '.png') });
        await (await page.$('#pricing')).screenshot({ path: path.join(output, 'pricing-' + width + '.png') });
        await (await page.$('#review-focus')).screenshot({ path: path.join(output, 'review-focus-' + width + '.png') });
      }
      if (width < 761) {
        await page.click('.menu-button'); assert.equal(await page.$eval('.menu-button', element => element.getAttribute('aria-expanded')), 'true');
        await page.keyboard.press('Escape'); assert.equal(await page.$eval('.menu-button', element => element.getAttribute('aria-expanded')), 'false');
        await page.click('.menu-button'); await page.click('#site-nav a[href="#pricing"]');
        assert.equal(await page.$eval('.menu-button', element => element.getAttribute('aria-expanded')), 'false');
      }
    }
    await page.setViewport({ width: 1440, height: 1000 }); await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('.quantity-line [data-step="1"]');
    assert.equal(await page.$eval('#request-quantity', element => element.value), '2');
    assert.equal(await page.$eval('.estimate-total dd', element => element.textContent), '$350');
    await page.$eval('#request-quantity', element => { element.value = 3; element.dispatchEvent(new Event('input', { bubbles: true })); });
    assert.equal(await page.$eval('#estimate-quantity', element => element.value), '3');
    assert.equal(await page.$eval('.estimate-card [data-estimate=upfront]', element => element.textContent), '$150');
    assert.equal(await page.$eval('.estimate-card [data-estimate=success]', element => element.textContent), '$375');
    assert.equal(await page.$eval('.estimate-total dd', element => element.textContent), '$525');
    await page.$eval('#removed-count', element => { element.value = 1; element.dispatchEvent(new Event('input', { bubbles: true })); });
    assert.equal(await page.$eval('.estimate-total dd', element => element.textContent), '$275', 'Three assessed, one removed: 3 × 50 + 1 × 125');
    assert.equal(await page.$eval('.request-preview [data-estimate=success]', element => element.textContent), '$375', 'Form preview retains the conditional maximum, not a prediction');
    await page.$eval('#removed-count', element => { element.value = 0; element.dispatchEvent(new Event('input', { bubbles: true })); });
    assert.equal(await page.$eval('.estimate-total dd', element => element.textContent), '$150', 'No success fee if none are removed');
    await page.$eval('#removed-count', element => { element.value = 3; element.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.$eval('#estimate-quantity', element => { element.value = 51; element.dispatchEvent(new Event('change', { bubbles: true })); });
    assert.equal(await page.$eval('#estimate-quantity', element => element.value), '50');
    assert.equal(await page.$eval('.quantity-line [data-step="1"]', element => element.disabled), true);
    await page.$eval('#estimate-quantity', element => { element.value = 3; element.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.click('.submit-button'); assert.equal(await page.$eval('#full-name', element => element === document.activeElement), true);
    await page.type('#full-name', '<img src=x onerror=alert(1)>');
    await page.type('#business-name', 'Independent Shop'); await page.type('#email-address', 'local@example.invalid');
    await page.type('#business-link', 'Find us on Main Street, not a URL.');
    await page.click('.extra-details summary'); await page.type('#review-context', 'Keep this customer context in the preview.');
    await page.click('.submit-button'); await page.waitForSelector('#request-preview:not([hidden])');
    assert.match(await page.$eval('#request-preview', element => element.textContent), /Nothing has been sent/);
    assert.equal(await page.$eval('[data-preview=business_url]', element => element.textContent), 'Find us on Main Street, not a URL.');
    assert.equal(await page.$eval('[data-preview=full_name]', element => element.textContent), '<img src=x onerror=alert(1)>');
    assert.equal(await page.$eval('[data-preview=reason]', element => element.textContent), 'Keep this customer context in the preview.');
    assert.equal(await page.$$eval('[data-preview=full_name] img', elements => elements.length), 0);
    assert.equal(await page.$eval('#preview-title', element => element === document.activeElement), true);
    await page.$eval('#estimate-quantity', element => { element.value = 4; element.dispatchEvent(new Event('change', { bubbles: true })); });
    assert.equal(await page.$eval('[data-preview=review_count]', element => element.textContent), '4', 'An open request preview stays consistent with calculator quantity');
    assert.equal(await page.$eval('.request-preview [data-estimate=success]', element => element.textContent), '$500');
    await page.click('#edit-request'); assert.equal(await page.$eval('#full-name', element => element.value), '<img src=x onerror=alert(1)>');
    await page.click('#tab-conflict');
    assert.equal(await page.$eval('#panel-conflict', element => element.hidden), false);
    assert.equal(await page.$eval('#panel-fake', element => element.hidden), true);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.$eval('#tab-harmful', element => element.getAttribute('aria-selected')), 'true');
    assert.equal(await page.$eval('#tab-harmful', element => element === document.activeElement), true);
    await page.keyboard.press('End'); assert.equal(await page.$eval('#panel-unsure', element => element.hidden), false);
    await page.keyboard.press('Home'); assert.equal(await page.$eval('#panel-fake', element => element.hidden), false);
    await page.click('.faq-list summary'); assert.equal(await page.$eval('.faq-list details', element => element.open), true);
    assert.deepEqual(errors, []); assert.deepEqual(unexpectedRequests, []);
    await page.setJavaScriptEnabled(false); await page.goto(base, { waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('.submit-button', element => element.disabled), true, 'No accidental native submission without JS');
    assert.equal(await page.$eval('#panel-conflict', element => getComputedStyle(element).display !== 'none'), true, 'Concern content stays available without JS');
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ layouts, consoleErrors: errors, unexpectedRequests, pricing: 'USD 50 + 125 per successful removal', form: 'Local preview only; no submission, storage or tracking' }, null, 2));
    console.log('PASS: five layouts, balanced headings and 16px text/inputs, first-screen CTA, local branding/fonts, navigation/keyboard, partial-outcome USD pricing/count sync and limits, accessible concern tabs, native validation, unrestricted profile text, safe request preview/edit, FAQ and zero external requests or submissions.');
  } finally {
    if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
