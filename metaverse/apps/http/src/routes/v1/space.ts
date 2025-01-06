// import { Router } from "express";
// import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
// import client from '@repo/db/client'
// import { userMiddleware } from "../../middleware/user";
// export const spaceRouter = Router();

// spaceRouter.post('/', userMiddleware, async (req, res) => {
//     const parsedData = CreateSpaceSchema.safeParse(req.body);
//     // console.log(req.body);
//     if (!parsedData.success) {
//         res.status(400).send({ message: "Validation failed" })
//         return
//     }
//     if (!parsedData.data.mapId) {
//         const space = await client.space.create({
//             data: {
//                 name: parsedData.data.name,
//                 width: parseInt(parsedData.data.dimensions.split('x')[0]),
//                 height: parseInt(parsedData.data.dimensions.split('x')[1]),
//                 creatorId: req.userId!
//             }
//         });

//         res.json({ spaceId: space.id })
//         return;
//     }
//     const map = await client.map.findFirst({
//         where: {
//             id: parsedData.data.mapId
//         },
//         select: {
//             mapElements: true,
//             width: true,
//             height: true
//         }
//     });


//     if (!map) {

//         res.status(404).send({ message: "Map not found" })
//         return
//     }

//     let space = await client.$transaction(async () => {

//         const space = await client.space.create({
//             data: {
//                 name: parsedData.data.name,
//                 width: map.width,
//                 height: map.height,
//                 creatorId: req.userId!,

//             }
//         });



//         await client.spaceElements.createMany({
//             data: map.mapElements.map((e) => ({
//                 spaceId: space.id,
//                 elementId: e.elementId,
//                 x: e.x!,
//                 y: e.y!,
//             }))
//         });

//         return space;
//     })
//     res.json({ spaceId: space.id });

// });

// spaceRouter.delete('/:spaceId', userMiddleware, async (req, res) => {
//     const spaceId = req.params.spaceId;
//     const userId = req.userId!;

//     const space = await client.space.findUnique({
//         where: {
//             id: spaceId
//         },
//         select: {
//             creatorId: true
//         }
//     });
//     if (!space) {
//         res.status(400).send({ message: "Space not found" })
//         return
//     }
//     if (space.creatorId != userId) {
//         res.status(403).send({ message: "Unauthorized" })
//         return
//     }

//     await client.space.delete({
//         where: {
//             id: spaceId
//         }
//     });


//     res.json({ message: "Space Deleted" });
// });

// spaceRouter.get('/all', userMiddleware, async (req, res) => {
//     const userId = req.userId;

//     const spaces = await client.space.findMany({
//         where: {
//             creatorId: userId
//         }
//     });
//     // const spaces = await client.user.find({
//     //     where: {
//     //         userId
//     //     },
//     //     select: {
//     //         spaces: true
//     //     }
//     // });
//     res.json({
//         spaces: spaces.map((s: any) => ({
//             id: s.id,
//             name: s.name,
//             thumbnail: s.thumbnail,
//             dimensions: `${s.width}X${s.height}`,
//         }))
//     })
// });

// spaceRouter.delete('/element', userMiddleware, async (req, res) => {
//     console.log('reached to del')
//     const parsedData = DeleteElementSchema.safeParse(req.body);
//     if (!parsedData.success) {
//         res.status(401).send({ message: "Validation failed" });
//         return;
//     }

//     const spaceElement = await client.spaceElements.findFirst({
//         where: {
//             id: parsedData.data.id
//         },
//         include: {
//             space: true
//         }
//     });

//     console.log("spaceElement")
//     console.log(spaceElement)

//     if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
//         res.status(405).send({ message: "Unauthorized" });
//         return;
//     }


//     const deletedElement = await client.spaceElements.delete({
//         where: {
//             id: parsedData.data.id
//         }
//     });
//     console.log(deletedElement);
//     res.json({ message: "element deleted" });

// });

