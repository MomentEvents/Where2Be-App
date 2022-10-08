var express = require("express");
var path = require("path");
var logger = require("morgan");
var _ = require("lodash");
var bodyParser = require("body-parser");
var neo4j = require("neo4j-driver");
const { Result } = require("neo4j-driver-core");
var session = require("express-session"); // need to install
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.PORT || 8080;

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var driver = neo4j.driver(
  // process.env.HOST,
  // neo4j.auth.basic(process.env.USER, process.env.PASSWORD)
  "neo4j+s://32c386b6.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "lXx1rWQyLKFNkRk3YbZrs0fNf8s5ujqBmA3HC5edcFk")
);
var connection = driver.session();

app.use(
  session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/privacy_policy", function (req, res) {
  const fs = require("fs");
  try {
    const data = fs.readFileSync(
      "/home/ec2-user/EventApp/server/message.txt",
      "utf8"
    );
    console.log(data);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
  console.error("printing privacy policy");
});

app.post("/user_login", jsonParser, (req, res) => {
  var userId = req.body.username;
  var pass = req.body.password;
  console.log("User login", userId);
  connection
    .run("MATCH (u:User {ID: $userId}) RETURN u", {
      userId: userId,
    })
    .then(function (result) {
      //console.log(result.records[0].get('u').properties.name)
      if (_.isEmpty(result.records)) {
        res.end();
        console.log("User Not found here");
        res.write("Please login first.");
        res.end();
        // throw {
        //   status: 400
        // }
      } else {
        var hashpass = result.records[0].get("u").properties.password;
        bcrypt.compare(pass, hashpass).then((passwordCheck) => {
          //console.log(result.records)
          if (!passwordCheck) {
            res.end();
            console.log("Wrong Password");
            res.write("Please try a different password.");
            res.end();
          } else {
            var user = {
              name: result.records[0].get("u").properties.name,
              username: result.records[0].get("u").properties.ID,
              email: result.records[0].get("u").properties.email,
              password: result.records[0].get("u").properties.password,
            };
            //console.log(user);
            res.send(JSON.stringify(user));
            res.end();
          }
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/email_login", jsonParser, (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;
  
  console.log("User login", email);
  connection
    .run("MATCH (u:User {email: $email}) RETURN u", {
      email: email,
    })
    .then(function (result) {
      //console.log(result.records[0].get('u').properties.name)
      if (_.isEmpty(result.records)) {
        res.end();
        console.log("User Not found here");
        res.write("Please login first.");
        res.end();
        // throw {
        //   status: 400
        // }
      } else {
        var hashpass = result.records[0].get("u").properties.password;
        bcrypt.compare(pass, hashpass).then((passwordCheck) => {
          //console.log(result.records)
          if (!passwordCheck) {
            res.end();
            console.log("Wrong Password");
            res.write("Please try a different password.");
            res.end();
          } else {
            var user = {
              name: result.records[0].get("u").properties.name,
              username: result.records[0].get("u").properties.ID,
              email: result.records[0].get("u").properties.email,
              password: result.records[0].get("u").properties.password,
            };

            res.send(JSON.stringify(user));
            res.end();
          }
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/create_user", jsonParser, (req, res) => {
  var name0 = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  var school = req.body.school;
  console.log("Create user", username);
  connection
    .run("MATCH (u:User {ID: $username}) RETURN u", {
      username: username,
    })
    .then(function (result) {
      if (!_.isEmpty(result.records)) {
        res.end();
      } else {
        bcrypt.hash(pass, 10).then((hashPass) => {
          connection
            .run(
              "Create (u:User {ID: $username, email:$email, name:$name0, password:$pass, school: $school}) Return u",
              {
                username: username,
                name0: name0,
                email: email,
                pass: hashPass,
                school: school,
              }
            )
            .then(function (result) {
              var user = {
                name: name0,
                username: username,
                email: email,
                password: hashPass,
              };
              res.send(JSON.stringify(user));
              res.end();
            });
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/user_test", jsonParser, (req, res) => {
  var userId = req.body.uid;
  var pass = req.body.password;
  console.log("User test", userId);
  connection
    .run("MATCH (u:User {ID: $userId, password: $pass}) RETURN u", {
      userId: userId,
      pass: pass,
    })
    .then(function (result) {
      //console.log(result.records[0].get('u').properties.name)
      if (_.isEmpty(result.records)) {
        res.end();
        console.log("User Not found here");
        res.write("Please login first.");
        res.end();
        // throw {
        //   status: 400
        // }
      } else {
        var user = {
          name: result.records[0].get("u").properties.name,
          username: result.records[0].get("u").properties.ID,
          email: result.records[0].get("u").properties.email,
          password: result.records[0].get("u").properties.password,
        };
        res.send(JSON.stringify(user));
        res.end();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});


app.post("/log", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.user;
  console.log("POST req on", inp_type);
  connection
    .run(
      'match (n:Event)-[:tags]->(inte:Interest)  with n, collect(inte.name) as int_list Where n.startingTime contains "2022" return ID(n), (n), int_list order by n.startingTime desc limit 25',
      { name: inp_type }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
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
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/feat", jsonParser, (req, res) => {
  var inp_type = req.body.UserId;

  console.log("POST req on", inp_type);
  connection
    .run(
      `Match (m:Interest) 
      Optional match (m)-[c:user_interest]-(u:User {ID : $userid})
      with m, u,
      case
          when (m)-[c]-(u) then 1
          else 0
      end as s1
      with m, s1
      Optional match (m)-[t:tags]-(:Event)-[:attending]-(u:User{ID : $userid})
      with m, s1, count(t) as s2
      //Optional match (m)-[t:tags]-(:Event)-[:liked]-(u:User{ID : $userid})
      Optional match (u:User{ID : $userid})-[:liked]-(:Event)-[t:tags]-(m)
      with m, s1, s2, count(t) as s3
      Optional match (u:User{ID : $userid})-[:attending]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, count(t) as s4
      Optional match (u:User{ID : $userid})-[:liked]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, s4, count(t) as s5
      Optional match (u:User{ID : $userid})-[c:user_interest]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, s4, s5, count(t) as s6
      with m, [m.name, s1*10000+s2*1000+s3*500+s4/5+s5/6+s6/2] as s//, s1, s2, s3, s4, s5, s6
      order by s[1] desc
      with collect(m) as mm, apoc.map.fromPairs(collect(s)) as ss, [] as pk
      call{
          with ss, pk
          match(e:Event)-[:tags]-(tt:Interest)
          where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) < date() AND not id(e) in pk and e.startingTime contains '2022'
          with e, apoc.map.get(ss, tt.name, 0) as intscore, tt
          with e, reduce (s=0, x in collect(intscore)| s + x) as try, collect(tt.name) as tt
          order by try desc
          with e.Name as nme, collect(e)[0] as e, collect(tt)[0] as tt
          with e.CreatorID as nme, collect(e)[0] as e, collect(tt)[0] as tt
          return e, tt
          limit 30
      }
    
    // return e.Name, tt
        with mm, e, tt, pk, ss
        order by e.startingTime desc
        optional match (e)-[r1:attending]-(:User)
        with mm, e, tt, pk, ss, count(r1) as atts
        optional match (e)-[r1:liked]-(:User)
        with mm, e, tt, pk, ss, atts, count(r1) as liks
        optional match (e)-[r1:shoutout]-(:User)
        with mm, e, tt, pk, ss, atts, liks, count(r1) as shuts
        with mm, e, tt, pk, ss, atts, liks, shuts,
        case 
            when (e)-[:attending]-(:User{ID : $userid}) then 1
            else 0
          end as att,
          case 
            when (e)-[:liked]-(:User{ID : $userid}) then 1
            else 0
          end as lik,
          case 
            when (e)-[:shoutout]-(:User{ID : $userid}) then 1
            else 0
          end as shut
        with mm, ["Past Events", collect([id(e), e, tt, att, lik, shut, atts, liks, shuts])] as loe, collect(id(e)) + pk as pk, ss
      
      call{
          with ss, pk
          match(e:Event)-[:tags]-(tt:Interest)
          where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() AND not id(e) in pk
          with e, apoc.map.get(ss, tt.name, 0) as intscore, tt
          with e, reduce (s=0, x in collect(intscore)| s + x) as try, collect(tt.name) as tt
          order by try desc
          with e.CreatorID as nme, collect(e)[0] as e, collect(tt)[0] as tt
          return e, tt
          limit 30
      }
    
        with mm, loe, e, tt, pk
        order by e.startingTime asc
        optional match (e)-[r1:attending]-(:User)
        with mm, loe, e, tt, pk, count(r1) as atts
        optional match (e)-[r1:liked]-(:User)
        with mm, loe, e, tt, pk, atts, count(r1) as liks
        optional match (e)-[r1:shoutout]-(:User)
        with mm, loe, e, tt, pk, atts, liks, count(r1) as shuts
        with mm, loe, e, tt, pk, atts, liks, shuts,
        case 
            when (e)-[:attending]-(:User{ID : $userid}) then 1
            else 0
          end as att,
          case 
            when (e)-[:liked]-(:User{ID : $userid}) then 1
            else 0
          end as lik,
          case 
            when (e)-[:shoutout]-(:User{ID : $userid}) then 1
            else 0
          end as shut
        with mm, loe, ["For You", collect([id(e), e, tt, att, lik, shut, atts, liks, shuts])] as fte, collect(id(e)) + pk as pk
        with mm, pk, collect(fte) + collect(loe) as ret
        unwind ret as ret2
      with ret2
      where not isempty(ret2[1]) and ret2[1][1] <> 'null'
      return ret2[0] as name, ret2[1] as events`,
      { userid: inp_type }
    )
    .then(function (result) {
      var FinalArr = [];
      result.records.forEach(function (record) {
        var EventArr = [];
        record._fields[1].forEach(function (event) {
          //console.log(event)
          //console.log(record);
          EventArr.push({
            //test: event[1].properties.Name
            id: event[0].low,
            uniqueID: event[1].properties.ID,
            title: event[1].properties.Name,
            userID: event[1].properties.CreatorID,
            //type: record._fields[1].properties.type,
            visibility: event[1].properties.Visibility,
            startingTime: event[1].properties.startingTime,
            image: event[1].properties.Image,
            description: event[1].properties.Description,
            location: event[1].properties.Location,
            taglist: event[2],
            joined: event[3].low,
            liked: event[4].low,
            shouted: event[5].low,
            num_joins: event[6].low,
            num_likes: event[7].low,
            num_shouts: event[8].low,
            link: null,
          });
          //console.log(record._fields[0].low);
        });
        FinalArr.push({
          header: record._fields[0],
          data: EventArr,
        });
      });
      //console.log(JSON.stringify(FinalArr));
      //res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(FinalArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/categories_feat", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.user;

  // if (req.session) {
  //   var inp_type = sess.username; // if session
  // } else {
  //   var inp_type = "user_1";
  // }

  var inp_type = req.body.UserId;

  console.log("POST req on", inp_type);
  connection
    .run(
      `Match (m:Interest) 
      Optional match (m)-[c:user_interest]-(u:User {ID : $userid})
      with m, u,
      case
          when (m)-[c]-(u) then 1
          else 0
      end as s1
      with m, s1
      Optional match (m)-[t:tags]-(:Event)-[:attending]-(u:User{ID : $userid})
      with m, s1, count(t) as s2
      //Optional match (m)-[t:tags]-(:Event)-[:liked]-(u:User{ID : $userid})
      Optional match (u:User{ID : $userid})-[:liked]-(:Event)-[t:tags]-(m)
      with m, s1, s2, count(t) as s3
      Optional match (u:User{ID : $userid})-[:attending]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, count(t) as s4
      Optional match (u:User{ID : $userid})-[:liked]-(:Event)-[:tags]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, s4, count(t) as s5
      Optional match (u:User{ID : $userid})-[c:user_interest]-(:Interest)-[:tags]-(:Event)-[t:tags]-(m)
      with m, s1, s2, s3, s4, s5, count(t) as s6
      optional match (m:Interest)-[:tags]-(e:Event)
      where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() 
      with m, s1, s2, s3, s4, s5, s6, count(e) as s7
      with m, [m.name, s1*10000+s2*1000+s3*500+s4/5+s5/6+s6/2+ s7/200] as s//, s1, s2, s3, s4, s5, s6
      order by s[1] desc
      with collect(m) as mm, [] as pk
      optional match (m:Interest {name: mm[0].name})-[:tags]-(e:Event)
            where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() and not id(e) in pk
            with pk, mm, e 
            order by e.startingTime 
            with pk, mm, e.CreatorID as nme, collect(e)[0] as e
            limit 15
            optional match (e)-[r1:attending]-(:User)
            with mm, e, pk, count(r1) as atts
            optional match (e)-[r1:liked]-(:User)
            with mm, e, pk, atts, count(r1) as liks
            optional match (e)-[r1:shoutout]-(:User)
            with mm, e, pk, atts, liks, count(r1) as shuts
            optional match (e)-[:tags]-(tt:Interest)
            with pk, mm, e, atts, liks, shuts, collect(tt.name) as ittlist,
            case 
                  when (e)-[:attending]-(:User{ID : $userid}) then 1
                  else 0
                end as att,
                case 
                  when (e)-[:liked]-(:User{ID : $userid}) then 1
                  else 0
                end as lik,
                case 
                  when (e)-[:shoutout]-(:User{ID : $userid}) then 1
                  else 0
                end as shut
            with mm, collect([id(e), e, ittlist, att, lik, shut, atts, liks, shuts]) as intr1, collect(id(e)) + pk as pk
            with pk, mm, collect([mm[0].name, intr1]) as ret
          
            optional match (m:Interest {name: mm[1].name})-[:tags]-(e:Event)
            where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() and not id(e) in pk
            with ret, pk, mm, e 
            order by e.startingTime 
            with ret, pk, mm, e.CreatorID as nme, collect(e)[0] as e
            limit 15
            optional match (e)-[r1:attending]-(:User)
            with ret, mm, e, pk, count(r1) as atts
            optional match (e)-[r1:liked]-(:User)
            with ret, mm, e, pk, atts, count(r1) as liks
            optional match (e)-[r1:shoutout]-(:User)
            with ret, mm, e, pk, atts, liks, count(r1) as shuts
            optional match (e)-[:tags]-(tt:Interest)
            with ret, pk, mm, e, atts, liks, shuts, collect(tt.name) as ittlist,
            case 
                  when (e)-[:attending]-(:User{ID : $userid}) then 1
                  else 0
                end as att,
                case 
                  when (e)-[:liked]-(:User{ID : $userid}) then 1
                  else 0
                end as lik,
                case 
                  when (e)-[:shoutout]-(:User{ID : $userid}) then 1
                  else 0
                end as shut
            with ret, mm, collect([id(e), e, ittlist, att, lik, shut, atts, liks, shuts]) as intr1, collect(id(e)) + pk as pk
            with pk, mm, ret + collect([mm[1].name, intr1]) as ret
          
            optional match (m:Interest {name: mm[2].name})-[:tags]-(e:Event)
            where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() and not id(e) in pk
            with ret, pk, mm, e 
            order by e.startingTime 
            with ret, pk, mm, e.CreatorID as nme, collect(e)[0] as e
            limit 15
            optional match (e)-[r1:attending]-(:User)
            with ret, mm, e, pk, count(r1) as atts
            optional match (e)-[r1:liked]-(:User)
            with ret, mm, e, pk, atts, count(r1) as liks
            optional match (e)-[r1:shoutout]-(:User)
            with ret, mm, e, pk, atts, liks, count(r1) as shuts
            optional match (e)-[:tags]-(tt:Interest)
            with ret, pk, mm, e, atts, liks, shuts, collect(tt.name) as ittlist,
            case 
                  when (e)-[:attending]-(:User{ID : $userid}) then 1
                  else 0
                end as att,
                case 
                  when (e)-[:liked]-(:User{ID : $userid}) then 1
                  else 0
                end as lik,
                case 
                  when (e)-[:shoutout]-(:User{ID : $userid}) then 1
                  else 0
                end as shut
            with ret, mm, collect([id(e), e, ittlist, att, lik, shut, atts, liks, shuts]) as intr1, collect(id(e)) + pk as pk
            with pk, mm, ret + collect([mm[2].name, intr1]) as ret
          
            optional match (m:Interest {name: mm[3].name})-[:tags]-(e:Event)
            where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() and not id(e) in pk
            with ret, pk, mm, e 
            order by e.startingTime 
            with ret, pk, mm, e.CreatorID as nme, collect(e)[0] as e
            limit 15
            optional match (e)-[r1:attending]-(:User)
            with ret, mm, e, pk, count(r1) as atts
            optional match (e)-[r1:liked]-(:User)
            with ret, mm, e, pk, atts, count(r1) as liks
            optional match (e)-[r1:shoutout]-(:User)
            with ret, mm, e, pk, atts, liks, count(r1) as shuts
            optional match (e)-[:tags]-(tt:Interest)
            with ret, pk, mm, e, atts, liks, shuts, collect(tt.name) as ittlist,
            case 
                  when (e)-[:attending]-(:User{ID : $userid}) then 1
                  else 0
                end as att,
                case 
                  when (e)-[:liked]-(:User{ID : $userid}) then 1
                  else 0
                end as lik,
                case 
                  when (e)-[:shoutout]-(:User{ID : $userid}) then 1
                  else 0
                end as shut
            with ret, mm, collect([id(e), e, ittlist, att, lik, shut, atts, liks, shuts]) as intr1, collect(id(e)) + pk as pk
            with pk, mm, ret + collect([mm[3].name, intr1]) as ret
          
            optional match (m:Interest {name: mm[4].name})-[:tags]-(e:Event)
            where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date() and not id(e) in pk
            with ret, pk, mm, e 
            order by e.startingTime 
            with ret, pk, mm, e.CreatorID as nme, collect(e)[0] as e
            limit 15
            optional match (e)-[r1:attending]-(:User)
            with ret, mm, e, pk, count(r1) as atts
            optional match (e)-[r1:liked]-(:User)
            with ret, mm, e, pk, atts, count(r1) as liks
            optional match (e)-[r1:shoutout]-(:User)
            with ret, mm, e, pk, atts, liks, count(r1) as shuts
            optional match (e)-[:tags]-(tt:Interest)
            with ret, pk, mm, e, atts, liks, shuts, collect(tt.name) as ittlist,
            case 
                  when (e)-[:attending]-(:User{ID : $userid}) then 1
                  else 0
                end as att,
                case 
                  when (e)-[:liked]-(:User{ID : $userid}) then 1
                  else 0
                end as lik,
                case 
                  when (e)-[:shoutout]-(:User{ID : $userid}) then 1
                  else 0
                end as shut
            with ret, mm, collect([id(e), e, ittlist, att, lik, shut, atts, liks, shuts]) as intr1, collect(id(e)) + pk as pk
            with pk, mm, ret + collect([mm[4].name, intr1]) as ret
            unwind ret as ret2
            with ret2
            where not isempty(ret2[1]) and ret2[1][1] <> 'null'
            return ret2[0] as name, ret2[1] as events
          //return ret2[0] as name`,
      { userid: inp_type }
    )
    .then(function (result) {
      var FinalArr = [];
      result.records.forEach(function (record) {
        var EventArr = [];
        record._fields[1].forEach(function (event) {
          //console.log(event)
          //console.log(record);
          EventArr.push({
            //test: event[1].properties.Name
            id: event[0].low,
            uniqueID: event[1].properties.ID,
            title: event[1].properties.Name,
            userID: event[1].properties.CreatorID,
            //type: record._fields[1].properties.type,
            visibility: event[1].properties.Visibility,
            startingTime: event[1].properties.startingTime,
            image: event[1].properties.Image,
            description: event[1].properties.Description,
            location: event[1].properties.Location,
            taglist: event[2],
            joined: event[3].low,
            liked: event[4].low,
            shouted: event[5].low,
            num_joins: event[6].low,
            num_likes: event[7].low,
            num_shouts: event[8].low,
            link: null,
          });
          //console.log(record._fields[0].low);
        });
        FinalArr.push({
          header: record._fields[0],
          data: EventArr,
        });
      });
      //console.log(JSON.stringify(FinalArr));
      //res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(FinalArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/spotlight", jsonParser, (req, res) => {
  // res.send("POST Request Called")

  var inp_type = req.body.UserId;

  console.log("POST req on", inp_type);
  connection
    .run(
      `match (e:Event)-[:tags]->(inte:Interest) 
      where date(datetime({epochmillis: apoc.date.parse(e.startingTime, "ms", "yyyy/MM/dd")})) >= date()
      with e, collect(inte.name) as int_list 
      order by e.startingTime
      with e.CreatorID as nme, collect(e)[0] as e, collect(int_list)[0] as tt
      optional match (e)-[r1:attending]-(:User)
      with e, tt, count(r1) as atts
      optional match (e)-[r1:liked]-(:User)
      with e, tt, atts, count(r1) as liks
      optional match (e)-[r1:shoutout]-(:User)
      with e, tt, atts, liks, count(r1) as shuts
      with e, tt, atts, liks, shuts,
      case 
        when (e)-[:attending]-(:User{ID : 'lukas'}) then 1
        else 0
      end as att,
      case 
        when (e)-[:liked]-(:User{ID : 'lukas'}) then 1
        else 0
      end as lik,
      case 
        when (e)-[:shoutout]-(:User{ID : 'lukas'}) then 1
        else 0
      end as shut
      return ID(e), e, tt, att, lik, shut, atts, liks, shuts 
      order by e.startingTime
      limit 20`,
      { userID: inp_type }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        // console.log(record);
        EventArr.push({
          id: record._fields[0].low,
          uniqueID: record._fields[1].properties.ID,
          title: record._fields[1].properties.Name,
          userID: record._fields[1].properties.CreatorID,
          //type: record._fields[1].properties.type,
          startingTime: record._fields[1].properties.startingTime,
          visibility: record._fields[1].properties.Visibility,
          image: record._fields[1].properties.Image,
          description: record._fields[1].properties.Description,
          location: record._fields[1].properties.Location,
          taglist: record._fields[2],
          joined: record._fields[3].low,
            liked: record._fields[4].low,
            shouted: record._fields[5].low,
            num_joins: record._fields[6].low,
            num_likes: record._fields[7].low,
            num_shouts: record._fields[8].low,

          // id: record._fields[0].low,
          // title: record._fields[1].properties.Name,
          // //type: record._fields[1].properties.type,
          // startingTime: record._fields[1].properties.startingTime,
          // image: record._fields[1].properties.Image,
          // description: record._fields[1].properties.Description,
          // location: record._fields[1].properties.Location,
          // taglist: record._fields[2],
        });
        console.log(record._fields[0].low);
      });
      // console.log(JSON.stringify(EventArr));
      // res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(EventArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/feat_orgs", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.UserId; //"user_1"; //req.body.user;
  console.log("POST req on", inp_type);
  connection
    .run("match (org:Organization) return ID(org), org limit 20", {
      name: inp_type,
    })
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        // console.log(record);
        EventArr.push({
          id: record._fields[0].low,
          uniqueID: record._fields[1].properties.ID,
          title: record._fields[1].properties.Name,
          image: record._fields[1].properties.Image,
        });
        console.log(record._fields[0].low);
      });
      // console.log(JSON.stringify(EventArr));
      // res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(EventArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/categories", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.UserId; //req.body.user;
  console.log("POST req on", inp_type);
  connection
    .run(
      `match (i:Interest)<-[:tags]-(e:Event)
      with distinct(i) as int, count(e) as event_count
      return ID(int), int, event_count
      order by event_count desc
      limit 20`,
      {
        name: inp_type,
      }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        // console.log(record);
        EventArr.push({
          id: record._fields[0].low,
          category: record._fields[1].properties.category,
          name: record._fields[1].properties.name,
          event_count: record._fields[2].low,
        });
        console.log(record._fields[0].low);
      });
      // console.log(JSON.stringify(EventArr));
      // res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(EventArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/interest_events", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.id;
  console.log("Org Events POST req on", inp_type);
  connection
    .run(
      `match (it:Interest {name :  $id})-[:tags]-(n:Event)
          with n
          order by n.startingTime desc
          limit 50
          optional match (n)-[:tags]-(itt:Interest)
          with n, collect(itt.name) as ittlist
          return id(n), n, ittlist`,
      { id: inp_type }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        console.log(record);
        EventArr.push({
          id: record._fields[0].low,
          uniqueID: record._fields[1].properties.ID,
          title: record._fields[1].properties.Name,
          userID: record._fields[1].properties.CreatorID,
          //type: record._fields[1].properties.type,
          startingTime: record._fields[1].properties.startingTime,
          visibility: record._fields[1].properties.visibility,
          location: record._fields[1].properties.Location,
          image: record._fields[1].properties.Image,
          description: record._fields[1].properties.Description,
          taglist: record._fields[2], // its an optional match now so it may cause an ERROR in the future on the frontend
          // description: record._fields[1].properties.description,
        });
      });
      console.log(EventArr);
      // res.setHeader('Content-Type', 'text/html');
      res.send(JSON.stringify(EventArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/data", function (req, res) {
  connection
    .run(
      "match (n:Event) where n.type contains $name return ID(n),(n) limit 25",
      { name: "Instagram" }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
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
      res.setHeader("Content-Type", "text/html");
      res.send(JSON.stringify(EventArr));
      res.end();
      // res.render('index', {
      //   movies: MovieArr
      // });
    })
    .catch(function (err) {
      console.log(err);
    });
  // console.log(result);
  // res.send(result);
});

app.post("/set_push_token", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.id;
  console.log("Org Events POST req on", inp_type);
  connection
    .run(
      `MERGE (u:User {pushToken: $id} )
      ON CREATE
        SET u.pushToken = $id
      ON MATCH
        SET u.pushToken = $id`,
      { id: inp_type }
    )
    .then(function (result) {})
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/search", function (req, res) {
  connection
    .run(
      'match (n:Event)-[:tags]->(inte:Interest)  with n, collect(inte.name) as int_list Where n.startingTime contains "2022/08" or n.startingTime contains "2022/09" or n.startingTime contains "2022/07" or n.startingTime contains "2022/10" or n.startingTime contains "2022/09"  return ID(n), (n), int_list order by n.startingTime desc limit 1000'
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        console.log(record);
        EventArr.push({
          // id: record._fields[0].low,
          // title: record._fields[1].properties.Name,
          // //type: record._fields[1].properties.type,
          // startingTime: record._fields[1].properties.startingTime,
          // visibility: record._fields[1].properties.visibility,
          // location: record._fields[1].properties.Location,
          // image: record._fields[1].properties.Image,
          // description: record._fields[1].properties.Description,
          // taglist: record._fields[2],

          id: record._fields[0].low,
          uniqueID: record._fields[1].properties.ID,
          title: record._fields[1].properties.Name,
          userID: record._fields[1].properties.CreatorID,
          //type: record._fields[1].properties.type,
          startingTime: record._fields[1].properties.startingTime,
          visibility: record._fields[1].properties.Visibility,
          image: record._fields[1].properties.Image,
          description: record._fields[1].properties.Description,
          location: record._fields[1].properties.Location,
          taglist: record._fields[2],

          // description: record._fields[1].properties.description,
        });
        console.log(record._fields[0].low);
      });
      res.setHeader("Content-Type", "text/html");
      res.send(JSON.stringify(EventArr));
      res.end();
      // res.render('index', {
      //   movies: MovieArr
      // });
    })
    .catch(function (err) {
      console.log(err);
    });
  // console.log(result);
  // res.send(result);
});

app.get("/search_org", function (req, res) {
  // var inp_type = req.body.id;
  // console.log("Org Events POST req on", inp_type);
  // if (inp_type !== null) {
  connection
    .run(
      `match (org:Organization)
      return ID(org), org`
      // { id: inp_type }
    )
    .then(function (result) {
      var EventArr = [];
      result.records.forEach(function (record) {
        console.log(record);
        EventArr.push({
          id: record._fields[0].low,
          OrgID: record._fields[1].properties.ID,
          name: record._fields[1].properties.Name,
          image: record._fields[1].properties.Image,
          // description: record._fields[1].properties.description,
        });
        console.log(record._fields[0].low);
      });
      console.log(EventArr);
      // res.setHeader('Content-Type', 'text/html');
      res.send(JSON.stringify(EventArr));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
  // }
});

app.get("/interests", function (req, res) {
  connection
    .run(
      "match (n:Interest) return distinct(n.category) as group, collect(n.name) as ls"
    )
    .then(function (result) {
      var InterestArr = [];
      result.records.forEach(function (record) {
        console.log(record);
        InterestArr.push({
          title: record._fields[0],
          data: record._fields[1],
        });
        console.log(record._fields[0].low);
        console.log(record._fields[2]);
      });
      res.setHeader("Content-Type", "text/html");
      res.send(JSON.stringify(InterestArr));
      res.end();
      // res.render('index', {
      //   movies: MovieArr
      // });
    })
    .catch(function (err) {
      console.log(err);
    });
  // console.log(result);
  // res.send(result);
});

app.post("/import_interest_list", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.UserId;
  console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id})-[:user_interest]->(i: Interest) return  collect(i.name) as Interest_list",
      { id: inp_type }
    )
    .then(function (result) {
      var user_int_array = result.records[0]._fields[0];
      // result.records.forEach(function(record){

      //   user_int_array.push({
      //     Interest_list: record._fields[0]
      //   });
      // });
      console.log(user_int_array);
      res.setHeader("Content-Type", "text/html");
      res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/organization_details", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.id;
  console.log("Org Events POST req on", inp_type);
  if (inp_type !== null) {
    connection
      .run(
        `match (org:Organization)
        where org.ID contains $id
        return ID(org), org`,
        { id: inp_type }
      )
      .then(function (result) {
        var EventArr = {
          id: result.records[0]._fields[0].low,
          name: result.records[0]._fields[1].properties.Name,
          image: result.records[0]._fields[1].properties.Image,
          // description: record._fields[1].properties.description,
        };
        console.log(EventArr);
        // res.setHeader('Content-Type', 'text/html');
        res.send(JSON.stringify(EventArr));
        res.end();
      })
      .catch(function (err) {
        console.log(err);
      });
  }
});

app.post("/organization_events", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  var inp_type = req.body.id;
  console.log("Org Events POST req on", inp_type);
  if (inp_type !== null) {
    connection
      .run(
        `match (org:Organization)-[:Created]->(n:Event), (n)-[:tags]->(inte:Interest)
        with org, n, collect(inte.name) as int_list
        where org.ID contains $id
        return ID(n),n, int_list
        order by n.startingTime desc
        limit 50`,
        { id: inp_type }
      )
      .then(function (result) {
        var EventArr = [];
        result.records.forEach(function (record) {
          console.log(record);
          EventArr.push({
            id: record._fields[0].low,
            title: record._fields[1].properties.Name,
            //type: record._fields[1].properties.type,
            startingTime: record._fields[1].properties.startingTime,
            userID: record._fields[1].properties.CreatorID,
            visibility: record._fields[1].properties.Visibility,
            location: record._fields[1].properties.Location,
            image: record._fields[1].properties.Image,
            description: record._fields[1].properties.Description,
            taglist: record._fields[2],
            // description: record._fields[1].properties.description,
          });
        });
        console.log(EventArr);
        // res.setHeader('Content-Type', 'text/html');
        res.send(JSON.stringify(EventArr));
        res.end();
      })
      .catch(function (err) {
        console.log(err);
      });
  }
});

app.post("/delete_user_interest", jsonParser, (req, res) => {
  var inp_type = req.body.UserId;

  console.log("Delete int list for user ", inp_type);
  // console.log("POST req on", inp_type);
  connection
    .run("match (u:User)-[t:user_interest]-(i) where u.ID = $id delete t", {
      id: inp_type,
    })
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/export_user_interest", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  // if (req.session) {
  //   var inp_type = sess.username; // if session
  // } else {
  //   var inp_type = "user_1";
  // }

  var inp_type = req.body.UserId;

  console.log("Export int list for user ", inp_type);
  var outTags = req.body.interest_list;
  console.log(outTags);
  console.log("POST req on", inp_type);
  connection
    .run(
      "match (u:User), (i:Interest) where u.ID = $id and i.name in $interest_list create (u)-[r:user_interest]->(i)",
      { id: inp_type, interest_list: outTags }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/get_shoutOut", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;
  var inp_type = req.body.UserId;

  console.log("Create shoutout for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id})-[s:shoutout]->(e: Event) return n, collect (e.ID) as event_IDs",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      if (_.isEmpty(result.records)) {
        res.end();
        console.log("does not exist");
        // res.setHeader("Content-Type", "text/html");
        res.send(JSON.stringify({ value: false }));
        // res.end();
      } else {
        res.end();
        // res.setHeader("Content-Type", "text/html");
        res.send(JSON.stringify({ value: true }));
        // res.end();
      }
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/create_shoutOut", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;

  var inp_type = req.body.UserId;

  console.log("Create shoutout for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id}), (e: Event {ID :$eventID}) where e.ID = $eventID create (n)-[:shoutout]->(e)",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      // res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/delete_shoutOut", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;
  var inp_type = req.body.UserId;

  console.log("Delete shoutout for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id})-[s:shoutout]->(e: Event {ID :$eventID}) delete s",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      // res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

///  ###### liked functions

app.post("/create_liked", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;
  var inp_type = req.body.UserId;

  console.log("Create liked for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id}), (e: Event {ID :$eventID}) where e.ID = $eventID create (n)-[:liked]->(e)",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      // res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/delete_liked", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;
  var inp_type = req.body.UserId;

  console.log("Delete liked for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id})-[s:liked]->(e: Event {ID :$eventID}) delete s",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      // res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

/// #### join functionality

app.post("/create_join", jsonParser, (req, res) => {
  var eventID = req.body.uniqueID;
  var inp_type = req.body.UserId;

  console.log("Create attending for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id}), (e: Event {ID :$eventID}) where e.ID = $eventID create (n)-[:attending]->(e)",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      res.setHeader("Content-Type", "text/html");
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/delete_join", jsonParser, (req, res) => {
  // res.send("POST Request Called")
  // var inp_type = req.body.id;
  var eventID = req.body.uniqueID;

  var inp_type = req.body.UserId;

  console.log("Delete attending for user and id: ", inp_type, " ", eventID);
  // console.log("Check int list for user ", inp_type);
  connection
    .run(
      "match (n:User {ID: $id})-[s:attending]->(e: Event {ID :$eventID}) delete s",
      { id: inp_type, eventID: eventID }
    )
    .then(function (result) {
      // var user_int_array = result.records[0]._fields[0];
      // result.records.forEach(function(record){

      //   user_int_array.push({
      //     Interest_list: record._fields[0]
      //   });
      // });
      // console.log(user_int_array);
      res.setHeader("Content-Type", "text/html");
      // res.send(JSON.stringify(user_int_array));
      res.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(PORT);
console.log("Server listening on PORT", PORT);

module.exports = app;
