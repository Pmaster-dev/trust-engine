/**
 * Waits for a number of milliseconds.
 *
 * @param milliseconds The number of milliseconds to wait.
 * @returns Resolves with 'done!' after the wait is over.
 */
export async function wait(milliseconds: number): Promise<string> {
  if (Number.isNaN(milliseconds)) {
    throw new Error('milliseconds is not a number')
  }

  // Fast path: avoid timer handle scheduling and event loop delay when milliseconds is <= 0
  if (milliseconds <= 0) {
    return 'done!'
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve('done!'), milliseconds)
  })
}
