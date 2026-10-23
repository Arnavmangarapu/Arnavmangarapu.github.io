(() => {
 const project=window.portfolio.projects.find(p=>p.id===document.body.dataset.project);
 const diagram=document.querySelector('#case-diagram');
 diagram.innerHTML=window.projectVisuals[diagram.dataset.visual];
 document.querySelector('#case-tags').innerHTML=project.tags.map(tag=>`<span>${tag}</span>`).join('');
 window.initProjectVisuals();
})();
