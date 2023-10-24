AFRAME.registerComponent('audioguia', {
  schema: {
    position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    camera: { type: 'selector', default: '' },
    sound: { type: 'selector', default: '' }
  },

  init: function () {
    console.log('ESTOY EN INIT')
    this.soundPlaying = false;
    //me hago una copia del valor porque si no se actualiza automaticamente porque ambas variables apuntan al mismo objeto en la memoria
    this.prevCamPos = new THREE.Vector3().copy(this.data.camera.object3D.position);

    this.frameCount = 0;
    this.framesToSkip = 60;  // Ejecutar cada 60 fotogramas (1 segundo a 60 FPS)
    this.tick();

    
  },

  tick: function() {
    
    // Incrementa el contador de fotogramas
    this.frameCount++;
    
    if (this.frameCount >= this.framesToSkip) {
      console.log('La función tick se ejecutó');
      var elemPos = this.data.position;
      var camPosNow = this.data.camera.object3D.position;
      console.log('Posición del objeto camPosNow:', camPosNow.x, camPosNow.y, camPosNow.z);
      console.log('Posición del objeto prevCamPos FINAL:', this.prevCamPos.x, this.prevCamPos.y, this.prevCamPos.z);
      if (camPosNow.x !== this.prevCamPos.x || camPosNow.y !== this.prevCamPos.y || camPosNow.z !== this.prevCamPos.z) {
        console.log('ME HE MOVIDO')
        let distance = camPosNow.distanceTo(elemPos);

        if (distance < 10 && !this.soundPlaying) {
          console.log("ESTOY CERCA DEL ELEMENTO");
          this.data.sound.play();
          this.soundPlaying = true;
        }

        if (distance >= 10 && this.soundPlaying) {
          console.log("ME ALEJÉ DEL ELEMENTO");
          this.data.sound.pause();
          this.soundPlaying = false;
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




