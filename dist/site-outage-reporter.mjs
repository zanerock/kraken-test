import{readFile as e}from"node:fs/promises"
import{resolve as t}from"node:path"
import s from"fetch-retry"
const r=async({apiKey:e,url:t,fetch:r=global.fetch,retryDelay:o=1e3,options:i})=>{r=s(r)
const n=(null==i?void 0:i.method)||"GET"
process.stdout.write(`Calling ${n} ${t}...\n`)
const a={headers:{"x-api-key":e},retryDelay:o}
Object.assign(a,i),a.retryOn=(e,t,s)=>{const{status:r}=s
if(null!==t||408===r||409===r||429===r||r>=500){if(e<3)return null!==t&&process.stdout.write("Error reported: "+t.message+"\n"),process.stdout.write(`retrying (got status: ${s.status}); attempt ${e+1} of 3...\n`),!0
process.stdout.write("retry count exceeded\n")}return!1}
const c=await r(t,a),u=await c.json()
if(!1===c.ok)throw new Error(`Call failed (status: ${c.status}${null!=u&&u.message?"; message: "+u.message:""}).`)
return process.stdout.write("request complete\n"),u},o="https://api.krakenflex.systems/interview-tests-mock-api/v1",i=class{constructor(e){this.apiKey=e}async getOutages(){const e=await r({apiKey:this.apiKey,url:o+"/outages"})
return process.stdout.write(`Found ${e.length} outages...\n`),e}async getSiteInfo(e){return r({apiKey:this.apiKey,url:o+`/site-info/${e}`})}async postSiteOutages(e,t){const s={body:JSON.stringify(t),method:"POST"}
return r({apiKey:this.apiKey,url:o+"/site-outages/"+e,options:s})}},n=async function({apiKey:s,configDir:r=process.cwd(),cutoffTime:o=new Date("2022-01-01T00:00:00.000Z"),siteId:n="norwich-pear-tree"}={}){void 0===s&&(s=await(async s=>{const r=t(s,"api-key.txt")
let o
try{o=(await e(r,{encoding:"utf8"})).trim()}catch(e){throw"ENOENT"===e.code?new Error(`Did not find configured API key file '${r}'; configure default key or set API key option.`,{cause:e}):new Error(`Unknown error occurred while reading configured API key file '${r}' (${e.message}); verify file exists and is readable or set API key option.`,{cause:e})}if(!o)throw new Error(`Found API key file '${r}', but it was empty.`)
return o})(r)),process.stdout.write(`Attempting to report outages for ${n} at or before ${o.toISOString()}...\n`)
const a=new i(s),c=(({cutoffTime:e,outages:t,siteInfo:s})=>{process.stdout.write("Merging data...\n")
const r=s.devices.reduce(((e,{id:t,name:s})=>(e[t]=s,e)),{})
return t.reduce(((t,s)=>{const{begin:o,id:i}=s,n=r[i]
return void 0!==n&&new Date(o)>=e&&(s.name=n,t.push(s)),t}),[])})({cutoffTime:o,outages:await a.getOutages(),siteInfo:await a.getSiteInfo(n)})
process.stdout.write(`Found ${c.length} applicable site records...\n`),await a.postSiteOutages(n,c),console.log("Success")}
export{n as siteOutageReporter}
//# sourceMappingURL=site-outage-reporter.mjs.map
