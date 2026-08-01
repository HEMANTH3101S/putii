This folder is intentionally empty.

The gallery and timeline sections currently use elegant CSS-drawn
placeholders (soft gradients + labels like "photo 1") instead of real
image files, so the site works perfectly right out of the box with
no broken image icons.

When you're ready to add real photos:
1. Drop your images in here (e.g. memory-01.jpg, memory-02.jpg ...).
2. In script.js, search for "buildGallery" and "timelineCaptions" —
   each placeholder item has a clear comment showing exactly where
   to swap in `background-image: url('images/your-file.jpg')`.

Recommended: compress photos to under ~300KB each (e.g. with
squoosh.app) so the site stays fast.
