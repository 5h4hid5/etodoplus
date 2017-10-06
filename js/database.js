var Datastore = require('nedb'),
db = new Datastore({filename: './db/todos.db', autoload: true});

exports.addTask = function (task) {
  if(task){
    db.insert(task, (err, newDoc) => {

    });
  }
};

exports.getTodos = function (fn) {
  db.find({}, (err, docs) => {
    fn(docs);
  });
};

exports.deleteTask = function(id) {
  console.log(id);
  db.remove({id: id}, {}, function(err, numRemoved) {
    console.log(err);
  });
};

exports.clearTaskList = function () {
  db.remove({}, {multi: true}, (err,n) => {
    console.log(n,'items cleared!');
  });
}
