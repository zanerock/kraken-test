#!/usr/bin/env -S node --enable-source-maps
"use strict"
const e=require("command-line-args"),t=require("string-input"),r=require("node:fs/promises"),s=require("node:path"),i=require("fetch-retry"),o={mainCommand:"site-outage-reporter",arguments:[{name:"api-key",description:"The API key to use in contacting the Kraken system. If not provided, will search the current working dir for 'api-key.txt' and use it's contents as the key."},{name:"cutoff-time",type:t.DateTime,typeDesc:"DateTime",description:"The earliest outage (beginning) to include in the site outage report. Will accept many formats including '2022-01-01T00:00:00.000Z', '1 Jan 2022 00:00:00 Z,', '2022-01-01 00:00:00 Z', etc.",default:"2022-01-01T00:00:00.000Z"},{name:"site-id",description:"The site ID for which to generate the report.",default:"norwich-pear-tree"},{name:"throw-error",type:Boolean,description:"If set, will throw an error instead of simply reporting the message. Useful for debugging."}]},n=async({apiKey:e,url:t,fetch:r=global.fetch,retryDelay:s=1e3,options:o})=>{r=i(r)
const n=(null==o?void 0:o.method)||"GET"
process.stdout.write(`Calling ${n} ${t}...\n`)
const a={headers:{"x-api-key":e},retryDelay:s}
Object.assign(a,o),a.retryOn=(e,t,r)=>{const{status:s}=r
if(null!==t||408===s||409===s||429===s||s>=500){if(e<3)return null!==t&&process.stdout.write("Error reported: "+t.message+"\n"),process.stdout.write(`retrying (got status: ${r.status}); attempt ${e+1} of 3...\n`),!0
process.stdout.write("retry count exceeded\n")}return!1}
const c=await r(t,a),u=await c.json()
if(!1===c.ok)throw new Error(`Call failed (status: ${c.status}${null!=u&&u.message?"; message: "+u.message:""}).`)
return process.stdout.write("request complete\n"),u},a="https://api.krakenflex.systems/interview-tests-mock-api/v1",c=class{constructor(e){this.apiKey=e}async getOutages(){const e=await n({apiKey:this.apiKey,url:a+"/outages"})
return process.stdout.write(`Found ${e.length} outages...\n`),e}async getSiteInfo(e){return n({apiKey:this.apiKey,url:a+`/site-info/${e}`})}async postSiteOutages(e,t){const r={body:JSON.stringify(t),method:"POST"}
return n({apiKey:this.apiKey,url:a+"/site-outages/"+e,options:r})}},u=async function({apiKey:e,configDir:t=process.cwd(),cutoffTime:i=new Date("2022-01-01T00:00:00.000Z"),siteId:o="norwich-pear-tree"}={}){void 0===e&&(e=await(async e=>{const t=s.resolve(e,"api-key.txt")
let i
try{i=(await r.readFile(t,{encoding:"utf8"})).trim()}catch(e){throw"ENOENT"===e.code?new Error(`Did not find configured API key file '${t}'; configure default key or set API key option.`,{cause:e}):new Error(`Unknown error occurred while reading configured API key file '${t}' (${e.message}); verify file exists and is readable or set API key option.`,{cause:e})}if(!i)throw new Error(`Found API key file '${t}', but it was empty.`)
return i})(t)),process.stdout.write(`Attempting to report outages for ${o} at or before ${i.toISOString()}...\n`)
const n=new c(e),a=(({cutoffTime:e,outages:t,siteInfo:r})=>{process.stdout.write("Merging data...\n")
const s=r.devices.reduce(((e,{id:t,name:r})=>(e[t]=r,e)),{})
return t.reduce(((t,r)=>{const{begin:i,id:o}=r,n=s[o]
return void 0!==n&&new Date(i)>=e&&(r.name=n,t.push(r)),t}),[])})({cutoffTime:i,outages:await n.getOutages(),siteInfo:await n.getSiteInfo(o)})
process.stdout.write(`Found ${a.length} applicable site records...\n`),await n.postSiteOutages(o,a),console.log("Success")};(async()=>{(async({argv:r=process.argv}={})=>{let s
try{s=e(o.arguments,{argv:r,camelCase:!0}),void 0===s.cutoffTime&&(s.cutoffTime=t.DateTime("2022-01-01T00:00:00.000Z")),void 0===s.siteId&&(s.siteId="norwich-pear-tree"),s.cutoffTime=s.cutoffTime.getDate(),await u(s)}catch(e){if(!0===s.throwError)throw e
process.stdout.write(`ERROR: ${e.message}\n`)}})()})()
//# sourceMappingURL=site-outage-reporter-exec.js.map
