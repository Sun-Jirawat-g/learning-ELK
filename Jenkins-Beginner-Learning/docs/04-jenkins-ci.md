# 04 — Build CI Pipeline (from GitHub)

> Pipeline file: [`jenkinsfiles/Jenkinsfile.ci`](../jenkinsfiles/Jenkinsfile.ci)

## Pre-req checklist

- [ ] Jenkins running (Module 3 done).
- [ ] GitHub repo exists with `Dockerfile` at root.
- [ ] `github-creds` and `registry-creds` added.

## Create Pipeline Job

- [ ] Dashboard → **New Item** → name `app-ci` → **Pipeline** → OK.
- [ ] **General**
  - GitHub project → repo URL.
- [ ] **Build Triggers**
  - ✔ GitHub hook trigger for GITScm polling.
- [ ] **Pipeline**
  - Definition: **Pipeline script from SCM**
  - SCM: **Git**
  - Repository URL: `https://github.com/<org>/<repo>.git`
  - Credentials: `github-creds`
  - Branch: `*/main`
  - Script Path: `jenkinsfiles/Jenkinsfile.ci`
- [ ] **Save**.

## Wire up GitHub webhook

- [ ] GitHub repo → Settings → **Webhooks** → Add webhook
  - Payload URL: `http://<jenkins-public-host>:8080/github-webhook/`
  - Content type: `application/json`
  - Events: **Just the push event** (or "Send me everything").
- [ ] Test: push commit → check Jenkins → build should start.

## Stage-by-stage breakdown (matches `Jenkinsfile.ci`)

1. **Checkout** — pull source from GitHub at the commit that triggered the build.
2. **Install** — `npm ci` (clean, reproducible install).
3. **Lint** — quick code-style check (fast fail).
4. **Test** — unit tests, emit JUnit XML for Jenkins to render trend.
5. **Docker Build** — `docker build` tagged with `branch-shortsha` (unique, traceable).
6. **Push Image** — only on `main` branch → push to registry, also tag `latest`.

## Verify

- [ ] Build #1 green.
- [ ] Image appears in registry (DockerHub / GHCR).
- [ ] `post.success` block triggers `app-cd` job — check next module.

## Troubleshooting

- ❌ `permission denied: /var/run/docker.sock` → re-check Module 3 docker mount.
- ❌ GitHub webhook 403 → check Jenkins is publicly reachable; use ngrok in dev.
- ❌ `npm ci` fails → ensure `package-lock.json` committed.
