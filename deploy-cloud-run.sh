#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-interactive-web-apps}"
SERVICE_NAME="${2:-faceless-youtube-video-generator}"
REGION="${3:-us-central1}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required. Install from https://cloud.google.com/sdk/docs/install"
  exit 1
fi

echo "Deploying ${SERVICE_NAME} to Cloud Run project ${PROJECT_ID} in ${REGION}..."

gcloud config set project "${PROJECT_ID}"

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080

echo "Deployment complete."
