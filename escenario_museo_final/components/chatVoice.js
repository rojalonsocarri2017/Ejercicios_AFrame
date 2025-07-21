AFRAME.registerComponent("chat-voice", {
  init: function () {
    const el = this.el;
    console.log("RAC. INICIO COMPONENTE CHAT-VOICE " + el.id);
    const cam = document.querySelector("#camera1");

    const boton = document.createElement("a-entity");
    boton.setAttribute("geometry", "primitive: plane; height: 0.4; width: 2");
    boton.setAttribute("material", "color: #3a86ff");
    boton.setAttribute("position", "10 -3 37");
    boton.setAttribute("rotation", "0 180 0");
    boton.setAttribute("text", "value: Iniciar conversacion; align: center; color: white; width: 4");
    boton.setAttribute("class", "clickable");
    boton.setAttribute("event-set__enter", "material.color: #265dbe");
    boton.setAttribute("event-set__leave", "material.color: #3a86ff");
    boton.setAttribute("visible", el.getAttribute("visible"));

    const textoRespuesta = document.createElement("a-text");
    textoRespuesta.setAttribute("value", "");
    textoRespuesta.setAttribute("color", "white");
    textoRespuesta.setAttribute("align", "center");
    textoRespuesta.setAttribute("width", "4");
    textoRespuesta.setAttribute("position", "10 -2 37");
    textoRespuesta.setAttribute("rotation", "0 180 0");
    textoRespuesta.setAttribute("visible", "false");

    const scene = document.querySelector("a-scene");
    if (scene) {
      scene.appendChild(boton);
      scene.appendChild(textoRespuesta);
    } else {
      console.warn("No se encontró el <a-scene>");
    }

    let recognition = null;
    let isSpeaking = false;
    let recognitionActive = false;
    let inactivityTimeout = null;   // para tiempo de inactividad general (30 min)
    let noInputTimeout = null;      // para 10s sin input

    const respuestas = {
      "describeme la mona lisa":
        "La Mona Lisa es una pintura de Leonardo da Vinci, famosa por su misteriosa sonrisa y su detallado fondo.",
      "quien pinto la mona lisa":
        "La Mona Lisa fue pintada por Leonardo da Vinci entre 1503 y 1506.",
      "donde esta la mona lisa":
        "Actualmente, la Mona Lisa se encuentra en el Museo del Louvre en París.",
      "que tecnica uso da vinci":
        "Leonardo da Vinci usó la técnica del sfumato, un difuminado suave que da realismo a sus pinturas."
    };

    const normalizarTexto = (texto) =>
      texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const estaCerca = (distanciaMaxima = 25) => {
      if (!cam || !cam.object3D) return false;
      const posCam = cam.object3D.position;
      const posEntidad = el.object3D.position;
      const dx = posCam.x - posEntidad.x;
      const dy = posCam.y - posEntidad.y;
      const dz = posCam.z - posEntidad.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return dist <= distanciaMaxima;
    };

    const resetInactivityTimeout = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        console.log("Tiempo de espera superado (30 min). Parando reconocimiento.");
        if (recognition && recognitionActive) {
          recognition.stop();
          recognitionActive = false;
        }
        textoRespuesta.setAttribute("visible", "false");
      }, 30 * 60 * 1000);
    };

    const stopRecognition = () => {
      if (recognition && recognitionActive) {
        recognition.stop();
        recognitionActive = false;
      }
      textoRespuesta.setAttribute("visible", "false");
      if (noInputTimeout) clearTimeout(noInputTimeout);
    };

    const iniciarReconocimiento = () => {
      if (recognitionActive) {
        console.warn("Reconocimiento ya activo");
        return;
      }

      if (!("webkitSpeechRecognition" in window)) {
        alert("Tu navegador no soporta reconocimiento de voz");
        return;
      }

      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "es-ES";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const reiniciarNoInputTimeout = () => {
        if (noInputTimeout) clearTimeout(noInputTimeout);
        noInputTimeout = setTimeout(() => {
          console.log("No se detectó voz en 10 segundos. Parando reconocimiento.");
          stopRecognition();
        }, 30 * 1000); // 10 segundos sin input
      };

      recognition.onresult = (event) => {
        resetInactivityTimeout();
        reiniciarNoInputTimeout();

        const resultado = event.results[event.results.length - 1];
        const textoReconocido = resultado[0].transcript;

        textoRespuesta.setAttribute("value", textoReconocido);
        textoRespuesta.setAttribute("visible", "true");

        if (!resultado.isFinal) {
          return;
        }

        const pregunta = normalizarTexto(textoReconocido);
        console.log("Reconocido final:", textoReconocido);

        if (!estaCerca()) {
          console.log("Estás lejos del modelo, no respondo.");
          textoRespuesta.setAttribute("visible", "false");
          stopRecognition();
          return;
        }

        let respuestaTexto = null;
        for (const clave in respuestas) {
          if (pregunta.includes(clave)) {
            respuestaTexto = respuestas[clave];
            break;
          }
        }

        if (respuestaTexto) {
          console.log("Respuesta detectada:", respuestaTexto);

          textoRespuesta.setAttribute("value", respuestaTexto);
          textoRespuesta.setAttribute("visible", "true");

          isSpeaking = true;

          const utterance = new SpeechSynthesisUtterance(respuestaTexto);
          utterance.lang = "es-ES";

          utterance.onend = () => {
            isSpeaking = false;
            textoRespuesta.setAttribute("visible", "false");
            stopRecognition();
          };

          speechSynthesis.speak(utterance);
        } else {
          console.log("Pregunta no reconocida o sin respuesta predefinida.");
          textoRespuesta.setAttribute("value", "No he entendido tu pregunta, intenta de nuevo.");
          textoRespuesta.setAttribute("visible", "true");
        }
      };

      recognition.onerror = (event) => {
        console.error("Error:", event.error);
        textoRespuesta.setAttribute("value", "Error en el reconocimiento de voz.");
        textoRespuesta.setAttribute("visible", "true");

        const utterance = new SpeechSynthesisUtterance(
          "Hubo un error en el reconocimiento de voz, intenta de nuevo."
        );
        utterance.lang = "es-ES";
        utterance.onend = () => {
          isSpeaking = false;
          textoRespuesta.setAttribute("visible", "false");
          stopRecognition();
        };
        speechSynthesis.speak(utterance);
      };

      recognition.onend = () => {
        recognitionActive = false;
        if (!isSpeaking) {
          console.log("Reconocimiento terminado inesperadamente.");
          textoRespuesta.setAttribute("visible", "false");
          stopRecognition();
        }
      };

      recognition.start();
      recognitionActive = true;
      resetInactivityTimeout();
      reiniciarNoInputTimeout();
    };

    boton.addEventListener("click", () => {
      iniciarReconocimiento();
    });

    el.addEventListener("componentchanged", (e) => {
      if (e.detail.name === "visible") {
        const visible = el.getAttribute("visible");
        boton.setAttribute("visible", visible);
        if (!visible) {
          textoRespuesta.setAttribute("visible", "false");
          stopRecognition();
        }
      }
    });
  },
});
