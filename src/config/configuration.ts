export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        name: process.env.DATABASE_NAME || 'base_visu',
    },
    jwt: process.env.JWT_SECRET,
    salt: parseInt(process.env.SALT) || 10,
});
