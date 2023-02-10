import { Database } from './middlewares/database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (title && description) {
        database.insert('tasks', {
          id: randomUUID(),
          title,
          description,
          created_at: new Date(),
          updated_at: new Date(),
          completed_at: null
        })

        return res.writeHead(201).end()
      } else {
        return res.writeHead(400).end()
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const requestBodyParams = {
        title,
        description
      }

      if (database.checkIfIdExists('tasks', id)) {
        /* ALL OF THE FOLLOWING HAVE THE SAME RESULT */

        // const nonEmptyfields = {}

        // for (let property in requestBodyParams) {
        //   if(requestBodyParams[property]) {
        //     nonEmptyfields[property] = requestBodyParams[property]
        //   }
        // }

        // const nonEmptyfields = Object.keys(requestBodyParams).reduce(
        //   (acc, key) => {
        //     if (requestBodyParams[key]) {
        //       return { ...acc, [key]: requestBodyParams[key] }
        //     } else {
        //       return acc
        //     }
        //   }, {}
        // )

        const nonEmptyfields = Object.keys(requestBodyParams).reduce(
          (acc, key) => (
            requestBodyParams[key] ? { ...acc, [key]: requestBodyParams[key] } : acc
          ), {}
        )

        if (Object.keys(nonEmptyfields).length > 0) {
          database.update('tasks', id, {
            ...nonEmptyfields,
            updated_at: new Date()
          })

          return res.writeHead(204).end()
        } else {
          return res.writeHead(400).end()
        }
      } else {
        return res.writeHead(404).end(JSON.stringify('No data found'))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.checkIfIdExists('tasks', id)) {
        database.delete('tasks', id)

        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end(JSON.stringify('No data found'))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.checkIfIdExists('tasks', id)) {
        database.patch('tasks', id, new Date())

        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end(JSON.stringify('No data found'))
      }
    }
  }
]