import consola from 'consola'
import env from 'std-env'
import chalk from 'chalk'
import { successBox } from './formatting'
import { getFormattedMemoryUsage } from './memory'

export function showBanner(nuxt, showMemoryUsage = true) {
  if (env.test) {
    return
  }

  if (env.minimalCLI) {
    for (const listener of nuxt.server.listeners) {
      consola.info('Listening on: ' + listener.url)
    }
    return
  }

  const titleLines = []
  const messageLines = []

  // Name and version
  titleLines.push(`${chalk.green.bold('Nuxt.js')} ${nuxt.constructor.version}`)

  // Running mode
  titleLines.push(`Running in ${nuxt.options.dev ? chalk.bold.blue('development') : chalk.bold.green('production')} mode (${chalk.bold(nuxt.options.mode)})`)

  if (nuxt.options._typescript && nuxt.options._typescript.runtime) {
    titleLines.push(`TypeScript support is ${chalk.green.bold('enabled')}`)
  }

  if (showMemoryUsage) {
    titleLines.push(getFormattedMemoryUsage())
  }

  // Listeners
  for (const listener of nuxt.server.listeners) {
    messageLines.push(chalk.bold('Listening on: ') + chalk.underline.blue(listener.url))
  }

  // Add custom badge messages
  if (nuxt.options.cli.badgeMessages.length) {
    messageLines.push('', ...nuxt.options.cli.badgeMessages)
  }

  process.stdout.write(successBox(messageLines.join('\n'), titleLines.join('\n')))
}

export function showWorkerBanner(options, listener) {
  if (env.test) {
    return
  }

  if (env.minimalCLI) {
    consola.info('Listening on: ' + listener.url)
    return
  }

  const titleLines = []
  const messageLines = []

  // Name and version
  titleLines.push(`${chalk.green.bold('Nuxt.js')}`)

  // Running mode
  titleLines.push(`Running in ${options.dev ? chalk.bold.blue('development') : chalk.bold.green('production')} mode (${chalk.bold(options.mode || 'universal')})`)
  titleLines.push(chalk.yellow('Using experimental workers'))

  // Listener
  messageLines.push(chalk.bold('Listening on: ') + chalk.underline.blue(listener.url))

  process.stdout.write(successBox(messageLines.join('\n'), titleLines.join('\n')))
}
