# 05 — Build CD Pipeline (deploy to prod)

> Pipeline file: [`jenkinsfiles/Jenkinsfile.cd`](../jenkinsfiles/Jenkinsfile.cd)

## Pre-req checklist

- [ ] CI pipeline working (Module 4 done).
- [ ] Target hosts reachable from Jenkins (dev/staging/prod).
- [ ] `ssh-prod` credential added (private key for `deploy` user).
- [ ] Each target host has `docker compose` installed and `/opt/app/docker-compose.yaml` ready.

## Create Pipeline Job

- [ ] New Item → name `app-cd` → **Pipeline** → OK.
- [ ] **General**
  - ✔ This project is parameterized
    - String: `IMAGE_TAG` (default `latest`)
    - Choice: `TARGET` (dev, staging, prod, all)
- [ ] **Pipeline** → Pipeline script from SCM
  - Same repo as CI, branch `main`, Script Path: `jenkinsfiles/Jenkinsfile.cd`.
- [ ] **Save**.

## Trigger flow

- CI job ends successfully → its `post.success` calls:
  ```groovy
  build job: 'app-cd', parameters: [string(name: 'IMAGE_TAG', value: env.IMAGE_TAG)]
  ```
- Or run manually: **Build with Parameters** → enter tag → Build.

## Stages (matches `Jenkinsfile.cd`)

1. **Verify Image** — pull from registry; fail fast if missing.
2. **Deploy DEV** — SSH to dev host → `docker pull` + `docker compose up -d`.
3. **Smoke test DEV** — hit `/health`.
4. **Deploy STAGING** — same pattern.
5. **Integration test STAGING** — fuller checks.
6. **Approval Gate** — `input` step pauses pipeline until human clicks **Deploy**. 30-min timeout → auto-abort.
7. **Deploy PROD** — pull, tag previous image as `app:previous` for quick rollback, deploy.
8. **Health Check PROD** — confirm app responds.

## Rollback recipe (manual)

- [ ] Re-run `app-cd` with `IMAGE_TAG=<previous-good-tag>` and `TARGET=prod`.
- [ ] OR on prod host: `docker tag app:previous app:current && docker compose up -d`.

## Where Argo CD would replace this

If using Kubernetes:
- Replace Deploy stages with: **commit new image tag** to a manifests repo (e.g. update `deployment.yaml` `image:` field).
- Argo CD watches manifests repo → auto-syncs cluster.
- Jenkins no longer needs cluster credentials → safer.
