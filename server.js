'use strict';

/********************************************************
  *   IMPORTS 
  ********************************************************/

const utf8 = require('utf8');
const hmacsha1 = require('hmacsha1');
const githubApi = require('github-api');


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

function loadData(identifiers) {
	for(let i = 0; i < identifiers.length; i++) {	
		if(fs.existsSync("data/" + identifiers[i] + ".json")) {
			readFile("data/" + identifiers[i] + ".json", content => { DATA[identifiers[i]] = content; });
		} else {
			updateFile("data/" + identifiers[i] + ".json", DATA[identifiers[i]]);
		}
	}
}

loadData([
	'issues', 	// List of Taiga to GitHub issues ids
	'projects',	// List of Taiga projects to GitHub repository
	'users',	// List of Taiga to GitHub users ids
]);


/********************************************************
  *   GITHUB
  ********************************************************/

const GitHub = new githubApi({ token: process.env.GITHUB_TOKEN });

/*function saveGitHubIssue(taigaId, gitHubId) {
	DATA.issues[taigaId] = gitHubId;
	updateFile(PATHS.issues, DATA.issues);
}

function getGitHubIssue(taigaId) {
	console.log(DATA.issues[id]);
}*/

// ISSUES
const GitHubIssues = GitHub.getIssues(process.env.GITHUB_OWNER, process.env.GITHUB_REPO);

const handle = (promise, successMessage) => {
	promise.then(output => {
		//console.log(output);
		console.log(successMessage);
	}).catch(error => {
		console.log("ERROR :", error);
	});
};

function updateIssue(taigaId, author, subject, description, assignment) {
	console.log(taigaId, author, subject, description, assignment);
	const data = {
		title: '[' + taigaId + '] ' + subject,
		body: description
	};
	if(typeof DATA.users[assignment] !== 'undefined') data.assignees = [ DATA.users[assignment] ];
	if(typeof DATA.issues[taigaId] === 'undefined') {
		handle(GitHubIssues.createIssue(data), "Issue for " + taigaId + " created");
	} else {
		handle(GitHubIssues.editIssue(DATA.issues[taigaId], data), "Issue for " + taigaId + " updated");
	}
}


/********************************************************
  *   TAIGA WEBHOOK
  ********************************************************/

app.post('/taiga', (req, res) => {
	const webhook = req.body;
	//const signature = req.headers['x-taiga-webhook-signature'];
    //console.log(utf8.encode(webhook));
  	console.log(webhook);

  	if(DATA.projects.indexOf(webhook.data.project.id) === -1) {
  		console.log("ERROR : Project \"" + webhook.data.project.id + "\" not in the list");
  	} else {
		switch(webhook.type) {

			// ISSUES
		    case 'issue':
		    	switch(webhook.action) {
		    		case 'create':
		    		case 'change':
		    			updateIssue(
		    				webhook.data.ref,			// taigaId
		    				webhook.by.username,		// author
		    				webhook.data.subject,		// subject
		    				webhook.data.description,	// description
		    				webhook.data.assigned_to,	// assignment
		    			);
		    			break;
		    		default:
		    			console.log("ERROR : Unknown action \"" + webhook.action + "\"");
		    	}
		        break;

	        // NONE
		    default:
		        console.log("ERROR : Unknown type \"" + webhook.type + "\"");
		}
  	}
  
  	res.end("OK");
});


/********************************************************
  *   SERVER
  ********************************************************/

app.listen(80, '0.0.0.0');
console.log("Server running...");
