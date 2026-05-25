import { app } from "./app";
import { PORT } from "./config/config";

const startedAt = `🕒 Started at ${new Date().toLocaleTimeString()}`;

app.listen(PORT, () => {
    console.log(`
╭─────────────────────────────────────────╮
│  🚀 Server started successfully         │
│  📡 Listening on http://localhost:${PORT}  │
│  ${startedAt.padEnd(39)}│
╰─────────────────────────────────────────╯
  `);
});
