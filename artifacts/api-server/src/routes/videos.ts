import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, videosTable } from "@workspace/db";
import {
  CreateVideoBody,
  UpdateVideoBody,
  UpdateVideoParams,
  DeleteVideoParams,
  ListVideosResponse,
  UpdateVideoResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  if ((req.session as any).isAdmin !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/videos", async (_req, res): Promise<void> => {
  const videos = await db
    .select()
    .from(videosTable)
    .orderBy(videosTable.sortOrder, videosTable.createdAt);
  res.json(ListVideosResponse.parse(videos));
});

router.post("/videos", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateVideoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [video] = await db.insert(videosTable).values({
    url: parsed.data.url,
    title: parsed.data.title,
    titleEn: parsed.data.titleEn ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();

  res.status(201).json(UpdateVideoResponse.parse(video));
});

router.patch("/videos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateVideoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateVideoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, any> = {};
  if (parsed.data.url !== undefined) updateData.url = parsed.data.url;
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if ("titleEn" in parsed.data) updateData.titleEn = parsed.data.titleEn ?? null;
  if (parsed.data.sortOrder !== undefined) updateData.sortOrder = parsed.data.sortOrder;

  const [video] = await db
    .update(videosTable)
    .set(updateData)
    .where(eq(videosTable.id, params.data.id))
    .returning();

  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  res.json(UpdateVideoResponse.parse(video));
});

router.delete("/videos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteVideoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [video] = await db
    .delete(videosTable)
    .where(eq(videosTable.id, params.data.id))
    .returning();

  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
