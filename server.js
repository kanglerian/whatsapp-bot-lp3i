const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 4002;

const { phoneNumberFormatter, phoneNumberWithoutSuffix } = require('./helpers/formatter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	},
});

client.on('qr', qr => {
	qrcode.generate(qr, { small: true });
});

client.on('message', async (msg) => {
	if (msg.body == 'resetpass') {
		setTimeout(() => {
			client.sendMessage(msg.from, 'Mohon ditunggu untuk pelayanan reset kata sandi dari kami.');
		}, 2000);
		setTimeout(() => {
			resetPassword(phoneNumberWithoutSuffix(msg.from))
				.then((response) => {
					const message = `Password anda telah berhasil direset!\n------\nEmail: ${response.email}\nNo.Whatsapp: ${response.phone}\n------\nPassword anda telah berhasil direset, silahkan login dengan kata sandi Nomor Whatsapp anda. Jangan lupa untuk ganti kata sandi!\n\n@lp3i.tasik\n\nPoliteknik LP3I Kampus Tasikmalaya\nJl. Ir. H. Juanda No.106, Panglayungan, Kec. Cipedes Kota Tasikmalaya, Jawa Barat 46151`
					client.sendMessage(msg.from, message);
				})
				.catch((error) => {
					console.log(error.response);
					if (error.response.status == '404') {
						client.sendMessage(msg.from, error.response.data.message);
					}
				});
		}, 10000);
	}

	if (msg.body == 'confirmregistration') {
		setTimeout(() => {
			getApplicant(phoneNumberWithoutSuffix(msg.from))
				.then((response) => {
					if (response.finish) {
						const messagePresenter = `Konfirmasi Pendaftaran!\n------\nUUID: ${response.applicant.identity}\nNIK: ${response.applicant.nik}\nNama lengkap: ${response.applicant.name}\nEmail: ${response.applicant.email}\nNo.Whatsapp: ${response.applicant.phone}\nAsal Sekolah: ${response.applicant.school}\nKelas: ${response.applicant.major}/${response.applicant.class}/${response.applicant.year}\n------\nSilahkan untuk segera Follow Up!\n\n@lp3i.tasik\n\nPoliteknik LP3I Kampus Tasikmalaya\nJl. Ir. H. Juanda No.106, Panglayungan, Kec. Cipedes Kota Tasikmalaya, Jawa Barat 46151`
						const message = `Konfirmasi Pendaftaran Berhasil!\n------\nID: ${response.applicant.identity}\nNIK: ${response.applicant.nik}\nNama lengkap: ${response.applicant.name}\nEmail: ${response.applicant.email}\nNo.Whatsapp: ${response.applicant.phone}\nAsal Sekolah: ${response.applicant.school}\nKelas: ${response.applicant.major}/${response.applicant.class}/${response.applicant.year}\n------\nSilahkan untuk menunggu follow up dari kak ${response.applicant.presenter}!\n\n@lp3i.tasik\n\nPoliteknik LP3I Kampus Tasikmalaya\nJl. Ir. H. Juanda No.106, Panglayungan, Kec. Cipedes Kota Tasikmalaya, Jawa Barat 46151`
						client.sendMessage(phoneNumberFormatter(response.applicant.no_presenter), messagePresenter);
						client.sendMessage(msg.from, message);
					} else {
						const message = `Mohon maaf data yang anda kirim belum lengkap!`
						client.sendMessage(msg.from, message);
					}
				})
				.catch((error) => {
					console.log(error.response);
					if (error.response.status == '404') {
						client.sendMessage(msg.from, error.response.data.message);
					}
				});
		}, 3000);
	}
});

client.on('ready', () => {
	console.log('Client is ready!');
});

client.on('disconnected', (reason) => {
	client.initialize();
})

client.initialize();

const resetPassword = async (phone) => {
	try {
		const responseData = await axios.post(`http://localhost:8000/api/auth/beasiswappo/forgot-password`, {
			phone: phone
		});
		return responseData.data;
	} catch (error) {
		throw error;
	}
}

const getApplicant = async (phone) => {
	try {
		const responseData = await axios.post(`http://localhost:8000/api/beasiswappo/profile/presenter`, {
			phone: phone
		});
		return responseData.data;
	} catch (error) {
		throw error;
	}
}

app.get('/', (req, res) => {
	return res.send('Whatsapp BOT LP3I Ready 🇮🇩');
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
				let message = req.body.message;
				client.sendMessage(target, message);
				let feedback = req.body.feedback;
				let phone = phoneNumberFormatter(data.whatsapp);
				client.sendMessage(phone, feedback);
				return res.json({
					status: true
				})
			} else {
				return res.json({
					status: false
				})
			}
		})
			.catch((error) => {
				return res.json({
					status: false
				})
			})
	} catch (error) {
		return res.json({
			status: false
		})
	}
});

app.post('/send-general', (req, res) => {
	try {
		const state = client.getState();
		const statePromise = new Promise((resolve, reject) => {
			resolve(state);
		});
		statePromise.then(async (value) => {
			if (value === 'CONNECTED') {
				let target = phoneNumberFormatter(req.body.target);
				let message = req.body.message;
				client.sendMessage(target, message);
				return res.json({
					status: true
				})
			} else {
				return res.json({
					status: false
				})
			}
		})
			.catch((error) => {
				return res.json({
					status: false
				})
			})
	} catch (error) {
		return res.json({
			status: false
		})
	}
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
})