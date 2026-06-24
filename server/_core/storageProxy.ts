import type { Express } from "express";
import path from "node:path";
import express from "express";

/**
 * Serves images from client/public/images as a fallback for /manus-storage/* URLs.
 * This maps old /manus-storage/filename.ext to /images/filename.ext
 */
export function registerStorageProxy(app: Express) {
  // Serve /images/ directory as static files
  const imagesDir = path.resolve(process.cwd(), "client/public/images");
  app.use("/images", express.static(imagesDir));

  // Redirect any old /manus-storage/* URLs to /images/*
  app.get("/manus-storage/*", (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(404).send("Not found");
      return;
    }
    // Strip the hash suffix from filenames: katie-lee-logo_49bcf825.png -> katie-lee-logo.png
    const cleanName = key.replace(/_[a-f0-9]{8}\./, ".");
    res.redirect(301, `/images/${cleanName}`);
  });
}
