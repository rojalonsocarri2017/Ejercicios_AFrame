/* global AFRAME */
var titleMovie;
var titleMovieCopy;
var listMoviesView = [];

AFRAME.registerComponent('ui-controller', {
  schema: {
    modalElement: {type: 'selector', default: '[spatial-modal]'}
  },

  init: function () {
    console.log('RAC ENTRO INIT');
    this.onStartButtonClicked = this.onStartButtonClicked.bind(this);
    this.onCloseButtonClicked = this.onCloseButtonClicked.bind(this);
    this.onTrailerButtonClicked = this.onTrailerButtonClicked.bind(this);
    console.log('RAC onStartButtonClicked ' +  this.onStartButtonClicked);
    console.log('RAC onTrailerButtonClicked ' +  this.onTrailerButtonClicked);



    
    this.onTileClicked = this.onTileClicked.bind(this);

    this.onSceneLoaded = this.onSceneLoaded.bind(this);

    this.el.sceneEl.addEventListener('loaded', this.onSceneLoaded);

    var tileEls = document.querySelectorAll('[tile]');
    for (var i = 0; i < tileEls.length; i++) {
      tileEls[i].addEventListener('click', this.onTileClicked);
    }

    document.getElementById('buttonAdelante').addEventListener('click', this.onStartButtonClicked);
    document.querySelector('[spatial-close-button]').addEventListener('click', this.onCloseButtonClicked);
    document.getElementById('trailer-button').addEventListener('click', this.onTrailerButtonClicked);

    this.addClickEvent();

  },

  onTileClicked: function (evt) {
    console.log('RAC PULSO TILE');
    var self = this;
    var el = this.el;
    var objects = el.sceneEl.getAttribute('raycaster').objects;

    var cameraCursorEl = el.sceneEl.querySelector('.camera-cursor');
    var buttonTrailer = document.getElementById('trailer-button');
    buttonTrailer.setAttribute('visible', true);

    objects = objects.split(',').filter(item => item !== '.tile').toString();
    el.sceneEl.setAttribute('raycaster', 'objects', objects);
    el.sceneEl.components.raycaster.refreshObjects();

    cameraCursorEl.setAttribute('raycaster', 'objects', objects);
    cameraCursorEl.components.raycaster.refreshObjects();

    el.sceneEl.querySelector('[spatial-window]').setAttribute('spatial-window', 'focused', false);
    el.sceneEl.querySelector('[spatial-modal-image]').setAttribute('spatial-modal-image', 'src', evt.target.getAttribute('tile').src);
    el.sceneEl.querySelector('.movie-title').setAttribute('value', evt.target.getAttribute('title'));
    el.sceneEl.querySelector('.movie-synopsis').setAttribute('value', evt.target.getAttribute('synopsis'));
    el.sceneEl.querySelector('.trailer-button').setAttribute('value', evt.target.getAttribute('button'));

    console.log('RAC TITLE ' +  evt.target.getAttribute('title')); // AQUI TENGO EL TITULO!!
    this.titleMovie = evt.target.getAttribute('title');
    console.log('RAC this.titleMovie ' + this.titleMovie); // AQUI TENGO EL TITULO!!

    setTimeout(function () {
      self.data.modalElement.setAttribute('visible', true);
    }, 100);
  },

  onSceneLoaded: function () {
    var el = this.el;
    var objects = el.sceneEl.getAttribute('raycaster').objects;
    var cameraCursorEl = el.sceneEl.querySelector('.camera-cursor');

    objects = objects.split(',').filter(item => item !== '.tile').join(',');
    el.sceneEl.setAttribute('raycaster', 'objects', objects);
    el.sceneEl.components.raycaster.refreshObjects();

    cameraCursorEl.setAttribute('raycaster', 'objects', objects);
    cameraCursorEl.components.raycaster.refreshObjects();
  },

  onCloseButtonClicked: function () {
    console.log('RAC HAGO CLICK EN CLOSE');
    var el = this.el;
    var objects = el.sceneEl.getAttribute('raycaster').objects;
    var cameraCursorEl = el.sceneEl.querySelector('.camera-cursor');
    var buttonTrailer = document.getElementById('trailer-button');

    buttonTrailer.setAttribute('visible', false);

    objects = objects === '' ? [] : objects.split(',');
    objects.push('.tile');
    objects = objects.join(',');

    el.sceneEl.setAttribute('raycaster', 'objects', objects);
    el.sceneEl.components.raycaster.refreshObjects();

    cameraCursorEl.setAttribute('raycaster', 'objects', objects);
    cameraCursorEl.components.raycaster.refreshObjects();

    el.sceneEl.querySelector('[spatial-window]').setAttribute('spatial-window', 'focused', true);
    this.el.sceneEl.querySelector('[spatial-modal]').setAttribute('visible', false);


    var videoControlsPlay = document.getElementById('videoControlsPlay');
    var videoControlsPause = document.getElementById('videoControlsPause');


    videoControlsPlay.setAttribute('visible', 'false');
    videoControlsPause.setAttribute('visible', 'false');
  },

  onStartButtonClicked: function () {
    console.log('RAC PULSO BOTON ADELANTE');
    var el = this.el;
    var cameraCursorEl = el.sceneEl.querySelector('.camera-cursor');

    el.sceneEl.setAttribute('raycaster', 'objects', '.tile');
    el.sceneEl.components.raycaster.refreshObjects();

    cameraCursorEl.setAttribute('raycaster', 'objects', '.tile');
    cameraCursorEl.components.raycaster.refreshObjects();

    el.querySelector('[spatial-hero-image]').setAttribute('visible', false);
    el.querySelector('#image-grid').setAttribute('visible', true);
  },


addClickEvent: function () {
  var videoControls = document.getElementById('videoControls');
  var elemVideo = document.getElementById('videoPelicula');
  var videoControlsPlay = document.getElementById('videoControlsPlay');
  var videoControlsPause = document.getElementById('videoControlsPause');
  var totalPanel = document.getElementById('totalPanel');
  console.log('RAC 1');



  // Eliminar evento de clic existente
  videoControls.removeEventListener('click', this.onClickHandler);

  // Agregar nuevo evento de clic
  this.onClickHandler = function () {
  console.log('RAC 2');

    var video = elemVideo.components.material.material.map.image;
    if (video.paused) {
      console.log('RAC 3');

      videoControlsPlay.setAttribute('visible', 'false');
      videoControlsPause.setAttribute('visible', 'true');
      totalPanel.setAttribute('visible', 'false');

      video.play();
    } else {
      console.log('RAC 4');

      video.pause();
      videoControlsPlay.setAttribute('visible', 'true');
      videoControlsPause.setAttribute('visible', 'false');
      totalPanel.setAttribute('visible', 'true');

    }
  };
  console.log('RAC 5');
  videoControls.addEventListener('click', this.onClickHandler);
},

onTrailerButtonClicked: function (evt) {
    console.log('RAC PULSO TRAILER');
    console.log('RAC PULSO TRAILER this.titleMovie ' + this.titleMovie); //aqui tengo el titulo seleccionado por el usuario
    

    document.getElementById('salaCine').setAttribute('visible', true);
    var elemVideo = document.getElementById('videoPelicula');

    var diccionario_trailer_peliculas={
                                      "El Rey Leon (1994)": "reyLeonVideo.mp4",
                                      "La vida es bella (1999)": "laVidaEsBellaVideo.mp4",
                                      "La Naranja Mecanica (1971)": "naranjaMecanicaVideo.mp4",
                                      "Cantando bajo la lluvia (1952)": "cantandoBajoLaLLuviaVideo.mp4",
                                      "Gladiator (2000)": "gladiatorVideo.mp4",
                                      "El Padrino (1972)": "elPadrinoVideo.mp4",
                                      "Cadena Perpetua (1994)": "cadenaPerpetuaVideo.mp4",
                                      "Interstellar (2014)": "interstellarVideo.mp4",
                                      "La lista de Schindler (1993)": "listaSchindlerVideo.mp4",
                                      "Pulp Fiction (1994)": "pulpFictionVideo.mp4",
                                      "El caballero oscuro (2008)": "elCaballeroOscuroVideo.mp4",
                                      "Forrest Gump (1994)": "forrestGumpVideo.mp4"
    }    
    var value;
    var videoControlsPlay = document.getElementById('videoControlsPlay');
    var videoControlsPause = document.getElementById('videoControlsPause');
    var totalPanel = document.getElementById('totalPanel');
    totalPanel.setAttribute('visible', 'false');

    if(this.titleMovie !== this.titleMovieCopy){
      if(!listMoviesView.includes(this.titleMovie)){
        listMoviesView.push(this.titleMovie)
        videoControlsPlay.setAttribute('visible', 'false');
        videoControlsPause.setAttribute('visible', 'true');
      }else{
        videoControlsPlay.setAttribute('visible', 'true');
        videoControlsPause.setAttribute('visible', 'false');
      }
      // Iterar sobre las claves del diccionario
      for (var key in diccionario_trailer_peliculas) {
        // Verificar si 'titleMovie' coincide con la clave actual
        if (key === this.titleMovie) {
            // Si coincide, asignamos el valor correspondiente a 'value'
            value = diccionario_trailer_peliculas[key];
            break; // Terminamos el bucle ya que encontramos la coincidencia
        }
      }

      // Verificar si se encontró un valor
      if (value !== undefined) {
          console.log("El valor correspondiente es:", value);
      } else {
          console.log("La película no está en el diccionario.");
      }
      elemVideo.setAttribute("src", value);
      elemVideo.setAttribute('visible', 'true');
      
      this.titleMovieCopy = this.titleMovie;
    }else{
      videoControlsPlay.setAttribute('visible', 'true');
      videoControlsPause.setAttribute('visible', 'false');
    }
    this.addClickEvent(); // Agregar el evento de clic después de cambiar el video
}

});
