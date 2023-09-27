const { chromium } = require('playwright')
const { expect } = require('@playwright/test');

(async () => {
  const capabilities = {
    'browserName': 'MicrosoftEdge', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': '116',
    'LT:Options': {
      // 'platform': 'Macos Catalina',
      "platform": "Windows 10",
      'build': 'Playwright SmartUI Build',
      'name': 'Playwright SmartUI Test',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'smartUIProjectName': 'wesfarmers-plus-icon-issue',
      'smartUIBaseline': false
    }
  }

  console.log(capabilities)

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  })
  console.log("Browser Launched")
  const page = await browser.newPage()
  console.log("Navigate URL")
  try {
    await page.goto('https://onepass.com.au/');
    await waitForLocatorToBeVisibleWithIteration(
      page.locator("//div[@class='faq4_accordion']"),
    );
    console.log("Page loaded")

    const closePolicy = page.locator(".banner10_content-wrapper .icon-embed-small");
    if(closePolicy){
      closePolicy.click()
    }
    console.log("Policy Icon closed")


    const plussign = page.locator("//div[@class='faq4_accordion']");
    for (let i = 0; i < (await plussign.count()); i++) {
      await plussign.nth(i).click();
      delay(1000);
    }
    console.log("Plus sign expanded")
    await scrolltoTop(page)
    await delay(1000);
    console.log("Scroll to top done, Now capturing screenshot")
    await page.evaluate((_) => { }, `lambdatest_action: ${JSON.stringify({
      action: 'smartui.takeScreenshot',
      arguments: { fullPage: true, screenshotName: 'plus-sign' }
    })}`)
    console.log("Screenshot captured successfully")

    await teardown(page, browser)
  } catch (e) {
    await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
    await teardown(page, browser)
    throw e
  }
})()

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}


const delay = (timeInMs) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeInMs)
  })
};

async function waitForLocatorToBeVisibleWithIteration(locator, maxAttempts = 30, interval = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const isVisible = await locator.first().isVisible();
      if (isVisible) {
        return locator;
      }
    } catch (error) {
      console.log(`waitForLocatorToBeVisibleWithIteration: error=${error}`);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return null;
}

async function scrolltoTop(page) {
  await page.evaluate(
    async () => {
      await window.scrollTo(0, 0);
    },
    { timeout: 150000 },
  );
}
