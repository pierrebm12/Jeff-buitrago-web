import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, photosTable } from "@workspace/db";
import {
  CreatePhotoBody,
  UpdatePhotoBody,
  UpdatePhotoParams,
  DeletePhotoParams,
  ListPhotosResponse,
  UpdatePhotoResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  if ((req.session as any).isAdmin !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/photos", async (_req, res): Promise<void> => {
  const photos = await db
    .select()
    .from(photosTable)
    .orderBy(photosTable.sortOrder, photosTable.createdAt);
  res.json(ListPhotosResponse.parse(photos));
});

router.post("/photos", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [photo] = await db.insert(photosTable).values({
    url: parsed.data.url,
    title: parsed.data.title,
    titleEn: parsed.data.titleEn ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();

  res.status(201).json(UpdatePhotoResponse.parse(photo));
});

router.patch("/photos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, any> = {};
  if (parsed.data.url !== undefined) updateData.url = parsed.data.url;
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if ("titleEn" in parsed.data) updateData.titleEn = parsed.data.titleEn ?? null;
  if (parsed.data.sortOrder !== undefined) updateData.sortOrder = parsed.data.sortOrder;

  const [photo] = await db
    .update(photosTable)
    .set(updateData)
    .where(eq(photosTable.id, params.data.id))
    .returning();

  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  res.json(UpdatePhotoResponse.parse(photo));
});

router.delete("/photos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeletePhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [photo] = await db
    .delete(photosTable)
    .where(eq(photosTable.id, params.data.id))
    .returning();

  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
