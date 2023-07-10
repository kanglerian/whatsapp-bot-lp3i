const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4002;

const { Pengaduan } = require('./models');

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
	console.log(message);
});

client.on('disconnected', (reason) => {
	client.initialize();
})

client.initialize();

app.get('/', (req,res) => {
	return res.send('Whatsapp BOT Ready 3 🇮🇩');
})

app.post('/send', (req, res) => {
	try {
		const state = client.getState();
		const statePromise = new Promise((resolve, reject) => {
			resolve(state);
		});
		statePromise.then( async (value) => {
			if(value === 'CONNECTED'){
				let target = req.body.target;
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
});

app.get('/report', async (req, res) => {
	try {
		const pengaduan = await Pengaduan.findAll();
		return res.status(200).json(pengaduan);
	} catch (error) {
		console.log(error);
	}
});

app.post('/report', (req, res) => {
	try {
		const state = client.getState();
		const statePromise = new Promise((resolve, reject) => {
			resolve(state);
		});
		statePromise.then( async (value) => {
			if(value === 'CONNECTED'){
				let target = req.body.target;
				let title = req.body.title;
				let division = req.body.division;
				let message = req.body.message;
				let messageSend = req.body.messageSend;
				client.sendMessage(target, messageSend);
				let data = {
					title: title,
					division: division,
					message: message
				}
				await Pengaduan.create(data);
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
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
})