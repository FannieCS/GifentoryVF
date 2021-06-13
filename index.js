var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

var sqlite3 = require('sqlite3');
sqlite3.verbose();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var db = new sqlite3.Database(__dirname + '/gifs.db3');
const param = {plusRecent : "added DESC",
              plusAncien : "added",
              plusUtilise : "clicks DESC",
              moinsUtilise : "clicks",
              usageRecent : "lastUse DESC",
              usageAncien : "lastUse"}

var affichage = {tri : "click DESC",
                affiche : "liste"}
//gif(id INT, link TEXT, tag TEXT, added INT, lastUse INT)


/* Change affichage */
app.get('/tri-affich-get', function(req, res) {
    affichage.tri = param[req.query.tri];
    affichage.affiche = req.query.affichage;
    res.redirect('/galerie.html');
  
});

/* Applique le tri et affichage */
app.post('/tri-affich', function(req, res) {
  if (affichage.affiche == 'liste') {
    db.all("SELECT link, tag, lastUse, added, clicks FROM gif ORDER BY " + affichage.tri + " LIMIT 24", function(err, rows) {
      res.json(rows);
  });
  }
  else {
    db.all("SELECT link FROM gif ORDER BY " + affichage.tri + " LIMIT 24", function(err, rows) {
      res.json(rows);
    });
  }
});


/* Trouve les derniers gifs utilisés */
app.get('/utilises', function (req, res) {
  db.all("SELECT link FROM gif ORDER BY lastUse DESC LIMIT 6", function(err, rows) {
    res.json(rows);
  });
});

/* Trouve les derniers gifs ajoutés */
app.get('/added', function (req, res) {
  db.all("SELECT link FROM gif ORDER BY added DESC LIMIT 6", function(err, rows) {
    res.json(rows);
  });
});

/* Trouve les gifs les plus utilisés */
app.get('/most', function (req, res) {
  db.all("SELECT link FROM gif ORDER BY clicks DESC LIMIT 6", function(err, rows) {
    res.json(rows);
  });
});


/* Ajouter de nouveaux gifs */
app.get('/add', function (req, res) {
  //This is a "fool-proof" solution to secure the databases but it won't hold against people with some knowledge in web developpement
  if (req.query.pwd == "JEVEUXPASSECURISERCEPOC") {
    var link = req.query.link.toString();
    var tag = req.query.tag.toString();
    var time = Date.now();
    var id = 1;
    db.all("SELECT id FROM gif ORDER BY id DESC LIMIT 1", function(err, rows) {
      id += rows.id;
      var sql = 'INSERT INTO gif VALUES(' + id + ', "' + link + '", "' + tag + '", ' + time + ', ' + time + ', 0)';
      db.run(sql);
    });
    
    res.redirect("/ajouter.html")
  }
});

/* Mettre à jour la base de donnée (lastUse et clicks) */
app.post('/copy', function (req, res) {
  db.run("UPDATE gif SET lastUse=" + Date.now() + " WHERE link=" + '"' + req.body.src + '"');
  
  var clicks=0;
  db.all('SELECT clicks FROM gif WHERE link="' + req.body.src + '"', function(err, rows) {
      clicks = rows[0].clicks + 1;
      db.run("UPDATE gif SET clicks=" + clicks + " WHERE link=" + '"' + req.body.src + '"');
    });
  res.redirect("/index.html");
});



app.get('/*', function(req, res) {
  if(req.url == "/") {
    res.sendFile(__dirname + '/index.html');
  }
  else {
    res.sendFile(__dirname + req.url);
  }
});
 
 
app.listen(8000); //commence à accepter les requêtes
console.log("App listening on port 8000...");