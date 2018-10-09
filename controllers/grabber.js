const puppeteer = require('puppeteer');

const baseURL = 'https://2gis.ru/rostov/';
const search = 'Парикмахерская';
const formSelector = 'div#module-1-3-1 > div > input';
const submitButton = '#module-1-3 > div.searchBar__forms > div > form > button.searchBar__submit._directory';
const width = 1980;
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
  const selectorID = await page.evaluate(() => {
    const anchors = document.querySelectorAll('article');
    const ids = [].map.call(anchors, article => article.id);
    return ids;
  });
  return { selectorID, page };
};
scrape().then((value) => {
  const promises = value.selectorID.forEach(async (selector, currentIndex) => {
    await setTimeout(() => {
      value.page.click(`#${selector} > div`);
      value.page.waitFor(1000);
      value.page.evaluate(() => {
        const elements = document.querySelectorAll('a.cardActionsButton__btn._type_phone');
        return [].map.call(elements, phoneSelector => phoneSelector.href);
      }).then((phone) => {
        console.log(phone);
      });
      console.log(`clicked on: #${selector} > div : ${currentIndex}`);
    }, currentIndex * 2000);
    await promises;
  });// Получилось!
}).catch((exception) => {
  console.log(`EXCEPTION CAUGHT: ${exception}`);
});
