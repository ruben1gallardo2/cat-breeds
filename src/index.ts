import express from 'express';
import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;;

mongoose.connect(process.env.MONGODB_URI || '')
	.then(() => {
		console.log('MongoDB connected')
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
	})
	.catch((err) => console.error('MongoDB error:', err));

 
