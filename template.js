!function(m){var l,t=`<svg><% _.forEach(icons, function(icon) { %>
  <symbol id="icon${uniqueId && '-'+uniqueId}-${icon.font_class}" viewBox="0 0 1024 1024">
  ${icon.show_svg.slice(icon.show_svg.indexOf('><path')+1, icon.show_svg.lastIndexOf('</svg>'))}</symbol><% }); %></svg>`,o=(l=document.getElementsByTagName("script"))[l.length-1].getAttribute("data-injectcss");if(o&&!m.__iconfont__svg__cssinject__){m.__iconfont__svg__cssinject__=!0;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(l){console&&console.log(l)}}!function(l){if(document.addEventListener)if(~["complete","loaded","interactive"].indexOf(document.readyState))setTimeout(l,0);else{var o=function(){document.removeEventListener("DOMContentLoaded",o,!1),l()};document.addEventListener("DOMContentLoaded",o,!1)}else document.attachEvent&&(e=l,i=m.document,h=!1,(c=function(){try{i.documentElement.doScroll("left")}catch(l){return void setTimeout(c,50)}t()})(),i.onreadystatechange=function(){"complete"==i.readyState&&(i.onreadystatechange=null,t())});function t(){h||(h=!0,e())}var e,i,h,c}(function(){var l,o;(l=document.createElement("div")).innerHTML=t,t=null,(o=l.getElementsByTagName("svg")[0])&&(o.setAttribute("aria-hidden","true"),o.style.position="absolute",o.style.width=0,o.style.height=0,o.style.overflow="hidden",function(l,o){o.firstChild?function(l,o){o.parentNode.insertBefore(l,o)}(l,o.firstChild):o.appendChild(l)}(o,document.body))})}(window);