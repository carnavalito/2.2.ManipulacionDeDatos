let express = require('express');
const bodyParser = require('body-parser')
let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const cors = require('cors');

app.use(cors());

let sqlite3 = require('sqlite3');



function createDatabase() {
    console.log("Creando la BD");
    let db = new sqlite3.Database('./videojuego.db', (err) => {
        if (err) {
            console.log("Error: " + err);
            return false;
        } else {
            console.log("Creando Tabla Videojuegos");
            db.exec(`create table videojuego(
                id INTEGER PRIMARY KEY AUTOINCREMENT not null ,
                nombre text not null,
                genero text not null,
                lanzamiento text not null
            );
            insert into videojuego(nombre,genero,lanzamiento) values('Halo 3','Shooter','2015');
            insert into videojuego(nombre,genero,lanzamiento) values('Mario Party Deluxe','Board','2020');
            insert into videojuego(nombre,genero,lanzamiento) values('Apex Legends','Shooter','2018');
            `);
        }
    });
    db.close();
    return true;
}

app.get('/listaVideojuegos', function (req, res) {
    let db = new sqlite3.Database('./videojuego.db');
    db.all("SELECT * FROM videojuego ORDER BY lanzamiento,nombre",
        function (err, rows) {
            let videojuegos = JSON.stringify(rows);
            res.end(videojuegos);
        });
})

app.post('/agregarVideojuego', function (req, res) {
    const _nombre = req.body.nombre;
    const _genero = req.body.genero;
    const _lanzamiento = req.body.lanzamiento;

    let db = new sqlite3.Database('./videojuego.db');
    let resultado = db.run(`INSERT INTO videojuego(nombre,genero,lanzamiento) VALUES ( ?, ?, ?);`, [_nombre, _genero, _lanzamiento]);
    res.end('OK');
})

app.post('/actualizarVideojuego', function (req, res) {
    const _id = req.body.id;
    const _nombre = req.body.nombre;
    const _genero = req.body.genero;
    const _lanzamiento = req.body.lanzamiento;

    let db = new sqlite3.Database('./videojuego.db');
    let resultado = db.run(`UPDATE videojuego SET nombre = ?,
 genero = ?,lanzamiento = ? WHERE id = ?;`,
        [_nombre, _genero, _lanzamiento, _id]);
    res.end('OK');
})

app.delete('/borrarVideojuego', function (req, res) {
    const _id = req.body.id;

    let db = new sqlite3.Database('./videojuego.db');
    let resultado = db.run(`DELETE from videojuego WHERE id = ?`, [_id]);
    res.end('OK');
})

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;


    let db = new sqlite3.Database('./videojuego.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err && err.code == "SQLITE_CANTOPEN") {
            db.close();
            console.log("Iniciando la creacion de la base de datos");
            createDatabase();
            return;
        } else if (err) {
            console.log("Error: " + err);
            exit(1);
        } else {
            console.log("Despliegue de la base de datos ejecutado con exito");
        }
    });
    console.log("Servidor escuchando en http://localhost:%s", port);

})
