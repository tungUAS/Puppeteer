const { json } = require('express');
var express = require('express');
var router = express.Router();

let puppeteer = require('puppeteer');
let browser = null;
let page = null;

router.get('/',async(req,res)=> {

    browser = await puppeteer.launch({
        headless:true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        defaultViewport: null});

    page = await browser.newPage();


    page.on('#notice', async dialog => {
        console.log('here');
        await dialog.accept();
      });

    await page.goto('https://www.frankfurt-university.de/de/hochschule/fachbereich-2-informatik-und-ingenieurwissenschaften/kontakt/professorinnen-und-professoren-im-fachbereich-2/',{waitUntil:'networkidle2'});
    // accept cookies first
    await page.click('body > div.cc-window.cc-banner.cc-type-info.cc-theme-edgeless.cc-bottom > div > button');
    
    // get all prof cards
    const prof_info_list = await page.$$('.contacts-list__info');
    const profs = [];
    for(const prof of prof_info_list){
        try{
            const prof_name = await page.evaluate(el => el.querySelector("div > a > div.contacts-list__contact-name").textContent,prof);
            const prof_title = await page.evaluate(el => el.querySelector("div > a > div.contacts-list__contact-title").textContent,prof);
            const prof_email = await page.evaluate(el => el.querySelector("div > div:nth-child(5) > a").textContent,prof);
            const prof_details = {"prof_title":prof_title,"prof_name":prof_name,"prof_email":prof_email};
            profs.push(prof_details);
        }catch{
            err=>console.log(err);
        }
    }

    return res.status(200).json({
      profs_info:profs
    })

})

module.exports = router;
