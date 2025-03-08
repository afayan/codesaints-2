import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

let audiostream = [];

io.on("connection", (socket) => {
    console.log("client connected");

    let process

    socket.on("audio-stream", async () => {
        try {

            console.log("starting...");
            

            process = spawn("C:\\college work\\coding\\botwebsite\\backend2\\.hackscript6env\\Scripts\\python.exe", 
                ["-u", "app.py"],  
                { cwd: 'C:\\college work\\coding\\botwebsite\\Backend2' }
            );
            // console.log(process);
            

            process.stdout.on("data", (data) => {
                console.log(data.toString());
                
                socket.emit("data", data.toString()); 
            });

            process.on("close", (code) => {
                console.log(`Python process exited with code ${code}`);
                // if (code !== 0) {
                //     console.log("Restarting Python process...");
                //     setTimeout(() => socket.emit("audio-stream"), 2000);
                // }
            });

            process.on("error", (err) => {
                console.error(`Failed to start/communicate with Python process: ${err.message}`);
                socket.emit("error", `Process error: ${err.message}`);
            });


        }catch(err){
            console.log(err);
            
        }
    });

    socket.on("stop-recording", () => {
        console.log("done");

        if (audiostream.length > 0) {
            const finalAudio = Buffer.concat(audiostream); // This should now work correctly
            console.log("Final audio buffer:", finalAudio);
        }

        if (process) {
            process.kill();
            console.log("Python process terminated");
          }

        audiostream = [];
    });

    socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (process) {
      process.kill();
      console.log("Python process terminated");
    }
  });
});

server.listen(9000, () => {
    console.log("app is listening on 9000");
});
