const { test } = require('@playwright/test');

test('Take screenshots', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'main_menu.png', fullPage: true });

    await page.click('#btn-new-game');
    await page.waitForTimeout(2000); // wait for fade in
    await page.screenshot({ path: 'scene1.png', fullPage: true });
});
