export class SignalingDO {
  constructor(state, env) {
    this.state = state
    this.topics = new Map()
  }

  async fetch(request) {
    const upgrade = request.headers.get('Upgrade')

    if (upgrade !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 })
    }

    const [client, server] = Object.values(new WebSocketPair())
    server.accept()

    const subscribedTopics = new Set()

    server.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data)

        switch (msg.type) {
          case 'subscribe':
            for (const topic of msg.topics || []) {
              if (typeof topic !== 'string') continue
              if (!this.topics.has(topic)) this.topics.set(topic, new Set())
              this.topics.get(topic).add(server)
              subscribedTopics.add(topic)
            }
            break

          case 'unsubscribe':
            for (const topic of msg.topics || []) {
              const subs = this.topics.get(topic)
              if (subs) subs.delete(server)
              subscribedTopics.delete(topic)
            }
            break

          case 'publish':
            if (msg.topic) {
              const receivers = this.topics.get(msg.topic)
              if (receivers) {
                msg.clients = receivers.size
                const data = JSON.stringify(msg)
                for (const receiver of receivers) {
                  try { receiver.send(data) } catch { }
                }
              }
            }
            break

          case 'ping':
            server.send(JSON.stringify({ type: 'pong' }))
            break
        }
      } catch { }
    })

    server.addEventListener('close', () => {
      for (const topic of subscribedTopics) {
        const subs = this.topics.get(topic)
        if (subs) {
          subs.delete(server)
          if (subs.size === 0) this.topics.delete(topic)
        }
      }
      subscribedTopics.clear()
    })

    return new Response(null, { status: 101, webSocket: client })
  }
}

export async function onRequest(context) {
  const { request, env } = context
  const upgrade = request.headers.get('Upgrade')

  if (upgrade !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 })
  }

  const id = env.SIGNALING_DO.idFromName('signal-hub')
  const stub = env.SIGNALING_DO.get(id)

  return stub.fetch(request)
}
