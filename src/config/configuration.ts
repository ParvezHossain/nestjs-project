const productionConfig = () => ({
    port: parseInt(process.env.PROD_PORT, 10) || 3000,
    database: {
        host: process.env.PROD_DATABASE_HOST || 'localhost',
        port: parseInt(process.env.PROD_DATABASE_PORT, 10) || 3306,
        user: process.env.PROD_DATABASE_USER || 'root',
        password: process.env.PROD_DATABASE_PASSWORD || '',
        name: process.env.PROD_DATABASE_NAME || 'base_visu',
    },
    jwt: process.env.PROD_JWT_SECRET,
    salt: parseInt(process.env.PROD_SALT) || 10,
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL),
        limit: parseInt(process.env.THROTTLE_LIMIT),
    },
});

const developmentConfig = () => ({
    port: parseInt(process.env.DEV_PORT, 10) || 5000,
    database: {
        host: process.env.DEV_DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DEV_DATABASE_PORT, 10) || 3306,
        user: process.env.DEV_DATABASE_USER || 'root',
        password: process.env.DEV_DATABASE_PASSWORD || '',
        name: process.env.DEV_DATABASE_NAME || 'base_visu',
    },
    jwt: process.env.DEV_JWT_SECRET,
    salt: parseInt(process.env.DEV_SALT) || 10,
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL),
        limit: parseInt(process.env.THROTTLE_LIMIT),
    },
});

export { productionConfig, developmentConfig };
