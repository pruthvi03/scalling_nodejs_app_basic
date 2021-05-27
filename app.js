const express = require('express');
const app = express();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


app.get('/', (req, res) => {
    for (let i = 0; i < 1e8; i++) {
        //  do something lengthy task
    }
    res.send(`From Worker: ${process.pid} => ok`);
    // Every time we create get request
    // Below command will kill cureent worker listening request
    // cluster.worker.kill();
})

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // after killing One worker we are creating another
        cluster.fork();
    });
} else {
    app.listen(3000, () =>
        console.log(`server ${process.pid} is running on 3000`)
    );
}

// app.listen(3000, () =>
//     console.log(`server is running on 3000`)
// );

// npm i -g loadtest
// run the server and execute below cmd
// loadtest -n 1000 -c 100 http://localhost:3000/