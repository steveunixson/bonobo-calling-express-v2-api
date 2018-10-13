const puppeteer = require('puppeteer');

const baseURL = 'https://2gis.ru/rostov/';
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
  const timeout = 3 * 30000;
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setDefaultNavigationTimeout(timeout);
  await page.goto(baseURL);
  await page.$eval(formSelector, (el, value) => el.value = value, search);
  await page.click(submitButton);
  await console.log(`clicked on ${submitButton}`);
  await page.waitFor(5000);
  const items = [];

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  // document.getElementsByClassName('miniCard')[2]
  // document.getElementsByClassName('miniCard')[3].attributes.id.nodeValue
  await page.waitForSelector('div.pagination__arrow._right');
  if (await page.$('div.pagination__arrow._right') === null || undefined) {
    console.log('EXCEPTION CAUGHT: No visible element div.pagination__arrow._right');
  }
  try {
    while (await page.$('div.pagination__arrow._right') !== null) {
      await page.waitForSelector('.miniCard');
      for (let step = 0; step < 12; step++) {
        const action = await page.evaluate(() => {
          const anchors = document.getElementsByClassName('miniCard');
          return [].map.call(anchors, a => a.id);
        });
        await page.click(`#${action[step]} > div`);
        await console.log(`clicked on: #${action[step]} > div`);
        // await page.waitForSelector('div.contact__phonesFadeShow');
        try {
          await page.waitForSelector('div.contact__phonesFadeShow');
        } catch (e) {
          await page.waitForSelector('span.mediaContacts__showPhones');
          await console.log('Exception caught: Using fallback selector: span.mediaContacts__showPhones');
          await page.click('span.mediaContacts__showPhones');
          await console.log('clicked on: span.mediaContacts__showPhones');
          const numberAlt = await page.evaluate(() => document.querySelector('a.mediaContacts__phonesNumber').innerText);
          items.push(numberAlt);
          await page.click('a.link.frame__controlsButton._back._undashed');
        }
        await page.waitFor(1000);
        await page.click('div.contact__phonesFadeShow');
        const number = await page.evaluate(() => document.querySelector('div.contact__phonesVisible').innerText);
        items.push(number.replace(/(\r\n\t|\n|\r\t)/gm, ' ', ' ').split('Пожалуйста, скажите, что узнали номер в 2ГИС').join(''));
        delay(5000);
      }
      await page.waitForSelector('div.pagination__arrow._right');
      await page.focus('div.pagination__arrow._right');
      await page.click('div.pagination__arrow._right');
      await console.log('clicked on: div.pagination__arrow._right');
    }
  } catch (exception) {
    console.log(`EXCEPTION CAUGHT: ${exception}`);
  }
  // await browser.close();
  return { selectorID: items };
};
scrape().then((value) => {
  console.log(value);
}).catch((exception) => {
  console.log(`EXCEPTION CAUGHT: ${exception}`);
});
