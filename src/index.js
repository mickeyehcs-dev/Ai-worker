export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Cloudflare AI Chat</title>
<style>
body{font-family:Arial;margin:0;background:#111;color:#fff}
header{padding:16px;background:#222}
#chat{height:70vh;overflow:auto;padding:12px}
.msg{margin:8px 0;padding:10px;border-radius:8px}
.user{background:#2563eb}
.ai{background:#333}
footer{display:flex;padding:10px;gap:8px}
input{flex:1;padding:10px}
button{padding:10px}
</style></head>
<body>
<header><h2>Cloudflare AI Chat</h2></header>
<div id="chat"></div>
<footer>
<input id="msg" placeholder="Ask something...">
<button onclick="send()">Send</button>
</footer>
<script>
async function send(){
 const t=document.getElementById('msg');
 const v=t.value.trim(); if(!v)return;
 chat.innerHTML+=`<div class="msg user">${v}</div>`;
 t.value='';
 const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})});
 const j=await r.json();
 chat.innerHTML+=`<div class="msg ai">${j.reply||JSON.stringify(j)}</div>`;
 chat.scrollTop=chat.scrollHeight;
}
</script></body></html>`,{headers:{"content-type":"text/html"}});
    }
    const {message=""}=await request.json();
    const out=await env.AI.run("@cf/google/gemma-3-1b-it",{
      messages:[{role:"system",content:"You are a helpful assistant."},{role:"user",content:message}],
      max_tokens:200
    });
    return Response.json({reply:out.response ?? JSON.stringify(out)});
  }
}
