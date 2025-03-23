import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveMessageController = async (req, res) => {
  const { userId, aiServiceId, message, response } = req.body;
  const now = new Date().toISOString();
  
  if (!userId || !aiServiceId || !message || !response) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const latestConversation = await prisma.conversation.findFirst({
      where: { userId, aiServiceId },
      orderBy: { createdAt: "desc" },
    });

    if (latestConversation) {
      const updatedMessages = [
        ...(latestConversation.messages || []),
        { sender: "user", text: message, timestamp: now },
        { sender: "AI", text: response, timestamp: new Date().toISOString() },
      ];

      const updatedConversation = await prisma.conversation.update({
        where: { id: latestConversation.id },
        data: { messages: updatedMessages },
      });

      res
        .status(200).json({ success: true, conversation: updatedConversation });
    } else {
      const newConversation = await prisma.conversation.create({
        data: {
          userId,
          aiServiceId,
          messages: [
            { sender: "user", text: message, timestamp: now },
            { sender: "AI", text: response, timestamp: new Date().toISOString() },
          ],
        },
      });

      res.status(201).json({ success: true, conversation: newConversation });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save conversation", details: error.message });
  }
};

export const getUserConversationController = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalCount = await prisma.conversation.count({ where: { userId } });

    res.status(200).json({
      conversations,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations", details: error.message });
  }
};

export const exportConversationsController = async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=conversations_" + userId + ".json"
    );
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(conversations, null, 2));
  } catch (error) {
    res.status(500).json({ error: "Failed to export conversations", details: error.message });
  }
};

export const searchConversationsController = async (req, res) => {
  const { userId } = req.params;
  const { query } = req.query;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const filtered = conversations.filter((convo) =>
      Array.isArray(convo.messages) &&
      convo.messages.some((msg) =>
        typeof msg.text === "string" &&
        msg.text.toLowerCase().includes(query.toLowerCase())
      )
    );

    res.status(200).json({ conversations: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search conversations", details: error.message });
  }
};
