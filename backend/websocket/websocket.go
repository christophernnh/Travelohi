package websocket

import (
	"fmt"
	"sync"

	"github.com/fasthttp/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

var upgrader = websocket.FastHTTPUpgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(ctx *fasthttp.RequestCtx) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]struct{})
var clientsMutex sync.Mutex

func HandleWebSocket(ctx *fiber.Ctx) error {
	fastCtx := ctx.Context()

	err := upgrader.Upgrade(fastCtx, func(conn *websocket.Conn) {
		clientsMutex.Lock()
		clients[conn] = struct{}{}
		// numClients := len(clients)
		clientsMutex.Unlock()

		defer func() {
			clientsMutex.Lock()
			delete(clients, conn)
			clientsMutex.Unlock()
		}()

		var userDetailsJSON string

		// if numClients == 1 {
		// } else if numClients == 2 {
		// }
		fmt.Println(userDetailsJSON)
		if err := conn.WriteMessage(websocket.TextMessage, []byte(userDetailsJSON)); err != nil {
			fmt.Println("WebSocket initial message write error:", err)
			return
		}

		for {
			messageType, p, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("WebSocket read error:", err)
				return
			}

			if messageType == websocket.CloseMessage {
				return
			}

			clientsMutex.Lock()
			for client := range clients {
				if err := client.WriteMessage(messageType, p); err != nil {
					fmt.Println("WebSocket write error:", err)
					delete(clients, client)
				}
			}
			clientsMutex.Unlock()
		}
	})

	if err != nil {
		fmt.Println("WebSocket upgrade error:", err)
		return err
	}

	return nil
}
