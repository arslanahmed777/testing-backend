const express = require("express");
const app = express();
const { Client } = require('whatsapp-web.js');
const port = 5000;
const chromium = require('chrome-aws-lambda');
app.use(express.urlencoded({ extended: false }));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to a basic express App again");
});

// Mock API
const browser = await chromium.puppeteer.launch({
  args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: true,
  ignoreHTTPSErrors: true,
})
app.get("/users", (req, res) => {
  const client = new Client({
    puppeteer: {
      args: ['--no-sandbox'],
    }
  });
  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    res.json([
      { name: "William", location: qr },
      { name: "Chris", location: "Vegas" }
    ]);
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize();

});

app.post("/user", (req, res) => {
  const { name, location } = req.body;

  res.send({ status: "User created", name, location });
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is boomings on port 5000 
Visit http://localhost:5000`);
});
