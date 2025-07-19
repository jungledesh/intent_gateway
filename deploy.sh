#!/bin/bash

echo "🧹 Cleaning cargo ..."
cargo clean

echo "🧹 Cleaning anchor ..."
anchor clean

echo "📁 Recreating deploy directory..."
mkdir -p target/deploy

echo "🔁 Restoring program keypair..."
cp keys/intent_gateway-keypair.json target/deploy/intent_gateway-keypair.json

# ✅ Delete old IDL (important)
rm -f target/idl/intent_gateway.json

echo "🔨 Building..."
anchor build

# Check: does this file now contain p2pTransfer?
cat target/idl/intent_gateway.json | jq '.instructions[].name'

echo "🚀 Deploying to $1..."
anchor deploy --provider.cluster $1

echo "Running tests ..."
anchor test