const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4002;

const { phoneNumberFormatter } = require('./helpers/formatter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Client, LocalAuth } = require('whatsapp-lerian');
const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	},
	webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2332.15.html'
  },
});

client.on('qr', qr => {
	qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
	console.log('Client is ready!');
});

client.on('disconnected', (reason) => {
	client.initialize();
})

client.initialize();

app.get('/', (req, res) => {
	return res.send('Whatsapp BOT Ready 🇮🇩');
})

app.post('/send', (req, res) => {
	try {
		const state = client.getState();
		const statePromise = new Promise((resolve, reject) => {
			resolve(state);
		});
		statePromise.then(async (value) => {
			if (value === 'CONNECTED') {
				let target = req.body.target;
				let data = {
					name: req.body.name,
					school: req.body.school,
					whatsapp: req.body.whatsapp
				}
				let message = `*Data terbaru dari Website LP3I!*\nKami dengan senang hati menginformasikan bahwa data terbaru telah tersedia di website kami:\n\n*Nama lengkap:* ${data.name}\n*Asal sekolah:* ${data.school}\n*Whatsapp:* ${data.whatsapp}\n\nMohon maaf jika pesan ini terkesan otomatis, namun kami ingin memastikan informasi ini tersampaikan dengan tepat dan cepat kepada Anda.\nTerima kasih.`;
				client.sendMessage(target, message);
				let feedback = `Halo ${data.name}!\nTerima kasih telah mengisi data, kami senang bisa berkomunikasi dengan Anda. Kami adalah Panitia PMB Politeknik LP3I Kampus Tasikmalaya. Ada yang bisa kami bantu?`;
				let phone = phoneNumberFormatter(data.whatsapp);
				client.sendMessage(phone, feedback);
				return res.json({
					status: true
				})
			} else {
				console.log(false)
				return res.json({
					status: false
				})
			}
		})
			.catch((error) => {
				console.log(error);
				return res.json({
					status: false
				})
			})
	} catch (error) {
		console.log(error);
		return res.json({
			status: false
		})
	}
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
})