# Jenkins Beginner Learning — DevOps Checklist

> Goal: Learn DevOps fundamentals → understand CI/CD tools → build Jenkins pipeline (CI + CD separated) pulling from GitHub for production deploy.

---

## Module 1 — Concepts: CI, CD, Pipeline

- [ ] **What is CI (Continuous Integration)?**
  - Devs merge code to shared branch **often** (multiple times per day).
  - Every merge → auto build + test → catch break early.
  - Tools: Jenkins, GitHub Actions, GitLab CI.
- [ ] **What is CD?** (two meanings — know both)
  - **Continuous Delivery** → build is always *deployable* to prod, but release is **manual** (push button).
  - **Continuous Deployment** → every passing build **auto-deploys** to prod (no human gate).
- [ ] **What is a Pipeline?**
  - Ordered set of **stages** (checkout → build → test → scan → deploy) executed by a CI tool.
  - Pipeline = code (`Jenkinsfile`, `.github/workflows/*.yml`, `.gitlab-ci.yml`).
- [ ] **CI vs CD flow (mental model):**
  ```
  Dev push → [CI: build, test, scan, image] → artifact/image
                                              ↓
                          [CD: deploy → dev → staging → prod]
  ```
- [ ] **Key terms to recognize**
  - Artifact, Registry, Runner/Agent, Trigger, Webhook, Stage, Step, Environment, Secret, Approval gate, Rollback.

📖 Detail → [docs/01-ci-cd-basics.md](docs/01-ci-cd-basics.md)

---

## Module 2 — Tool Comparison

- [ ] **Jenkins** — self-hosted, plugin-driven, `Jenkinsfile` (Groovy DSL). Flexible, mature, heavy.
- [ ] **GitHub Actions** — SaaS, lives in repo `.github/workflows/`, YAML. Easy if code already on GitHub.
- [ ] **GitLab CI** — built into GitLab, `.gitlab-ci.yml`. Tight repo+CI integration.
- [ ] **Azure Pipelines** — Microsoft DevOps, YAML or classic UI. Strong for .NET / Azure.
- [ ] **Argo CD** — **CD-only**, GitOps for Kubernetes. Watches Git → syncs cluster state. *Not a CI tool.*

| Feature        | Jenkins      | GitHub Actions | GitLab CI    | Azure Pipelines | Argo CD     |
|----------------|--------------|----------------|--------------|-----------------|-------------|
| Hosting        | Self         | SaaS / self    | SaaS / self  | SaaS / self     | Self (K8s)  |
| Config         | Groovy       | YAML           | YAML         | YAML            | YAML (CRDs) |
| Scope          | CI + CD      | CI + CD        | CI + CD      | CI + CD         | CD only     |
| Target         | Anything     | Anything       | Anything     | Anything        | Kubernetes  |
| Strength       | Flexibility  | Repo-native    | All-in-one   | Enterprise/MS   | GitOps      |
| Weakness       | Plugin mgmt  | Vendor lock-in | Vendor lock-in | Vendor lock-in | K8s only    |

- [ ] Understand **CI tool vs CD tool**: Argo CD is *pull-based GitOps* — cluster pulls desired state from Git. Jenkins/GH Actions are *push-based* — pipeline pushes to target.

📖 Detail → [docs/02-tool-comparison.md](docs/02-tool-comparison.md)

---

## Module 3 — Setup Jenkins (Docker Compose)

- [ ] Read `docker-compose.yaml` in this folder.
- [ ] Understand services:
  - `jenkins` — controller (LTS image)
  - `jenkins-agent` — optional build agent (SSH)
- [ ] Start Jenkins:
  ```bash
  docker compose up -d
  ```
- [ ] Get initial admin password:
  ```bash
  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
  ```
- [ ] Open `http://localhost:8080` → unlock → install **suggested plugins**.
- [ ] Create first admin user.
- [ ] Verify install (Manage Jenkins → System).
- [ ] Install needed plugins manually if missing:
  - Git, GitHub, Pipeline, Pipeline: Stage View, Docker Pipeline, Credentials Binding, Blue Ocean (optional UI).

📖 Detail → [docs/03-jenkins-setup.md](docs/03-jenkins-setup.md)

---

## Module 4 — CI Pipeline (build + test, from GitHub repo)

> Goal: when devs push to GitHub → Jenkins pulls → builds → tests → produces Docker image.

- [ ] **Add GitHub credentials** to Jenkins
  - Manage Jenkins → Credentials → System → Global → Add
  - Kind: **Username + Personal Access Token** (PAT) — ID: `github-creds`
