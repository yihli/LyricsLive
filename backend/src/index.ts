import app from './app';
import discordBot from './discord/bot';

import env from './utils/env_setup';

discordBot.login(env.DISCORD_TOKEN);

app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
});

// scroll bar
// click pfp for a menu 
    // one option to send to spotify profile
// themes 