var express = require('express');
var router = express.Router();
const db = require('../database');

router.get('/get',async (req,res)=>{
    try{
        db.table('Rotbeer').withFields([
            'uhr_name',
            'uhr_description',
            'uhr_price',
            'uhr_location',
            'uhr_link',
            'uhr_note'
        ])
        .getAll()
        .then(list=>{
            return res.json({"uhr_info":list});
        })
    }catch(err){
        return res.json("error getting list of uhren from DB :",err);
    };
})


router.post('/save', async (req,res)=>{
    console.log(req.body);
    const {name,description,price,location,link,note} = req.body;
    const sql = "INSERT IGNORE INTO UhrTracker.Rotbeer (uhr_name,uhr_description,uhr_price,uhr_location,uhr_link,uhr_note) VALUES('"+name+"','"+description+"',"+price+",'"+location+"','"+link+"','"+note+"') ";
    console.log(sql);
    db.query(sql).then(result=>{res.json(result)}).catch(err=>{res.json(err)});
})

router.put('/update', async (req,res)=>{
    const {uhr_link,uhr_note} = req.body;
    console.log(uhr_link,uhr_note);
    db.table('Rotbeer')
      .filter({uhr_link:uhr_link})
      .update({
        uhr_note:uhr_note
      })
      .then(res=>{
        return res.json({"res":res});
      }).catch(error=>{
        return res.json({"error":error});
      })
})

module.exports = router;


