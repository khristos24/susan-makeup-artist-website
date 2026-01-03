import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";
import { ArrowLeft, Save, X, Eye, Plus, Trash2 } from "lucide-react";
import { getSection, updateSection, uploadImage, withSite } from "@/lib/api";

interface TextEditorProps {
  section?: string;
  onNavigate: (page: string) => void;
  onSave: () => void;
}

export default function TextEditor({
  section = "home",
  onNavigate,
  onSave,
}: TextEditorProps) {
  const [rawJson, setRawJson] = useState("{}");
  const [prettyJson, setPrettyJson] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"form" | "json">("form");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingSetter, setPendingSetter] = useState<((url: string) => void) | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getSection(section);
        const pretty = JSON.stringify(data, null, 2);
        setData(data);
        setRawJson(pretty);
        setPrettyJson(pretty);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [section]);

  const openFilePickerFor = (setter: (url: string) => void) => {
    setPendingSetter(() => setter);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSetter) return;
    try {
      setError("");
      const res = await uploadImage(file);
      pendingSetter(res.url);
      // update rawJson to reflect current data snapshot
      setRawJson(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (e.target) e.target.value = "";
      setPendingSetter(null);
    }
  };

  const revertImage = (path: string, previousUrl: string) => {
    // path like "about.image"
    try {
      const [root, key] = path.split(".");
      const next = { ...data };
      if (next[root]) {
        const currentUrl = next[root][key];
        next[root][key] = previousUrl;
        next[root].imageHistory = Array.isArray(next[root].imageHistory)
          ? next[root].imageHistory
          : [];
        next[root].imageHistory.unshift(currentUrl);
        setData(next);
        setRawJson(JSON.stringify(next, null, 2));
      }
    } catch {
      /* noop */
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const payload = mode === "form" ? data : JSON.parse(rawJson);
      await updateSection(section, payload);
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON or save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate("content")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-display text-[#2c1a0a] capitalize">Edit {section}</h2>
            <p className="text-sm text-muted-foreground">Manage content and layout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "form" ? "json" : "form")}
            className="p-2"
          >
            {mode === "form" ? "Switch to JSON" : "Switch to Form"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {mode === "form" && section === "home" && data?.hero && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Eyebrow"
                  id="home_hero_eyebrow"
                  value={data.hero.eyebrow || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, eyebrow: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Input
                  label="Title"
                  id="home_hero_title"
                  value={data.hero.title || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, title: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Textarea
                  label="Subtitle"
                  id="home_hero_subtitle"
                  value={data.hero.subtitle || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, subtitle: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#2c1a0a]">Slides</label>
                  <Button
                    variant="primary"
                    className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
                    onClick={() => {
                      const slides = Array.isArray(data.hero.slides) ? data.hero.slides : [];
                      const nextSlide = {
                        title: "",
                        subtitle: "",
                        image: "/assets/placeholder.jpg",
                        primaryLabel: "Book Appointment",
                        primaryHref: "/book",
                        secondaryLabel: "View Packages",
                        secondaryHref: "/packages",
                        imageHistory: [],
                      };
                      const next = { ...data, hero: { ...data.hero, slides: [nextSlide, ...slides] } };
                      setData(next);
                      setRawJson(JSON.stringify(next, null, 2));
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Slide
                  </Button>
                </div>
                <div className="space-y-6">
                  {(Array.isArray(data.hero.slides) ? data.hero.slides : []).map((slide: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-[#d6c4a5]/50 bg-white p-3">
                      <div className="flex items-start gap-4">
                        <img
                          src={withSite(slide.image)}
                          alt={slide.title || `Slide ${idx + 1}`}
                          className="w-40 h-28 object-cover rounded"
                          onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="primary"
                              className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
                              onClick={() =>
                                openFilePickerFor((url) => {
                                  const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                  const prev = slides[idx]?.image;
                                  const hist = Array.isArray(slides[idx]?.imageHistory) ? slides[idx].imageHistory : [];
                                  slides[idx] = { ...slides[idx], image: url, imageHistory: [prev, ...hist] };
                                  const next = { ...data, hero: { ...data.hero, slides } };
                                  setData(next);
                                  setRawJson(JSON.stringify(next, null, 2));
                                })
                              }
                            >
                              Replace Image
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides.splice(idx, 1);
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                          <Input
                            label="Slide Title"
                            id={`home_slide_${idx}_title`}
                            value={slide.title || ""}
                            onChange={(e) => {
                              const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                              slides[idx] = { ...slides[idx], title: e.target.value };
                              const next = { ...data, hero: { ...data.hero, slides } };
                              setData(next);
                              setRawJson(JSON.stringify(next, null, 2));
                            }}
                          />
                          <Textarea
                            label="Slide Subtitle"
                            id={`home_slide_${idx}_subtitle`}
                            value={slide.subtitle || ""}
                            onChange={(e) => {
                              const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                              slides[idx] = { ...slides[idx], subtitle: e.target.value };
                              const next = { ...data, hero: { ...data.hero, slides } };
                              setData(next);
                              setRawJson(JSON.stringify(next, null, 2));
                            }}
                            rows={3}
                          />
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input
                              label="Primary Button Text"
                              id={`home_slide_${idx}_primaryLabel`}
                              value={slide.primaryLabel || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], primaryLabel: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Primary Button Link"
                              id={`home_slide_${idx}_primaryHref`}
                              value={slide.primaryHref || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], primaryHref: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Secondary Button Text"
                              id={`home_slide_${idx}_secondaryLabel`}
                              value={slide.secondaryLabel || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], secondaryLabel: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Secondary Button Link"
                              id={`home_slide_${idx}_secondaryHref`}
                              value={slide.secondaryHref || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], secondaryHref: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                          </div>
                          {Array.isArray(slide.imageHistory) && slide.imageHistory.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-2">Previous Images</p>
                              <div className="grid grid-cols-4 gap-2">
                                {slide.imageHistory.slice(0, 8).map((prevUrl: string, pidx: number) => (
                                  <button
                                    key={pidx}
                                    type="button"
                                    onClick={() => {
                                      const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                      const current = slides[idx]?.image;
                                      slides[idx] = {
                                        ...slides[idx],
                                        image: prevUrl,
                                        imageHistory: [current, ...slides[idx].imageHistory],
                                      };
                                      const next = { ...data, hero: { ...data.hero, slides } };
                                      setData(next);
                                      setRawJson(JSON.stringify(next, null, 2));
                                    }}
                                    className="rounded border hover:border-[#C9A24D]"
                                  >
                                    <img
                                      src={withSite(prevUrl)}
                                      alt={`Prev ${pidx + 1}`}
                                      className="w-full h-16 object-cover rounded"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      )}

      {mode === "json" && (
        <Card>
          <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#2c1a0a]">JSON Editor</label>
                    <span className="text-xs text-muted-foreground">Edit raw content structure</span>
                </div>
                <Textarea
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    rows={20}
                    className="font-mono text-sm bg-slate-50"
                />
              </div>
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "about" && data?.about && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Title"
                  id="about_title"
                  value={data.about.title || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, title: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Input
                  label="Tagline"
                  id="about_tagline"
                  value={data.about.tagline || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, tagline: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Textarea
                  label="Bio"
                  id="about_bio"
                  value={data.about.bio || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, bio: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                  rows={6}
                />
                <Input
                  label="Travel Note"
                  id="about_travel"
                  value={data.about.travelNote || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, travelNote: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#2c1a0a]">Profile Image</label>
                <div className="rounded-lg border border-[#d6c4a5]/50 bg-white p-3">
                  <img
                    src={withSite(data.about.image)}
                    alt={data.about.imageAlt || "About image"}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <Button
                      variant="primary"
                      className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
                      onClick={() =>
                        openFilePickerFor((url) => {
                          const prev = data.about.image;
                          const hist = Array.isArray(data.about.imageHistory) ? data.about.imageHistory : [];
                          const next = {
                            ...data,
                            about: { ...data.about, image: url, imageHistory: [prev, ...hist] },
                          };
                          setData(next);
                        })
                      }
                    >
                      Replace Image
                    </Button>
                    <Input
                      label="Alt Text"
                      id="about_alt"
                      value={data.about.imageAlt || ""}
                      onChange={(e) => {
                        const next = { ...data, about: { ...data.about, imageAlt: e.target.value } };
                        setData(next);
                        setRawJson(JSON.stringify(next, null, 2));
                      }}
                    />
                  </div>
                  {Array.isArray(data.about.imageHistory) && data.about.imageHistory.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Previous Images</p>
                      <div className="grid grid-cols-3 gap-2">
                        {data.about.imageHistory.slice(0, 6).map((prevUrl: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              revertImage("about.image", prevUrl)
                            }
                            className="rounded border hover:border-[#C9A24D]"
                          >
                            <img
                              src={withSite(prevUrl)}
                              alt={`Previous ${idx + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
