import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
        this.ws = ws;
        this.initHandlers()
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            // console.log(data)
            const parsedData = JSON.parse(data.toString());
            switch (parsedData.type) {
                case "join":
                    const token = parsedData.payload.token;
                    const spaceId = parsedData.payload.spaceId;
                    if (!token) {
                        console.log('return')
                        return;
                    }

                    const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId
                    if (!userId) {
                        this.ws.close()
                        return
                    }
                    this.id = userId;
                    console.log("join" + this.id?.slice(this.id.length - 2));
                    // console.log("jouin receiverdfd 2")
                    this.userId = userId
                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId
                        }
                    })
                    // console.log("jouin receiverdfd 3")
                    if (!space) {
                        this.ws.close()
                        return;
                    }
                    // console.log("jouin receiverdfd 4")
                    this.spaceId = spaceId
                    RoomManager.getInstance().addUser(spaceId, this);
                    this.x = Math.floor(Math.random() * space?.width);
                    this.y = Math.floor(Math.random() * (space?.height ?? 20));
                    const otherUsers = RoomManager.getInstance().rooms.get(spaceId)
                        ?.filter(x => x.id !== this.id)
                        ?.map((u) => ({
                            id: u.id,
                            x: u.x,
                            y: u.y
                        })) ?? [];
                    this.send({
                        type: "space-joined",
                        payload: {
                            userId: this.userId,
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: otherUsers
                        }
                    });
                    // console.log("jouin receiverdf5")
                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!);
                    break;
                case "move":
                    console.log("move" + this.id?.slice(this.id.length - 2));

                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    if ((xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)) {
                        this.x = moveX;
                        this.y = moveY;
                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y,
                                userId: this.userId
                            }
                        }, this, this.spaceId!);
                        return;
                    }

                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                    });

            }
        });
    }

    destroy() {
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            }
        }, this, this.spaceId!);
        RoomManager.getInstance().removeUser(this, this.spaceId!);
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
}