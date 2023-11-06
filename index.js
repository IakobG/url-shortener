const express = require('express')
const mongoose = require('mongoose')
const url = require('./urls')
require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
const port = process.env.PORT || 5000
const dbUrl = process.env.DBURL || 'mongodb://127.0.0.1:27017/shortUrls'

mongoose.connect(dbUrl)

const rnd = () => {
    return Math.floor(Math.random() * 62)
}
function rId(size = 4){
    const a = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let rndstr = ""
    for(let i = 0; i < size; i++){
        rndstr += a[rnd()]
    }
    return rndstr
}
const uid = (x = null) => {
    if(x === null){
        return rId()
    }
    let y = rId()===x?uid(x):x
    return y   
}

app.get('/', async(req, res) => {
    const urls = await url.find();
    res.render('home', {urls: urls})
  })

app.post('/short', async(req, res) => {
    const id = uid()
    const newShort = await url.create({url: req.body.url, short: url.countDocuments({short: id})==0?id:uid(id)})
    res.render('homeShort', {newShort: newShort})
})

app.get('/:short', async(req, res) => {
    const long = await url.findOne({short: req.params.short})
    if(long == null){
        return res.sendStatus(404)
    }
    long.clicked++
    long.save()
    res.redirect(long.url)
})

app.listen(port)

