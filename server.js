const axios = require('axios')
var fs = require('fs');
var http = require('http');
const express = require('express')
const app = express()
const port = 3000;
var botID = ''; // bot id here
var schoolName = ''; // schoolName here

app.get('/', (req, res) => {
	checkResults();
    res.send('Results Bot!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function checkResults() {
    axios.get('https://www.betaclub.org/api?request=convention_info&year=2020&type=S&state=ga')
    .then((response) => {
        if(response.data != null) {
            fs.readFile('non-repeat.html', function(err, data) {
                if(data == undefined) {
                    for(let i=0; i<response.data.nationalcompetitions.length; i++) {
                        for(let j=0; j<response.data.nationalcompetitions[i].winners.length; j++) {
                            if(response.data.nationalcompetitions[i].winners[j].school_name == schoolName) {
                                let text = `🎉 ${response.data.nationalcompetitions[i].name} [Place: ${response.data.nationalcompetitions[i].winners[j].place}] ${response.data.nationalcompetitions[i].winners[j].lname != null ? ": " + response.data.nationalcompetitions[i].winners[j].lname + "," : ""} ${response.data.nationalcompetitions[i].winners[j].fname != null ? response.data.nationalcompetitions[i].winners[j].fname : ""}`;
                                try {
                                    axios.post('https://api.groupme.com/v3/bots/post', { 
                                        "bot_id"  : botID,
                                        "text"    : text
                                    })
                                    .then(res => {})
                                    .catch(error => {})
                                } catch(e) {}
                            }
                        }
                    }
                    fs.appendFile('non-repeat.html', 'Dont repeat anymore', function (err) {
                        if (err) throw err;
                        console.log('Saved!');
		    });
                }
            });
        }
    });
}
