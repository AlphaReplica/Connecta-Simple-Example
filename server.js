/**
 * Simple Connecta Chat example
 * 
 * http server serves index.html, style.css and connecta-full (connecta client library from node_modules)
 * 
 * Creates new room and joins connected clients to this room
 */
const fs       = require('fs');
const http     = require('http');
const Connecta = require('connecta');

var httpsServer = http.createServer(function(request, response)
{
    if(request.url === '/')
    {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(fs.readFileSync('index.html'));
    }
    else if(request.url === '/style.css')
    {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.end(fs.readFileSync('style.css'));
    }
    else if(request.url === '/connecta.js')
    {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.end(fs.readFileSync('node_modules/connecta/lib/client/build/connecta-full.js'));
    }
}).listen(3000, '0.0.0.0');

var connecta = new Connecta.ConnectaServer(8038);

connecta.createRoom("testRoom",true,false,true,true,false);

connecta.addListener('connected',function(client)
{
    console.log("CONNECTED",client.id,connecta.peersCount());
    connecta.addClientToRoom(client.id,"testRoom");
    connecta.broadcastEventToRoom("testRoom","roomUsersCount",connecta.getRoomClientsCount("testRoom"));
});

connecta.addListener('disconnected',function(client)
{
    console.log("DISCONNECTED",client.id,connecta.peersCount());
    connecta.broadcastEventToRoom("testRoom","roomUsersCount",connecta.getRoomClientsCount("testRoom"));
});

connecta.addListener('roomCreated',function(id)
{
    console.log("ROOM CREATED",id);
});

connecta.addListener('roomDeleted',function(id)
{
    console.log("ROOM DELETED",id);
});