import * as React from 'react';

<% _.forEach(icons, function(icon) { %>  
  export const ${icon.svgName} = {
    renderPath: () => <>${icon.show_svg.slice(
    icon.show_svg.indexOf("><path") + 1,
    icon.show_svg.lastIndexOf("</<%>") - 5
  )}</>,
  width: ${icon.width},
  height: ${icon.height}
  }
  <% }) %>
