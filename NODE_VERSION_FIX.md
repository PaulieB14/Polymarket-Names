# Fixing Node.js Version Issue for Graph CLI

The Graph CLI requires Node.js version >=20.18.1, but your system has v18.20.8. Here are several ways to resolve this:

## Option 1: Install Node.js using NVM (Node Version Manager)

NVM allows you to install and switch between multiple Node.js versions easily.

### Install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Restart your terminal or source your profile:

```bash
source ~/.zshrc  # or ~/.bash_profile or ~/.bashrc depending on your shell
```

### Install and use Node.js 20:

```bash
nvm install 20
nvm use 20
```

### Verify the installation:

```bash
node -v  # Should show v20.x.x
```

## Option 2: Use Docker

You can use a Docker container with the required Node.js version.

### Create a Dockerfile:

```bash
echo 'FROM node:20
WORKDIR /app
COPY . .
RUN npm install -g @graphprotocol/graph-cli
CMD ["bash"]' > Dockerfile
```

### Build and run the Docker container:

```bash
docker build -t graph-cli .
docker run -it --rm -v $(pwd):/app graph-cli
```

## Option 3: Temporary Workaround - Modify the Graph CLI

This is a hacky solution but can work in a pinch:

1. Find the version check in the Graph CLI:

```bash
cd node_modules/@graphprotocol/graph-cli
grep -r "Node.js version" .
```

2. Edit the file that contains the version check to bypass it (the exact file may vary):

```bash
# Example (the actual file path may be different)
vim ./dist/cli.js
```

3. Find the version check code and comment it out or modify it to accept your Node.js version.

## Option 4: Use npx with the Local Installation

Since we've already built the subgraph successfully using the local installation, you can continue using npx to run the Graph CLI commands:

```bash
cd polymarket-subgraph
npx graph deploy --node https://api.studio.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ polymarket-human-readable-markets
```

This bypasses the need for a global installation with the version check.
