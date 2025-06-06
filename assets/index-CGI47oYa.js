import{s as c,ac as i,ad as h,t as u,j as s,U as m,L as p,G as k,x as v,T as n,C as g,H as x}from"./index-BqrwD2Al.js";import{I as b}from"./IconUserCircle-D5slchT-.js";import{I as y}from"./IconChevronRight-Dfgpj9QB.js";/**
 * @license @tabler/icons-react v3.33.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var I=c("outline","cash-banknote","IconCashBanknote",[["path",{d:"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",key:"svg-0"}],["path",{d:"M3 8a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z",key:"svg-1"}],["path",{d:"M18 12h.01",key:"svg-2"}],["path",{d:"M6 12h.01",key:"svg-3"}]]);/**
 * @license @tabler/icons-react v3.33.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var f=c("outline","file-info","IconFileInfo",[["path",{d:"M14 3v4a1 1 0 0 0 1 1h4",key:"svg-0"}],["path",{d:"M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z",key:"svg-1"}],["path",{d:"M11 14h1v4h1",key:"svg-2"}],["path",{d:"M12 11h.01",key:"svg-3"}]]);/**
 * @license @tabler/icons-react v3.33.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var C=c("outline","receipt-2","IconReceipt2",[["path",{d:"M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2",key:"svg-0"}],["path",{d:"M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5",key:"svg-1"}]]);/**
 * @license @tabler/icons-react v3.33.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var M=c("outline","truck-return","IconTruckReturn",[["path",{d:"M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-0"}],["path",{d:"M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-1"}],["path",{d:"M5 17h-2v-11a1 1 0 0 1 1 -1h9v6h-5l2 2m0 -4l-2 2",key:"svg-2"}],["path",{d:"M9 17l6 0",key:"svg-3"}],["path",{d:"M13 6h5l3 5v6h-2",key:"svg-4"}]]);const z=function(){const{customerId:l}=i({from:"/customer/$customerId/"}),a=h({from:"/customer/$customerId"});a!=null&&a.name;const e=(a==null?void 0:a.id)||l,t=u("light"),d=[{label:"Orders",description:"View and manage customer orders",icon:C,color:"blue",path:`/customer/${e}/orders`},{label:"Collections",description:"Record and track collections",icon:I,color:"green",path:`/customer/${e}/collections`},{label:"Returns",description:"Process customer returns",icon:M,color:"orange",path:`/customer/${e}/returns`},{label:"Statement",description:"View customer account statement",icon:f,color:"grape",path:`/customer/${e}/statement`},{label:"Customer Details",description:"View and edit customer information",icon:b,color:"teal",path:`/customer/${e}/detail`}].map(r=>s.jsx(m,{component:p,to:r.path,style:o=>({display:"block",padding:o.spacing.md,borderRadius:o.radius.sm,border:`1px solid ${t==="dark"?o.colors.dark[4]:o.colors.gray[3]}`,color:t==="dark"?o.colors.dark[0]:o.black,backgroundColor:t==="dark"?o.colors.dark[7]:o.white,boxShadow:o.shadows.sm,transition:"box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.1s ease-in-out","&:hover":{backgroundColor:t==="dark"?o.colors.dark[6]:o.colors.gray[0],boxShadow:o.shadows.md},"&:active":{transform:"scale(0.98)",boxShadow:o.shadows.xs}}),children:s.jsxs(k,{children:[s.jsx(v,{color:r.color,variant:"light",size:"lg",children:s.jsx(r.icon,{size:"1.5rem"})}),s.jsxs("div",{children:[s.jsx(n,{size:"lg",fw:500,children:r.label}),s.jsx(n,{size:"sm",c:"dimmed",children:r.description})]}),s.jsx(y,{size:"1rem",style:{marginLeft:"auto"}})]})},r.label));return s.jsxs(s.Fragment,{children:[s.jsx(g,{order:2,ta:"center",mb:"lg",fw:600,c:"primaryColor.7",children:"Customer Menu"}),s.jsx(x,{cols:{base:1,sm:2,md:3},spacing:"xs",children:d})]})};export{z as component};
