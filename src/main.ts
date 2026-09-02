import * as core from '@actions/core'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    // Only log debug info if runner debug is enabled to avoid unnecessary
    // string interpolations and Date object allocations in standard workflow runs
    if (core.isDebug()) {
      core.debug(`Waiting ${ms} milliseconds ...`)
      core.debug(new Date().toTimeString())
    }

    await wait(parseInt(ms, 10))

    if (core.isDebug()) {
      core.debug(new Date().toTimeString())
    }

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
