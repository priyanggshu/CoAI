import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveMessageController = async (req, res) => {
  const { userId, aiServiceId, message, response } = req.body;

  try {
    const conversation = await prisma.conversation.create({
        data: {
            userId,
            aiServiceId,
            messages: { request: message, response }
        }
    });

    res.status(201).json({ success: true, conversation});
  } catch (error) {
    res.status(500).json({ error: "Failed to save conversation" });
  }
};

export const getUserConversationController = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.status(203).json({ conversations });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
};
