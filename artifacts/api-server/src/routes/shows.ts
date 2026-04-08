import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, showsTable } from "@workspace/db";
import {
  CreateShowBody,
  UpdateShowBody,
  UpdateShowParams,
  DeleteShowParams,
  ListShowsResponse,
  UpdateShowResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  if ((req.session as any).isAdmin !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/shows", async (_req, res): Promise<void> => {
  const shows = await db.select().from(showsTable).orderBy(showsTable.createdAt);
  res.json(ListShowsResponse.parse(shows));
});

router.post("/shows", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateShowBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [show] = await db.insert(showsTable).values({
    place: parsed.data.place,
    day: parsed.data.day,
    time: parsed.data.time ?? null,
    available: parsed.data.available ?? true,
  }).returning();

  res.status(201).json(UpdateShowResponse.parse(show));
});

router.patch("/shows/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateShowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateShowBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, any> = {};
  if (parsed.data.place !== undefined) updateData.place = parsed.data.place;
  if (parsed.data.day !== undefined) updateData.day = parsed.data.day;
  if ("time" in parsed.data) updateData.time = parsed.data.time ?? null;
  if (parsed.data.available !== undefined) updateData.available = parsed.data.available;

  const [show] = await db
    .update(showsTable)
    .set(updateData)
    .where(eq(showsTable.id, params.data.id))
    .returning();

  if (!show) {
    res.status(404).json({ error: "Show not found" });
    return;
  }

  res.json(UpdateShowResponse.parse(show));
});

router.delete("/shows/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteShowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [show] = await db
    .delete(showsTable)
    .where(eq(showsTable.id, params.data.id))
    .returning();

  if (!show) {
    res.status(404).json({ error: "Show not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
