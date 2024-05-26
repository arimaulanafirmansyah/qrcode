const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const chromePath = require('chrome-paths');
puppeteer.use(pluginStealth);

const Validasi = (token, userid, zoneid, emailutama) =>
  new Promise((resolve, reject) => {
    fetch('https://api.mobapay.com/pay/order', {
  method: 'POST',
  headers: {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json;charset=UTF-8',
    'did': 'null',
    'origin': 'https://www.mobapay.com',
    'priority': 'u=1, i',
    'referer': 'https://www.mobapay.com/',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'x-token': token
  },
  body: JSON.stringify({
    'app_id': 100000,
    'user_id': 89867767,
    'server_id': 2181,
    'email': 'arim8062@gmail.com',
    'shop_id': 1001,
    'amount_pay': 1504000,
    'currency_code': 'IDR',
    'country_code': 'ID',
    'goods_id': 53,
    'num': 1,
    'pay_channel_sub_id': 10099,
    'price_pay': 1504000,
    'coupon_id': '',
    'lang': 'en',
    'network': '',
    'net': '',
    'terminal_type': 'WEB'
  })
    })
    .then((res) => res.json())
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });

  const Validasi2 = (token, order_id) =>
  new Promise((resolve, reject) => {
    fetch('https://api.mobapay.com/pay/order/payment', {
  method: 'POST',
  headers: {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json;charset=UTF-8',
    'did': 'null',
    'origin': 'https://www.mobapay.com',
    'priority': 'u=1, i',
    'referer': 'https://www.mobapay.com/',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'x-token': token
  },
  body: JSON.stringify({
    'order_id': order_id,
    'return_url': `https://www.mobapay.com/order?order=${order_id}`,
    'network': '',
    'net': '',
    'terminal_type': 'WEB'
  })
    })
    .then((res) => res.json())
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });


(async () => {
    const fileData2 = fs.readFileSync('akun.txt', 'utf8');
    const listnya = fileData2.split('\n');
    const pathBrowser = chromePath.chrome;
    const $options = {
        waitUntil: 'networkidle2'
    };
    const args = [
        '--disable-background-networking',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-infobars',
        '--mute-audio',
    ];

    async function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    for (let index = 0; index < listnya.length; index++) {
        const email = listnya[index].split(':')[0];
        const password = listnya[index].split(':')[1];

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: pathBrowser,
            args
        });

        try {
            const fileData3 = fs.readFileSync('config.json', 'utf8');
            const jsonData = JSON.parse(fileData3);
            const userid = jsonData.userid
            const zoneid = jsonData.zoneid
            const emailutama = jsonData.email
            const urlmoba = jsonData.linkreff;

            console.log(`[!] Proses Login ${email}`);

            const page = await browser.newPage();
            await page.goto('https://accounts.google.com', $options);
            await delay(5000);

            await page.waitForSelector('#identifierId', { timeout: 20000 });
            await page.type('#identifierId', email);
            await delay(2000);
            await page.click('#identifierNext > div > button > span');
            await delay(5000);

            await page.waitForSelector('input[type="password"]', { timeout: 20000 });
            await page.type('input[type="password"]', password);
            await delay(2000);
            await page.keyboard.press('Enter');
            await delay(5000);

            try {
                await page.waitForSelector('input[name="confirm"]', { timeout: 5000 });
                const btnConfirm = await page.$('input[name="confirm"]');
                await btnConfirm.click();
                await delay(2000);
            } catch (err) {}

            try {
                const buttons = await page.$$('button[type="button"]');
                if (buttons.length > 1) {
                    await buttons[1].click();
                    await delay(2000);
                }
            } catch (err) {}

            if (page.url().includes('myaccount.google.com')) {
                console.log('    Login Success');
                await page.goto(urlmoba, $options);
                await delay(5000);

                try {
                    await page.waitForSelector('#root > div > div.dialog_app-dialog__BE0AV > div > div > div > div.style_close__3LmNt', { timeout: 5000 });
                    await page.click('#root > div > div.dialog_app-dialog__BE0AV > div > div > div > div.style_close__3LmNt');
                } catch (err) {}

                await delay(2000);

                await page.waitForSelector('#root > div > div.header_header-wrapper__322_Y > div > div.header_header-right__17dh3 > div.header_loginBtnBox__KruXx > div', { timeout: 5000 });
                const btnLogin = await page.$('#root > div > div.header_header-wrapper__322_Y > div > div.header_header-right__17dh3 > div.header_loginBtnBox__KruXx > div');
                await btnLogin.click();
                await delay(2000);

                await page.waitForSelector('#root > div > div.dialog_app-dialog__BE0AV > div > div > section > div.content.dialog_content__LM1m- > div > div.style_listBox__cW8VH > div:nth-child(1)', { timeout: 5000 });
                const btnGoogle = await page.$('#root > div > div.dialog_app-dialog__BE0AV > div > div > section > div.content.dialog_content__LM1m- > div > div.style_listBox__cW8VH > div:nth-child(1)');
                const newPagePromise = new Promise(resolve => browser.once('targetcreated', target => resolve(target.page())));
                await btnGoogle.click();
                const newPage = await newPagePromise;
                await delay(5000);

                try {
                    await newPage.waitForSelector(`div[data-authuser="0"]`, { timeout: 20000 });
                    const klikMail = await newPage.$(`div[data-authuser="0"]`);
                    await klikMail.click();
                    await delay(5000);
                } catch (err) {}
                try {
                    await newPage.waitForSelector('input[name="confirm"]', { timeout: 5000 });
                    const btnConfirm = await newPage.$('input[name="confirm"]');
                    await btnConfirm.click();
                    await delay(2000);
                } catch (err) {}

                try {
                    const buttons = await newPage.$$('button[type="button"]');
                    if (buttons.length > 1) {
                        await buttons[1].click();
                        await delay(2000);
                    }
                } catch (err) {}

                 let token;
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
          if (interceptedRequest.url().includes('https://api.mobapay.com/account/refresh')) {
            const headers = interceptedRequest.headers();
            token = headers['x-token'];
          }
          interceptedRequest.continue();
        });
        
        await page.goto(urlmoba, $options);
        await delay(5000);
        
        if (token) {
          console.log(`    Token : ${token}`)
          const html = await Validasi(token, userid, zoneid, emailutama);
          if(html.message == 'OK') {
            console.log('[!] Order Successfully!')
            console.log(`    Username : ${html.data.user_name}`)
            console.log(`    Order ID : ${html.data.order_id}`)
            console.log(`    Total : Rp. ${html.data.amount_pay}`)
            const payment = await Validasi2(token, html.data.order_id)
            if(payment.message == 'OK') {
              console.log(`    URL Payment : ${payment.data.payment_url}`)
              fs.appendFileSync('urlpayment.txt', `${html.data.order_id} | ${payment.data.payment_url}\n`)
            } else {
                console.log('    Paymnet Failed!')
            }
          } else {
            console.log('[!] Order Failed!')
          }
        } else {
          console.log('Token not found');
        }

        console.log('\n');
      } else {
        console.log('Failed to log in');
      }

            await page.close();
            await browser.close();
        } catch (error) {
            console.error('Error during processing:', error);
            await browser.close();
        }
    }

    await browser.close();
})();
