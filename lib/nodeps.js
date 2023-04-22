const net = require('net');

module.exports = nodePS = (host, ports) => {

  return new Promise((resolve, reject) => {  
    const allPorts = Array.from({length: 65535}, (_, i) => i + 1);
  
    const connectToPort = (host, port, callback) => {
      if (!Number.isInteger(port)) reject({ 'error' : 'port must be an integer' });
      if (port < 1 || port > 65535) reject({ 'error' : 'port must be in range [1-65535]' });
      
      let socket = new net.Socket();
      let timeout = 200;
      socket._scan = {};
      socket._scan.status = 'initialized';
      socket._scan.host = host;
      socket._scan.port = port;
      socket._scan._events = { complete : callback };
      
      socket.on('connect', function () {
        this._scan.status = 'connect';
        socket.destroy();
      });
      socket.on('timeout', function () {
        this._scan.status = 'timeout';
        socket.destroy();
      });
      socket.on('error', function (exception) {
        this._scan.status = 'error';
        socket.destroy();
      });
      socket.on('close', function (exception) {
        this._scan._events.complete(this._scan);
      });
      
      socket.setTimeout(timeout);
      socket.connect(port, host);
      
    };
  
    const connectToPorts = (host, ports, scanResults) => {
      
      let port = ports.shift();
      
      connectToPort(host, port, function (result) {
        
        if (result.status == 'connect') {
          scanResults.ports.open.push(result.port);
        } 
        else {
          scanResults.ports.closed.push(result.port);
        }
        
        if (ports.length) {
          connectToPorts(host, ports, scanResults);
        }

        else {
          resolve(scanResults);
        }
        
      });
      
    };
    
    if (host == undefined || !host) reject({ 'error' : 'host is required' });
    if (ports == undefined || !ports) reject({ 'error' : 'ports is required' });
    if (!Array.isArray(ports)) reject({ 'error' : 'ports must be an array' });

    let scanResults = { 'host' : host, 'ports' : { 'open' : [], 'closed' : [] } };
  
    if (!ports.length) ports = allPorts;
    
    connectToPorts(host, ports, scanResults);
  
  });
  
};