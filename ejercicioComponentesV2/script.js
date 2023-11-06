function calculateDistance(pos1, pos2) {
  return pos1.distanceTo(pos2);
}

AFRAME.registerComponent('distance', {
  schema: {
    camera: { type: 'selector', default: '' },
    distanceLimit: { type: 'number', default: 10 }
  },

  init: function () {
    console.log('ESTOY EN INIT');
    //me hago una copia del valor porque si no se actualiza automaticamente porque ambas variables apuntan al mismo objeto en la memoria
    this.prevCamPos = new THREE.Vector3().copy(this.data.camera.object3D.position);
    console.log('LLEGO AQUI 1')
    this.frameCount = 0;
    this.framesToSkip = 60;  // Ejecutar cada 60 fotogramas (1 segundo a 60 FPS)
    this.tick();
  },
  // Pasa la función calculateDistance al componente como un método
  calculateDistance: calculateDistance,
  
  tick: function() {
    
    // Incrementa el contador de fotogramas
    this.frameCount++;
    
    if (this.frameCount >= this.framesToSkip) {
      console.log('La función tick se ejecutó');
      var elemPos = this.el.getAttribute('position');
      console.log('Posición del objeto elemPos:', elemPos.x, elemPos.y, elemPos.z);

      var camPosNow = this.data.camera.object3D.position;
      
      var distanceLimit = this.data.distanceLimit;
      console.log('distanceLimit '+distanceLimit)
      console.log('Posición del objeto camPosNow:', camPosNow.x, camPosNow.y, camPosNow.z);
      // console.log('Posición del objeto prevCamPos FINAL:', this.prevCamPos.x, this.prevCamPos.y, this.prevCamPos.z);
      if (camPosNow.x !== this.prevCamPos.x || camPosNow.y !== this.prevCamPos.y || camPosNow.z !== this.prevCamPos.z) {
        console.log('ME HE MOVIDO')
        var distance = this.calculateDistance(camPosNow,elemPos);
        console.log('distance ' + distance)
            if (distance < distanceLimit) {
              console.log('DISPARO PLAY')
              this.el.sceneEl.emit('cercaObjeto', {elem: this.el, id: this.el.id, distance: distance});
            }

            if (distance >= distanceLimit) {
              console.log("ME ALEJÉ DEL ELEMENTO");
              this.el.sceneEl.emit('lejosObjeto', {elem: this.el, id: this.el.id});
            }
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

document.addEventListener('cercaObjeto', function(event) {
  // Accede al elemento y sus atributos desde el evento
  var elemento = event.detail.elem;
  console.log('elemento ' + elemento)
  console.log('sound component:', elemento.components.sound);
  var idElemento = event.detail.id;
  var distance = event.detail.distance;

  // Imprime todos los atributos del elemento
  var atributosElemento = elemento.attributes;
  console.log('Atributos del elemento con ID', idElemento);
  for (var i = 0; i < atributosElemento.length; i++) {
    var nombreAtributo = atributosElemento[i].name;
    var valorAtributo = atributosElemento[i].value;
    console.log('Atributo:', nombreAtributo, 'Valor:', valorAtributo);
 
    if(nombreAtributo === 'sonido_interruptor'){
      console.log('ACTIVO SONIDO')
      // let audio = document.querySelector("#audio1");
      // audio.play();
      let audio = document.querySelector(elemento.components.sound.attrValue.src);
      audio.play();
    }else if(nombreAtributo === 'opacidad_interruptor'){
      console.log('ACTIVO OPACIDAD')
      if(distance >= 6){
          elemento.setAttribute('material', 'opacity: 0.3'); 
        }else if(distance <= 6 && distance > 3 ){
          elemento.setAttribute('material', 'opacity: 0.7'); 
        }else if(distance <= 3 && distance > 2 ){
          elemento.setAttribute('material', 'opacity: 0.9'); 
        }else{
          elemento.setAttribute('material', 'opacity: 1');
        }
    }else if(nombreAtributo === 'luz_interruptor'){
      console.log('ACTIVO LUZ');
      let el = document.getElementById('luzCilindro');
      el.setAttribute('light', 'intensity: 4');
    }
  }
});

document.addEventListener('lejosObjeto', function(event) {
  // Accede al elemento y sus atributos desde el evento
  var elemento = event.detail.elem;
  var idElemento = event.detail.id;

  // Imprime todos los atributos del elemento
  var atributosElemento = elemento.attributes;
  console.log('Atributos del elemento con ID', idElemento);
  for (var i = 0; i < atributosElemento.length; i++) {
    var nombreAtributo = atributosElemento[i].name;
    var valorAtributo = atributosElemento[i].value;
    console.log('Atributo:', nombreAtributo, 'Valor:', valorAtributo);
    if(nombreAtributo === 'sonido_interruptor'){
      console.log('PARO SONIDO')    
      let audio = document.querySelector(elemento.components.sound.attrValue.src);
      audio.pause();
    }else if(nombreAtributo === 'opacidad_interruptor'){
      elemento.setAttribute('material', 'opacity: 0.1');
    }else if(nombreAtributo === 'luz_interruptor'){
      let el = document.getElementById('luzCilindro');
      el.setAttribute('light', 'intensity: 0.2');
    }
  }
});

AFRAME.registerComponent('tiempo', {
  init: function () {
    console.log('this.el.id ' + this.el.id)
    // Función para mostrar el texto cada 5 segundos durante 1 segundo
    setInterval(() => {
      // Muestra el texto
      this.el.setAttribute('visible', 'true');

      // Oculta el texto después de 1 segundo
      setTimeout(() => {
        this.el.setAttribute('visible', 'false');
      }, 1000);
    }, 5000);
  },

});


