const buckets = new Map();
function securityHeaders(req,res,next){
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy','same-origin-allow-popups');
  if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  next();
}
function rateLimit({windowMs=60000,max=60,keyPrefix='general'}={}){
  return (req,res,next)=>{
    const key=`${keyPrefix}:${req.ip||req.socket.remoteAddress||'unknown'}`;
    const now=Date.now(); const current=buckets.get(key);
    if(!current || now-current.start>windowMs){ buckets.set(key,{start:now,count:1}); return next(); }
    current.count += 1;
    if(current.count>max){ res.setHeader('Retry-After',Math.ceil((windowMs-(now-current.start))/1000)); return res.status(429).json({message:'Too many requests. Please try again shortly.'}); }
    next();
  };
}
module.exports={securityHeaders,rateLimit};
