import express from 'express'
import { APIError } from '../lib/Error.js';
import { exec, execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

export const mount = '/api/v1/'
export const router = express.Router();

import tokenManager from '../lib/tokenManager.js'
import Token from '../models/Token.model.js';

// Deal with any errors that are returned by functions
function handleApiError(req,res,error:APIError) {
    return res.status(error.statuscode).json({error: error.message})
}

router.use(express.json())

router.use(async (req, res, next) => {
    if(!req.headers.authorization) return res.status(400).json({error: "No authorization header provided"})
    req.headers.authorization = req.headers.authorization.replace("Bearer ", "");

    const token = await tokenManager.getToken(req.headers.authorization as string)
    if(!token) return res.status(401).send({error: "Invalid token"})
    req['token'] = token as Token
    next()
})

router.use(async (req, res, next) => {
    if(req.method == "POST" && !req.body) {
        return res.status(400).json({error: "No data provided"})
    }
    next();
})


router.post('/createtoken', async (req, res) => {
    if(!req.body.ownerIdentifier) return res.status(400).json({error: "No ownerIdentifier provided"})

    const token = await tokenManager.createToken(req.body.ownerIdentifier, req['token'])
    if(token instanceof APIError) return handleApiError(req, res, token)
    return res.json({token: token})
})

router.get('/token', async (req, res) => {
    const token = await tokenManager.getToken(req.body.token)
    if(token instanceof APIError) return handleApiError(req, res, token)
    return res.json({token: token})
})

router.post('/deploy', async (req, res) => {
    const token = req['token'];
    const targetProject = req.body.project;
    const branch = req.body.branch;
    const repoCloneUrl = req.body.repoCloneUrl;

    let command = ''
    if(fs.existsSync(`${os.userInfo().homedir}/projects/${targetProject}`)) {

        command = `
            cd ${os.userInfo().homedir}/projects/${targetProject} && 
            git pull origin ${branch} && 
            docker-compose kill -s SIGINT && 
            docker-compose rm -f && 
            docker-compose build && 
            docker-compose up --detach
        `
    }
    else {
        command = `
            cd ${os.userInfo().homedir}/projects && 
            git clone ${repoCloneUrl} && 
            cd ${targetProject} && 
            git checkout ${branch} && 
            docker-compose up --detach`
    }
    // Run the cmd command
    exec(command, (error, stdout, stderr) => {
        return res.status(200).json({output:stdout, error:error, stderr:stderr})
    });
})