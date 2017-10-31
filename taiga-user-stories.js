
const usCreated = (id, name, description) => {
    console.log("=> US CREATED : TG-" + id);
    console.log(this);
};

const usUpdated = (id, name, description) => {
    console.log("=> US UPDATED : TG-" + id);
    console.log(this);
};

const usDeleted = id => {
    console.log("=> US DELETED : TG-" + id);
    console.log(this);
};

const usStatus = (id, status) => {
    console.log("=> US STATUS FOR TG-" + id + " : " + status);
    console.log(this);
};

// Tasks

const usTaskCreated = (usId, taskId, author, subject, description, assignment) => {
    console.log("=> US TASK CREATED : TG-" + usId);
    console.log(this);
};

const usTaskUpdated = (usId, taskId, subject, description, assignment) => {
    console.log("=> US TASK UPDATED : TG-" + id);
    console.log(this);
};

const usTaskDeleted = id => {
    console.log("=> US TASK DELETED : TG-" + id);
    console.log(this);
};

const usTaskAssignment = (id, taigaUsername) => {
    console.log("=> US TASK ASSIGNMENT FOR TG-" + id + " : " + taigaUsername);
    console.log(this);
};

const usTaskStatus = (id, status) => {
    console.log("=> US TASK STATUS FOR TG-" + id + " : " + status);
    console.log(this);
};

// Comments

const usCommentCreated = (usId, commentId, author, content) => {
    console.log("=> US NEW COMMENT FOR TG-" + usId + " : " + commentId + "(from " + author + ")");
    console.log(this);
};

const usCommentUpdated = (usId, commentId, content) => {
    console.log("=> US NEW COMMENT FOR TG-" + usId + " : " + commentId);
    console.log(this);
};

const usCommentDeleted = (usId, commentId) => {
    console.log("=> US DELETED COMMENT FOR TG-" + usId + " : " + commentId);
    console.log(this);
};

const usCommentRestore = (usId, commentId) => {
    console.log("=> US RESTORED COMMENT FOR TG-" + usId + " : " + commentId);
    console.log(this);
};
