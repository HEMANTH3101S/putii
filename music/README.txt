This folder is intentionally empty.

The floating music button looks for a file named:
    music/placeholder.mp3

The site is built to fail silently if that file is missing — no
errors, the button just won't play anything yet — so you can preview
everything else before adding a song.

To add your song:
1. Drop an MP3 file in this folder.
2. Rename it to: placeholder.mp3
   (or rename it to anything you like and update the `src` on the
   <audio id="bg-music"> tag in index.html to match)

Keep it under ~5MB if you plan to host this site online — most free
hosts have upload limits.
