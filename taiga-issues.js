
const issueCreated = (id, author, subject, description, assignment) => {
    console.log("=> ISSUE CREATED : TG-" + id);
    console.log(this);
};

const issueUpdated = (id, subject, description, assignment) => {
    console.log("=> ISSUE UPDATED : TG-" + id);
    console.log(this);
};

const issueDeleted = (id) => {
    console.log("=> ISSUE DELETED : TG-" + id);
    console.log(this);
};

const issueAssignment = (id, taigaUsername) => {
    console.log("=> ISSUE ASSIGNMENT FOR TG-" + id + " : " + taigaUsername);
    console.log(this);
};

const issueStatus = (id, status) => {
    console.log("=> ISSUE STATUS FOR TG-" + id + " : " + status);
    console.log(this);
};

// Comments

const issueCommentCreated = (issueId, commentId, author, content) => {
    console.log("=> ISSUE NEW COMMENT FOR TG-" + issueId + " : " + commentId + "(from " + author + ")");
    console.log(this);
};

const issueCommentUpdated = (issueId, commentId, content) => {
    console.log("=> ISSUE NEW COMMENT FOR TG-" + issueId + " : " + commentId);
    console.log(this);
};

const issueCommentDeleted = (issueId, commentId) => {
    console.log("=> ISSUE DELETED COMMENT FOR TG-" + issueId + " : " + commentId);
    console.log(this);
};

const issueCommentRestore = (issueId, commentId) => {
    console.log("=> ISSUE RESTORED COMMENT FOR TG-" + issueId + " : " + commentId);
    console.log(this);
};

// Files

const issueFileAdded = (issueId, author, fileId, url) => {
    console.log("=> ISSUE NEW FILE FOR TG-" + issueId + " : " + fileId + "(from " + author + ")");
    console.log(this);
};

const issueFileRemoved = (issueId, fileId) => {
    console.log("=> ISSUE DELETED FILE FOR TG-" + issueId + " : " + fileId);
    console.log(this);
};
