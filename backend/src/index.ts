import app from './app';
import discordBot from './discord/bot';

import { DISCORD_TOKEN, PORT } from './utils/env_setup';

discordBot.login(DISCORD_TOKEN);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});