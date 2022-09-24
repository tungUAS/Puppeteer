const CronJob = require("node-cron");
const schedule = require("node-schedule");
const db = require("./database");
let puppeteer = require('puppeteer');
let browser = null;
let page = null;

exports.initScheduledJobs = () => {
    const scheduledJobFunction = CronJob.schedule("* * */3 * * *", async ()=>{
    try{
        console.log("Puppeteer is running...");
        var regex = /[+-]?\d+(\.\d+)?/g;

        browser = await puppeteer.launch({
            args: ['--disable-dev-shm-usage'],
            headless:true,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            defaultViewport: null});

        page = await browser.newPage();

        await page.goto('https://www.chrono24.de/search/index.htm?query=Rolex+126711CHNR&dosearch=true&searchexplain=1&watchTypes=&accessoryTypes=&goal_suggest=1',{waitUntil:'networkidle0'});
        const uhren = [];
        const uhren_list = await page.$$('#wt-watches > div > a');
        let count = 0; 
        
        console.log(uhren_list.length);
            for(const uhr of uhren_list){
                try{
                count=count+1;

                        const uhr_name = await page.evaluate(el => el.querySelector('div.p-x-2.p-x-sm-0 > div.text-bold.text-ellipsis').textContent,uhr);
                        const uhr_des = await page.evaluate(el => el.querySelector('div.p-x-2.p-x-sm-0 > div.text-ellipsis.m-b-2').textContent,uhr);
                        const uhr_price = await page.evaluate(el => el.querySelector('div.p-x-2.p-x-sm-0 > div.d-flex.justify-content-between.align-items-end.m-b-2 > div:nth-child(1) > div.text-bold').textContent,uhr);
                        const uhr_loc = await page.evaluate(el => el.querySelector('div.p-x-2.p-x-sm-0 > div.d-flex.justify-content-between.align-items-end.m-b-2 > div.align-self-end > button > span').textContent,uhr);

                        const uhr_link = await page.evaluate(a => a.getAttribute('href'),uhr);
                        const floats_price = uhr_price.match(regex).map(function(v) { return parseFloat(v); });
                        
                        const uhr_details = {"name":uhr_name,"description":uhr_des,"price":floats_price[0],"location":uhr_loc,"link":"https://www.chrono24.de/rolex"+uhr_link};
                        if(uhr_details !== null && uhr_details !== undefined){
                            uhren.push(uhr_details);
                        }
                    }catch{
                        err=>console.log(err);
                    }
                } 
            await browser.close();
            //console.log(uhren);
            console.log("DONE"); 
            
            uhren.forEach( async uhr =>{
                const {name,description,price,location,link} = uhr;
                // set note to empty at first
                const note = '';
                const sql = "INSERT IGNORE INTO UhrTracker.Rotbeer (uhr_name,uhr_description,uhr_price,uhr_location,uhr_link,uhr_note) VALUES('"+name+"','"+description+"',"+price+",'"+location+"','"+link+"','"+note+"') ";            
                await db.query(sql).then().catch(err=>{console.log(err)});
            }); 
        }catch(err){
            console.log(err);
        }   
    
    }
)
    scheduledJobFunction.start();
}



