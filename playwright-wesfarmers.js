const { chromium } = require('playwright')
const { expect } = require("expect");

(async () => {
    const capabilities = {
        'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
        'browserVersion': 'latest',
        'LT:Options': {
            'platform': 'MacOS Big Sur',
            'build': 'Playwright SmartUI Build',
            'name': 'Playwright SmartUI Test',
            'user': process.env.LT_USERNAME,
            'accessKey': process.env.LT_ACCESS_KEY,
            'network': true,
            'video': true,
            'console': true,
            'smartUIProjectName': process.env.SMARTUI_PROJECT || '<yourProjectName>',
            'smartUIBaseline': false
        }
    }

    const githubURL = process.env.GITHUB_URL
    if (githubURL) {
        capabilities['LT:Options']['github'] = {
            url: githubURL
        }
    }

    const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
    })

    console.log('Browser Launched')
    const page = await browser.newPage()

    console.log('Navigating URL')
    await page.goto('https://onepass.com.au/bundles/onepass-disneyplus-bundle');
    // Add the following command in order to take screenshot in SmartUI
    // Add a relevant screenshot name
    // Set `fullPage: true` to take full page screenshots
    await page.evaluate((_) => { },
        `lambdatest_action: ${JSON.stringify({ action: "smartui.takeScreenshot", arguments: { fullPage: true, screenshotName: "wesfarmers", ignoreXPath: ['/html/body/div/main/header/div/header/div/div/div'] } })}`);
    await browser.close();
})()
