var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

//MongoClient.connect(url, function(err, db) {
//  if (err) throw err;
//  console.log("Database created!");
//  db.close();
//});


//MongoClient.connect(url, function(err, db) {
//  if (err) throw err;
//  var dbo = db.db("mydb");
//  dbo.createCollection("customers", function(err, res) {
//    if (err) throw err;
//    console.log("Collection created!");
//    db.close();
//  });
//});


//MongoClient.connect(url, function(err, db) {
//  if (err) throw err;
//  var dbo = db.db("mydb");
//  var myobj = { name: "Company Inc", address: "Highway 37" };
//  dbo.collection("customers").insertOne(myobj, function(err, res) {
//    if (err) throw err;
//    console.log("1 document inserted");
//   db.close();
//  });
//});


let s = {
    "AL": {"lat":"32.318230", "long":"-86.902298"},
    "AK": {"lat":"66.160507", "long":"-153.369141"},
    "AS": {"lat":"-14.275632", "long":"	-170.702042"},
    "AZ": {"lat":"34.048927", "long":"-111.093735"},
    "AR": {"lat":"34.799999", "long":"-92.199997"},
    "CA": {"lat":"36.778259", "long":"-119.417931"},
    "CO": {"lat":"39.113014", "long":"-105.358887"},
    "CT": {"lat":"41.599998", "long":"-72.699997"},
    "DE": {"lat":"39.000000", "long":"-75.500000"},
    "DC": {"lat":"38.942142", "long":"-77.025955"},
    "FM": {"lat":"6.916640", "long":"158.149963"},
    "FL": {"lat": "27.994402", "long":"-81.760254"},
    "GA": {"lat": "33.247875", "long":"-83.441162"},
    "GU": {"lat": "	13.444304", "long":"144.793732"},
    "HI": {"lat": "19.741755", "long":"-155.844437"},
    "ID": {"lat": "44.068203", "long":"-114.742043"},
    "IL": {"lat": "40.000000", "long":"-89.000000"},
    "IN": {"lat": "40.273502", "long":"-86.126976"},
    "IA": {"lat": "42.032974", "long":"-93.581543"},
    "KS": {"lat": "38.500000", "long":"-98.000000"},
    "KY": {"lat": "37.839333", "long":"-84.270020"},
    "LA": {"lat": "30.391830", "long":"-92.329102"},
    "ME": {"lat": "45.367584", "long":"-68.972168"},
    "MH": {"lat": "7.120520", "long":"171.365753"},
    "MD": {"lat": "39.045753", "long":"-76.641273"},
    "MA": {"lat": "42.407211", "long":"-71.382439"},
    "MI": {"lat": "44.182205", "long":"-84.506836"},
    "MN": {"lat": "46.392410", "long":"-94.636230"},
    "MS": {"lat": "33.000000", "long":"-90.000000"},
    "MO": {"lat": "38.573936", "long":"-92.603760"},
    "MT": {"lat": "46.965260", "long":"-109.533691"},
    "NE": {"lat": "41.500000", "long":"-100.000000"},
    "NV": {"lat": "39.876019", "long":"-117.224121"},
    "NH": {"lat": "44.000000", "long":"-71.500000"},
    "NJ": {"lat": "	39.833851", "long":"-74.871826"},
    "NM": {"lat": "	34.307144", "long":"-106.018066"},
    "NY": {"lat": "	40.730610", "long":"-73.935242"},
    "NC": {"lat": "	35.782169", "long":"-80.793457"},
    "ND": {"lat": "	47.650589", "long":"-100.437012"},
    "MP": {"lat": "	15.183333", "long":"145.750000"},
    "OH": {"lat": "	40.367474", "long":"-82.996216"},
    "OK": {"lat": "	36.084621", "long":"-96.921387"},
    "OR": {"lat": "	44.000000", "long":"-120.500000"},
    "PW": {"lat": "	7.514980", "long":"134.582520"},
    "PA": {"lat": "	41.203323", "long":"-77.194527"},
    "PR": {"lat": "	18.200178", "long":"-66.664513"},
    "RI": {"lat": "41.580093", "long":"-71.477432"},
    "SC": {"lat": "33.836082", "long":"-81.163727"},
    "SD": {"lat": "43.969517", "long":"-99.901810"},
    "TN": {"lat": "35.517490", "long":"-86.580444"},
    "TX": {"lat": "31.968599", "long":"-99.901810"},
    "UT": {"lat": "39.419220", "long":"-111.950684"},
    "VT": {"lat": "44.000000", "long":"-72.699997"},
    "VI": {"lat": "18.335765", "long":"-64.896335"},
    "VA": {"lat": "37.926868", "long":"-78.024902"},
    "WA": {"lat": "47.751076", "long":"-120.740135"},
    "WV": {"lat": "39.000000", "long":"-80.500000"},
    "WI": {"lat": "44.500000", "long":"-89.500000"},
    "WY": {"lat": "43.075970", "long":"-107.290283"}
}
// //for(var i in s){
//     //console.log(Object.keys(s[0]));
// //}
// let sn = s.keys();
// console.log(sn);

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
// async function findOne() {

//     const client = await MongoClient.connect(url, { useNewUrlParser: true })
//         .catch(err => { console.log(err); });

//     if (!client) {
//         return;
//     }

//     try {

//         const db = client.db("mydb");

//         let collection = db.collection('forecastDB');

//         if(trumpQuery != null){

//         let query = { hashtag: '#trump' }

//         let resulted = await collection.findOne(query);
//         }
//         if(bidenQuery != null){

//         let query = { hashtag: '#biden' }
//         let resulted = await collection.findOne(query);

//         }

//         console.log(resulted);

//     } catch (err) {

//         console.log(err);
//     } finally {

//         client.close();
//     }
// }

// let results = await 
// findOne();
// console.log(results);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var query = { hashtag: "#trump" };
  dbo.collection("forecastDB").find(query).toArray(function(err, result) {
    if (err) throw err;
   return(result);
    db.close();
  });
});

