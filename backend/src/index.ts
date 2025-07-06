import app from './app';

import { PORT } from './utils/env_setup';

// REDIS

import { createClient } from 'redis';

const client = createClient({
    url: 'redis://redis:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect().then(() => {
    console.log('Connected to redis');
});

// REDIS

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});