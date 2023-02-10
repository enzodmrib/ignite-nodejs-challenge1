export async function json(req, res) {
  const buffers = []

  //Buffers are the request body data, but in a diferent data format, which leads to better performance

  for await (const chunk of req) {
    //chunks have the type Buffer, therefore can be added to a new one as an array
    buffers.push(chunk)
  }

  try {
    // Upon transforming the buffers in a string, the original data comes up, on a string format
    req.body = JSON.parse(Buffer.concat(buffers).toString())

  } catch {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
}