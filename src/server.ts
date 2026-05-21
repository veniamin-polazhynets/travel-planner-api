import { app } from "./app";
import { PORT } from "./config/config";

app.listen(PORT, () => {
    console.log(`
╭─────────────────────────────────────────╮
│  🚀 Server started successfully         │
│  📡 Listening on http://localhost:${PORT}  │
│  🕒 Started at ${new Date().toLocaleTimeString()}               │
╰─────────────────────────────────────────╯
  `);
});
