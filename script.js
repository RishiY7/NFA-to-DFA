function sanitizeStateName(s){ return s.trim(); }
function parseNFA(text){
  const lines=text.trim().split("\n").map(l=>l.trim()).filter(l=>l.length>0);
  const states=lines[0].split(",").map(s=>sanitizeStateName(s));
  const start=lines[1].trim();
  const finals=lines[2].split(",").map(s=>sanitizeStateName(s));
  const transitions=lines.slice(3).map(l=>l.split(",").map(p=>p.trim()));
  return {states,start,finals,transitions};
}

function drawGraphAnimated(svgSelector, states, finals, transitions){
    const svg=d3.select(svgSelector);
    svg.selectAll("*").remove();
    svg.append("defs").append("marker")
      .attr("id","arrow").attr("viewBox","0 0 10 10").attr("refX",12).attr("refY",5)
      .attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto")
      .append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("fill","#0b1220");

    const g=new dagreD3.graphlib.Graph().setGraph({rankdir:"LR",nodesep:50,ranksep:70});
    states.forEach(s=>g.setNode(s,{label:s,class:finals.includes(s)?"finalState":"",shape:"circle"}));
    transitions.forEach(([from,symbol,to])=>{
      if(g.edge(from,to)) g.edge(from,to).label += "," + symbol;
      else g.setEdge(from,to,{label:symbol});
    });

    const inner=svg.append("g");
    const render=new dagreD3.render();
    render(inner,g);

    const svgWidth=+svg.attr("width")||svg.node().clientWidth;
    const svgHeight=+svg.attr("height")||svg.node().clientHeight;
    const scaleX=svgWidth / g.graph().width;
    const scaleY=svgHeight / g.graph().height;
    const scale=Math.min(scaleX, scaleY,1);
    inner.attr("transform",`translate(${(svgWidth - g.graph().width*scale)/2},${(svgHeight - g.graph().height*scale)/2}) scale(${scale})`);

    svg.call(d3.zoom().scaleExtent([0.3,3]).on("zoom",e=>inner.attr("transform",e.transform)));

    const nodes=inner.selectAll(".node circle").style("opacity",0)
        .transition().delay((d,i)=>i*300).duration(300).style("opacity",1);

    const edges=inner.selectAll(".edgePath path");
    edges.each(function(_,i){
        const path=d3.select(this);
        const totalLength=this.getTotalLength();
        path.attr("stroke-dasharray",totalLength+" "+totalLength)
            .attr("stroke-dashoffset",totalLength)
            .style("opacity",1)
            .attr("marker-end",null)
            .transition()
            .delay(nodes.size()*300 + i*500)
            .duration(600)
            .attr("stroke-dashoffset",0)
            .on("end",()=>path.attr("marker-end","url(#arrow)"));
    });
}

let lastNFA=null;

function generateNFA(){
  const status=document.getElementById("statusText");
  try{
    const nfa=parseNFA(document.getElementById("nfaInput").value);
    lastNFA=nfa;
    status.textContent="Rendering NFA...";
    drawGraphAnimated("#nfaSVG", nfa.states, nfa.finals, nfa.transitions);
    makeTable("nfaTable", nfa.states, nfa.transitions,[...new Set(nfa.transitions.map(t=>t[1]))].sort());
    status.textContent="NFA Ready. Click Convert to DFA.";
    document.getElementById("conversionSteps").innerHTML="Steps will appear here after converting to DFA.";
  }catch(e){ status.textContent="Error: "+e.message; alert("Input Error:\n"+e.message); }
}

function convertNFAtoDFAWithSteps(nfa){
  const steps=[];
  const dfaStates=[], dfaTransitions=[], queue=[], visited=new Set();
  const setName=set=>[...set].sort().join("_")||"∅";
  const alphabet=[...new Set(nfa.transitions.map(t=>t[1]))].sort();
  const startSet=new Set([nfa.start]); queue.push(startSet);

  while(queue.length){
    const current=queue.shift(), name=setName(current);
    if(visited.has(name)) continue; visited.add(name);
    dfaStates.push(name);
    const step={dfaState:name, fromNFA:[...current], transitions:{}};
    alphabet.forEach(symbol=>{
      const next=new Set();
      current.forEach(s=>{ nfa.transitions.forEach(([from,sym,to])=>{ if(from===s&&sym===symbol) next.add(to); }); });
      const nextName=setName(next);
      if(next.size>0){ dfaTransitions.push([name,symbol,nextName]); if(!visited.has(nextName)) queue.push(next); }
      step.transitions[symbol]=[...next].sort();
    });
    steps.push(step);
  }
  const dfaFinals=dfaStates.filter(s=>s.split("_").some(x=>nfa.finals.includes(x)));
  return {states:dfaStates,start:setName(startSet),finals:dfaFinals,transitions:dfaTransitions,alphabet,steps};
}

function makeTable(divID, states, transitions, alphabet){
  alphabet=alphabet||["0","1"];
  let html="<table><thead><tr><th>State</th>";
  alphabet.forEach(a=>html+=`<th>${a}</th>`); html+="</tr></thead><tbody>";
  states.forEach(s=>{
    html+=`<tr><td><strong>${s}</strong></td>`;
    alphabet.forEach(a=>{ const cell=transitions.filter(t=>t[0]===s&&t[1]===a).map(t=>t[2]).join(",")||"-"; html+=`<td>${cell}</td>`; });
    html+="</tr>";
  });
  html+="</tbody></table>"; document.getElementById(divID).innerHTML=html;
}

function displaySteps(steps){
  const container=document.getElementById("conversionSteps");
  container.innerHTML="";
  steps.forEach((step,i)=>{
    const div=document.createElement("div");
    div.classList.add("step-title");
    div.textContent=`Step ${i+1}: DFA State = ${step.dfaState}`;
    container.appendChild(div);
    const content=document.createElement("div");
    content.classList.add("step-content");
    const trows=Object.entries(step.transitions).map(([sym,arr])=>`${sym}: {${arr.join(",")}}`).join(" | ");
    content.textContent=`NFA States: {${step.fromNFA.join(",")}} → Transitions: ${trows}`;
    container.appendChild(content);
  });
}

function convertToDFA(){
  if(!lastNFA){ alert("Generate NFA first!"); return; }
  const status=document.getElementById("statusText");
  status.textContent="Converting to DFA...";
  const dfa=convertNFAtoDFAWithSteps(lastNFA);
  drawGraphAnimated("#dfaSVG", dfa.states, dfa.finals, dfa.transitions); // edges animate sequentially
  makeTable("dfaTable", dfa.states, dfa.transitions, dfa.alphabet);
  displaySteps(dfa.steps);
  status.textContent="DFA Ready!";
}
