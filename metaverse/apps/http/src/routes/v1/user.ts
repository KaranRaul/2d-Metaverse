import { Router } from "express";
import { UpdateElementSchema, UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
import client from '@repo/db/client';

// import { PrismaClient } from "../../../../../node_modules/.prisma/client"
// const client = new PrismaClient();
export const userRouter = Router();

userRouter.post('/metadata', userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validatoin failed"
        })
        return;
    }

    try {
        const avatar = await client.avatar.findFirst({
            where: {
                id: parsedData.data.avatarId
            }
        });

        if (!avatar) {
            res.status(400).json({
                message: "Avatar not found"
            })
            return;
        }


        await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        });
        res.json({ message: "Meatadta Updated" })

    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "error" });

    }


})

userRouter.get('/metadata/bulk', async (req, res) => {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString.length - 1).split(",");
    // console.log(userIds);

    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            avatar: true,
            id: true
        }
    });

    res.json({
        avatars: metadata.map((m: any) => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })

})