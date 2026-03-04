#!/bin/bash

# docker run -d -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack

# Copy and run mode for container (when called from host with ./init_s3.sh CONTAINER_ID)
if [ -n "$1" ] && ! command -v awslocal &>/dev/null; then
    CONTAINER_ID="$1"
    SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
    echo "📦 Copying script to container and executing..."
    docker cp "$SCRIPT_PATH" "$CONTAINER_ID":/init_s3.sh
    docker exec -it "$CONTAINER_ID" /bin/bash /init_s3.sh
    exit $?
fi

echo "🚀 Starting LocalStack S3 and creating buckets..."

# 1. Create Public and Private Buckets
awslocal s3 mb s3://public
awslocal s3 mb s3://private

# 2. Set access permissions (ACL) for public bucket
# (Note: Granting public-read at the bucket level in LocalStack is a good practice)
awslocal s3api put-bucket-acl --bucket public --acl public-read
awslocal s3api put-public-access-block \
    --bucket public \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "✅ S3 buckets created successfully!"
awslocal s3 ls

