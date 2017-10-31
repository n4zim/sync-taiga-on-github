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

let DATA = { issues: {}, projects: {}, users: {} };

const PATHS = {
	issues: "data/issues.json",
	projects: "data/projects.json",
	users: "data/users.json"
};

function loadData(identifiers) {
	for(let i = 0; i < identifiers.length; i++) {	
		if(fs.existsSync(PATHS[identifiers[i]])) {
			readFile(PATHS[identifiers[i]], content => { DATA[identifiers[i]] = content; });
		} else {
			updateFile(PATHS[identifiers[i]], DATA[identifiers[i]]);
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

// ISSUES
const GitHubIssues = GitHub.getIssues(process.env.GITHUB_OWNER, process.env.GITHUB_REPO);

const handle = (promise, callback) => {
	promise.then(output => {
		//console.log(output);
		if(callback) callback(output);
	}).catch(error => {
		console.log("ERROR :", error);
	});
};

function updateIssue(taigaId, author, subject, description, assignment) {
	let data = { title: '[TG-' + taigaId + '] ' + subject, body: description };

	if(assignment === null) {
		data.assignees = [];
	} else if(typeof DATA.users[assignment.username] !== 'undefined') {
		data.assignees = [ DATA.users[assignment.username] ];
	}
	
	if(typeof DATA.issues[taigaId] === 'undefined') {
		handle(GitHubIssues.createIssue(data), output => {
			DATA.issues[taigaId] = output.data.number;
			updateFile(PATHS.issues, DATA.issues);
			console.log("Issue for TG-" + taigaId + " created");
		});
	} else {
		handle(GitHubIssues.editIssue(DATA.issues[taigaId], data), () => {
			console.log("Issue for TG-" + taigaId + " updated");
		});
	}
}

function commentIssue(taigaId, author, comment) { 
	if(typeof DATA.issues[taigaId] === 'undefined') {
		
	} else {
		console.log("ERROR :", "Issue for TG-" + taigaId + " not found");
	}
}


/********************************************************
  *   TAIGA WEBHOOK
  ********************************************************/

function isValid(webhook) {
	if(DATA.projects.indexOf(webhook.data.project.id) === -1) {
		console.log("ERROR : Project \"" + webhook.data.project.id + "\" is not in the list");
		return false;
	}
	return true;
}

function DEBUG(webhook) {
    console.log(webhook);
    fs.writeFile(
        "debug-" + Date.now() + "-" + webhook.action + ".json",
        JSON.stringify(webhook),
        'utf8',
        function(err) { if(err) console.log("ERROR :", err); }
    );
}

app.post('/taiga', (req, res) => {

    const webhook = req.body;

    const signature = req.headers['x-taiga-webhook-signature'];

    console.log(utf8.encode(webhook));

    console.log(webhook);

    //DEBUG(webhook);

	/*switch(webhook.type) {

		// TEST
		case 'test':
			console.log("Test webhook received !");
			break;

		// ISSUES
	    case 'issue':
	    	switch(webhook.action) {
	    		case 'create':
	    		case 'change':
	    			if(isValid(webhook)) {
						if(typeof webhook.change !== 'undefined' && typeof webhook.change.comment !== 'undefined') {
							commentIssue(
								webhook.data.ref,			// taigaId
								webhook.by.username,		// author
								webhook.change.comment		// comment
							);
						} else {
							updateIssue(
								webhook.data.ref,			// taigaId
								webhook.by.username,		// author
								webhook.data.subject,		// subject
								webhook.data.description,	// description
								webhook.data.assigned_to	// assignment
							);
						}
	    			}
	    			break;
	    		default:
	    			console.log("ERROR : Unknown action \"" + webhook.action + "\"");
	    	}
	        break;

        // NONE
	    default:
	        console.log("ERROR : Unknown type \"" + webhook.type + "\"");

	}*/

  	res.end("ok");
});


/********************************************************
  *   SERVER
  ********************************************************/

app.listen(80, '0.0.0.0');
console.log("Server running...");
