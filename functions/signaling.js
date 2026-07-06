const topics = new Map()

export async function onRequest(context) {
  const { request } = context
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
            if (!topics.has(topic)) topics.set(topic, new Set())
            topics.get(topic).add(server)
            subscribedTopics.add(topic)
          }
          break

        case 'unsubscribe':
          for (const topic of msg.topics || []) {
            const subs = topics.get(topic)
            if (subs) subs.delete(server)
            subscribedTopics.delete(topic)
          }
          break

        case 'publish':
          if (msg.topic) {
            const receivers = topics.get(msg.topic)
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
      const subs = topics.get(topic)
      if (subs) {
        subs.delete(server)
        if (subs.size === 0) topics.delete(topic)
      }
    }
    subscribedTopics.clear()
  })

  return new Response(null, { status: 101, webSocket: client })
}
