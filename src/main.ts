import * as core from '@actions/core'
import { connectToMQ, publishMessage } from './nats'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const subject = core.getInput('subject')
    const message = core.getInput('message')
    const urls = core.getInput('urls')
    const jwt = core.getInput('jwt')
    const nKeySeed = core.getInput('nKeySeed')

    const nc = await connectToMQ({ urls, jwt, nKeySeed })

    publishMessage(nc, subject, message)

    await nc.close()

    core.setOutput('published', `subject: ${subject}, message: ${message}`)
    // check if the close was OK
    const err = await nc.closed()
    if (err) {
      core.debug(`error closing:
${err.message}`)
      core.setFailed(err.message)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
