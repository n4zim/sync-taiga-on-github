'use strict';

/********************************************************
  *   IMPORTS 
  ********************************************************/

const utf8 = require('utf8');
const hmacsha1 = require('hmacsha1');


/********************************************************
  *   EXPRESS APP 
  ********************************************************/

const app = require('express')();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/********************************************************
  *   GLOBAL 
  ********************************************************/

const TAIGA_SECRET = process.env.TAIGA_SECRET;


/********************************************************
  *   FILES 
  ********************************************************/

const fs = require('fs');

const PATHS = { issues: 'data/issues.json', users: 'data/users.json' };

function updateFile(path, jsonContent) {
	fs.writeFile(path, JSON.stringify(jsonContent), 'utf8', function(err) {
    	if(err) console.log("ERROR :", err);
    });
}

function readFile(path, callback) {
	fs.readFile(path, 'utf8', function (err, content) {
	    if(err) console.log("ERROR :", err);
	    if(callback) callback(JSON.parse(content));
	});
}

let DATA = { issues: {}, users: {} };

// Issues
if(fs.existsSync(PATHS.issues)) {
	readFile(PATHS.issues, issues => { DATA.issues = issues; });
} else {
	updateFile(PATHS.issues, DATA.issues);
}

// Users
if(fs.existsSync(PATHS.users)) {
	readFile(PATHS.users, users => { DATA.users = users; });
} else {
	updateFile(PATHS.users, DATA.users);
}


/********************************************************
  *   GITHUB
  ********************************************************/

const GitHub = require('github-api')({ token: process.env.GITHUB_TOKEN });

function saveGitHubIssue(taigaId, gitHubId) {
	DATA.issues[taigaId] = gitHubId;
	updateFile(PATHS.issues, DATA.issues);
}

function getGitHubIssue(taigaId) {
	console.log(DATA.issues[id]);
}

function createIssue(data) {
  	//GitHub.createIssue({});
}


/********************************************************
  *   TAIGA WEBHOOK
  ********************************************************/

app.post('/taiga', (req, res) => {
	const data = req.body;
	//const signature = req.headers['x-taiga-webhook-signature'];
    //console.log(utf8.encode(data));
  	console.log(data);

	switch(data.action) {
	    case 'issues':
	    	console.log(data);
	        break;
	    default:
	        console.log("ERROR : Unknown action \"" + data.action + "\"");
	}
  
  	res.end("OK");
});


/********************************************************
  *   SERVER
  ********************************************************/

app.listen(80, '0.0.0.0');
console.log("Server running...");
