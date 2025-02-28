const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'postbuild.log' }),
    ],
});

async function postBuildStatic() {
    const buildDir = path.join(process.cwd(), 'build');
    const nextDir = path.join(buildDir, '_next');
    const newNextDir = path.join(buildDir, 'next');
    const destinationDir = path.resolve(__dirname, '../../ServerApp/app/src/main/assets/web');

    try {
        // Rename _next to next
        if (fs.existsSync(nextDir)) {
            logger.info(`Renaming ${nextDir} to ${newNextDir}`);
            await fs.rename(nextDir, newNextDir);
            logger.info(`Successfully renamed ${nextDir} to ${newNextDir}`);
        } else {
            logger.info(`Directory ${nextDir} does not exist. Skipping rename.`);
        }

        // Move the build directory content to the specified location
        if (fs.existsSync(buildDir)) {
            if (fs.existsSync(destinationDir)) {
                logger.info(`Moving contents of ${buildDir} to ${destinationDir}`);
                const items = await fs.readdir(buildDir);

                for (const item of items) {
                    const sourcePath = path.join(buildDir, item);
                    const destinationPath = path.join(destinationDir, item);
                    try {
                        await fs.move(sourcePath, destinationPath, { overwrite: true });
                        logger.info(`Moved ${sourcePath} to ${destinationPath}`);
                    } catch (moveErr) {
                        logger.error(`Error moving ${sourcePath} to ${destinationPath}: ${moveErr}`);
                    }
                }
                logger.info(`Successfully moved contents of ${buildDir} to ${destinationDir}`);
            } else {
                logger.error(`Destination directory ${destinationDir} does not exist. Skipping move.`);
            }
        } else {
            logger.error(`Build directory ${buildDir} does not exist. Skipping move.`);
        }

    } catch (err) {
        logger.error(`Error during post-build: ${err}`);
    }
}

postBuildStatic();