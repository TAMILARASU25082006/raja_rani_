import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({path:path.join(root,'.env')});
const port=process.env.PORT || '5000';
const url=`http://localhost:${port}`;
const server=spawn(process.execPath,['dist-server/index.js'],{cwd:root,env:process.env,stdio:'inherit'});
let opened=false;
const timer=setInterval(async()=>{
 try {
  const response=await fetch(`${url}/api/health`,{signal:AbortSignal.timeout(1000)});
  if(!response.ok || opened)return;
  opened=true; clearInterval(timer); console.log(`\nOPEN YOUR GAME: ${url}\nKeep this terminal open while playing.\n`);
  if(process.argv.includes('--open')) {
   const command=process.platform==='win32'?'cmd':process.platform==='darwin'?'open':'xdg-open';
   const args=process.platform==='win32'?['/c','start','',url]:[url];
   const opener=spawn(command,args,{stdio:'ignore'}); opener.on('error',()=>console.log(`Open ${url} manually.`));
  }
 }catch{}
},500);
server.on('error',error=>{clearInterval(timer);console.error(error.message);process.exitCode=1;});
server.on('exit',code=>{clearInterval(timer);process.exitCode=code??1;});
process.on('SIGINT',()=>server.kill('SIGINT'));
process.on('SIGTERM',()=>server.kill('SIGTERM'));
