# deploy-server-contactor
A simple webserver to receive requests to force a redeployment of a running docker-compose instance.

## How does it work?
Using a simple Github action you can send a request (with a token) to (re)deploy a project to your docker instance.
A template of this action is below:
```yml
name: Node.js CI

on:
  push:
    branches: [ main ]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 16.x
        uses: actions/setup-node@v3
        with:
          node-version: 16.x
      - run: |
          git clone https://github.com/AtherActive-net/deploy-client.git
          cd deploy-client
          npm i
          node dist/app.js ${{ vars.PROJECT }} main ${{ vars.REPOCLONEURL }} ${{ secrets.TOKEN }} "{}"
```

## Setup
Setup is pretty easy, but we will go through it anyway! Please note, this server **CANNOT** run inside a docker container, as it needs access to the docker commands provided by the host system.

### Prerequirements
There are some obvious dependencies here, which are `docker` and `docker-compose`. `node 16.x+` is also required. Finally, an SQL database is a good idea for your tokens. The default token is called `default` and will be destroyed the first time you make a valid request to `/api/v1/createtoken`.

### Downloading
First off, you will need to download teh server. It is recommended to take the `latest` release. You can take a `prerelease` too if you need experimental features.

### Configuring env vars

### Running
Now, running is the tricky part. This webserver **requires** to be run as su. This is needed as docker requires it and this webserver runs *direct* docker-compose commands.

Whatever solution you plan for this does not matter, however the command to run will be `npm run start`.
