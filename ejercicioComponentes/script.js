function calculateDistance(pos1, pos2) {
  return pos1.distanceTo(pos2);
}

AFRAME.registerComponent('distance', {
  schema: {
    position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    camera: { type: 'selector', default: '' },
    distanceLimit: { type: 'number', default: 10 }
  },

  init: function () {
    // console.log('ESTOY EN INIT')
    this.soundPlaying = false;
    this.activeIluminity = false;
    
    //me hago una copia del valor porque si no se actualiza automaticamente porque ambas variables apuntan al mismo objeto en la memoria
    this.prevCamPos = new THREE.Vector3().copy(this.data.camera.object3D.position);

    this.frameCount = 0;
    this.framesToSkip = 60;  // Ejecutar cada 60 fotogramas (1 segundo a 60 FPS)
    this.allEntities = document.querySelectorAll('a-entity');
    this.tick();
  },
  // Pasa la función calculateDistance al componente como un método
  calculateDistance: calculateDistance,
  
  tick: function() {
    
    // Incrementa el contador de fotogramas
    this.frameCount++;
    
    if (this.frameCount >= this.framesToSkip) {
      // console.log('La función tick se ejecutó');
      var elemPos = this.data.position;
      var camPosNow = this.data.camera.object3D.position;
      var distanceLimit = this.data.distanceLimit;
      // console.log('distanceLimit '+distanceLimit)
      // console.log('Posición del objeto camPosNow:', camPosNow.x, camPosNow.y, camPosNow.z);
      // console.log('Posición del objeto prevCamPos FINAL:', this.prevCamPos.x, this.prevCamPos.y, this.prevCamPos.z);
      if (camPosNow.x !== this.prevCamPos.x || camPosNow.y !== this.prevCamPos.y || camPosNow.z !== this.prevCamPos.z) {
        // console.log('ME HE MOVIDO')
        var distance = this.calculateDistance(camPosNow,elemPos);
        this.allEntities.forEach((entity) => {
        // console.log('entity '+ entity)
        if (entity.components.sonido) {
            if (distance < distanceLimit && !this.soundPlaying) {
              // console.log('DISPARO PLAY')
              this.el.sceneEl.emit('playSound', {elem: this.el});
              this.soundPlaying = true;
            }

            if (distance >= distanceLimit && this.soundPlaying) {
              // console.log("ME ALEJÉ DEL ELEMENTO");
              this.el.sceneEl.emit('stopSound', {elem: this.el});
              this.soundPlaying = false;
            }
          } 
          
          if (entity.components.iluminacion) {
            
            if (distance < distanceLimit && !this.activeIluminity){
              // console.log('DISPARO ACTIVO LUZ')
              this.el.sceneEl.emit('activeIluminity', {elem: this.el});
              this.activeIluminity = true;
            }
            if (distance >= distanceLimit && this.activeIluminity){
              // console.log('DISPARO STOP LUZ')
              this.el.sceneEl.emit('stopIluminity', {elem: this.el});
              this.activeIluminity = false;
            }
            
        
          }
          
          if (entity.components.opacity) {
            
            if (distance < distanceLimit){
              // console.log('DISPARO ACTIVO OPACIDAD')
              this.el.sceneEl.emit('activeOpacity', {elem: this.el, distance:distance});
            }
            if (distance >= distanceLimit){
              // console.log('DISPARO STOP OPACIDAD')
              this.el.sceneEl.emit('stopOpacity', {elem: this.el, distance:distance});
            }
            
        
          }
          
          
        });
        
        
        
        // Actualiza la posición anterior
        this.prevCamPos.copy(camPosNow)
      }

      
      
      // Reinicia el contador de fotogramas
      this.frameCount = 0;
    }

    // Vuelve a programar la ejecución de la función tick para el próximo fotograma
    this.el.sceneEl.renderer.xr.getSession()?.requestAnimationFrame(this.tick.bind(this));

  }
  
});

AFRAME.registerComponent('sonido', {
  schema: {
    sound: { type: 'selector', default: '' }
  },

  init: function () {
    this.el.sceneEl.addEventListener('playSound', (event) => {
        // console.log('RECIBO PLAY')
        if(event.detail.elem == this.el){
          this.data.sound.play();
        }
        
      
    });

    this.el.sceneEl.addEventListener('stopSound', (event) => {
        this.data.sound.pause();
    });
  }
});


//NO SOY CAPAZ DE QUEDARME SOLO CON UNA ENTIDAD, SE ME APLICA EL ATRIBUTO LIGHT A TODAS LAS ENTIDADES!!! PREGUNTAR!!
AFRAME.registerComponent('iluminacion', {
  init: function () {
    // Configuramos la luz con intensidad cero cuando se inicializa
    this.el.setAttribute('light', 'type: ambient; intensity: 1; groundColor: #e66060; distance: 0; decay: 0;');
    

    // Escuchamos el evento para activar la iluminación
    this.el.sceneEl.addEventListener('activeIluminity', (event) => {
      // console.log('RECIBO ACTIVE');
      if (event.detail.elem == this.el) {
        // console.log('LLEGO 1');
        // Aumentamos la intensidad de la luz usando setAttribute
        this.el.setAttribute('light', 'intensity: 4');
        // console.log('AUMENTO ILUMINACION');
      }
    });

    // Escuchamos el evento para detener la iluminación
    this.el.sceneEl.addEventListener('stopIluminity', (event) => {
      if (event.detail.elem == this.el) {
        // Establecemos la intensidad de la luz a cero cuando se detiene
        this.el.setAttribute('light', 'intensity: 1');
        // console.log('QUITO ILUMINACION');
      }
    });
  }
});

AFRAME.registerComponent('opacity', {
  init: function () {
    
    this.el.sceneEl.addEventListener('activeOpacity', (event) => {
      // console.log('RECIBO ACTIVE');
      if (event.detail.elem == this.el) {
        if(event.detail.distance >= 20){
          this.el.setAttribute('material', 'opacity: 0.2'); 
        }else if(event.detail.distance >= 10 && event.detail.distance < 20 ){
          this.el.setAttribute('material', 'opacity: 0.5'); 
        }else if(event.detail.distance >= 5 && event.detail.distance < 10 ){
          this.el.setAttribute('material', 'opacity: 0.7'); 
        }else{
          this.el.setAttribute('material', 'opacity: 1');
        }
      }
    });

    // Escuchamos el evento para detener la iluminación
    this.el.sceneEl.addEventListener('stopOpacity', (event) => {
      if (event.detail.elem == this.el) {
        // Establecemos la intensidad de la luz a cero cuando se detiene
        this.el.setAttribute('material', 'opacity: 0');
      }
    });
  }
});

 

AFRAME.registerComponent('tiempo', {
  init: function () {
    // Función para mostrar el texto cada 5 segundos durante 1 segundo
    setInterval(() => {
      // Muestra el texto
      document.getElementById('textoTiempo').setAttribute('visible', 'true');

      // Oculta el texto después de 1 segundo
      setTimeout(() => {
        document.getElementById('textoTiempo').setAttribute('visible', 'false');
      }, 1000);
    }, 5000);
  },

});



  
