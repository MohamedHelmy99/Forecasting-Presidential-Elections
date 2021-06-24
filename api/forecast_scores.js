const express = require('express');
const router = express.Router();
const T = require('./twit');
var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var mongourl = "mongodb://localhost:27017/mydb";


MongoClient.connect(mongourl, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});


//Create mongodb collection
MongoClient.connect(mongourl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("forecastDB", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });


//Dictionary with the states and their locations.
let states = {
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
    "WY": {"lat": "43.075970", "long":"-107.290283"},
}


const fetch = require("node-fetch");

const tfn = require('@tensorflow/tfjs-node');

const tfjsModel = tfn.io.fileSystem('./api/tfjs_models/tfjs_model_files/model.json');
const tfjsMetaData = require('./tfjs_models/metadata.json');

const urls = {

    model: tfjsModel,

    metadata: tfjsMetaData
};


const SentimentThreshold = {
    Positive: 0.66,
    Neutral: 0.33,
    Negative: 0
}

const PAD_INDEX = 0;
const OOV_INDEX = 2;

let  model, metadata;
metadata = urls.metadata;


async function setupSentimentModel(){
    if(typeof model === 'undefined'){
        //model = urls.model;
        model = await loadModel(urls.model);
    }
    if(typeof metadata === 'undefined'){
       //metadata = urls.metadata;
        metadata = await loadMetadata(urls.metadata);
    }
}




async function loadModel(url) {
    try {
        
        const model = await tfn.loadLayersModel(url);
        //await model.save('file://./api/tfjs_models/tfjs_models');
        return model;
    } catch (err) {
        console.log(err);
    }
}



const padSequences = (sequences, metadata) => {
    return sequences.map(seq => {
        if (seq.length > metadata.max_len) {
            seq.splice(0, seq.length - metadata.max_len);
        }
        if (seq.length < metadata.max_len) {
            const pad = [];
            for (let i = 0; i < metadata.max_len - seq.length; ++i) {
                pad.push(0);
            }
            seq = pad.concat(seq);
        }
        return seq;
    });
}


//https://dev.to/twilio/how-positive-was-your-year-with-tensorflow-js-and-twilio-3foi
function getSentimentScore(text) {
    const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    // Convert the words to a sequence of word indices.
   // console.log('metadata', inputText);
    const sequence = inputText.map(word => {
        let wordIndex = metadata.word_index[word];
        if (typeof wordIndex === 'undefined' || wordIndex > metadata.max_len) {
            return OOV_INDEX; //oov_index
        }
        return wordIndex + metadata.index_from;
    });


    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], metadata);
   // console.log(paddedSequence);
    const input = tfn.tensor2d(paddedSequence, [1, metadata.max_len]);
    
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();

    return score;
}


const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);


//a function to get the tweets
const getTweets = (query, loc, tweetsNumber) => {
    return new Promise ((resolve, reject) => {
        let params = {
            q: query ,
          // lang:"en",
            geocode: loc,
            count: tweetsNumber,
            tweet_mode: 'extended'
        }
        T.get('search/tweets', params, function (err, data, response) {
            if (err) {
              reject(err);
            }
            resolve(data.statuses);
        })
    })
}


//a function that turns an array of multiple strings into one string with ORs
const getString = (arr) => {

    return arr? arr.join(' OR '):[];
}



 
router.get('/', async (req, res, next)=>{

    try{

        

        const forLoop = async _ => {
            console.log('Start')
              
            for (var i in states) {
                  
                let lat = states[i].lat;
                let long = states[i].long;
                const dist = 100;
                var loc = [lat,long,dist+"km"];
                let trumpTweets = await getTweets('#Trump', loc, 10);


                trumpTweets.map((value)=>{
                
                let tweetText = value.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
                let myobj = { hashtag: "#Trump", state: i, tweets: tweetText, score: getSentimentScore(tweetText)};
                console.log("myobj",myobj);


                MongoClient.connect(mongourl, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("mydb");
                dbo.collection("forecastDB").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();

                  });
                });  

                })


                let bidenTweets = await getTweets('#Biden', loc, 10);

                bidenTweets.map((value)=>{

                    let tweetText2 = value.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
                    let myobj2 = { hashtag: "#Biden", state: i, tweets: tweetText2, score: getSentimentScore(tweetText2)};
                    console.log("myobj2",myobj2);

                    MongoClient.connect(mongourl, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db("mydb");
                        dbo.collection("forecastDB").insertOne(myobj2, function(err, res) {
                            if (err) throw err;
                            console.log("1 document inserted");
                            db.close();

                        });
                    }); 

                })

            }
              
                console.log('End')
        }
    


        await setupSentimentModel();
        console.log('mainModel', model);
        console.log('modelTesting', model);
        forLoop();
    

        res.send("success");

    } catch (error) {

        return next(error)
    }

})

module.exports = router;