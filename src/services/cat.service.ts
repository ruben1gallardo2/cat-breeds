import fetch from "node-fetch";
import { Breed, CatBreeds } from "../models/breeds.model";
import dotenv from "dotenv"

dotenv.config();

const headers = {
	'Content-Type': 'application/json',
	'x-api-key': process.env.API_KEY || '',
};

export const fetchCatBreeds = async () => {
	const response = await fetch("https://api.thecatapi.com/v1/breeds", {
		method: 'GET',
		headers,
	})

	const data = await response?.json();
	if (!response.ok) {
		throw new Error(`Failed to fetch cat breeds: ${response.statusText}`);
	}
	return data;
}

export const fetchCatBreedById = async (id: string): Promise<Breed | null> => {
	const response = await fetch(`https://api.thecatapi.com/v1/breeds/${id}`, {
		method: 'GET',
		headers,
	});

	const data = (await response.json()) as Breed;
	if (!response.ok) {
		throw new Error(`Failed to fetch cat breeds by id: ${response.statusText}`);
	}
	return data;
}

export const fetchCatbreedBySearch = async (search: any): Promise<any> => {
	const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(search)}`, {
		method: 'GET',
		headers,
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(`Failed to fetch cat breeds by id: ${response.statusText}`);
	}
	return data;
}
