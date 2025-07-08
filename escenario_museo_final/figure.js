AFRAME.registerComponent('figure', {
  schema: {
    figure: { type: 'string' },
    description: { type: 'string' },
    position: { type: 'string', default: '0 1.2 3' },
    // pinchable: { type: 'boolean', default: false },
    scale: { type: 'string', default: '0.2 0.2 0.2' },  // Añadido el parámetro de escala
    textScale: { type: 'string', default: '2 2 2' },   // Añadido el parámetro de escala del texto
    textPosition: { type: 'string', default: '0 0.7 0' },  // Añadido el parámetro de posición del texto

  },

  init: function () {
    var data = this.data;
    var el = this.el;
    this.localPosition = new THREE.Vector3();
    // this.bindMethods();
    // Encuentra el elemento art-gallery más cercano y verifica las figuras permitidas
    var artGalleryEl = el.closest('[art-gallery]');
    console.log('artGalleryEl: ' + artGalleryEl)
    if (!artGalleryEl) {
      console.error('No se encontró un elemento shelf para la opción:', data.figure);
      return;
    }

    // Esperar a que el art-gallery esté completamente inicializado
    artGalleryEl.addEventListener('componentinitialized', (event) => {
      if (event.detail.name === 'art-gallery') {
        var allowedObjects = artGalleryEl.getAttribute('allowed-figures');
        if (!allowedObjects) {
          console.error('El elemento art-gallery no tiene objetos permitidos:', artGalleryEl);
          return;
        }
        allowedObjects = allowedObjects.split(',');
        if (!allowedObjects.includes(data.figure)) {
          console.error('Figura no permitida:', data.figure);
          return;
        }

        // Crear la entidad que representará el modelo GLTF
        var entity = document.createElement('a-entity');
        entity.setAttribute('gltf-model', data.figure);
        entity.setAttribute('scale', data.scale);
        entity.setAttribute('position', data.position);
        entity.setAttribute('lounge-staydown', '');
        entity.addEventListener('model-loaded', () => {
          let bbox = new THREE.Box3().setFromObject(entity.object3D);
          console.log('bbox min:', bbox.min);
          console.log('bbox max:', bbox.max);
        
          // Ajustar posición Y para poner la base en y=0
          entity.object3D.position.y -= bbox.min.y;
          console.log('Position Y ajustada a:', entity.object3D.position.y);
          console.log('Position x ajustada a:', entity.object3D.position.x);
          console.log('Position z ajustada a:', entity.object3D.position.z);
        });

        // Añadir el texto encima del modelo
        var text = document.createElement('a-entity');
        text.setAttribute('text', {
          value: data.name,
          align: 'center',
          side: 'double'
        });
        text.setAttribute('position', data.textPosition);  
        text.setAttribute('scale', data.textScale);

        entity.appendChild(text);
        el.appendChild(entity);
      }
    });
  },

//   bindMethods: function () {
//     this.onPinchedMoved = this.onPinchedMoved.bind(this);
//   },

//   onPinchedMoved: function (evt) {
//     var el = evt.target;
//     var localPosition = this.localPosition;

//     localPosition.copy(evt.detail.position);
//     this.el.object3D.updateMatrixWorld();
//     this.el.object3D.worldToLocal(localPosition);

//     // Actualizar la posición del objeto en todas las coordenadas (X, Y, Z)
//     el.object3D.position.copy(localPosition);
//   }
});




