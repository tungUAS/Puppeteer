const cron = require("node-cron");
const db = require("./database");
let puppeteer = require('puppeteer');
let browser = null;
let page = null;

// cronjob running every 3 hours
cron.schedule("0 0 */3 * * *",async function(){
    console.log("Puppeteer is running...");
    var regex = /[+-]?\d+(\.\d+)?/g;

    browser = await puppeteer.launch({
        headless:true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        defaultViewport: null});

    page = await browser.newPage();

    await page.goto('https://www.chrono24.de/',{waitUntil:'networkidle2'});
    // accept cookies first
    // await page.click('body > div.cc-window.cc-banner.cc-type-info.cc-theme-edgeless.cc-bottom > div > button');

    //await page.click('#modal-content > div > button');
    await page.type('#query','Rolex 126711CHNR');

    const uhr_finden = await page.$('#header-search > div > div.input-group > button');

    await Promise.all([
        page.waitForNavigation(),
        await uhr_finden.evaluate(uhr_finden => uhr_finden.click())
    ]);
    const uhren = [];
    const uhren_list = await page.$$('#wt-watches > div');
    let i = 0;
    
    for(const uhr of uhren_list){
        // n-th div in the web returns 1,3,5,7,...
        i=i+2;
        try{
            const uhr_list_link_div  = await page.$('#wt-watches > div:nth-child('+i+') > a',uhr);

            const uhr_name = await page.evaluate(el => el.querySelector('a > div.p-x-2.p-x-sm-0 > div.text-bold.text-ellipsis').textContent,uhr);
            const uhr_des = await page.evaluate(el => el.querySelector('a > div.p-x-2.p-x-sm-0 > div.text-ellipsis.m-b-2').textContent,uhr);
            const uhr_price = await page.evaluate(el => el.querySelector('a > div.p-x-2.p-x-sm-0 > div.d-flex.justify-content-between.align-items-end.m-b-2 > div:nth-child(1) > div.text-bold').textContent,uhr);
            const uhr_loc = await page.evaluate(el => el.querySelector('a > div.p-x-2.p-x-sm-0 > div.d-flex.justify-content-between.align-items-end.m-b-2 > div.align-self-end > button > span').textContent,uhr);


            const uhr_link = await page.evaluate(a => a.getAttribute('href'),uhr_list_link_div);
            const floats_price = uhr_price.match(regex).map(function(v) { return parseFloat(v); });
            
            const uhr_details = {"name":uhr_name,"description":uhr_des,"price":floats_price[0],"location":uhr_loc,"link":"https://www.chrono24.de/rolex"+uhr_link};
            console.log(uhr_details);
            uhren.push(uhr_details)
        } catch{
            err => res.json({
                "error":err
            })
        }
    }
    
    uhren.forEach(async uhr=>{
        const {name,description,price,location,link} = uhr;
        const sql = "INSERT IGNORE INTO UhrTracker.Rotbeer (uhr_name,uhr_description,uhr_price,uhr_location,uhr_link) VALUES('"+name+"','"+description+"',"+price+",'"+location+"','"+link+"') ";
        await db.query(sql).then(result=>{console.log(result)}).catch(err=>{console.log(err)});
    });
});

module.exports = cron;