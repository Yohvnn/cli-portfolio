import { motion } from "motion/react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface Photo {
    url: string;
    thumb?: string;
    title: string;
    location: string;
    date: string;
}

interface GalleryProps {
    photos: Photo[];
    title: string;
    subtitle?: string;
}

/**
 * Photo gallery with terminal-style chrome, grayscale hover effect,
 * and fullscreen modal viewing.
 */
export function Gallery({ photos, title, subtitle }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}.${month}.${year}`;
    };

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-xs md:text-sm uppercase tracking-[0.25em] text-accent mb-8">
            // {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs sm:text-sm opacity-70 leading-relaxed max-w-lg uppercase tracking-wider">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {photos.map((photo, idx) => (
                        <motion.button
                            key={photo.url}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            onClick={() => setSelectedIndex(idx)}
                            className="group flex flex-col border border-border hover:border-accent transition-colors duration-300 overflow-hidden text-left"
                            aria-label={`View ${photo.title}`}
                        >
                            <div className="relative aspect-square overflow-hidden bg-foreground/5">
                                <img
                                    src={photo.thumb || photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover
                             grayscale brightness-75
                             transition-all duration-700 ease-in-out
                             group-hover:grayscale-0
                             group-hover:brightness-100
                             group-hover:scale-105 cursor-pointer"
                                    loading="lazy"
                                />

                                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest border border-accent/40 text-accent/60 px-2 py-0.5 bg-background/50 backdrop-blur-sm group-hover:border-accent group-hover:text-accent transition-all">
                                    {String(idx + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                                </div>
                            </div>

                            <div className="border-t border-border px-3 py-2 space-y-1 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-[11px] sm:text-xs uppercase tracking-wide group-hover:text-accent transition-colors duration-300 font-medium">
                                        {photo.title}
                                    </h3>
                                    <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">
                                        {photo.location}
                                    </p>
                                </div>
                                <p className="text-[9px] opacity-30 uppercase tracking-wider">
                                    {formatDate(photo.date)}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <DialogPrimitive.Root
                open={selectedIndex !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedIndex(null);
                }}
            >
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay
                        className="fixed inset-0 z-[200] bg-background/95"
                        onClick={() => setSelectedIndex(null)}
                    />
                    {selectedPhoto !== null && selectedIndex !== null && (
                        <DialogPrimitive.Content
                            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col outline-none"
                            aria-label="Photo fullscreen view"
                        >
                            <div className="border border-border px-4 py-2 flex items-center justify-between bg-background/50">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                </div>

                                <span className="text-[10px] uppercase tracking-[0.2em] opacity-30 mx-4 flex-1 text-center">
                                    {selectedPhoto.title}
                                    <span className="opacity-60 ml-2">
                                        {String(selectedIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                                    </span>
                                </span>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] uppercase tracking-widest opacity-30 hidden sm:inline">
                                        [ ESC ]
                                    </span>
                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-all shrink-0"
                                        aria-label="Close"
                                    >
                                        [ CLOSE ]
                                    </button>
                                </div>
                            </div>

                            <div className="border border-t-0 border-border overflow-auto bg-black/50 flex items-center justify-center min-h-[300px]">
                                <img
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.title}
                                    className="max-h-[80vh] max-w-full object-contain"
                                />
                            </div>

                            <div className="border border-t-0 border-border px-4 py-3 bg-background/50 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-sm uppercase tracking-wide font-medium">
                                            {selectedPhoto.title}
                                        </h3>
                                        <p className="text-xs opacity-70 uppercase tracking-wider">
                                            {selectedPhoto.location} · {formatDate(selectedPhoto.date)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() =>
                                                setSelectedIndex((i) => (i! - 1 + photos.length) % photos.length)
                                            }
                                            className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                            aria-label="Previous photo"
                                        >
                                            [ ← ]
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedIndex((i) => (i! + 1) % photos.length)
                                            }
                                            className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                            aria-label="Next photo"
                                        >
                                            [ → ]
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogPrimitive.Content>
                    )}
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
        </>
    );
}
