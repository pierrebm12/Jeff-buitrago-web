import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Image, Video, Calendar, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";
import {
  useListShows, useCreateShow, useUpdateShow, useDeleteShow,
  useListPhotos, useCreatePhoto, useUpdatePhoto, useDeletePhoto,
  useListVideos, useCreateVideo, useUpdateVideo, useDeleteVideo,
  useAdminLogout,
  getListShowsQueryKey, getListPhotosQueryKey, getListVideosQueryKey,
} from "@workspace/api-client-react";

type Tab = "shows" | "photos" | "videos";

export function Admin({ onLogout }: { onLogout: () => void }) {
  const { t } = useLanguage();
  const { setIsAdmin } = useAdmin();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("shows");
  const [deleteTarget, setDeleteTarget] = useState<{ type: Tab; id: number } | null>(null);
  const [editingShow, setEditingShow] = useState<any | null>(null);

  const logoutMutation = useAdminLogout({
    mutation: {
      onSuccess: () => {
        setIsAdmin(false);
        onLogout();
      },
    },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-primary/20 px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-bold tracking-widest text-primary uppercase">
          {t.admin.panel}
        </div>
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate({})}
          className="border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <LogOut className="w-4 h-4" />
          {t.admin.logout}
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-6">
        {([["shows", Calendar, t.admin.showsList], ["photos", Image, t.admin.photos], ["videos", Video, t.admin.videos]] as const).map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 py-4 px-6 text-sm font-medium uppercase tracking-wider border-b-2 transition-all ${
              tab === key ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {tab === "shows" && <ShowsTab t={t} qc={qc} onEdit={setEditingShow} onDelete={(id) => setDeleteTarget({ type: "shows", id })} />}
        {tab === "photos" && <MediaTab type="photos" t={t} qc={qc} onDelete={(id) => setDeleteTarget({ type: "photos", id })} />}
        {tab === "videos" && <MediaTab type="videos" t={t} qc={qc} onDelete={(id) => setDeleteTarget({ type: "videos", id })} />}
      </div>

      {/* Edit Show Modal */}
      {editingShow && (
        <EditShowModal
          show={editingShow}
          t={t}
          onClose={() => setEditingShow(null)}
          onSaved={() => { qc.invalidateQueries({ queryKey: getListShowsQueryKey() }); setEditingShow(null); }}
        />
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-[#111] border-primary/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">{t.admin.confirmDelete}</DialogTitle>
            <DialogDescription className="text-gray-400 mt-2">{t.admin.confirmDeleteDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-white/20 text-white">{t.admin.cancel ?? "Cancelar"}</Button>
            <DeleteConfirmButton target={deleteTarget} qc={qc} t={t} onDone={() => setDeleteTarget(null)} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeleteConfirmButton({ target, qc, t, onDone }: any) {
  const deleteShow = useDeleteShow({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListShowsQueryKey() }); onDone(); } } });
  const deletePhoto = useDeletePhoto({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListPhotosQueryKey() }); onDone(); } } });
  const deleteVideo = useDeleteVideo({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListVideosQueryKey() }); onDone(); } } });

  const handleDelete = () => {
    if (!target) return;
    if (target.type === "shows") deleteShow.mutate({ id: target.id });
    if (target.type === "photos") deletePhoto.mutate({ id: target.id });
    if (target.type === "videos") deleteVideo.mutate({ id: target.id });
  };

  const isPending = deleteShow.isPending || deletePhoto.isPending || deleteVideo.isPending;

  return (
    <Button onClick={handleDelete} disabled={isPending} className="bg-red-500 hover:bg-red-600 text-white font-bold">
      {isPending ? "..." : t.admin.confirm}
    </Button>
  );
}

function ShowsTab({ t, qc, onEdit, onDelete }: any) {
  const { data: shows = [], isLoading } = useListShows();
  const createShow = useCreateShow({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListShowsQueryKey() }) } });
  const updateShow = useUpdateShow({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListShowsQueryKey() }) } });

  const [form, setForm] = useState({ place: "", day: "", time: "", available: true });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.place || !form.day) return;
    createShow.mutate({ data: { place: form.place, day: form.day, time: form.time || null, available: form.available } });
    setForm({ place: "", day: "", time: "", available: true });
  };

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6">
        <h3 className="text-primary font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.admin.addShow ?? t.shows.addShow}
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.place}</label>
            <input value={form.place} onChange={e => setForm(f => ({ ...f, place: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Ej: Bogotá" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.day}</label>
            <input value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Ej: 15 de Mayo" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.time}</label>
            <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Ej: 8:00 PM" />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
              className="w-4 h-4 accent-yellow-500" />
            <label htmlFor="avail" className="text-sm text-gray-300">{t.admin.availableLabel}</label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={createShow.isPending} className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider">
              {createShow.isPending ? "..." : t.admin.add}
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-gray-500 text-center py-12">Cargando...</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {shows.map((show: any) => (
              <motion.div key={show.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">{show.day} — {show.place}</div>
                  {show.time && <div className="text-primary text-sm mt-1">{show.time}</div>}
                  <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${show.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {show.available ? t.shows.available : t.shows.unavailable}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => {
                    updateShow.mutate({ id: show.id, data: { available: !show.available } });
                  }} className={`gap-1 text-xs border-white/20 ${show.available ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-400 hover:bg-white/10'}`}>
                    <Check className="w-3 h-3" /> {t.admin.toggleAvail}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(show)}
                    className="gap-1 text-xs border-white/20 text-blue-400 hover:bg-blue-500/10">
                    <Edit2 className="w-3 h-3" /> {t.admin.edit}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(show.id)}
                    className="gap-1 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" /> {t.admin.delete}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {shows.length === 0 && <div className="text-gray-500 text-center py-8">{t.shows.noShows}</div>}
        </div>
      )}
    </div>
  );
}

