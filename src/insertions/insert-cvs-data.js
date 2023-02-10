import { createReadStream } from 'fs'
import { parse } from 'csv-parse';

const taskListPath = new URL('../../taskList.csv', import.meta.url)

export async function insertCSVData() {
  const parser = createReadStream(taskListPath).pipe(parse())

  for await (let row of parser) {
    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: row[0],
        description: row[1]
      })
    })
  }
}
