# 01 — CI / CD / Pipeline Basics

## CI — Continuous Integration

- [ ] Devs integrate code **frequently** to shared branch (often `main`).
- [ ] Every push runs: **build → test → static checks**.
- [ ] Goal: catch integration bugs **early**, when cheap to fix.
- [ ] Outputs: build status, test report, artifact (jar/binary/docker image).

## CD — two meanings

- [ ] **Continuous Delivery** — every passing build is **release-ready**, but go-live is **manual**.
- [ ] **Continuous Deployment** — every passing build is **auto-deployed** to prod. No human gate.
- [ ] Most teams start with Delivery (safer), move to Deployment when confidence is high.

## Pipeline

- [ ] Sequence of **stages**; each stage has **steps**.
- [ ] Defined as **code** in repo (`Jenkinsfile`, `.gitlab-ci.yml`, GH Actions YAML).
- [ ] Typical stages:
  ```
  checkout → install deps → lint → test → build → scan → publish → deploy
  ```

## Common terms

| Term       | Meaning                                                |
|------------|--------------------------------------------------------|
| Artifact   | output of build (jar, image, binary, zip)              |
| Registry   | place to store/pull images (DockerHub, GHCR, Harbor)   |
| Runner/Agent | machine that executes pipeline steps                 |
| Trigger    | event that starts pipeline (push, PR, cron, manual)    |
| Webhook    | HTTP callback from Git to CI when event happens        |
| Stage      | logical group of steps                                 |
| Secret     | encrypted credential injected into pipeline            |
| Approval   | manual gate before risky stage (usually prod)          |
| Rollback   | revert to previous known-good version                  |

## Mental model

```
Dev ─push→ Git ─webhook→ CI ─build/test→ Artifact/Image ─push→ Registry
                                                            │
                                                            ↓
                                                  CD ─deploy→ dev → staging → prod
```
