const logg = require('./logger');

const requestLogger = (request, response, next) => {
    logg.info('Method:', request.method);
    logg.info('Path:  ', request.path);
    logg.info('Body:  ', request.body);
    logg.info('---');
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}