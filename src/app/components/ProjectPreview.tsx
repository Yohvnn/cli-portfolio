import { motion } from "motion/react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

interface ProjectImage {
    src: string;
    alt: string;
}

interface ProjectPreviewProps {
    images: ProjectImage | ProjectImage[];
    githubUrl?: string;
    stack: string[];
    year: string;
    chromeLabel: string;
    badgeLabel?: string;
}

/**
 * Renders a project screenshot inside a terminal-style chrome frame
 * with tech stack tags, status badges, and fullscreen modal viewing.
 */
export function ProjectPreview({
    images,
    githubUrl,
    stack,
    year,
    chromeLabel,
    badgeLabel = "[ PREVIEW ]",
}: ProjectPreviewProps) {
    const { t } = useTranslation();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    // Normalize to array
    const imageList = Array.isArray(images) ? images : [images];
    const currentImage = imageList[currentImageIndex];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-6 border border-border group/preview"
            >

                <div
                    className="flex items-center justify-between border-b border-border px-4 py-2"
                    aria-hidden="true"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 border border-foreground/20 shrink-0 inline-block" />
                        <span className="w-2 h-2 border border-foreground/20 shrink-0 inline-block" />
                        <span className="w-2 h-2 border border-foreground/20 shrink-0 inline-block" />
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 truncate mx-4 flex items-center gap-2">
                        {chromeLabel}
                        {imageList.length > 1 && (
                            <span className="opacity-60 text-[9px]">
                                {currentImageIndex + 1} / {imageList.length}
                            </span>
                        )}
                    </span>

                    <span className="text-[10px] tracking-wider opacity-20 shrink-0 hidden sm:inline w-0" />
                </div>


                <button
                    onClick={() => setModalOpen(true)}
                    className="block w-full overflow-hidden bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    aria-label={`View ${currentImage.alt} in fullscreen`}
                >
                    <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        width={1280}
                        height={720}
                        className="w-full aspect-video object-cover object-top
                       grayscale brightness-75
                       transition-all duration-700 ease-in-out
                       hover:grayscale-0
                       hover:brightness-100
                       hover:scale-[1.015] cursor-zoom-in"
                        loading="lazy"
                    />
                </button>


                {imageList.length > 1 && (
                    <div className="border-t border-border px-4 py-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] opacity-60 uppercase tracking-widest">
                            Images
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentImageIndex((i) => (i - 1 + imageList.length) % imageList.length)}
                                className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                aria-label="Previous image"
                            >
                                [ ← ]
                            </button>
                            <div className="flex gap-1">
                                {imageList.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-1.5 h-1.5 border transition-all ${idx === currentImageIndex
                                            ? "bg-accent border-accent"
                                            : "border-foreground/30 hover:border-accent"
                                            }`}
                                        aria-label={`View image ${idx + 1}`}
                                        aria-current={idx === currentImageIndex}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentImageIndex((i) => (i + 1) % imageList.length)}
                                className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                aria-label="Next image"
                            >
                                [ → ]
                            </button>
                        </div>
                    </div>
                )}

                <div className="border-t border-border flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {stack.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-80 hover:text-accent transition-colors duration-200 cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                        <span className="text-[10px] opacity-20 mx-0.5 hidden sm:inline">│</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-50 hidden sm:inline">
                            {year}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase tracking-widest border border-accent/50 text-accent/80 px-2 py-0.5 shrink-0">
                            {badgeLabel}
                        </span>
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${chromeLabel} source code on GitHub`}
                                className="text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300"
                            >
                                [ GITHUB ]
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            <DialogPrimitive.Root open={modalOpen} onOpenChange={setModalOpen}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-background/95" />
                    <DialogPrimitive.Content
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 outline-none"
                        aria-label="Image preview modal"
                    >
                        <div className="max-w-6xl w-full max-h-[90vh] flex flex-col">
                            <div className="border border-border px-4 py-2 flex items-center justify-between bg-background/50">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                    <span className="w-2 h-2 border border-foreground/20 shrink-0" />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 flex-1 text-center mx-4">
                                    {currentImage.alt}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] uppercase tracking-widest opacity-50 hidden sm:inline">
                                        [ ESC ]
                                    </span>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-all"
                                        aria-label="Close modal"
                                    >
                                        [ {t("nav.closeButton")} ]
                                    </button>
                                </div>
                            </div>

                            <div className="border border-t-0 border-border overflow-auto bg-black/50 flex items-center justify-center min-h-[300px]">
                                <img
                                    src={currentImage.src}
                                    alt={currentImage.alt}
                                    className="max-h-[80vh] max-w-full object-contain"
                                />
                            </div>

                            {imageList.length > 1 && (
                                <div className="border border-t-0 border-border px-4 py-2 bg-background/50 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentImageIndex((i) => (i - 1 + imageList.length) % imageList.length)}
                                        className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                        aria-label="Previous image"
                                    >
                                        [ ← {t("nav.previousButton")} ]
                                    </button>
                                    <span className="text-[10px] opacity-60 uppercase tracking-wider">
                                        {currentImageIndex + 1} / {imageList.length}
                                    </span>
                                    <button
                                        onClick={() => setCurrentImageIndex((i) => (i + 1) % imageList.length)}
                                        className="text-[11px] opacity-60 hover:opacity-100 hover:text-accent transition-all uppercase tracking-widest"
                                        aria-label="Next image"
                                    >
                                        [ {t("nav.nextButton")} → ]
                                    </button>
                                </div>
                            )}
                        </div>
                    </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
        </>
    );
}
