import * as core from '@actions/core'
import { NatsConnection, StringCodec, connect, jwtAuthenticator } from 'nats'

export async function connectToMQ({
  urls: natsUrls,
  jwt,
  nKeySeed
}: {
  urls: string
  jwt: string
  nKeySeed: string
}): Promise<NatsConnection> {
  const urls = natsUrls?.split(',') ?? []
  const servers = urls.map(s => s.trim())

  const natsConn = await connect({
    servers,
    authenticator: jwtAuthenticator(jwt, new TextEncoder().encode(nKeySeed))
  })
  core.debug(`NATS connected to ${natsConn.info?.server_name}`)
  return natsConn
}

/**
 * @param {import("nats").NatsConnection} nc
 * @param {string} subject
 * @param {string} message
 */
export function publishMessage(
  nc: NatsConnection,
  subject: string,
  message: string
): void {
  nc.publish(subject, StringCodec().encode(message))
}
