const puppeteer = require('puppeteer');

const baseURL = 'https://2gis.ru/rostov';
const search = 'Парикмахерская';
const formSelector = 'div#module-1-3-1 > div > input';
const submitButton = '#module-1-3 > div.searchBar__forms > div > form > button.searchBar__submit._directory';
const width = 1920;
const height = 1050;

const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=${width},${height}`,
    ],
  });
  const timeout = 4 * 30000;
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setDefaultNavigationTimeout(timeout);
  await page.goto(baseURL);
  await page.$eval(formSelector, (el, value) => el.value = value, search);
  await page.click(submitButton);
  await console.log(`clicked on ${submitButton}`);
  await page.waitFor(5000);
  const items = [];

  try {
    await page.waitForSelector('div.pagination__arrow._right');
  } catch (exception) {
    console.log(`EXCEPTION CAUGHT: ${exception}`);
  }
  try {
    while (await page.$('div.pagination__arrow._right') !== null) {
      await page.waitForSelector('.miniCard');
      for (let step = 0; step < 12; step++) {
        const action = await page.evaluate(() => {
          const anchors = document.getElementsByClassName('miniCard__headerTitleLink');
          return [].map.call(anchors, a => a.href);
        });
        const pageNew = await browser.newPage();
        await pageNew.setViewport({ width, height });
        await pageNew.setDefaultNavigationTimeout(timeout);
        await pageNew.goto(action[step]);
        try {
          await pageNew.waitFor(1000);
          await pageNew.waitForSelector('div.card__scrollerIn');
          await pageNew.waitForSelector('h1.cardHeader__headerNameText');
          await pageNew.waitForSelector('address.card__address');
          await pageNew.evaluate(() => document.getElementsByClassName('contact__toggle _place_phones')[0].click());
          const number = await pageNew.evaluate(() => document.getElementsByClassName('contact__phones _shown')[0].innerText);
          const phone = number.replace(/(\r\n\t|\n|\r\t)/gm, ' ', ' ').split('Пожалуйста, скажите, что узнали номер в 2ГИС').join('');
          const name = await pageNew.evaluate(() => document.querySelector('h1.cardHeader__headerNameText').innerText);
          const Address = await pageNew.evaluate(() => document.querySelector('address.card__address').innerText);
          items.push({
            phoneNumber: phone,
            companyName: name,
            address: Address,
          });
          await pageNew.close();
        } catch (e) {
          await console.log(`Exception caught: ${e}`);
          await pageNew.close();
        }
      }
      await page.waitForSelector('div.pagination__arrow._right');
      await page.focus('div.pagination__arrow._right');
      await page.click('div.pagination__arrow._right');
      await console.log('clicked on next page');
    }
  } catch (exception) {
    console.log(`EXCEPTION CAUGHT: ${exception}`);
  }
  await browser.close();
  return items;
};
scrape().then((value) => {
  console.log(value);
}).catch((exception) => {
  console.log(`EXCEPTION CAUGHT: ${exception}`);
});
