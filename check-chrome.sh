#!/bin/bash

echo "Checking Chrome installations..."
echo ""

# Check Chrome Stable
if [ -d "/Applications/Google Chrome.app" ]; then
    STABLE_VERSION=$(/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version 2>/dev/null)
    echo "✓ Chrome Stable: $STABLE_VERSION"
else
    echo "✗ Chrome Stable: Not installed"
fi

# Check Chrome Canary
if [ -d "/Applications/Google Chrome Canary.app" ]; then
    CANARY_VERSION=$(/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --version 2>/dev/null)
    echo "✓ Chrome Canary: $CANARY_VERSION"
else
    echo "✗ Chrome Canary: Not installed"
fi

# Check Chrome Dev
if [ -d "/Applications/Google Chrome Dev.app" ]; then
    DEV_VERSION=$(/Applications/Google\ Chrome\ Dev.app/Contents/MacOS/Google\ Chrome\ Dev --version 2>/dev/null)
    echo "✓ Chrome Dev: $DEV_VERSION"
else
    echo "✗ Chrome Dev: Not installed"
fi

# Check Chrome Beta
if [ -d "/Applications/Google Chrome Beta.app" ]; then
    BETA_VERSION=$(/Applications/Google\ Chrome\ Beta.app/Contents/MacOS/Google\ Chrome\ Beta --version 2>/dev/null)
    echo "✓ Chrome Beta: $BETA_VERSION"
else
    echo "✗ Chrome Beta: Not installed"
fi

echo ""
echo "Chrome AI requires version 127+ (Canary, Dev, or Beta)"
