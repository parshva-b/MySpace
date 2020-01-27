const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = ( error, request, response, next ) => {
	console.log(error)

	if( error.name === 'CastError' && error.kind === 'ObjectId' ) {
		return response.status(400).send({
			error: 'Malformatted id: Resend request'
		})
	}
	if( error.name === 'TypeError') {
		return response.status(400).send({
			error: 'No such user found'
		})
	}

	next(error)
}

module.exports = {
    unknownEndpoint,
    errorHandler
}