- [ ] **Add Docker registry credentials** (DockerHub / GHCR / private)
  - ID: `registry-creds`
- [ ] **Create Pipeline job**
  - New Item → **Pipeline** → name: `app-ci`
  - Build Triggers: **GitHub hook trigger for GITScm polling** (or Generic Webhook)
  - Pipeline: **Pipeline script from SCM** → Git → repo URL → credentials → branch `main` → script path `jenkinsfiles/Jenkinsfile.ci`
- [ ] **Connect GitHub webhook**
  - GitHub repo → Settings → Webhooks → Add: `http://<jenkins-host>:8080/github-webhook/`
- [ ] **Pipeline stages to implement** (see `jenkinsfiles/Jenkinsfile.ci`):
  - [ ] Checkout (from GitHub)
  - [ ] Install deps
  - [ ] Lint
  - [ ] Unit test
  - [ ] Build (compile / docker build)
  - [ ] Tag image with git SHA
  - [ ] Push image to registry
  - [ ] (optional) SAST scan (Trivy, Snyk)
- [ ] Trigger first build → check **Console Output** → fix failures.
- [ ] Verify image landed in registry.

📖 Detail → [docs/04-jenkins-ci.md](docs/04-jenkins-ci.md)

---

## Module 5 — CD Pipeline (deploy to production)

> Goal: deploy the image produced by CI → to target env (dev → staging → prod) with manual approval gate before prod.

- [ ] **Decide deploy target** (pick one to start)
  - SSH + docker compose on VM
  - Kubernetes (`kubectl apply` / Helm)
  - Argo CD (commit manifest → cluster pulls)
- [ ] **Add deploy credentials**
  - SSH key → ID: `ssh-prod`
  - or kubeconfig (Secret file) → ID: `kubeconfig-prod`
- [ ] **Create separate Pipeline job** `app-cd`
  - Script path: `jenkinsfiles/Jenkinsfile.cd`
  - Trigger: **upstream** from `app-ci` (Build Triggers → "Build after other projects: `app-ci`") OR manual with `IMAGE_TAG` parameter.
- [ ] **Stages to implement** (see `jenkinsfiles/Jenkinsfile.cd`):
  - [ ] Pull image tag from upstream / param
  - [ ] Deploy to **dev** (auto)
  - [ ] Smoke test dev
  - [ ] Deploy to **staging** (auto)
  - [ ] Integration test staging
  - [ ] **Manual approval gate** (`input` step)
  - [ ] Deploy to **prod**
  - [ ] Post-deploy health check
  - [ ] (optional) Rollback on failure
- [ ] **Notifications** — Slack / Email plugin on success + failure.

📖 Detail → [docs/05-jenkins-cd.md](docs/05-jenkins-cd.md)

---

## Module 6 — Production Flow (end-to-end)

- [ ] Push code to `feature/*` branch → CI runs (build+test only, no deploy).
- [ ] Open PR → merge to `main`.
- [ ] CI on `main` → build image → tag `:main-<sha>` + `:latest` → push registry.
- [ ] CI completes → triggers CD job with the new tag.
- [ ] CD → dev (auto) → staging (auto) → **approval** → prod.
- [ ] Verify on prod → monitor logs / metrics.
- [ ] Tag release in Git (`v1.2.3`) → CD can re-deploy by tag.
- [ ] Practice **rollback**: deploy previous tag, verify, document.

---

## Module 7 — Beyond Beginner (next steps)

- [ ] Migrate Jenkins config to **JCasC** (`jenkins/casc/jenkins.yaml`) — config as code.
- [ ] Use **Shared Libraries** for common pipeline code.
- [ ] Add **Trivy** image scan stage.
- [ ] Try **GitOps with Argo CD** — Jenkins commits new image tag to manifests repo → Argo CD syncs.
- [ ] Compare same pipeline rewritten in GitHub Actions → see trade-offs.

---

## Folder structure

```
Jenkins-Beginner-Learning/
├── README.md                      # this checklist
├── docker-compose.yaml            # Jenkins controller + agent
├── docs/
│   ├── 01-ci-cd-basics.md
│   ├── 02-tool-comparison.md
│   ├── 03-jenkins-setup.md
│   ├── 04-jenkins-ci.md
│   └── 05-jenkins-cd.md
├── jenkinsfiles/
│   ├── Jenkinsfile.ci             # CI pipeline (build + test + push image)
│   └── Jenkinsfile.cd             # CD pipeline (deploy dev → staging → prod)
└── jenkins/
    └── casc/jenkins.yaml          # (optional) Configuration as Code
```