// spaceRouter.post('/element', userMiddleware, async (req, res) => {
// //     const parsedData = AddElementSchema.safeParse(req.body);

// //     if (!parsedData.success) {
// //         res.status(400).send({ message: "Validation failed" });
// //         return;
// //     }
// //     const space = await client.space.findUnique({
// //         where: {
// //             id: req.body.spaceId,
// //             creatorId: req.userId
// //         },
// //         select: {
// //             width: true,
// //             height: true
// //         }
// //     });

// //     if (!space) {
// //         res.status(400).send({ message: "space not found" });
// //         return
// //     }

// //     await client.spaceElements.create({
// //         data: {
// //             spaceId: req.body.spaceId,
// //             elementId: req.body.elementId,
// //             x: req.body.x,
// //             y: req.body.y
// //         }
// //     })

// //     res.json({ message: "element added" });
// // });




// spaceRouter.get('/:spaceId', async (req, res) => {
//     console.log('reached to get')
//     const space = await client.space.findUnique({
//         where: {
//             id: req.params.spaceId
//         },
//         include: {
//             elements: {
//                 include: {
//                     element: true
//                 }
//             }
//         }
//     });

//     if (!space) {
//         res.status(400).json({ message: "space not found" });
//         return;
//     }

//     res.json({
//         "dimensions": `${space.height}x${space.width}`,

//         elements: space.elements.map((e: any) => ({
//             id: e.id,
//             element: {
//                 id: e.element.id,
//                 imageUrl: e.element.imageUrl,
//                 width: e.element.width,
//                 height: e.element.height,
//                 statis: e.element.static
//             },
//             x: e.x,
//             y: e.y
//         }))
//     })
// })

import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
    console.log("endopibnt")
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(JSON.stringify(parsedData))
        res.status(400).json({ message: "Validation failed" })
        return
    }

    if (!parsedData.data.mapId) {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        });
        res.json({ spaceId: space.id })
        return;
    }

    const map = await client.map.findFirst({
        where: {
            id: parsedData.data.mapId
        }, select: {
            mapElements: true,
            width: true,
            height: true
        }
    })
    console.log("after")
    if (!map) {
        res.status(400).json({ message: "Map not found" })
        return
    }
    console.log("map.mapElements.length")
    console.log(map.mapElements.length)
    let space = await client.$transaction(async () => {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        });

        await client.spaceElements.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!
            }))
        })

        return space;

    })
    console.log("space crated")
    res.json({ spaceId: space.id })
})


spaceRouter.delete("/element", userMiddleware, async (req, res) => {
    console.log("spaceElement?.space1 ")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return
    }
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        },
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({ message: "Unauthorized" })
        return
    }
    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({ message: "Element deleted" })
})

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
    console.log("req.params.spaceId", req.params.spaceId)
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatorId: true
        }
    })
    if (!space) {
        res.status(400).json({ message: "Space not found" })
        return
    }

    if (space.creatorId !== req.userId) {
        console.log("code should reach here")
        res.status(403).json({ message: "Unauthorized" })
        return
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.json({ message: "Space deleted" })
})

spaceRouter.get("/all", userMiddleware, async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId!
        }
    });

    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
        }))
    })


})

spaceRouter.post("/element", userMiddleware, async (req, res) => {
    const parsedData = AddElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return
    }
    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if (req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
        res.status(400).json({ message: "Point is outside of the boundary" })
        return
    }

    if (!space) {
        res.status(400).json({ message: "Space not found" })
        return
    }
    await client.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.json({ message: "Element added" })
})

spaceRouter.get("/:spaceId", async (req, res) => {
    const space = await client.space.findFirst({
        where: {
            id: req.params.spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
    })

    if (!space) {
        res.status(400).json({ message: "Space not found" })
        return
    }

    res.json({
        "dimensions": `${space.height}x${space.width}`,
        elements: space.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        })),
    })
})