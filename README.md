# The record of change — strategy brief

A single-page web brief on the missing layer in health AI: a structured record of
attempted change, across patient, clinician, system and research surfaces. Written for a
Google Research / Google Health / Health Impact Accelerator reader.

## How to open it

It is one self-contained HTML file. No build step, no dependencies.

- Double-click `index.html`, or
- Drag it into a browser, or
- Serve the folder locally:

```bash
cd ~/Projects/delta/brief
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html` — the finished one-page brief (HTML + embedded CSS, no JavaScript).
- `notes/sources.md` — every Google initiative mentioned, with the source used and any
  point that still needs checking before sending.
- `notes/copy.md` — the full page copy in plain text, for editing by hand.

## Before sending it on

Two references are deliberately marked for confirmation in `notes/sources.md`:

- the exact Gemini capability being relied on, and
- the current status of the consumer health / Fitbit AI-coach surface.

Both are referred to generally in the page so nothing breaks if a product detail has
moved. Confirm them if you want to name a specific product.
