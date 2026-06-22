"use client";

import { useCallback, useRef, useState } from "react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getCompressionType(file: File): "jpeg" | "webp" {
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/png") return "webp"; // PNG -> WebP for better compression
  return "jpeg"; // Default to JPEG for JPG and others
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compress = useCallback(
    async (file: File, q: number) => {
      setProcessing(true);
      setError(null);
      setOriginalSize(file.size);

      try {
        // Load image
        const img = new Image();
        const url = URL.createObjectURL(file);
        setOriginalUrl(url);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image. The file may be corrupted or not a valid image format."));
          img.src = url;
        });

        // Draw to canvas and compress
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const type = getCompressionType(file);
        const mimeType = type === "webp" ? "image/webp" : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              setCompressedUrl(compressedUrl);
              setCompressedSize(blob.size);
            } else {
              setError("Compression failed. Try a different image format.");
            }
            setProcessing(false);
          },
          mimeType,
          q / 100
        );
      } catch (e) {
        setError((e as Error).message);
        setProcessing(false);
      }
    },
    []
  );

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP).");
      return;
    }
    setFile(f);
    // Revoke previous compressed URL
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setCompressedUrl("");
    setCompressedSize(0);
    compress(f, quality);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function handleQualityChange(q: number) {
    setQuality(q);
    if (file) {
      compress(file, q);
    }
  }

  function downloadCompressed() {
    if (!compressedUrl || !file) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    const ext = getCompressionType(file) === "webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
    a.download = name;
    a.click();
  }

  const savings =
    originalSize > 0 && compressedSize > 0
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  return (
    <main>
      <canvas ref={canvasRef} className="hidden" />

      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Image Compressor
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Compress JPG, PNG, and WebP images right in your browser — adjust
            quality, preview results, and download smaller files instantly.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Upload & settings */}
        <div className="grid gap-4 content-start">
          {/* Drop zone */}
          <div
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition cursor-pointer ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : file
                ? "border-emerald-300 bg-emerald-50"
                : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileInput}
            />
            {file ? (
              <div>
                <p className="font-bold text-emerald-700">{file.name}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  {formatBytes(file.size)} — {file.type}
                </p>
                <p className="text-xs text-emerald-500 mt-2">
                  Click or drop to replace
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-10 w-10 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="mt-3 font-bold text-slate-600">
                  Drag &amp; drop an image here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  or click to browse — JPG, PNG, WebP
                </p>
              </div>
            )}
          </div>

          {/* Quality slider */}
          {file && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Quality</span>
                <span className="text-sm font-mono text-slate-500">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Stats */}
          {file && !processing && compressedSize > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold mb-2">Compression Results</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-md border border-slate-200 p-2">
                  <p className="font-bold text-slate-700">
                    {formatBytes(originalSize)}
                  </p>
                  <p className="text-slate-500">Original</p>
                </div>
                <div className="rounded-md border border-slate-200 p-2">
                  <p className="font-bold text-emerald-700">
                    {formatBytes(compressedSize)}
                  </p>
                  <p className="text-slate-500">Compressed</p>
                </div>
                <div className="rounded-md border border-slate-200 p-2">
                  <p className="font-bold text-blue-700">
                    {savings}%
                  </p>
                  <p className="text-slate-500">Savings</p>
                </div>
              </div>
            </div>
          )}

          {processing && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Compressing...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Previews */}
        <div className="grid gap-4 content-start">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Preview</span>
            {compressedUrl && (
              <button
                onClick={downloadCompressed}
                className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                Download Compressed
              </button>
            )}
          </div>

          {file ? (
            <div className="grid gap-4">
              {/* Original */}
              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-100 px-3 py-2 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500">
                    Original — {formatBytes(originalSize)}
                  </span>
                </div>
                <div className="p-2 flex items-center justify-center bg-[#fafafa] min-h-[150px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed */}
              {compressedUrl && (
                <div className="rounded-lg border border-emerald-200 bg-white overflow-hidden">
                  <div className="border-b border-emerald-100 px-3 py-2 bg-emerald-50">
                    <span className="text-xs font-bold text-emerald-700">
                      Compressed — {formatBytes(compressedSize)}{" "}
                      ({savings}% smaller)
                    </span>
                  </div>
                  <div className="p-2 flex items-center justify-center bg-[#fafafa] min-h-[150px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="max-h-64 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
              Upload an image on the left to see the preview here.
            </div>
          )}
        </div>
      </section>

      {/* What is this? */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">What is an Image Compressor?</h2>
          <p className="mt-3 text-slate-600">
            An image compressor reduces file size by lowering image quality,
            stripping metadata, and re-encoding the image. This tool uses the
            browser&apos;s Canvas API to recompress images as JPEG or WebP. Smaller
            images load faster on websites, use less bandwidth, and improve Core
            Web Vitals scores. All processing happens locally — your images never
            leave your computer.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">FAQs</h2>
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="font-bold">Does my image get uploaded anywhere?</h3>
              <p className="text-slate-600">
                No. Everything runs in your browser using the HTML5 Canvas API.
                Your images never leave your computer. No server, no uploads.
              </p>
            </div>
            <div>
              <h3 className="font-bold">What output format does this produce?</h3>
              <p className="text-slate-600">
                JPEG images are recompressed as JPEG. PNG and WebP images are
                converted to WebP, which typically offers better compression at
                the same quality level.
              </p>
            </div>
            <div>
              <h3 className="font-bold">What quality level should I use?</h3>
              <p className="text-slate-600">
                For web use, 70-85% is usually a good balance between file size
                and visual quality. Forprint or high-detail images, use 90%+. For
                thumbnails, 50-60% is often sufficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">
              Need help with image optimization for your website?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              If you are optimizing images for a production site, implementing
              responsive images, or setting up automated image pipelines, send us
              your use case.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Image%20optimization%20help"
            >
              Request image help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