function EditShowModal({ show, t, onClose, onSaved }: any) {
  const [form, setForm] = useState({ place: show.place, day: show.day, time: show.time ?? "", available: show.available });
  const updateShow = useUpdateShow({ mutation: { onSuccess: onSaved } });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShow.mutate({ id: show.id, data: { place: form.place, day: form.day, time: form.time || null, available: form.available } });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-primary/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{t.admin.editShow}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.place}</label>
            <input value={form.place} onChange={e => setForm(f => ({ ...f, place: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.day}</label>
            <input value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.time}</label>
            <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="edit-avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
              className="w-4 h-4 accent-yellow-500" />
            <label htmlFor="edit-avail" className="text-sm text-gray-300">{t.admin.availableLabel}</label>
          </div>
          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
              <X className="w-4 h-4 mr-1" /> {t.shows.cancel}
            </Button>
            <Button type="submit" disabled={updateShow.isPending} className="bg-primary text-black hover:bg-primary/90 font-bold">
              {updateShow.isPending ? "..." : t.admin.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MediaTab({ type, t, qc, onDelete }: { type: "photos" | "videos"; t: any; qc: any; onDelete: (id: number) => void }) {
  const isPhoto = type === "photos";
  const { data: items = [], isLoading } = isPhoto ? useListPhotos() : useListVideos();
  const createPhoto = useCreatePhoto({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListPhotosQueryKey() }) } });
  const createVideo = useCreateVideo({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListVideosQueryKey() }) } });
  const updatePhoto = useUpdatePhoto({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListPhotosQueryKey() }) } });
  const updateVideo = useUpdateVideo({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListVideosQueryKey() }) } });

  const [form, setForm] = useState({ url: "", title: "", titleEn: "", sortOrder: 0 });
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ url: "", title: "", titleEn: "", sortOrder: 0 });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.title) return;
    const data = { url: form.url, title: form.title, titleEn: form.titleEn || null, sortOrder: Number(form.sortOrder) };
    if (isPhoto) createPhoto.mutate({ data });
    else createVideo.mutate({ data });
    setForm({ url: "", title: "", titleEn: "", sortOrder: 0 });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({ url: item.url, title: item.title, titleEn: item.titleEn ?? "", sortOrder: item.sortOrder });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const data = { url: editForm.url, title: editForm.title, titleEn: editForm.titleEn || null, sortOrder: Number(editForm.sortOrder) };
    if (isPhoto) updatePhoto.mutate({ id: editingItem.id, data });
    else updateVideo.mutate({ id: editingItem.id, data });
    setEditingItem(null);
  };

  const addLabel = isPhoto ? t.admin.addPhoto : t.admin.addVideo;

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6">
        <h3 className="text-primary font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> {addLabel}
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.urlLabel}</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="https://..." required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.titleEs}</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Título en español" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.titleEn}</label>
            <input value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Title in English" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.orderLabel}</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
              className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={createPhoto.isPending || createVideo.isPending}
              className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider">
              {(createPhoto.isPending || createVideo.isPending) ? "..." : t.admin.add}
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-gray-500 text-center py-12">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {(items as any[]).map((item: any) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                {isPhoto ? (
                  <img src={item.url} alt={item.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-black/50 flex items-center justify-center">
                    <Video className="w-10 h-10 text-primary/40" />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-white font-semibold">{item.title}</div>
                  {item.titleEn && <div className="text-gray-400 text-sm">{item.titleEn}</div>}
                  <div className="text-xs text-gray-600 mt-1">#{item.sortOrder}</div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}
                      className="gap-1 text-xs border-white/20 text-blue-400 hover:bg-blue-500/10 flex-1">
                      <Edit2 className="w-3 h-3" /> {t.admin.edit}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(item.id)}
                      className="gap-1 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1">
                      <Trash2 className="w-3 h-3" /> {t.admin.delete}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {(items as any[]).length === 0 && <div className="text-gray-500 text-center py-8 col-span-2">Sin elementos</div>}
        </div>
      )}

      {/* Edit modal */}
      {editingItem && (
        <Dialog open onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="bg-[#111] border-primary/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">{t.admin.edit}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.urlLabel}</label>
                <input value={editForm.url} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.titleEs}</label>
                <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.titleEn}</label>
                <input value={editForm.titleEn} onChange={e => setEditForm(f => ({ ...f, titleEn: e.target.value }))}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{t.admin.orderLabel}</label>
                <input type="number" value={editForm.sortOrder} onChange={e => setEditForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <DialogFooter className="gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="border-white/20 text-white">
                  {t.shows.cancel}
                </Button>
                <Button type="submit" disabled={updatePhoto.isPending || updateVideo.isPending}
                  className="bg-primary text-black hover:bg-primary/90 font-bold">
                  {(updatePhoto.isPending || updateVideo.isPending) ? "..." : t.admin.save}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
