# how to start
```bash
vim .env
yarn install
yarn start
```

`.env` file
```
REACT_APP_IMAGE_PATH=<backend-pictures-path>
```

# fix
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```