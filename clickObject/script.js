document.addEventListener('DOMContentLoaded', function () {
  AFRAME.registerComponent('clickable', {
    init: function () {
      var el = this.el;
      el.addEventListener('click', function () {
        // Cambiar color para el cubo
        if (el.id === 'cubo') {
          el.setAttribute('color', '#FF0000');
        }
        // Cambiar posición para la esfera
        else if (el.id === 'esfera') {
          el.setAttribute('position', '0 2 -3');
        }
        // Hacer más pequeño para el cilindro
        else if (el.id === 'cilindro') {
          var escalaActual = el.getAttribute('scale');
          var nuevaEscala = {
            x: escalaActual.x * 0.9,
            y: escalaActual.y * 0.9,
            z: escalaActual.z * 0.9
          };
          el.setAttribute('scale', nuevaEscala);
        }
      });
    }
  });
});