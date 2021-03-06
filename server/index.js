const express = require('express');
const cors = require('cors');
const compression = require('compression');
const app = express();
const { db , Shoes, Looks, Shares } = require('../database');

app.use(cors({
  'origin': '*',
}));
app.use(compression());

let randomImg = () => {
  var arr = [];
  for (var i = 0; i < 18; i++) {
    arr.push(Math.floor(Math.random() * (101)))
  }
  return arr;
}

db.authenticate()
  .then(() => {
    console.log('Connection successful!');
  })
  .catch(err => {
    console.error('Connection failed: ', err);
  })

app.get('*.gz', function (req, res, next) {
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('/shoes', (req,res) => {
  let arr = randomImg();
  Shoes.sync()
    .then(() => {
      return Shoes.findAll({where : {id : arr}});
    })
    .then(shoes => {
      console.log('shoes', shoes.length)
      res.json(shoes);
    })
    .catch(err => {
      console.log(err);
    })
})

app.get('/shoes/:shoeId', (req,res) => {
  let id = Number(req.params.shoeId);
  Shoes.sync()
  .then(() => {
    return Shoes.findOne({where: {id: id}});
  })
  .then(shoe => {
    res.json(shoe);
  })
  .catch(err => {
    console.log('ERROR: ', err);
  })
})

app.get('/looks/:id', (req,res) => {
  let id = Number(req.params.id);
  Looks.sync()
  .then(() => {
    return Looks.findOne({where: {id: id}});
  })
  .then(look => {
    res.json(look);
  })
  .catch(err => {
    console.log('error', err);
  })
})

app.get('/shares/:id', (req,res) => {
  let id = Number(req.params.id);
  Shares.sync()
  .then(() => {
    return Shares.findOne({where: {id: id}});
  })
  .then(share => {
    res.json(share);
  })
  .catch( err => {
    console.log('err', err)
  })
})

app.use(express.static(__dirname + '/../public'));

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

module.exports = app;
