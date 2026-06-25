import app from "./app.js";
import { dbConnection } from "./config/db.config.js";
import envConfig from "./config/env.config.js";

dbConnection().then(() => {
    app.listen(envConfig.PORT, () => {
        console.log(`✅ Server running http://localhost:${envConfig.PORT}`);
        console.log(`✅ Server running on port ${envConfig.PORT}`);
    });
}).catch((error) => {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
})
