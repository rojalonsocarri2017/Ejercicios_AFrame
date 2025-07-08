AFRAME.registerComponent('art-gallery', {
    schema: {
      figures: { type: 'array' },
      names: { type: 'array' }
    },
    init: function () {
      const data = this.data;
      const el = this.el;
      
      if (data.figures.length !== data.names.length) {
        console.error('El número de objetos definidos es distinto a los nombres que hay declarados');
        return;
      }
  
      // figuras permitidas
      el.setAttribute('allowed-figures', data.figures.join(','));
    }
  });