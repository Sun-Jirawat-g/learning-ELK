# 03 — Jenkins Setup (Docker Compose)

## Start

- [ ] From this folder:
  ```bash
  docker compose up -d
  docker compose ps
  ```
- [ ] Read initial password:
  ```bash
  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
  ```
- [ ] Open `http://localhost:8080` → paste password.
- [ ] Choose **Install suggested plugins**.
- [ ] Create first admin user.

## Plugins to verify installed

- [ ] Git
- [ ] GitHub
- [ ] Pipeline
- [ ] Pipeline: Stage View
- [ ] Docker Pipeline
- [ ] Credentials Binding
- [ ] SSH Agent
- [ ] (optional) Blue Ocean — modern pipeline UI

## Credentials

- [ ] Manage Jenkins → Credentials → System → Global → **Add**
  - `github-creds` — Username + PAT (GitHub Personal Access Token, scopes: `repo`, `read:org`)
  - `registry-creds` — Username + Password (DockerHub or GHCR)
  - `ssh-prod` — SSH Username with Private Key (deploy user on target hosts)

## Verify Docker access from Jenkins container

```bash
docker exec jenkins docker ps
```
If permission denied → ensure `/var/run/docker.sock` mounted and container runs as `root` (already set in compose).

## Restart / logs

```bash
docker compose logs -f jenkins
docker compose restart jenkins
```

## Backup

- [ ] `jenkins_home` volume holds **all** Jenkins state. Back it up regularly.
  ```bash
  docker run --rm -v jenkins_home:/data -v $PWD:/backup alpine \
    tar czf /backup/jenkins_home_$(date +%F).tgz -C /data .
  ```
