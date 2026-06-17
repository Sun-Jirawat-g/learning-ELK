# 02 — Tool Comparison

## Jenkins

- Self-hosted Java server. Massive plugin ecosystem.
- Pipeline as code: `Jenkinsfile` (Groovy DSL).
- Strength: flexible, runs anywhere, mature.
- Weakness: plugin sprawl, manual upgrades, dated UI (use Blue Ocean).

## GitHub Actions

- SaaS, baked into GitHub. Free minutes for public repos.
- Config: `.github/workflows/*.yml`.
- Strength: zero setup if code on GitHub, marketplace of actions.
- Weakness: vendor lock-in, costs scale with usage.

## GitLab CI

- Native to GitLab (SaaS or self-hosted).
- Config: `.gitlab-ci.yml`.
- Strength: tight Git+CI+Registry+K8s integration in one product.
- Weakness: best with GitLab repo (not GitHub).

## Azure Pipelines

- Part of Azure DevOps.
- YAML or classic visual editor.
- Strength: strong Microsoft stack support (.NET, Azure cloud).
- Weakness: vendor-leaning, learning curve outside MS world.

## Argo CD — **CD only, GitOps**

- Lives **in Kubernetes cluster**.
- Watches a Git repo of manifests (declarative state).
- When repo changes → Argo CD **pulls** and syncs cluster.
- **Not a CI tool** — pair it with Jenkins / GH Actions for CI.

## Push vs Pull

- **Push CD** (Jenkins, GH Actions): pipeline runs `kubectl apply` / `ssh deploy`.
- **Pull CD** (Argo CD): cluster pulls desired state from Git. Better auditability, no cluster creds in CI.

## When to pick which?

| Situation                                  | Best fit              |
|--------------------------------------------|-----------------------|
| Code on GitHub, small/medium team          | GitHub Actions        |
| Code on GitLab, want one-product CI/CD     | GitLab CI             |
| Enterprise .NET / Azure                    | Azure Pipelines       |
| Self-hosted, lots of customization, legacy | Jenkins               |
| Kubernetes + GitOps                        | Argo CD (+ CI tool)   |
