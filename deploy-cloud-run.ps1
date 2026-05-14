param(
  [string]$ProjectId = "interactive-web-apps",
  [string]$ServiceName = "faceless-youtube-video-generator",
  [string]$Region = "us-central1"
)

$ErrorActionPreference = "Stop"

$Gcloud = Get-Command gcloud.cmd -ErrorAction SilentlyContinue
if (-not $Gcloud) {
  $Gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
}

if (-not $Gcloud) {
  throw "gcloud CLI is required. Install it from https://cloud.google.com/sdk/docs/install, then run: gcloud auth login"
}

Write-Host "Deploying $ServiceName to Cloud Run project $ProjectId in $Region..."

& $Gcloud.Source config set project $ProjectId

& $Gcloud.Source run deploy $ServiceName `
  --source . `
  --region $Region `
  --platform managed `
  --allow-unauthenticated `
  --port 8080

Write-Host "Deployment complete."
