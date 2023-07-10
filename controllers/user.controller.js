import UserModel from './../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Cookies from 'cookies';
import { multerFunction } from '../utils/muterFunc';
const nodemailer = require('nodemailer');

export const getUsers = async (req, res) => {
	try {
		const userData = await UserModel.find();
		if (userData) {
			return res.status(200).json({
				data: userData,
				message: 'Success'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const addUser = (req, res) => {
	try {
		console.log(req.body);
		const { name, email, password, contact } = req.body;
		const userData = new UserModel({
			name: name,
			email: email,
			password: password,
			contact: contact
		});
		userData.save();

		if (userData) {
			return res.status(201).json({
				data: userData,
				message: 'Successfully inserted'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const addUsers = (req, res) => {
	try {
		console.log(req.body);
		let userArr = [];
		req.body.forEach((element) => {
			const { name, email, password, contact } = element;
			const userData = new UserModel({
				name: name,
				email: email,
				password: password,
				contact: contact
			});
			userData.save();
			userArr.push(userData);
		});
		if (userArr) {
			return res.status(201).json({
				data: userArr,
				message: 'Successfully inserted'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const getUser = async (req, res) => {
	try {
		const id = req.params.id;
		const userData = await UserModel.findOne({ _id: id });
		if (userData) {
			return res.status(200).json({
				data: userData,
				message: 'Success'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteUser = await UserModel.deleteOne({ _id: id });
		console.log(deleteUser);
		if (deleteUser.acknowledged) {
			return res.status(200).json({
				message: 'Successfully deleted.'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { name, email, password, contact } = req.body;
		const updateUser = await UserModel.updateOne(
			{
				_id: id
			},
			{
				$set: {
					name: name,
					email: email,
					password: password,
					contact: contact
				}
			}
		);
		if (updateUser.acknowledged) {
			return res.status(200).json({
				message: 'Successfully updated.'
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const signUp = async (req, res) => {
	// try {
	// 	const { name, email, password, contact } = req.body;
	// 	const existUser = await UserModel.findOne({ email: email });

	// 	if (existUser) {
	// 		return res.status(200).json({
	// 			message: 'Already user exist!!'
	// 		});
	// 	}
	// 	const newPassword = await bcrypt.hash(password, 10);

	// 	const userData = new UserModel({
	// 		name: name,
	// 		email: email,
	// 		password: newPassword,
	// 		contact: contact
	// 	});
	// 	userData.save();

	// 	if (userData) {
	// 		return res.status(201).json({
	// 			data: userData,
	// 			message: 'Success'
	// 		});
	// 	}
	// } catch (error) {
	// 	return res.status(500).json({
	// 		message: error.message
	// 	});
	// }

	try {
		const uploadFile = multerFunction('./uploads/user').single('image');

		uploadFile(req, res, async function (err) {
			if (err) {
				return res.status(500).json({
					message: err.message
				});
			}

			const { name, about, contact, password, email } = req.body;

			const existUser = await UserModel.findOne({ email: email });

			if (existUser) {
				return res.status(200).json({
					message: 'Already user exist!!'
				});
			}

			const generatedPassword = await bcrypt.hash(password, 10);

			let imagename = '';
			if (req.file != undefined) {
				imagename = req.file.filename;
			}

			const userData = new UserModel({
				name: name,
				about: about,
				contact: contact,
				password: generatedPassword,
				email: email,
				image: imagename,
				role: 1,
				otp: 0
			});

			userData.save();
			if (userData) {
				return res.status(201).json({
					data: userData,
					message: 'user created successsfully'
				});
			}
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		const existUser = await UserModel.findOne({ email: email });

		if (!existUser) {
			return res.status(200).json({
				message: "User doesn't exist!!"
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

		if (!isPasswordCorrect) {
			return res.status(200).json({
				message: 'Invalid credential'
			});
		}

		// Create a cookies object

		// var cookies = new Cookies(req, res);

		// cookies.set('users', JSON.stringify(existUser));

		const token = jwt.sign(
			{ _id: existUser.id, email: existUser.email },
			process.env.TOKEN_SECRET_KEY,
			{ expiresIn: '3h' }
		);

		return res.status(200).json({
			data: existUser,
			token: token,
			message: 'login successful'
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};

export const signInWithOtp = async (req, res) => {
	try {
		const { email } = req.body;

		const existUser = await UserModel.findOne({ email: email });

		if (existUser) {
			let randomOtp = Math.floor(Math.random() * (9998 - 1002 + 1)) + 1002;

			let mailTransporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'gohildhruvchange@gmail.com',
					pass: 'noupouvy6JeKhfR'
				}
			});

			let details = {
				from: 'gohildhruvchange@gmail.com',
				to: email,
				subject: 'OTP for sign in assignment',
				text: randomOtp
			};

			mailTransporter.sendMail(details, async (err) => {
				if (err) {
					return res.status(500).json({
						message: err.message
					});
				}
				else {
					const updateUser = await UserModel.updateOne(
						{
							email: email
						},
						{
							$set: {
								otp: randomOtp
							}
						}
					);

					return res.status(200).json({
						message: `OTP sent successufully to ${email}`
					});
				}
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: err.message
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		//user will need to send his current password and email to reset the password
		const { password, email, newPassword } = req.body;

		const existUser = await UserModel.findOne({ email: email });

		if (!existUser) {
			return res.status(200).json({
				message: 'Invalid email'
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

		if (!isPasswordCorrect) {
			return res.status(200).json({
				message: 'Invalid password'
			});
		}

		const crypedPassword = await bcrypt.hash(newPassword, 10);

		const updateUser = await UserModel.updateOne(
			{
				email: email
			},
			{
				$set: {
					password: crypedPassword
				}
			}
		);
		if (updateUser.acknowledged) {
			return res.status(200).json({
				message: 'password Successfully updated.'
			});
		}
	} catch (err) {
		return res.status(500).json({
			messaage: err.message
		});
	}
};
