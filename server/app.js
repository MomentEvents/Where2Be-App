var express = require('express');
var path = require('path');
var logger = require('morgan');
var _ = require('lodash')
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
const { Result } = require('neo4j-driver-core');



var app = express();
var PORT = process.env.PORT || 3000;

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
        location: record._fields[1].properties.Location,
        taglist: record._fields[2],
      });
      console.log(record._fields[0].low);
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

app.post('/feat', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.user;
  console.log("POST req on", inp_type); 
  session
  .run(`Match (m:Interest) 
  Optional match (m)-[c:user_interest]-(u:User)
  with m, u,
  case
      when (m)-[c]-(u) then 1
      else 0
  end as s1
  with m, s1
  Optional match (m)-[t:tags]-(:Event)-[:attending]-(u:User)
  with m, s1, count(t) as s2
  //Optional match (m)-[t:tags]-(:Event)-[:liked]-(u:User)
  Optional match (u:User)-[:liked]-(:Event)-[t:tags]-(m)
  with m, s1, s2, count(t) as s3
  Optional match (u:User)-[:attending]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
  with m, s1, s2, s3, count(t) as s4
  Optional match (u:User)-[:liked]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
  with m, s1, s2, s3, s4, count(t) as s5
  Optional match (u:User)-[c:user_interest]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
  with m, s1, s2, s3, s4, s5, count(t) as s6
  with m, [m.name, s1*10000+s2*1000+s3*500+s4/5+s5/6+s6/2] as s//, s1, s2, s3, s4, s5, s6
  order by s[1] desc
  with collect(m) as mm, apoc.map.fromPairs(collect(s)) as ss, [] as pk
  
  call{
      match(u:User)
      optional match (u)-[:attending]-(e1:Event)
      with u, collect(e1) as e1
      //, collect(id(e1)) as e1id [id(e1), e1, ittlist]
      optional match (u)-[:liked]-(e2:Event)
      where not e2 in e1
      //with u, e1, e2, collect(itt.name) as ittlist
      with e1+collect(e2) as ee
      unwind ee as er
      with er
      order by er.startingTime desc
      optional match (er)-[:tags]-(itt:Interest)
      with er, collect(itt.name) as ittlist
      return collect([id(er), er, ittlist]) as ee, collect(id(er)) as eeid
  }
  
  with ss, mm, ["Followed", ee] as loe, eeid + pk as pk
  
  call{
      with ss, pk
      match(e:Event)-[:tags]-(tt:Interest)
      where e.startingTime contains '2022' AND not id(e) in pk
      with e, apoc.map.get(ss, tt.name, 0) as intscore, tt
      with e, reduce (s=0, x in collect(intscore)| s + x) as try, collect(tt.name) as tt
      order by try desc
      with e.Name as nme, collect(e)[0] as e, collect(tt)[0] as tt
      return e, tt
      limit 20
  }
// return e.Name, tt
    with mm, loe, e, tt, pk
    order by e.startingTime desc
    with mm, loe, ["Featured", collect([id(e), e, tt])] as fte, collect(id(e)) + pk as pk
    
  unwind mm as m
  optional match (m)-[:tags]-(e:Event)
  where e.startingTime contains '2022' AND not id(e) in pk
  optional match (e)-[:tags]-(tt:Interest)
  with fte, loe, m, e, collect(tt.name) as ittlist
  with fte, loe, m, e, ittlist
  order by e.startingTime desc
  with fte, loe, m, collect([id(e), e, ittlist]) as scrs
  with fte, loe, [m.name, scrs] as bb
  where not isEmpty(scrs[1])
  
  with fte, loe, collect(bb) as bb
  with collect(fte) + collect(loe) + bb as bb

  unwind bb as bbb
  with bbb[0] as name, bbb[1] as events
  return name, events
  `
  // {name: inp_type}
  )
  .then(function(result){

    
    var FinalArr = [];
    result.records.forEach(function(record){
      var EventArr = [];
      record._fields[1].forEach(function(event){
        //console.log(event)
        //console.log(record);
        EventArr.push({
          //test: event[1].properties.Name
          id: event[0].low,
          title: event[1].properties.Name,
          userID: event[1].properties.UserID,
          //type: record._fields[1].properties.type,
          startingTime: event[1].properties.startingTime,
          image: event[1].properties.Image,
          description: event[1].properties.Description,
          location: event[1].properties.Location,
          taglist: event[2],
        });
        //console.log(record._fields[0].low);
      });
      FinalArr.push({
        header: record._fields[0],
        data: EventArr
      })
    });
    //console.log(JSON.stringify(FinalArr));
    //res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(FinalArr));
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
  .run('match (n:Event)-[:tags]->(inte:Interest)  with n, collect(inte.name) as int_list Where n.startingTime contains "2022" return ID(n), (n), int_list order by n.startingTime desc limit 100')
  .then(function(result){
    
    var EventArr = [];
    result.records.forEach(function(record){
      console.log(record);
      EventArr.push({
        id: record._fields[0].low,
        title: record._fields[1].properties.Name,
        //type: record._fields[1].properties.type,
        startingTime: record._fields[1].properties.startingTime,
        visibility: record._fields[1].properties.visibility,
        location: record._fields[1].properties.Location,
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

app.post('/organization_events', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.id;
  console.log("Org Events POST req on", inp_type); 
  session
  .run(`match (org:Organization)-[:Created]->(n:Event)
        where org.ID contains $id
        return ID(n),n
        order by n.startingTime
        limit 50`,
  {id: inp_type})
  .then(function(result){

    var EventArr = [];
    result.records.forEach(function(record){
      console.log(record);
      EventArr.push({
        id: record._fields[0].low,
        title: record._fields[1].properties.Name,
        //type: record._fields[1].properties.type,
        startingTime: record._fields[1].properties.startingTime,
        visibility: record._fields[1].properties.visibility,
        location: record._fields[1].properties.Location,
        image: record._fields[1].properties.Image,
        description: record._fields[1].properties.Description,
        // description: record._fields[1].properties.description,
      });
    });
    console.log(EventArr);
    // res.setHeader('Content-Type', 'text/html');
    res.send(JSON.stringify(EventArr));
    res.end();
  })
  .catch(function(err){
    console.log(err);
  });
})

app.post('/delete_user_interest', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.id;
  console.log("POST req on", inp_type); 
  session
  .run('match (u:User)-[t:user_interest]-(i) where u.ID = $id delete t',
  {id: inp_type})
  .then(function(result){
    
    res.setHeader('Content-Type', 'text/html');
    res.end();
  })
  .catch(function(err){
    console.log(err);
  });
})

app.post('/export_user_interest', jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type=req.body.id;
  var outTags=req.body.interest_list;
  console.log(outTags)
  console.log("POST req on", inp_type); 
  session
  .run("match (u:User), (i:Interest) where u.ID = $id and i.name in $interest_list create (u)-[r:user_interest]->(i)",
  {id: inp_type, interest_list: outTags})
  .then(function(result){
    
    res.setHeader('Content-Type', 'text/html');
    res.end();
  })
  .catch(function(err){
    console.log(err);
  });
})

app.post('/create_user', jsonParser, (req, res) => {
  var name0=req.body.name;
  var userId=req.body.username;
  var pass=req.body.password;
  console.log("Create user", userId); 
  session.run('MATCH (u:User {ID: $userId}) RETURN u',{
    userId : userId
  })
  .then(function(result){
    if (!_.isEmpty(result.records)) {
      throw {
        name0 : 'username already in use',
        status: 400
      }
    }
    else{
      session.run('Create (u:User{ID: $userId, name:$name0, password:$pass}) Return u',{
        userId:userId,
        name0:name0,
        pass:pass
      })
      .then(function(result){
        var user = {
            name : result.records[0].get('u').properties.name,
            phone: result.records[0].get('u').properties.phone,
            username : result.records[0].get('u').properties.ID
        };
        res.send(JSON.stringify(user));
        res.end();
      })
    }
  })
  .catch(function(err){
    console.log(err);
  });
})

app.post('/user_login', jsonParser, (req, res) =>{
  var userId=req.body.username;
  var pass=req.body.password;
  console.log("User login", userId); 
  session.run('MATCH (u:User {ID: $userId, password:$pass}) RETURN u',{
    userId : userId,
    pass : pass
  })
  .then(function(result){
    //console.log(result.records[0].get('u').properties.name)
    if (_.isEmpty(result.records)) {
      throw {
        name0 : 'wrong username or password',
        status: 400
      }
    }
    else{
      //console.log(result.records)
      var user = {
        name : result.records[0].get('u').properties.name,
        phone: result.records[0].get('u').properties.phone,
        username : result.records[0].get('u').properties.ID
      };
      res.send(JSON.stringify(user));
      res.end();
    }
  })
  .catch(function(err){
    console.log(err);
  });
})

app.listen(PORT);
console.log("Server listening on PORT", PORT); 

module.exports = app;