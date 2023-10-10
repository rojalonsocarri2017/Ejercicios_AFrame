AFRAME.registerComponent('audioguia', {
  init: function () {
    this.cam = document.querySelector("#camera1")
    this.coche = document.querySelector("#coche")
    this.elefante = document.querySelector("#elefante")
    this.calavera = document.querySelector("#calavera")
    this.cocodrilo = document.querySelector("#cocodrilo")
    this.soundPlayingCoche = false;    
    this.soundPlayingCocodrilo = false;
    this.soundPlayingElefante = false;
    this.soundPlayingCalavera = false;
  },
  tick: function() {
    let camPos = this.cam.object3D.position
    // console.log('camPos' + camPos)
    // console.log('Posición del objeto camPos:', camPos.x, camPos.y, camPos.z);
    let cochePos = this.coche.object3D.position
    // console.log('cochePos' + cochePos)
    // console.log('Posición del objeto cochePos:', cochePos.x, cochePos.y, cochePos.z);

    let cocodriloPos = this.cocodrilo.object3D.position
    // console.log('cocodriloPos' + cocodriloPos)
    // console.log('Posición del objeto cocodriloPos:', cocodriloPos.x, cocodriloPos.y, cocodriloPos.z);

    let elefantePos = this.elefante.object3D.position
    // console.log('elefantePos' + elefantePos)
    // console.log('Posición del objeto elefantePos:', elefantePos.x, elefantePos.y, elefantePos.z);

    let calaveraPos = this.calavera.object3D.position
    // console.log('calaveraPos' + calaveraPos)
    // console.log('Posición del objeto calaveraPos:', calaveraPos.x, calaveraPos.y, calaveraPos.z);

    let distance1 = camPos.distanceTo(cochePos)
    let distance2 = camPos.distanceTo(cocodriloPos)
    let distance3 = camPos.distanceTo(elefantePos)
    let distance4 = camPos.distanceTo(calaveraPos)
    // console.log(' DISTANCIA AL COCHE ' + distance1)
    // console.log(' DISTANCIA AL COCODRILO ' + distance2)
    // console.log(' DISTANCIA AL ELEFANTE ' + distance3)
    // console.log(' DISTANCIA A LA CALAVERA ' + distance4)
    if (distance1 < 10 && !this.soundPlayingCoche) {
      console.log('ESTOY A MENOS DE 10 METRO DEL COCHE')
      this.coche.components.sound.playSound();
      this.soundPlayingCoche = true;
    }
    
    if (distance1 >= 10 && this.soundPlayingCoche) {
      console.log('ME ALEJÉ A MÁS DE 10 METROS DEL COCHE');
      this.coche.components.sound.stopSound();
      this.soundPlayingCoche = false;
    }
    
    if (distance2 < 10 && !this.soundPlayingCocodrilo) {
        console.log('ESTOY A MENOS DE 10 METRO DEL COCODRILO')
        this.cocodrilo.components.sound.playSound();
        this.soundPlayingCocodrilo = true;
    }
    
    if (distance2 >= 10 && this.soundPlayingCocodrilo) {
      console.log('ME ALEJÉ A MÁS DE 10 METROS DEL COCODRILO');
      this.cocodrilo.components.sound.stopSound();
      this.soundPlayingCocodrilo = false;
    }
    
    if (distance3 < 10 && !this.soundPlayingElefante) {
        console.log('ESTOY A MENOS DE 10 METRO DEL ELEFANTE')
      this.elefante.components.sound.playSound();
      this.soundPlayingElefante = true;
    }
    
    if (distance3 >= 10 && this.soundPlayingElefante) {
      console.log('ME ALEJÉ A MÁS DE 10 METROS DEL ELEFANTE');
      this.elefante.components.sound.stopSound();
      this.soundPlayingElefante = false;
    }
    
    if (distance4 < 10 && !this.soundPlayingCalavera) {
      console.log('ESTOY A MENOS DE 10 METRO DE LA CALAVERA')
      this.calavera.components.sound.playSound();
      this.soundPlayingCalavera = true;
    }
    
    if (distance4 >= 10 && this.soundPlayingCalavera) {
      console.log('ME ALEJÉ A MÁS DE 10 METROS DE LA CALAVERA');
      this.calavera.components.sound.stopSound();
      this.soundPlayingCalavera = false;
    }
    
  }
});


