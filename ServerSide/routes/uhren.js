var express = require('express');
var router = express.Router();
const db = require('../database');

let puppeteer = require('puppeteer');
const { json } = require('express');
let browser = null;
let page = null;


router.get('/get',async (req,res)=>{
    try{
        db.table('Rotbeer').withFields([
            'uhr_name',
            'uhr_description',
            'uhr_price',
            'uhr_location',
            'uhr_link'
        ])
        .getAll()
        .then(list=>{
            console.log(list);
            return res.json({"uhr_info":list});
        })
    }catch(err){
        return res.json("error getting list of uhren from DB :",err);
    };
})


router.post('/save', async (req,res)=>{
    console.log(req.body);
    const {name,description,price,location,link} = req.body;
    const sql = "INSERT IGNORE INTO UhrTracker.Rotbeer (uhr_name,uhr_description,uhr_price,uhr_location,uhr_link) VALUES('"+name+"','"+description+"',"+price+",'"+location+"','"+link+"') ";
    console.log(sql);
    db.query(sql).then(result=>{res.json(result)}).catch(err=>{res.json(err)});
})

module.exports = router;


