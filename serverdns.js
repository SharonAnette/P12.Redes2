const dgram = require('dgram'); 
const mysql = require('mysql2'); 
// Configuración de MySQL 
const db = mysql.createConnection({ 
    host: 'localhost', 
    user: 'ubuntu', 
    password: 'ubuntu', 
    database: 'dns_proxy' 
}); 
db.connect((err) => {
    if (err){
        console.error('Error al conectar a MySQL:', err); 
        return; 
    } 
    console.log('Conectado a MySQL'); 
}); 

// Crear un servidor UDP para escuchar las consultas DNS 
const server = dgram.createSocket('udp4'); 

// Función para verificar si un dominio está en la lista negra 
function isBlacklisted(domain, callback) { 
const query = 'SELECT * FROM blacklist WHERE domain = ?'; 
console.log(`Consultando la lista negra para el dominio: ${domain}`); 
db.query(query, [domain], (err, results) => { 
    if (err) { 
        console.error('Error al consultar la base de datos:', err); 
        return callback(false); 
    } 
    console.log('Resultados de la consulta:', results); 
    callback(results.length > 0); 
}); 
} 

// Función para manejar las consultas DNS 
server.on('message', (msg, rinfo) => { 
console.log('Consulta recibida:', msg); 
const domain = parseDomainFromQuery(msg); 
console.log('Dominio extraído:', domain); 

if (!domain) { 
    console.log('Consulta DNS no válida'); 
    return; 
} 

isBlacklisted(domain, (blacklisted) => { 
    if (blacklisted) { 
        console.log(`Dominio bloqueado: ${domain}`); 
        sendFakeResponse(msg, rinfo, server); 
    } else { 
        console.log(`Dominio no bloqueado: ${domain}`); 
        forwardQueryToDNS(msg, rinfo, server); 
    } 
}); 
}); 

// Función para analizar el dominio de la consulta DNS 
function parseDomainFromQuery(msg) { 
const question = msg.slice(12); 
let domain = ''; 
let i = 0; 

while (i < question.length) { 
    const len = question[i]; 
    if (len === 0) break; 
    domain += question.slice(i + 1, i + 1 + len).toString('utf8') + '.'; 
    i += len + 1; 
} 

return domain.slice(0, -1); 
} 

// Función para enviar una respuesta falsa (IP 0.0.0.0) 
function sendFakeResponse(msg, rinfo, server) { 
const response = Buffer.alloc(msg.length); 
msg.copy(response); 
response[2] = 0x81; // Respuesta con error (NXDOMAIN) 
response[3] = 0x83; 
server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => 
{ 
    if (err) console.error('Error al enviar la respuesta falsa:', err); 
}); 
} 

// Función para reenviar la consulta DNS al resolver real 
function forwardQueryToDNS(msg, rinfo, server) { 
const client = dgram.createSocket('udp4'); 
client.on('message', (response) => { 
    server.send(response, 0, response.length, rinfo.port, rinfo.address, 
(err) => { 
        if (err) console.error('Error al enviar la respuesta del DNS real:', 
err); 
    }); 
    client.close(); 
}); 

client.send(msg, 0, msg.length, 53, '8.8.8.8', (err) => { 
    if (err) console.error('Error al enviar la consulta al DNS real:', err); 
}); 
} 

// Iniciar el servidor DNS Proxy 
server.bind(53, '192.168.0.53', () => { 
console.log('Servidor DNS Proxy escuchando en el puerto 3306'); 
});

