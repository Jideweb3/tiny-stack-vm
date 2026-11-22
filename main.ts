import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p,g){
 const n=p.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,l=0,q=0,pc=0,t=0;
 // Pre-decode once per program: for every byte position, its opcode (255 = invalid),
 // decoded immediate, and next pc (-1 = immediate cut off by the program's end).
 // The hot loop then never re-reads immediates or re-checks opcode validity per step.
 // Every position is decoded, not just instruction starts, so a jump landing
 // mid-immediate behaves exactly as decoding on the fly would.
 const op=new Uint8Array(n),ar=new Int32Array(n),nx=new Int32Array(n);
 for(let i=0;i<n;i++){
  const b=p[i],ok=b<8||b>=0x10&&b<=0x1e||b>=0x20&&b<=0x22||b>=0x30&&b<=0x34||b===0x40||b===0x41||b>=0x50&&b<=0x53;
  if(!ok){op[i]=255;continue;}
  const im=b===1?1:b===2?4:b>=0x30&&b<=0x33?2:0;
  op[i]=b;
  if(i+im>=n){nx[i]=-1;continue;}
  nx[i]=i+1+im;
  ar[i]=b===1?(p[i+1]<<24)>>24:b===2?p[i+1]|p[i+2]<<8|p[i+3]<<16|p[i+4]<<24:b>=0x30&&b<=0x33?p[i+1]|p[i+2]<<8:0;
 }
 const end=e=>[o.subarray(0,l),e];
 for(;;){
  if(t===1e6)return end(10);
  if(pc<0||pc>=n)return end(9);
  const k=op[pc];
  if(k===255)return end(5);
  const nn=nx[pc];
  if(nn<0)return end(9);
  t++;
  const a=ar[pc];
  pc=nn;
  switch(k){
   case 0x00:return end(0);
   case 0x01:if(s===256)return end(3);D[s++]=a;break;
   case 0x02:if(s===256)return end(3);D[s++]=a;break;
   case 0x03:if(s<1)return end(2);s--;break;
   case 0x04:if(s<1)return end(2);if(s===256)return end(3);D[s]=D[s-1];s++;break;
   case 0x05:if(s<2)return end(2);{const x=D[s-1];D[s-1]=D[s-2];D[s-2]=x;}break;
   case 0x06:if(s<2)return end(2);if(s===256)return end(3);D[s]=D[s-2];s++;break;
   case 0x07:if(s<3)return end(2);{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;}break;
   case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:{
    if(s<2)return end(2);
    const b=D[s-1],a=D[s-2];
    let r;
    if(k===0x10)r=(a+b)|0;
    else if(k===0x11)r=(a-b)|0;
    else if(k===0x12)r=Math.imul(a,b);
    else if(k===0x13){if(!b)return end(4);r=(a/b)|0;}
    else if(k===0x14){if(!b)return end(4);r=a%b|0;}
    else if(k===0x15){if(!b)return end(4);r=(a>>>0)/(b>>>0)|0;}
    else if(k===0x16){if(!b)return end(4);r=(a>>>0)%(b>>>0)|0;}
    else if(k===0x18)r=a&b;
    else if(k===0x19)r=a|b;
    else if(k===0x1a)r=a^b;
    else if(k===0x1c)r=a<<(b&31);
    else if(k===0x1d)r=a>>(b&31);
    else if(k===0x1e)r=a>>>(b&31)|0;
    else if(k===0x20)r=a===b?1:0;
    else if(k===0x21)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    s-=2;D[s++]=r;
    break;}
   case 0x17:if(s<1)return end(2);D[s-1]=-D[s-1]|0;break;
   case 0x1b:if(s<1)return end(2);D[s-1]=~D[s-1];break;
   case 0x30:case 0x31:case 0x32:{
    const rel=(a<<16)>>16;
    if(k===0x30){pc=nn+rel;break;}
    if(s<1)return end(2);
    const v=D[--s];
    if((k===0x31)===(v===0))pc=nn+rel;
    break;}
   case 0x33:if(c===64)return end(7);C[c++]=nn;pc=a;break;
   case 0x34:if(!c)return end(8);pc=C[--c];break;
   case 0x40:if(s<1)return end(2);{const a=D[s-1];if(a<0||a>255)return end(6);D[s-1]=M[a];}break;
   case 0x41:if(s<2)return end(2);{const a=D[s-1];if(a<0||a>255)return end(6);M[a]=D[s-2];s-=2;}break;
   case 0x50:{
    if(s<1)return end(2);
    const v=D[s-1];
    let u=v<0?-v:v,ln=v<0?1:0,x=u;
    do{ln++;x=(x/10)|0;}while(x);
    if(l+ln>65536)return end(11);
    s--;
    let i=l+ln;
    if(v<0)o[l]=45;
    x=u;
    do{o[--i]=48+x%10;x=(x/10)|0;}while(x);
    l+=ln;
    break;}
   case 0x51:if(s<1)return end(2);if(l>=65536)return end(11);o[l++]=D[--s]&255;break;
   case 0x52:if(s===256)return end(3);D[s++]=q<g.length?g[q++]:-1;break;
   case 0x53:if(s<1)return end(2);return end(D[--s]&255);
  }
 }
}
for(const id of readdirSync(I).sort()){
 const[b,e]=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),b);
 writeFileSync(join(O,id,'exit.txt'),e+'\n');
}
