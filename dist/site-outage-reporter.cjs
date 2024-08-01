"use strict"
Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})
const e=require("node:fs/promises"),t=require("node:path"),s=require("fetch-retry"),r=async({apiKey:e,url:t,fetch:r=global.fetch,retryDelay:o=1e3,options:i})=>{r=s(r)
const n=(null==i?void 0:i.method)||"GET"
process.stdout.write(`Calling ${n} ${t}...\n`)
const a={headers:{"x-api-key":e},retryDelay:o}
Object.assign(a,i),a.retryOn=(e,t,s)=>{const{status:r}=s
if(null!==t||408===r||409===r||429===r||r>=500){if(e<3)return null!==t&&process.stdout.write("Error reported: "+t.message+"\n"),process.stdout.write(`retrying (got status: ${s.status}); attempt ${e+1} of 3...\n`),!0
process.stdout.write("retry count exceeded\n")}return!1}
const u=await r(t,a),c=await u.json()
if(!1===u.ok)throw new Error(`Call failed (status: ${u.status}${null!=c&&c.message?"; message: "+c.message:""}).`)
return process.stdout.write("request complete\n"),c},o="https://api.krakenflex.systems/interview-tests-mock-api/v1",i=class{constructor(e){this.apiKey=e}async getOutages(){const e=await r({apiKey:this.apiKey,url:o+"/outages"})
return process.stdout.write(`Found ${e.length} outages...\n`),e}async getSiteInfo(e){return r({apiKey:this.apiKey,url:o+`/site-info/${e}`})}async postSiteOutages(e,t){const s={body:JSON.stringify(t),method:"POST"}
return r({apiKey:this.apiKey,url:o+"/site-outages/"+e,options:s})}}
exports.siteOutageReporter=async function({apiKey:s,configDir:r=process.cwd(),cutoffTime:o=new Date("2022-01-01T00:00:00.000Z"),siteId:n="norwich-pear-tree"}={}){void 0===s&&(s=await(async s=>{const r=t.resolve(s,"api-key.txt")
let o
try{o=(await e.readFile(r,{encoding:"utf8"})).trim()}catch(e){throw"ENOENT"===e.code?new Error(`Did not find configured API key file '${r}'; configure default key or set API key option.`,{cause:e}):new Error(`Unknown error occurred while reading configured API key file '${r}' (${e.message}); verify file exists and is readable or set API key option.`,{cause:e})}if(!o)throw new Error(`Found API key file '${r}', but it was empty.`)
return o})(r)),process.stdout.write(`Attempting to report outages for ${n} at or before ${o.toISOString()}...\n`)
const a=new i(s),u=(({cutoffTime:e,outages:t,siteInfo:s})=>{process.stdout.write("Merging data...\n")
const r=s.devices.reduce(((e,{id:t,name:s})=>(e[t]=s,e)),{})
return t.reduce(((t,s)=>{const{begin:o,id:i}=s,n=r[i]
return void 0!==n&&new Date(o)>=e&&(s.name=n,t.push(s)),t}),[])})({cutoffTime:o,outages:await a.getOutages(),siteInfo:await a.getSiteInfo(n)})
process.stdout.write(`Found ${u.length} applicable site records...\n`),await a.postSiteOutages(n,u),console.log("Success")}
//# sourceMappingURL=site-outage-reporter.cjs.map
