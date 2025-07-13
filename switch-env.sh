#!/bin/bash

# Script to switch between Railway and localhost environments

echo "🌐 API Environment Switcher"
echo "=========================="

if [ "$1" = "railway" ]; then
    echo "🔧 Switching to Railway API..."
    sed -i 's/VITE_USE_RAILWAY=false/VITE_USE_RAILWAY=true/' client/.env
    echo "✅ Switched to Railway API"
    echo "📝 Updated client/.env: VITE_USE_RAILWAY=true"
elif [ "$1" = "localhost" ]; then
    echo "🔧 Switching to localhost API..."
    sed -i 's/VITE_USE_RAILWAY=true/VITE_USE_RAILWAY=false/' client/.env
    echo "✅ Switched to localhost API"
    echo "📝 Updated client/.env: VITE_USE_RAILWAY=false"
else
    echo "Usage: ./switch-env.sh [railway|localhost]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh railway   # Use Railway API"
    echo "  ./switch-env.sh localhost # Use localhost API"
    echo ""
    echo "Current setting:"
    grep "VITE_USE_RAILWAY" client/.env
fi 