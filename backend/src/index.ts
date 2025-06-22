import app from './app';

import { PORT } from './utils/env_setup';

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});