# Faceless YouTube Video Generator

A static interactive web app that turns creator inputs into a complete faceless YouTube video production prompt with AI-assisted direction.

The production app lives in `app/` and runs without a build step:

- `app/index.html` for the page shell
- `app/styles.css` for the responsive UI
- `app/app.js` for the generator workflow and AI Director logic

## Local Use

Open `app/index.html` directly in a browser, or serve the `app/` directory with any static file server.

Serve it locally on `http://127.0.0.1:4173/` with:

```bash
python -m http.server 4173 --bind 127.0.0.1 --directory app
```

Validate the deployable artifact with:

```bash
node scripts/validate-static-app.mjs app/index.html
```

## Deployment

Internal deployment is handled by Cloud Run:

```powershell
.\deploy-cloud-run.ps1 -ProjectId interactive-web-apps -ServiceName faceless-youtube-video-generator -Region us-central1
```

Or from Git Bash:

```bash
./deploy-cloud-run.sh interactive-web-apps faceless-youtube-video-generator us-central1
```

For a local container smoke test:

```bash
docker build -t faceless-youtube-video-generator:local .
docker run --rm -p 8080:8080 faceless-youtube-video-generator:local
```

External deployment is handled by the static framework in this repo:

- GitHub Pages workflow: `.github/workflows/external-pages.yml`
- Netlify config: `netlify.toml`
- Vercel config: `vercel.json`
- External deployment guide: `docs/external-deployment.md`

For GitHub Pages, set the repository Pages source to GitHub Actions, then push to `main` or run the workflow manually.

## App Features

- Ten-step guided video planning workflow
- Persistent AI Director panel with readiness scoring, next-step guidance, hook ideas, visual direction, voice direction, and trust notes
- Source-note capture for URLs, transcripts, product angles, and raw topic seeds
- Client-side state persistence through `localStorage`
- AI starter angles when the user is unsure of a concept
- Generated AI prompt with script direction, shot list, caption plan, voiceover guidance, editing notes, publishing package, and quality checklist
- Fully static deployment artifact for public hosting
