// Progressive enhancement for browsers without cross-document View Transitions.
(() => {
 if ('onpageswap' in window) return;
 document.addEventListener('click', event => {
  const link=event.target.closest('a');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download')||document.documentElement.classList.contains('motion-off'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname||!url.pathname.endsWith('.html'))return;
  event.preventDefault();document.body.classList.add('page-exiting');setTimeout(()=>location.assign(url.href),180);
 });
 addEventListener('pageshow',()=>document.body.classList.remove('page-exiting'));
})();
