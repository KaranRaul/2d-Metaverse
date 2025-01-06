import React, { useEffect, useRef, useState } from 'react';
import { getSpaceBySpaceId } from '../api/space';

interface Space {
    dimesions: string,
    elements: {
        id: string,
        element: {
            id: string,
            imageUrl: string,
            widht: number,
            height: number,
            static: boolean
        },
        x: number,
        y: number
    }[]
}

const Game = () => {
    const canvasRef = useRef<any>(null);
    const wsRef = useRef<any>(null);
    const containerRef = useRef<any>(null);
    const SCALE_SIZE = 10;
    const USER_SIZE = 5;
    const [space, setSpace] = useState<Space | null>();
    const [currentUser, setCurrentUser] = useState<any>(null);  // Initialize as null
    const [users, setUsers] = useState(new Map());
    const [canvasDimesions, setCanvasDimesions] = useState({ width: 1000, height: 1000 })
    const [isConnected, setIsConnected] = useState(false);  // Add connection state
    const [params, setParams] = useState({ token: '', spaceId: '' });


    const userColors = [
        '#4ECDC4', // Turquoise
        '#FF6B6B', // Coral
        '#95E1D3', // Mint
        '#FCE38A', // Yellow
        '#EAFFD0', // Light Green
        '#F38181', // Pink
        '#A8E6CF', // Seafoam
        '#FFD3B6', // Peach
        '#AA96DA', // Purple
        '#FF9A9E'  // Salmon
    ];

    const getUserColor = (userId: string) => {
        const colorIndex = parseInt(userId, 36) % userColors.length;
        return userColors[colorIndex];
    };
    // Initialize WebSocket connection and handle URL params

    const getSpace = async (spaceId: string) => {
        const currentSpace = await getSpaceBySpaceId(spaceId);
        console.log(currentSpace);
        setSpace(currentSpace)
    }
    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = localStorage.getItem('authToken') || "";
        const spaceId = urlParams.get('spaceId') || 'cm4vkip900016vmh4b4iqyazr';
        setCanvasDimesions({ width: parseInt(urlParams.get('width') ?? "50") * 20, height: parseInt(urlParams.get('height') ?? "50") * 20 });
        setParams({ token, spaceId });
        getSpace(spaceId);


        const connectWebSocket = () => {
            wsRef.current = new WebSocket('ws://localhost:3001');

            wsRef.current.onopen = () => {
                setIsConnected(true);
                wsRef.current.send(JSON.stringify({
                    type: 'join',
                    payload: {
                        spaceId,
                        token
                    }
                }));
            };

            wsRef.current.onclose = () => {
                setIsConnected(false);
                // Attempt to reconnect after a delay
                setTimeout(connectWebSocket, 3000);
            };

            wsRef.current.onerror = (error: any) => {
                console.error('WebSocket error:', error);
                wsRef.current?.close();
            };

            wsRef.current.onmessage = (event: any) => {
                const message = JSON.parse(event.data);
                handleWebSocketMessage(message);
            };
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleWebSocketMessage = (message: any) => {
        switch (message.type) {
            case 'space-joined':
                const newUser = {
                    x: message.payload.spawn.x,
                    y: message.payload.spawn.y,
                    userId: message.payload.userId
                };
                setCurrentUser(newUser);

                // Initialize other users
                const userMap = new Map();
                message.payload.users.forEach((user: any) => {
                    if (user.id !== newUser.userId) {  // Don't add current user to others list
                        userMap.set(user.id, {
                            x: user.x || 0,
                            y: user.y || 0,
                            userId: user.id
                        });
                    }
                });
                setUsers(userMap);
                break;

            case 'user-joined':
                if (message.payload.userId !== currentUser?.userId) {
                    setUsers(prev => {
                        const newUsers = new Map(prev);
                        newUsers.set(message.payload.userId, {
                            x: message.payload.x,
                            y: message.payload.y,
                            userId: message.payload.userId
                        });
                        return newUsers;
                    });
                }
                break;

            case 'movement':
                const movingUserId = message.payload.userId;

                setUsers(prev => {
                    const newUsers = new Map(prev);
                    const user = newUsers.get(movingUserId);
                    if (user) {
                        user.x = message.payload.x;
                        user.y = message.payload.y;
                        newUsers.set(movingUserId, user);
                    }
                    return newUsers;
                });

                break;
            case 'movement-rejected':
                setCurrentUser(prev => ({
                    ...prev,
                    x: message.payload.x,
                    y: message.payload.y
                }))
                break;

            case 'user-left':
                setUsers(prev => {
                    const newUsers = new Map(prev);
                    newUsers.delete(message.payload.userId);
                    return newUsers;
                });
                break;
        }
    };
    const handleMove = (newX: number, newY: number) => {
        if (!currentUser) return;
        console.log({ newCordinates: newX, newY })
        setCurrentUser(prev => ({
            ...prev,
            x: newX,
            y: newY
        }));
        wsRef.current.send(JSON.stringify({
            type: 'move',
            payload: {
                x: newX,
                y: newY,
                userId: currentUser.userId
            }
        }));
    };

    const setUpCanvas = () => {

    }

    useEffect(() => {
        console.log("render")
        const canvas = canvasRef.current;
        if (!canvas) return;
        console.log("below render")

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#eee';
        for (let i = 0; i < canvas.width; i += SCALE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += SCALE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }



        console.log("before curerntusert")
        // console.log(currentUser)
        // Draw current user
        if (currentUser && currentUser.x) {
            console.log("drawing myself")
            console.log(currentUser)
            ctx.beginPath();
            ctx.fillStyle = '#FF6B6B';
            ctx.arc(currentUser.x * SCALE_SIZE, currentUser.y * SCALE_SIZE, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('You', currentUser.x * SCALE_SIZE, currentUser.y * SCALE_SIZE + USER_SIZE);
        }

        space?.elements.forEach(element => {
            const img = new Image();
            img.src = element.element.imageUrl;

            img.onload = () => {
                const width = element.element.widht * SCALE_SIZE; // Using the specified width
                const height = element.element.height * SCALE_SIZE; // Using the specified height

                ctx.drawImage(
                    img,
                    element.x * SCALE_SIZE,
                    element.y * SCALE_SIZE,
                    width * 20,
                    height * 20
                );

                // Draw element ID
                ctx.fillStyle = '#000';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    `Element ${element.element.id}`,
                    element.x * SCALE_SIZE + (width / 2),
                    element.y * SCALE_SIZE + height + USER_SIZE
                );
            };
        });


        // Draw other users
        users.forEach(user => {
            if (!user.x) return;

            ctx.beginPath();
            ctx.fillStyle = getUserColor(user.userId);
            ctx.arc(user.x * SCALE_SIZE, user.y * SCALE_SIZE, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`User ${user.userId}`, user.x * SCALE_SIZE, user.y * SCALE_SIZE + USER_SIZE);
        });
    }, [currentUser, users]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Prevent default browser scrolling behavior
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        if (!currentUser) return;

        const { x, y } = currentUser;
        console.log({ oldCordinates: x, y })

        switch (e.key) {
            case 'ArrowUp':
                handleMove(x, y - 1);
                break;
            case 'ArrowDown':
                handleMove(x, y + 1);
                break;
            case 'ArrowLeft':
                handleMove(x - 1, y);
                break;
            case 'ArrowRight':
                handleMove(x + 1, y);
                break;
        }
    };

    // Auto-focus the game container when component mounts
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    // Re-focus when user clicks anywhere in the game area
    const handleContainerClick = () => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            className="p-4 outline-none" // Add outline-none to remove focus outline
            onKeyDown={handleKeyDown}
            onClick={handleContainerClick}
            tabIndex={0}
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }} // Prevent text selection
        >
            <h1 className="text-2xl font-bold mb-4">Arena</h1>
            <div className="mb-4">
                <p className="text-sm text-gray-600">useId: {currentUser?.userId}</p>

                <p className="text-sm text-gray-600">Token: {params.token}</p>
                <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
                <p className="text-sm text-gray-600">Connected Users: {users.size + (currentUser ? 1 : 0)}</p>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={canvasDimesions.width}
                    height={canvasDimesions.height}
                    className="bg-white"
                />
            </div>
            <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
        </div>
    );
};

export default Game;