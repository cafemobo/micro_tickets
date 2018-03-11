// se invocan las variables necesitadas
var express    = require('express');        // se llama express
var app        = express();                 // app usando express
var bodyParser = require('body-parser');

// Soporte de HAL 
var halson = require('halson');

// configura app para usar bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Se establece puerto
var port = process.env.PORT || 9999;        

// Carga configuraciones de config.js
var config = require('./config');

// Conexión a MongoDB
var mongoose = require('mongoose');

// conexion de MongoDB a models
mongoose.connect(config.db[app.settings.env]); 

// importar models
var Ticket = require('./app/models/ticket');

// obtiene una instancia a Router express
var router = express.Router(); 

// crear/actualizar una cantidad de producto - productQuantity
router.put('/tickets/:id', function(req, res) {

    if (req.body.cliente == null) {
	res.status(400);
	res.setHeader('Content-Type', 'application/vnd.error+json');
	res.json({ message: "Es requerido nombre del cliente"});
    }  else
    {

        Ticket.findOne({ id: req.params.id, function(err, ticket) {
	    if (err) return console.error(err);

	    var created = false; // valida creado vs. actualizado
	    if (ticket == null) {
		ticket = new Ticket();
		ticket.id = req.params.id;
		created = true;
	    }

	    // establecer/actualizr onhand quantity y guardar
	    ticket.cliente = req.body.cliente;
	    ticket.save(function(err) {
		if (err) {
		    res.status(500);
		    res.setHeader('Content-Type', 'application/vnd.error+json');
		    res.json({ message: "Falla al almacenar ticket"});
		} else {
		    // returna el codigo de respuesta
		    if (created) {
			res.status(201);
		    } else {
			res.status(200);
		    }
		    
		    res.setHeader('Content-Type', 'application/hal+json');
		    
		    var resource = halson({
			id: ticket.id,
			cliente: ticket.cliente,
			created_at: ticket.created_at
		    }).addLink('self', '/tickets/'+ticket.id)
		    
		    res.send(JSON.stringify(resource));
		}
	    });
	});
    }	
});
	
router.get('/tickets/:id', function(req, res) {
    Ticket.findOne({id: req.params.id}, function(err, ticket) {
        if (err) {
	    res.status(500);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "Falla al buscar tickets"});
	} else if (ticket == null) {
	    res.status(404);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "Ticket no encontrado para el id "+req.params.product_id});
	} else {
	    res.status(200);
	    res.setHeader('Content-Type', 'application/hal+json');

	    var resource = halson({
		id: ticket.id,
		cliente: ticket.cliente,
		created_at: ticket.created_at
	    }).addLink('self', '/tickets/'+ticket.id)
	    res.send(JSON.stringify(resource));
	    
	}
    });	
});


// Registrar ruta
app.use('/', router);

// Inicia el server
app.listen(port);
console.log('Running on port ' + port);
