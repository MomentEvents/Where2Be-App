var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
const { Result } = require('neo4j-driver-core');

var app = express();
var PORT = 3001;

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var driver = neo4j.driver('neo4j+s://bff6d1fc.databases.neo4j.io', 
                          neo4j.auth.basic('neo4j', '57yuB7Ts5UL1Ajbggx9kVLoovrIiHwAI0NZ1Veu2_I0'));
var session = driver.session();
  
app.post('/log', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.user;
  console.log("POST req on", inp_type); 
  session
  .run('match (n:Event)-[:tags]->(inte:Interest)  with n, collect(inte.name) as int_list Where n.startingTime contains "2022" return ID(n), (n), int_list order by n.startingTime desc limit 25',
  {name: inp_type})
  .then(function(result){
    
    var EventArr = [];
    result.records.forEach(function(record){
      // console.log(record);
      EventArr.push({
        id: record._fields[0].low,
        title: record._fields[1].properties.Name,
        //type: record._fields[1].properties.type,
        startingTime: record._fields[1].properties.startingTime,
        image: record._fields[1].properties.Image,
        description: record._fields[1].properties.Description,
        taglist: record._fields[2],
      });
      // console.log(record._fields[0].low);
    });
    // console.log(JSON.stringify(EventArr));
    // res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(EventArr));
    res.end();
  })
  .catch(function(err){
    console.log(err);
  });
})

app.get('/data', function(req,res){
  session
  .run('match (n:Event) where n.type contains $name return ID(n),(n) limit 25',
  {name: 'Instagram'})
  .then(function(result){
    
    var EventArr = [];
    result.records.forEach(function(record){
      console.log(record);
      EventArr.push({
        id: record._fields[0].low,
        key: record._fields[1].properties.ID,
        title: record._fields[1].properties.title,
        type: record._fields[1].properties.type,
        startingTime: record._fields[1].properties.startingTime,
        image: record._fields[1].properties.image,
        description: record._fields[1].properties.description,
      });
      console.log(record._fields[0].low);
    });
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(EventArr));
    res.end();
    // res.render('index', {
    //   movies: MovieArr
    // });
  })
  .catch(function(err){
    console.log(err);
  });
  // console.log(result);
  // res.send(result);
});

app.get('/search', function(req,res){
  session
  .run('match (n:Event)-[:tags]->(inte:Interest)  with n, collect(inte.name) as int_list Where n.startingTime contains "2022" return ID(n), (n), int_list order by n.startingTime desc limit 25')
  .then(function(result){
    
    var EventArr = [];
    result.records.forEach(function(record){
      console.log(record);
      EventArr.push({
        id: record._fields[0].low,
        title: record._fields[1].properties.Name,
        //type: record._fields[1].properties.type,
        startingTime: record._fields[1].properties.startingTime,
        image: record._fields[1].properties.Image,
        description: record._fields[1].properties.Description,
        taglist: record._fields[2],
        
        // description: record._fields[1].properties.description,
      });
      console.log(record._fields[0].low);
    });
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(EventArr));
    res.end();
    // res.render('index', {
    //   movies: MovieArr
    // });
  })
  .catch(function(err){
    console.log(err);
  });
  // console.log(result);
  // res.send(result);
});

app.get('/interests', function(req,res){
  session
  .run('match (n:Interest) return distinct(n.category) as group, collect(n.name) as ls')
  .then(function(result){
    
    var InterestArr = [];
    result.records.forEach(function(record){
      console.log(record);
      InterestArr.push({
        title: record._fields[0],
        data: record._fields[1]
      });
      console.log(record._fields[0].low);
      console.log(record._fields[2]);
    });
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(InterestArr));
    res.end();
    // res.render('index', {
    //   movies: MovieArr
    // });
  })
  .catch(function(err){
    console.log(err);
  });
  // console.log(result);
  // res.send(result);
});

app.post('/import_interest_list', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.id;
  console.log("POST req on", inp_type); 
  session
  .run('match (n:User {ID: $id})-[:user_interest]->(i: Interest) return  collect(i.name) as Interest_list',
  {id: inp_type})
  .then(function(result){
    var user_int_array = result.records[0]._fields[0];
    // result.records.forEach(function(record){
      
    //   user_int_array.push({
    //     Interest_list: record._fields[0]
    //   });
    // });
    console.log(user_int_array);
    res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(user_int_array));
    res.end();
  })
  .catch(function(err){
    console.log(err);
  });
})

app.listen(PORT);
console.log("Server listening on PORT", PORT); 

module.exports = app;