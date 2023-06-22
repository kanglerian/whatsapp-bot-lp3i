const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 443;

const options = {
  key: fs.readFileSync('./key.key'),
  cert: fs.readFileSync('./cert.crt')
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	}
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});

client.initialize();

const server = https.createServer(app);

app.get('/', (req,res) => {
	res.send('Whatsapp BOT');
})

app.post('/send', (req, res) => {
	try {
		const state = client.getState();
		const statePromise = new Promise((resolve, reject) => {
			resolve(state);
		});
		statePromise.then( async (value) => {
			if(value === 'CONNECTED'){
				let target = '6287861604530@c.us';
				let data = {
					name: req.body.name,
					whatsapp: req.body.whatsapp
				}
				let message = `*Data terbaru dari Website LP3I!*\nKami dengan senang hati menginformasikan bahwa data terbaru telah tersedia di website kami:\n\n*Nama lengkap:* ${data.name}\n*Whatsapp:* ${data.whatsapp}\n\nMohon maaf jika pesan ini terkesan otomatis, namun kami ingin memastikan informasi ini tersampaikan dengan tepat dan cepat kepada Anda.\nTerima kasih.`
				client.sendMessage(target, message);
				return res.json({
					status: true
				})
			}else{
				console.log(false)
				return res.json({
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error);
		})
	} catch (error) {
		console.log(error);
	}
})

server.listen(port, () => {
	console.log(`http://localhost:${port}`);
})