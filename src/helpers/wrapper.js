module.exports = {
  response: (response, status, message, data, pagination) => {
    const result = {
      status: status || 200,
      message,
      data,
      pagination
    }

    return response.status(result.status).json(result)
  }
}
