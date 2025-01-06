import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
import client from '@repo/db/client';

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    // console.log(parsedData);
    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed" });
        return
    }
    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl
        }
    });
    //  g(element);
    res.json({
        id: element.id
    })

});

adminRouter.put('/element/:elementId', async (req, res) => {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed" });
        return
    }
    const response = await client.element.findFirst({
        where: {
            id: req.params.elementId
        }
    });

    if (!response) {
        res.status(403).json({ message: "element not found " })
        return;
    }
    await client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {

            imageUrl: parsedData.data.imageUrl
        }
    });
    res.json({
        message: "Element updated"
    });
});


adminRouter.post('/avatar', adminMiddleware, async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed" });
        return
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl,
        }
    });
    res.json({
        avatarId: avatar.id
    })
});


adminRouter.post('/map', adminMiddleware, async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body);
    // console.log(parsedData);
    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed" });
        return
    }
    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            height: parseInt(parsedData.data.dimensions.split('x')[0]),
            width: parseInt(parsedData.data.dimensions.split('x')[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map((e) => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                })
                )

            }
        }
    });

    res.json({ id: map.id });

})
