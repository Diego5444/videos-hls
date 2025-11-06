// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Configuración de Firebase
const app = initializeApp({
  apiKey: "AIzaSyAfqvmcg2Y6GOAQOVjFvXi46hp3NTCT6ZE",
  authDomain: "abby-cdb30.firebaseapp.com",
  databaseURL: "https://abby-cdb30-default-rtdb.firebaseio.com",
  projectId: "abby-cdb30",
  storageBucket: "abby-cdb30.appspot.com",
  messagingSenderId: "738241914654",
  appId: "1:738241914654:web:80351b3fed2f4dc3688b0f"
});

const db = getDatabase(app);
const storage = getStorage(app);

// Referencia a la lista de usuarios en línea
const usuariosOnlineRef = ref(db, 'usuarios_online');

onValue(usuariosOnlineRef, (snapshot) => {
  const numUsuarios = snapshot.size;
  document.getElementById('num-usuarios').textContent = numUsuarios;
});

// CORREGIDO: Descomentada la función
registrarUsuarioOnline();

//======== mantenimiento funciones=====

// Verificar y crear la clave de mantenimiento si no existe
const mantenimientoRef = ref(db, 'mantenimiento/db');

get(mantenimientoRef).then((snapshot) => {
  if (!snapshot.exists()) {
    // No existe la clave, crearla con valor false
    set(mantenimientoRef, false);
  }
});

// Escuchar cambios para mostrar/ocultar modal
onValue(mantenimientoRef, (snapshot) => {
  const enMantenimiento = snapshot.val();
  const modal = document.getElementById("modal-mantenimiento");

  if (enMantenimiento === true) {
    modal.classList.remove("hidden");
    document.body.style.pointerEvents = "none";
    modal.style.pointerEvents = "auto";
  } else {
    modal.classList.add("hidden");
    document.body.style.pointerEvents = "auto";
  }
});

// ===== ELEMENTOS DEL DOM =====

// Elementos principales
const listasContenido = document.getElementById("listas-contenido");
const dramasDiv = document.getElementById("dramas");
const peliculasDiv = document.getElementById("peliculas");

// Menú y navegación
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const searchToggle = document.getElementById("search-toggle");
const btnAcerca = document.getElementById("btn-acerca");
const linkPolitica = document.getElementById("link-politica");

// Carrusel destacado
const destacadoEmision = document.getElementById("destacado-emision");
const carruselImg = document.getElementById("carrusel-img");
const carruselImgDerecha = document.getElementById("carrusel-img-derecha");
const carruselTitulo = document.getElementById("carrusel-titulo");
const carruselDescripcion = document.getElementById("carrusel-descripcion");
const carruselAno = document.getElementById("carrusel-ano");
const carruselAudio = document.getElementById("carrusel-audio");
const btnVer = document.getElementById("btn-ver");

// Búsqueda
const busquedaSection = document.getElementById("busqueda");
const buscador = document.getElementById("buscador");
const resultadosBusqueda = document.getElementById("busqueda-resultados");

// Sección "Acerca de"
const acercaDeSection = document.getElementById("acerca-de");
const btnVolverAcerca = document.getElementById("btn-volver-acerca");

// Detalle del contenido
const detalleSection = document.getElementById("detalle");
const btnVolver = document.getElementById("btn-volver");
const detalleImg = document.getElementById("detalle-img");
const detalleTitulo = document.getElementById("detalle-titulo");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleAno = document.getElementById("detalle-ano");
const detalleGenero = document.getElementById("detalle-genero");
const detalleAudio = document.getElementById("detalle-audio");
const detalleActors = document.getElementById("detalle-actors");
const capitulosLista = document.getElementById("capitulos-lista");

// Botón de like en detalle
const btnLikeDetalle = document.getElementById("btn-like-detalle");
const likeIcon = document.querySelector(".like-icon");
const likeCount = document.querySelector(".like-count");

// Reproductor de video
const videoPlayer = document.getElementById("video-player");
const videoElement = document.getElementById("video");

// Modal de vista previa
const previewModal = document.getElementById("preview-modal");
const previewImg = document.getElementById("preview-img");
const previewTitle = document.getElementById("preview-title");
const previewDescripcion = document.getElementById("preview-descripcion");
const modalCerrar = document.getElementById("modal-cerrar");

// === CHAT DE PETICIONES ===
const btnPedirDrama = document.getElementById("btn-pedir-drama");
const modalPedir = document.getElementById("modal-pedir-drama");
const cerrarPedir = document.getElementById("cerrar-pedir-drama");
const pedirLogin = document.getElementById("pedir-drama-login");
const formularioPedir = document.getElementById("formulario-pedir");
const formPedir = document.getElementById("form-pedir-drama");
const listaPeticiones = document.getElementById("lista-peticiones");
const usuarioPedir = document.getElementById("usuario-pedir");
const clavePedir = document.getElementById("clave-pedir");
const btnLoginPedir = document.getElementById("btn-login-pedir");
const errorPedir = document.getElementById("error-pedir");

// === FAVORITOS ===
// CORREGIDO: Añadida la definición de favoritosSection
const btnFavoritos = document.getElementById("btn-favoritos");
const favoritosSection = document.getElementById("favoritos");
const btnVolverFavoritos = document.getElementById("btn-volver-favoritos");
const favoritosLista = document.getElementById("favoritos-lista");

let usuarioPeticiones = null;

// CORREGIDO: Función reanudarCarrusel definida correctamente
function reanudarCarrusel() {
  if (enVistaDetalle) return;

  const itemsDestacados = Object.values(datosContenido).filter(item => 
    item.foto && item.Titulo && (item.estreno || "").toLowerCase() === "true"
  );

  if (itemsDestacados.length > 0 && !listasContenido.classList.contains("hidden")) {
    iniciarCarrusel(itemsDestacados);
  }
}

if (btnPedirDrama) {
  btnPedirDrama.addEventListener("click", () => {
    modalPedir.classList.remove("hidden");
    usuarioPeticiones = localStorage.getItem("usuarioDOGTV");
    if (usuarioPeticiones) {
      pedirLogin.classList.add("hidden");
      formularioPedir.classList.remove("hidden");
      cargarPeticiones();
    } else {
      pedirLogin.classList.remove("hidden");
      formularioPedir.classList.add("hidden");
    }
  });
}

if (cerrarPedir) {
  cerrarPedir.addEventListener("click", () => {
    modalPedir.classList.add("hidden");
  });
}

if (btnLoginPedir) {
  btnLoginPedir.addEventListener("click", async () => {
    const user = usuarioPedir.value.trim().toLowerCase();
    const pass = clavePedir.value.trim();
    if (!user || !pass) return;

    const userRef = ref(db, `usuarios/${user}`);
    const snap = await get(userRef);

    if (snap.exists()) {
      // Ya existe, verificar clave
      if (snap.val().clave === pass) {
        usuarioPeticiones = user;
        localStorage.setItem("usuarioDOGTV", user);
        pedirLogin.classList.add("hidden");
        formularioPedir.classList.remove("hidden");
        cargarPeticiones();
      } else {
        errorPedir.style.display = "block";
        errorPedir.textContent = "Contraseña incorrecta";
      }
    } else {
      // Usuario no existe: crear cuenta (como en el chat general)
      const rawIP = await obtenerIP();
      const ip = rawIP.replace(/\./g, "_");
      const bloqueadoRef = ref(db, `bloqueados/${ip}`);
      const bloqueadoSnap = await get(bloqueadoRef);

      if (bloqueadoSnap.exists()) {
        const datos = bloqueadoSnap.val();
        mostrarModalBloqueado(datos);
        return;
      }

      await set(userRef, { clave: pass, permiso: false }); // incluye clave y permiso
      usuarioPeticiones = user;
      localStorage.setItem("usuarioDOGTV", user);
      pedirLogin.classList.add("hidden");
      formularioPedir.classList.remove("hidden");
      cargarPeticiones();
    }
  });
}

function cargarPeticiones() {
  onValue(ref(db, 'peticiones'), (snapshot) => {
    listaPeticiones.innerHTML = "";
    snapshot.forEach(child => {
      const peticion = child.val();
      const id = child.key;

      // Si ya existe el drama, no mostrar la petición
      if (Object.values(datosContenido).some(c => (c.Titulo || "").toLowerCase() === peticion.titulo.toLowerCase())) return;

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="margin-bottom:10px;background:#333;padding:10px;border-radius:10px;">
          <img src="${peticion.imagen}" alt="Preview" style="width:100%;border-radius:8px;">
          <p style="margin:5px 0;"><strong>${peticion.titulo}</strong></p>
          <p style="font-size:12px;color:#ccc;">por ${peticion.usuario}</p>
        </div>`;
      listaPeticiones.appendChild(div);
    });
  });
}

// Variables globales
let datosContenido = {};
let intervalCarrusel = null;
let itemSeleccionadoPreview = null;
let enVistaDetalle = false; // Indica si estamos viendo un contenido
let contenidoActual = null; // Para almacenar el contenido actual y manejar los likes

const palabrasProhibidas = [
  "puta", "mierda", "hpta", "malparido", "malparida", "maldita", "maldito",
  "estúpido", "estupido", "imbécil", "imbecil", "culo", "verga", "perra",
  "coño", "pendejo", "pendeja", "zorra", "idiota", "marica", "maricón", "maricona",
  "gonorrea", "gonorreita", "gonorreíta", "gonorreo", "come mierda", "come-mierda",
  "comemierda", "hijueputa", "hijueputas", "hijuep*", "hp", "hpta", "carechimba",
  "careverga", "careculo", "caremondá", "caremondah", "caremalparido",
  "cagada", "cagado", "maldita sea", "malnacido", "malnacida", "jodido", "jodida",
  "chimba", "rechimba", "desgraciado", "desgraciada", "cojudo", "cojuda", "tarado",
  "tarada", "cabron", "cabrona", "pichurria", "pichurriento", "pinche", "puto",
  "puta madre", "chingada", "chingar", "chingadera", "chingados", "pelotudo",
  "pelotuda", "culicagado", "culicagada", "mariquita", "mamaguevo", "mamabicho",
  "baboso", "babosa", "bobo", "zángano", "lagarto", "arrastrado", "sapa", "zorra inmunda",
  "asqueroso", "asquerosa", "desgracia", "me vale verga", "vete a la mierda",
  "lambón", "lambona", "lamberico", "lambe culo", "come verga", "que te jodan",
  "vete al carajo", "maldito sea", "que chingados", "jódete", "pendeja", "huevón",
  "hueva", "mierdero", "culiado", "culiada", "culo roto", "malco", "retrasado",
  "tonto", "babosada", "imbecilazo", "paraco", "sapo", "marimonda", "sapito",
  "idioteces", "balurdo", "cojones", "verguero", "pelmazo", "berraco", "bestia",
  "coñazo", "coñeta", "berriondo", "marik", "marikn", "kulo", "m1erda", "mi3rda",
  "m13rda", "v3rga", "verhga", "pvt4", "p3rr4", "z0rr4", "zorra", "z0rra",
  "malpa", "malpa#", "mrd", "huevon", "guevon", "güevon", "mamón", "mamona",
  "joputa", "hueputa", "malpa#$", "idi0ta", "imb3cil", "g0n0rr34", "perr@", "kbron",
  ///ingle
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "damn", "dick", "pussy",
  "cunt", "motherfucker", "son of a bitch", "suck my dick", "ass", "jerk", "retard",
  "douche", "whore", "slut", "fag", "faggot", "cock", "shithead", "bullshit", "dumbass",
  "twat", "cocksucker", "wanker", "prick", "piss off", "bollocks", "screw you",
  // Portugués
   "merda", "porra", "caralho", "puta", "puto", "vai se foder", "vai tomar no cu",
  "filho da puta", "bosta", "babaca", "cu", "viado", "desgraçado", "arrombado",
  "otário", "fdp", "piranha", "corno", "trouxa", "imbecil", "idiota", "cacete",
// Francés
  "putain", "merde", "salope", "connard", "con", "enculé", "ta gueule", "chiant",
  "bâtard", "pute", "fils de pute", "bordel", "cul", "nique ta mère", "trou du cul",
// Alemán
  "scheiße", "arschloch", "miststück", "verdammt", "hure", "fotze", "wichser",
  "fick dich", "hurensohn", "schlampe", "dummkopf", "idiot", "arsch", "kotzbrocken",
// Italiano
  "cazzo", "stronzo", "merda", "vaffanculo", "bastardo", "puttana", "figlio di puttana",
  "culo", "pezzo di merda", "porca puttana", "rompicoglioni", "minchia", "scemo",
// Variaciones con símbolos
  "p3rr4", "m13rd@", "v3rg@", "c0ñ0", "idi0t@", "g0n0rr34", "imb3c1l", "hpt@", "put@", "f*ck", "sh1t", "b!tch"
];

// ===== FUNCIONES DE NAVEGACIÓN Y CONTROL DE VISTAS =====
function mostrarVistaInicial() {
  // Detener cualquier video/iframe activo
  const container = document.getElementById("video-player");
  if (container) {
    container.innerHTML = "";          // Destruye iframe o <video>
    container.classList.add("hidden"); // Oculta el contenedor
  }
  enVistaDetalle = false; // ← Añade esto
  contenidoActual = null; // Reiniciar el contenido actual
  // Mostrar elementos principales
  listasContenido.classList.remove("hidden");
  destacadoEmision.classList.remove("hidden");
  menuToggle.classList.remove("hidden");
  searchToggle.classList.remove("hidden");
  
  // Ocultar otras secciones
  menu.classList.add("hidden");
  busquedaSection.classList.add("hidden");
  acercaDeSection.classList.add("hidden");
  detalleSection.classList.add("hidden");
  videoPlayer.classList.add("hidden");
  previewModal.classList.add("hidden");
  
  // Limpiar video
  if (videoElement) {
    videoElement.pause();
    videoElement.removeAttribute("src");
    videoElement.load(); // Limpia el buffer sin error
  }
  
  // Mostrar todas las tarjetas
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('hidden');
  });
  
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ocultarElementosPrincipales() {
  listasContenido.classList.add("hidden");
  destacadoEmision.classList.add("hidden");
  menuToggle.classList.add("hidden");
  searchToggle.classList.add("hidden");
  menu.classList.add("hidden");
}

// ===== FUNCIONES DEL CARRUSEL =====

let carruselItems = [];
let carruselIndex = 0;

function iniciarCarrusel(items) {
  detenerCarrusel();
  carruselItems = items;
  carruselIndex = 0;

  if (!items || items.length === 0) {
    document.getElementById("destacado-emision").classList.add("hidden");
    return;
  }

  document.getElementById("destacado-emision").classList.remove("hidden");

  const img = document.getElementById("carrusel-img");
  const titulo = document.getElementById("carrusel-titulo");
  const desc = document.getElementById("carrusel-descripcion");
  const ano = document.getElementById("carrusel-ano");
  const audio = document.getElementById("carrusel-audio");
  const mini = document.getElementById("carrusel-img-derecha");

  function renderizar() {
    const item = carruselItems[carruselIndex];

    // Actualizar elementos del carrusel
    img.src = item.foto || "";
    titulo.textContent = item.Titulo || "Sin título";
    desc.textContent = item.descripción || "Sin descripción";
    ano.textContent = item.Año || item.ano || "N/A";
    audio.textContent = item.audio || "Latino";
    mini.src = item.foto || "";

    // ✅ Botón REPRODUCIR → ir a detalle
    const btnVer = document.getElementById("btn-ver");
    if (btnVer) btnVer.onclick = () => mostrarDetalle(item);

    // ✅ Botón FAVORITOS → agregar/quitar
    const btnListaCarrusel = document.getElementById("btn-lista-carrusel");
    if (btnListaCarrusel) {
      const icono = btnListaCarrusel.querySelector(".corazon-icon");
      const texto = btnListaCarrusel.querySelector(".texto-favorito");

      const esFav = esFavorito(item.id || item.Titulo);
      icono.textContent = esFav ? "♥" : "♡";
      texto.textContent = esFav ? "GUARDADO" : "FAVORITOS";

      btnListaCarrusel.onclick = () => {
        toggleFavorito(item, icono, texto);
      };
    }

    // Actualizar indicadores
    const indicadores = document.getElementById("carrusel-indicadores");
    if (indicadores) {
      indicadores.innerHTML = "";
      carruselItems.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "indicador";
        if (i === carruselIndex) dot.classList.add("activo");
        dot.addEventListener("click", () => {
          carruselIndex = i;
          renderizar();
        });
        indicadores.appendChild(dot);
      });
    }
  }

  // Flechas
  document.getElementById("carrusel-prev").onclick = () => {
    carruselIndex = (carruselIndex - 1 + carruselItems.length) % carruselItems.length;
    renderizar();
  };

  document.getElementById("carrusel-next").onclick = () => {
    carruselIndex = (carruselIndex + 1) % carruselItems.length;
    renderizar();
  };

  renderizar();
  intervalCarrusel = setInterval(() => {
    carruselIndex = (carruselIndex + 1) % carruselItems.length;
    renderizar();
  }, 6000);
}

function detenerCarrusel() {
  if (intervalCarrusel) {
    clearInterval(intervalCarrusel);
    intervalCarrusel = null;
  }
}

// ===== EVENT LISTENERS DEL MENÚ =====

// Toggle del menú hamburguesa
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Toggle de búsqueda
searchToggle.addEventListener("click", () => {
  menu.classList.add("hidden");
  
  if (busquedaSection.classList.contains("hidden")) {
    // Mostrar búsqueda
    ocultarElementosPrincipales();
    busquedaSection.classList.remove("hidden");
    detenerCarrusel();
    buscador.focus();
  } else {
    // Ocultar búsqueda y volver a inicio
    busquedaSection.classList.add("hidden");
    buscador.value = "";
    resultadosBusqueda.innerHTML = "";
    mostrarVistaInicial();
    reanudarCarrusel();
  }
});

// Botón "Acerca de"
btnAcerca.addEventListener("click", () => {
  menu.classList.add("hidden");
  ocultarElementosPrincipales();
  acercaDeSection.classList.remove("hidden");
  detenerCarrusel();
});

// Botón volver de "Acerca de"
btnVolverAcerca.addEventListener("click", () => {
  acercaDeSection.classList.add("hidden");
  mostrarVistaInicial();
  reanudarCarrusel();
});

const btnPopulares = document.getElementById("btn-populares");
const popularesSection = document.getElementById("populares");
const btnVolverPopulares = document.getElementById("btn-volver-populares");

btnPopulares.addEventListener("click", () => {
  ocultarElementosPrincipales();
  popularesSection.classList.remove("hidden");
  cargarPopulares(); // ← Aquí se llama
});

btnVolverPopulares.addEventListener("click", () => {
  popularesSection.classList.add("hidden");
  mostrarVistaInicial();
  reanudarCarrusel();
});

// Botón volver general
btnVolver.addEventListener("click", () => {
  detalleSection.classList.add("hidden");
  videoPlayer.classList.add("hidden");

  // Ocultar el botón de juego al salir
  const btnGame = document.getElementById('btn-game');
  if (btnGame) btnGame.classList.add('hidden');

  if (videoElement) {
    videoElement.pause();
    videoElement.src = "";
  }

  mostrarVistaInicial();
  reanudarCarrusel();
});

// ===== FUNCIONES DE BÚSQUEDA =====

buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase().trim();

  if (resultadosBusqueda) {
    resultadosBusqueda.innerHTML = "";
  }

  if (texto === "") {
    // 🏠 Si el buscador queda vacío, regresar a la vista principal
    busquedaSection.classList.add("hidden");
    mostrarVistaInicial();
    reanudarCarrusel();
    return;
  }

  
  // Filtrar contenido
  const encontrados = Object.values(datosContenido).filter(item =>
    item.foto && item.Titulo && (
      (item.Titulo || "").toLowerCase().includes(texto) ||
      (item.genero || "").toLowerCase().includes(texto) ||
      (item.descripción || "").toLowerCase().includes(texto) ||
      (item.actores || item.ars || "").toLowerCase().includes(texto)
    )
  );
  
  if (encontrados.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-resultados";
    mensaje.textContent = `No se encontraron resultados para: "${texto}"`;
    mensaje.style.cssText = `
      color: #ccc;
      text-align: center;
      padding: 20px;
      font-style: italic;
    `;
    if (resultadosBusqueda) {
      resultadosBusqueda.appendChild(mensaje);
    }
  } else {
    encontrados.forEach(item => {
      if (resultadosBusqueda) {
        resultadosBusqueda.appendChild(crearCard(item));
      }
    });
  }
});

// ===== FUNCIONES PARA CREAR TARJETAS =====

function crearCard(item) {
  const card = document.createElement("div");
  card.className = "content-card";

  const img = document.createElement("img");
  img.src = item.foto;
  img.alt = item.Titulo || "Sin título";
  img.classList.add("card-img");

  const titulo = document.createElement("div");
  titulo.className = "card-title";
  titulo.textContent = item.Titulo || "Sin título";

  card.appendChild(img);
  card.appendChild(titulo);

  // Estrellas por visitas
  const estrellasDiv = document.createElement("div");
  const visitas = item.visitas || 0;
  let estrellas = 0;

  if (visitas >= 1000) estrellas = 5;
  else if (visitas >= 500) estrellas = 4;
  else if (visitas >= 300) estrellas = 3;
  else if (visitas >= 200) estrellas = 2;
  else if (visitas >= 100) estrellas = 1;

  estrellasDiv.textContent = "⭐".repeat(estrellas);
  estrellasDiv.style.color = "#FFD700";
  estrellasDiv.style.marginTop = "5px";
  card.appendChild(estrellasDiv);

  // Click en imagen o título: ir a detalle
  const verDetalle = () => {
    mostrarDetalle(item);
  };
  img.addEventListener("click", verDetalle);
  titulo.addEventListener("click", verDetalle);

  // Vista previa (modal) con toque prolongado
  let presionado;
  let fuePreview = true;

  const iniciarPreview = () => {
    fuePreview = false;
    presionado = setTimeout(() => {
      fuePreview = true;
      mostrarPreview(item);
    }, 500); // medio segundo para activar modal
  };

  const cancelarPreview = () => {
    clearTimeout(presionado);
  };

  // MOUSE
  card.addEventListener("mousedown", iniciarPreview);
  card.addEventListener("mouseup", cancelarPreview);
  card.addEventListener("mouseleave", cancelarPreview);

  // TOUCH (móvil/tablet)
  card.addEventListener("touchstart", iniciarPreview);
  card.addEventListener("touchend", (e) => {
    cancelarPreview();
    if (!fuePreview) {
      // Si no se activó el modal por tiempo prolongado, interpretar como toque normal
      const tocado = e.target;
      if (tocado === img || tocado === titulo) {
        mostrarDetalle(item);
      }
    }
  });
  card.addEventListener("touchcancel", cancelarPreview);

  return card;
}

// ===== FUNCIONES DE DETALLE =====
function mostrarDetalle(item) {
  enVistaDetalle = true; // ← Añade esto
  contenidoActual = item; // Guardar el contenido actual para la función de likes
  detenerCarrusel();
  ocultarElementosPrincipales();
  busquedaSection.classList.add("hidden");
  acercaDeSection.classList.add("hidden");
  // CORREGIDO: Verificar que favoritosSection existe antes de usarlo
  if (favoritosSection) favoritosSection.classList.add("hidden");
  chatContenidoID = item.id || item.Titulo;

  const refPopulares = ref(db, `populares/${item.Titulo}`);
  get(refPopulares).then((snap) => {
    const data = snap.val() || {
      Titulo: item.Titulo,
      visitas: 0,
      historial: [],
      foto: item.foto || ""
    };

    if (!data.foto && item.foto) {
      data.foto = item.foto;
    }

    data.visitas += 1;
    data.historial.push(Date.now());

    set(refPopulares, data).catch((err) => {
      console.error("Error al guardar popularidad:", err);
    });
  });
  
  // === Botón de juego (si existe) ===
  const gameName = (item.Titulo || '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toUpperCase();
  const gamePath = `Games/${gameName}.html`;

  fetch(gamePath, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        const btnGame = document.getElementById('btn-game');
        btnGame.classList.remove('hidden');
        btnGame.onclick = () => window.open(gamePath, '_blank');
      }
    })
    .catch(() => { /* no existe -> nada */ });

  ///anuncio1

  // Mostrar anuncio si permiso es false
  const usuarioActual = localStorage.getItem("usuarioDOGTV");
  if (usuarioActual) {
    const userRef = ref(db, `usuarios/${usuarioActual}`);
    get(userRef).then(snap => {
      const datos = snap.val();
      if (datos && datos.permiso === false) {
        // Inyectar script del anuncio
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://www.revenuecpmgate.com/xyf3jb01?key=be7f361756a94f2db97956f3a66e36de";
        document.body.appendChild(script);
      }
    });
  }

  const btnCompartir = document.getElementById("btn-compartir");
  if (btnCompartir) {
    btnCompartir.onclick = () => {
      const baseUrl = window.location.href.split('?')[0];
      const tituloCodificado = encodeURIComponent(item.Titulo || item.id);
      const linkCompartible = `${baseUrl}?content=${tituloCodificado}`;
      
      // Copia el enlace y cambia el texto del botón temporalmente
      navigator.clipboard.writeText(linkCompartible).then(() => {
        btnCompartir.textContent = "✓ ¡Copiado!";
        btnCompartir.style.background = "#4CAF50"; // Verde para confirmación
        
        // Vuelve al estado original después de 2 segundos
        setTimeout(() => {
          btnCompartir.textContent = "🔗 Copiar enlace";
          btnCompartir.style.background = "#06D9FF";
        }, 2000);
      }).catch(() => {
        // Fallback: Muestra el enlace en el botón si no se puede copiar
        btnCompartir.textContent = "📋 " + linkCompartible;
      });
    };
  }

  detalleSection.classList.remove("hidden");
  
  // Llenar información
  if (detalleImg) detalleImg.src = item.foto || "";
  if (detalleTitulo) detalleTitulo.textContent = item.Titulo || "Sin título";
  if (detalleDescripcion) detalleDescripcion.textContent = item.descripción || "Sin descripción";
  if (detalleAno) detalleAno.textContent = item.Año || item.ano || "N/A";
  if (detalleGenero) detalleGenero.textContent = item.genero || "N/A";
  if (detalleAudio) detalleAudio.textContent = item.audio || "N/A";
  if (detalleActors) detalleActors.textContent = item.actores || item.ars || "N/A";
  
  const btnFav = document.getElementById("btn-favorito-detalle");
  const icono = btnFav.querySelector(".corazon-icon");

  if (esFavorito(item.id || item.Titulo)) {
    icono.textContent = "♥";
  } else {
    icono.textContent = "♡";
  }

  btnFav.onclick = () => {
    toggleFavorito(item, icono);
  };

  // Cargar y mostrar likes del contenido
  cargarLikes(item.id || item.Titulo);
  
  // Limpiar capítulos anteriores
  if (capitulosLista) {
    capitulosLista.innerHTML = "";
  }

  // Generar botones de capítulos
  const capitulos = Object.entries(item)
    .filter(([key, value]) => key.toUpperCase().startsWith("CAPITULO") && value)
    .sort((a, b) => {
      const numA = parseInt(a[0].replace(/\D/g, "")) || 0;
      const numB = parseInt(b[0].replace(/\D/g, "")) || 0;
      return numA - numB;
    });

  capitulos.forEach(([key, url]) => {
    const btn = document.createElement("button");
    btn.className = "capitulo-btn";
    btn.textContent = key.replace(/_/g, " ").replace(/capitulo/gi, "Capítulo");
    btn.style.cssText = `
      display: block;
      width: 100%;
      margin: 5px 0;
      padding: 10px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    `;

    // AGREGAR ATRIBUTO PARA SEGUIMIENTO
    btn.setAttribute('data-capitulo', key);

    btn.addEventListener("mouseover", () => {
      btn.style.background = "#555";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.background = "#333";
    });
    
    btn.addEventListener("click", () => {
      // 1. Cargar el video en tu reproductor inmediatamente
      cargarVideo(url);
      document.getElementById("video-player").scrollIntoView({ behavior: "smooth", block: "center" });

      // 2. Abrir el anuncio en otra pestaña sin demora
      window.open("https://www.revenuecpmgate.com/v24hcyd4v?key=ae0103079feeb206a13f024b06224d78");
    });

    if (capitulosLista) {
      capitulosLista.appendChild(btn);
    }
  });

  // INICIALIZAR SEGUIMIENTO DE CAPÍTULOS
  inicializarSeguimientoCapitulos();

  // Scroll hacia el detalle
  setTimeout(() => {
    detalleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ===== FUNCIONES DE LIKES =====

// Función para cargar los likes de un contenido desde Firebase
async function cargarLikes(contenidoId) {
  if (!contenidoId) return;
  
  const likesRef = ref(db, `likes/${contenidoId}`);
  
  try {
    const snapshot = await get(likesRef);
    const likesData = snapshot.val() || { count: 0, users: {} };
    
    // Actualizar el contador de likes en la UI
    if (likeCount) {
      likeCount.textContent = likesData.count || 0;
    }
    
    // Verificar si el usuario actual ya dio like a este contenido
    const usuarioActual = localStorage.getItem("usuarioDOGTV");
    if (usuarioActual && likesData.users && likesData.users[usuarioActual]) {
      // El usuario ya dio like, cambiar el estado del botón
      if (btnLikeDetalle) {
        btnLikeDetalle.classList.add("active");
      }
    } else {
      // El usuario no ha dado like, asegurar que el botón no esté activo
      if (btnLikeDetalle) {
        btnLikeDetalle.classList.remove("active");
      }
    }
  } catch (error) {
    console.error("Error al cargar likes:", error);
  }
}

// Función para manejar el evento de click en el botón de like
async function toggleLike() {
  const usuarioActual = localStorage.getItem("usuarioDOGTV");
  
  // Verificar si el usuario está registrado
  if (!usuarioActual) {
    // Mostrar un mensaje indicando que necesita iniciar sesión
    alert("Debes iniciar sesión para dar like. Por favor, regístrate o inicia sesión en el chat.");
    return;
  }
  
  if (!contenidoActual) return;
  
  const contenidoId = contenidoActual.id || contenidoActual.Titulo;
  if (!contenidoId) return;
  
  const likesRef = ref(db, `likes/${contenidoId}`);
  
  try {
    const snapshot = await get(likesRef);
    const likesData = snapshot.val() || { count: 0, users: {} };
    
    // Verificar si el usuario ya dio like
    if (likesData.users && likesData.users[usuarioActual]) {
      // El usuario ya dio like, lo quitamos
      likesData.count = Math.max(0, likesData.count - 1);
      delete likesData.users[usuarioActual];
      
      // Actualizar UI
      if (btnLikeDetalle) {
        btnLikeDetalle.classList.remove("active");
      }
    } else {
      // El usuario no ha dado like, lo añadimos
      likesData.count = (likesData.count || 0) + 1;
      if (!likesData.users) likesData.users = {};
      likesData.users[usuarioActual] = true;
      
      // Actualizar UI
      if (btnLikeDetalle) {
        btnLikeDetalle.classList.add("active");
      }
    }
    
    // Guardar los cambios en Firebase
    await set(likesRef, likesData);
    
    // Actualizar el contador en la UI
    if (likeCount) {
      likeCount.textContent = likesData.count;
    }
  } catch (error) {
    console.error("Error al actualizar like:", error);
    alert("Ocurrió un error al procesar tu like. Por favor, inténtalo de nuevo más tarde.");
  }
}

// Agregar event listener al botón de like
if (btnLikeDetalle) {
  btnLikeDetalle.addEventListener("click", toggleLike);
}

// CONTINÚA EN LA PARTE 2..
// ===== FUNCIONES DEL REPRODUCTOR =====
function cargarVideo(url) {
  const contenedor = document.getElementById("video-player");
  if (!contenedor || !url) return;

  // Detener cualquier reproducción previa
  const iframePrevio = contenedor.querySelector("iframe");
  if (iframePrevio && iframePrevio.src.includes("ok.ru/videoembed")) {
    // Para Ok.ru: intentar pausar vía postMessage antes de destruir
    iframePrevio.contentWindow.postMessage(
      '{"method":"pause","value":""}',
      "https://ok.ru"
    );
  }

  contenedor.innerHTML = "";
  contenedor.style.cssText =
    "position:relative; padding-bottom:56.25%; height:0; overflow:hidden;";

  let iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:absolute; top:0; left:0; width:100%; height:100%; border:0;";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen; web-share";

  if (
    url.includes("dailymotion.com/player.html") ||
    url.includes("dailymotion.com/embed/video/")
  ) {
    iframe.src = url;
  } else if (url.includes("archive.org/embed/")) {
    iframe.src = url;
  } else if (url.includes("ok.ru/videoembed/")) {
    iframe.src = url;
  } else if (url.includes("my.mail.ru/video/embed/")) {
    iframe.src = url;
  } else if (url.includes("fkplayer.xyz/e/")) {
    iframe.src = url;
  } else if (url.includes("video.doramedplay.net/videos/embed/")) {
    // ➕ Soporte para doramedplay.net
    iframe.src = url;
  } else if (url.includes("dailymotion.com/video/")) {
    const videoId = url.split("/video/")[1]?.split("?")[0];
    iframe.src = videoId
      ? `https://geo.dailymotion.com/player.html?video=${videoId}`
      : url;
  } else if (url.includes("<iframe")) {
    contenedor.innerHTML = url;
    contenedor.style.cssText = "";
    return;
  } else {
    // Firebase Storage o archivo directo
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.controlsList = "nodownload";
    video.oncontextmenu = () => false;
    video.autoplay = true;
    video.style.width = "100%";
    video.style.maxHeight = "480px";
    contenedor.style.cssText = "";
    contenedor.appendChild(video);
    contenedor.classList.remove("hidden");
    // CORREGIDO: Usar video en lugar de iframe para el scroll
    setTimeout(() => video.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    return;
  }

  contenedor.appendChild(iframe);
  contenedor.classList.remove("hidden");
  // CORREGIDO: Asegurarse de que iframe esté definido
  setTimeout(() => {
    iframe.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

// Event listeners del video
if (videoElement) {
  videoElement.addEventListener('ended', () => {
    videoPlayer.classList.add("hidden");
    videoElement.src = "";
  });
  
  videoElement.addEventListener('error', (e) => {
    console.error("Error en el video:", e);
    alert("ESTO SE DEBE A PROBLEMAS CON EL SERVIDOR TRANQUILOS EL MANTENIMIENTO DEL MISMO NO DEMORA DE 1 A 2 DIAS ABILES RECUERDEN QUE NO TENEMOS NI ANUCIOS NI MENBRECIAS QUE NOS AYUDEN PODER USAR UN MEJOR SERVICIO AGRADESCO SU PASIENCIA. ");
  });
}

// ===== FUNCIONES DEL MODAL DE PREVIEW =====

function mostrarPreview(item) {
  itemSeleccionadoPreview = item;
  
  if (previewImg) previewImg.src = item.foto || "";
  if (previewTitle) previewTitle.textContent = item.Titulo || "Sin título";
  if (previewDescripcion) {
    const desc = item.descripción || "Sin descripción";
    previewDescripcion.textContent = desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
  }
  
  previewModal.classList.remove("hidden");
}

// Cerrar modal
modalCerrar.addEventListener("click", () => {
  previewModal.classList.add("hidden");
  itemSeleccionadoPreview = null;
});

previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) {
    previewModal.classList.add("hidden");
    itemSeleccionadoPreview = null;
  }
});

// Agregar botón "Ver más" al modal
const modalContent = document.querySelector(".modal-content");
if (modalContent) {
  const verMasBtn = document.createElement("button");
  verMasBtn.textContent = "Ver más";
  verMasBtn.className = "ver-mas-btn";
  verMasBtn.style.cssText = `
    margin-top: 15px;
    background: #06D9FF;
    border: none;
    color: #000;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s;
    width: 100%;
  `;
  
  verMasBtn.addEventListener("mouseover", () => {
    verMasBtn.style.backgroundColor = "#05B8D9";
    verMasBtn.style.transform = "scale(1.05)";
  });
  
  verMasBtn.addEventListener("mouseout", () => {
    verMasBtn.style.backgroundColor = "#06D9FF";
    verMasBtn.style.transform = "scale(1)";
  });
  
  verMasBtn.addEventListener("click", () => {
    if (itemSeleccionadoPreview) {
      previewModal.classList.add("hidden");
      mostrarDetalle(itemSeleccionadoPreview);
      itemSeleccionadoPreview = null;
    }
  });
  
  modalContent.appendChild(verMasBtn);
}

// ===== FUNCIONES DE ACORDEÓN =====

function inicializarAcordeon() {
  const headers = document.querySelectorAll('.acordeon-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.acordeon-content');
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los acordeones
      document.querySelectorAll('.acordeon-item').forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.acordeon-content');
        if (c) c.style.display = 'none';
      });
      
      // Abrir el seleccionado si no estaba activo
      if (!isActive) {
        item.classList.add('active');
        if (content) content.style.display = 'block';
      }
    });
  });
}

// ===== FUNCIONES PRINCIPALES =====

function renderizarContenido(data) {
  // Limpiar contenedores
  if (dramasDiv) dramasDiv.innerHTML = "";
  if (peliculasDiv) peliculasDiv.innerHTML = "";
  
  const itemsDestacados = [];
  
  for (const key in data) {
    const item = data[key];
    
    // Validar que el item tenga los datos mínimos
    if (!item.foto || !item.Titulo) continue;
    
    const tipo = (item.tipo || "").toLowerCase().trim();
    const estreno = (item.estreno || "").toLowerCase().trim();
    
    // Items para el carrusel (destacados)
    if (estreno === "true") {
      itemsDestacados.push(item);
    }
    
    // Categorizar por tipo
    if (["dorama", "dramas", "drama"].includes(tipo) && dramasDiv) {
      dramasDiv.appendChild(crearCard(item));
    } else if (["película", "pelicula", "movie"].includes(tipo) && peliculasDiv) {
      peliculasDiv.appendChild(crearCard(item));
    }
  }
  
  // Iniciar carrusel con items destacados
  if (itemsDestacados.length > 0) {
    iniciarCarrusel(itemsDestacados);
  }
}

// ===== CONTROL DE VISIBILIDAD DE PÁGINA =====

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    detenerCarrusel();
  } else {
    // Solo reanudar si estamos en la vista principal
    if (!listasContenido.classList.contains("hidden") && !destacadoEmision.classList.contains("hidden")) {
      reanudarCarrusel();
    }
  }
});

// ===== CERRAR MENÚS AL HACER CLICK FUERA =====

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// ===== TECLAS DE ACCESO RÁPIDO =====

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Escape':
      // Cerrar modales y menús
      previewModal.classList.add("hidden");
      menu.classList.add("hidden");
      itemSeleccionadoPreview = null;
      break;
    case '/':
      // Activar búsqueda
      if (!busquedaSection.classList.contains("hidden")) {
        e.preventDefault();
        buscador.focus();
      }
      break;
  }
});

// ===== INICIALIZACIÓN =====

// Cargar datos desde Firebase
onValue(ref(db, 'contenido_db_adm'), (snapshot) => {
  datosContenido = snapshot.val() || {};
  renderizarContenido(datosContenido);

  const params = new URLSearchParams(window.location.search);
  const contentParam = params.get('content');

  if (contentParam) {
    const tituloDecodificado = decodeURIComponent(contentParam);
    const itemEncontrado = Object.values(datosContenido).find(
      item => (item.Titulo || item.id) === tituloDecodificado
    );
    if (itemEncontrado) {
      ocultarElementosPrincipales();
      mostrarDetalle(itemEncontrado);
    }
  }

  // ✅ Mostrar publicidad al final, cuando ya cargó todo
  setTimeout(() => {
    mostrarPublicidad();
  }, 500); // Le damos medio segundo de margen
});

// Inicializar acordeón cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarAcordeon();
  mostrarSaludoPersonalizado();

  // ✅ Asegurar que el botón siempre esté visible DESPUÉS de que el DOM esté listo
  const botonOnline = document.getElementById('btn-usuarios-online');
  if (botonOnline) {
    botonOnline.style.display = 'flex';
    botonOnline.style.visibility = 'visible';
    botonOnline.style.opacity = '1';
  }

  // ✅ Registrar usuario en línea solo cuando el DOM esté listo
  registrarUsuarioOnline();
});

// VALIDAR USUARIO GUARDADO
const usuario = localStorage.getItem("usuarioDOGTV");
if (usuario) {
  const userRef = ref(db, `usuarios/${usuario}`);
  get(userRef).then(snap => {
    if (!snap.exists()) {
      // Si NO existe en Firebase, limpiar localStorage
      localStorage.removeItem("usuarioDOGTV");
    }
  }).catch(err => {
    console.error("Error al verificar usuario:", err);
  });
}

// ===== FAVORITOS =====

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos") || "{}");
}

function guardarFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function esFavorito(id) {
  const favs = obtenerFavoritos();
  return Boolean(favs[id]);
}

function agregarAFavoritos(item) {
  const favs = obtenerFavoritos();
  favs[item.id || item.Titulo] = item;
  guardarFavoritos(favs);
}

function removerDeFavoritos(id) {
  const favs = obtenerFavoritos();
  delete favs[id];
  guardarFavoritos(favs);
}

function toggleFavorito(item, icono, texto) {
  const id = item.id || item.Titulo;
  if (esFavorito(id)) {
    removerDeFavoritos(id);
    icono.textContent = "♡";
    if (texto) texto.textContent = "MI LISTA";
  } else {
    agregarAFavoritos(item);
    icono.textContent = "♥";
    if (texto) texto.textContent = "GUARDADO";
  }
}

function mostrarFavoritos() {
  ocultarElementosPrincipales();
  favoritosSection.classList.remove("hidden");

  const favs = obtenerFavoritos();
  favoritosLista.innerHTML = "";

  const values = Object.values(favs);
  if (values.length === 0) {
    favoritosLista.innerHTML = `
      <div class="favoritos-vacio">
        <h3>No tienes favoritos aún</h3>
        <p>Agrega contenido a tu lista de favoritos para verlo aquí</p>
      </div>`;
    return;
  }

  values.forEach(item => {
    favoritosLista.appendChild(crearCard(item));
  });
}

btnFavoritos.addEventListener("click", () => {
  menu.classList.add("hidden");
  mostrarFavoritos();
});

btnVolverFavoritos.addEventListener("click", () => {
  favoritosSection.classList.add("hidden");
  mostrarVistaInicial();
  reanudarCarrusel();
});

// === CHAT POR CONTENIDO ===

const chatModal = document.getElementById("chat-modal");
const cerrarChat = document.getElementById("cerrar-chat");
const chatLogin = document.getElementById("chat-login");
const chatArea = document.getElementById("chat-area");
const chatUsuarioInput = document.getElementById("chat-usuario");
const chatClaveInput = document.getElementById("chat-clave");
const chatLoginBtn = document.getElementById("chat-login-btn");
const chatLoginError = document.getElementById("chat-login-error");
const chatMensajes = document.getElementById("chat-mensajes");
const chatForm = document.getElementById("chat-form");
const chatTextoInput = document.getElementById("chat-texto");
const btnChat = document.getElementById("btn-chat");

let chatContenidoID = null;
let usuarioActual = null;

// Abrir modal de chat al presionar el botón

btnChat.addEventListener("click", async () => {
  if (!chatContenidoID) return;

  const rawIP = await obtenerIP();
  const ip = rawIP.replace(/\./g, "_");

  const bloqueadoRef = ref(db, `bloqueados/${ip}`);
  const snapshot = await get(bloqueadoRef);

  if (snapshot.exists()) {
    const datos = snapshot.val();
    mostrarModalBloqueado(datos);
    return;
  }

  chatModal.classList.remove("hidden");
  usuarioActual = localStorage.getItem("usuarioDOGTV");

  if (usuarioActual) {
    chatLogin.classList.add("hidden");
    chatArea.classList.remove("hidden");
    escucharMensajes(chatContenidoID);
  } else {
    chatLogin.classList.remove("hidden");
    chatArea.classList.add("hidden");
  }
});

// Cerrar modal
cerrarChat.addEventListener("click", () => {
  chatModal.classList.add("hidden");
  chatMensajes.innerHTML = "";
});

// Login con nombre de usuario y contraseña

chatLoginBtn.addEventListener("click", async () => {
  const usuario = chatUsuarioInput.value.trim().toLowerCase();
  const clave = chatClaveInput.value.trim();

  if (!usuario || !clave) return;

  const userRef = ref(db, `usuarios/${usuario}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    if (data.clave === clave) {
      localStorage.setItem("usuarioDOGTV", usuario);
      usuarioActual = usuario;
      chatLogin.classList.add("hidden");
      chatArea.classList.remove("hidden");
      escucharMensajes(chatContenidoID);
    } else {
      chatLoginError.textContent = "Contraseña incorrecta";
      chatLoginError.style.display = "block";
    }
  } else {
    // ✅ Verificar IP antes de permitir crear cuenta
    const rawIP = await obtenerIP();
    const ip = rawIP.replace(/\./g, "_");
    const bloqueadoRef = ref(db, `bloqueados/${ip}`);
    const bloqueadoSnap = await get(bloqueadoRef);

    if (bloqueadoSnap.exists()) {
      const datos = bloqueadoSnap.val();
      mostrarModalBloqueado(datos);
      return;
    }

    // ✅ Crear cuenta si no está bloqueado
    await set(userRef, { clave, permiso: false });
    localStorage.setItem("usuarioDOGTV", usuario);
    usuarioActual = usuario;
    chatLogin.classList.add("hidden");
    chatArea.classList.remove("hidden");
    escucharMensajes(chatContenidoID);
  }
});

// Escuchar mensajes del contenido actual
function escucharMensajes(contenidoID) {
  const mensajesRef = ref(db, `chats/${contenidoID}/mensajes`);

  onValue(mensajesRef, (snapshot) => {
    chatMensajes.innerHTML = "";
    snapshot.forEach(child => {
      const msg = child.val();
      const div = document.createElement("div");
      div.className = "mensaje";
      div.classList.add(msg.usuario === usuarioActual ? "propio" : "otro");

      const contenido = document.createElement("span");
      contenido.textContent = `${msg.usuario}: ${msg.texto}`;
      div.appendChild(contenido);

      // Si NO es del usuario actual, añadimos botón de reporte
      if (msg.usuario !== usuarioActual) {
        const btnReportar = document.createElement("button");
        btnReportar.textContent = "🚩";
        btnReportar.className = "btn-reportar";
        btnReportar.style.marginLeft = "10px";
        btnReportar.style.background = "none";
        btnReportar.style.border = "none";
        btnReportar.style.cursor = "pointer";
        btnReportar.style.fontSize = "12px";
        
        btnReportar.addEventListener("click", () => {
          mostrarModalReporte(msg.usuario, msg.texto, child.key);
        });
        
        div.appendChild(btnReportar);
      }

      chatMensajes.appendChild(div);
    });
    
    // Scroll al final
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  });
}

// Enviar mensaje
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const texto = chatTextoInput.value.trim();
  if (!texto) return;
  
  // Verificar palabras prohibidas
  const textoLower = texto.toLowerCase();
  const palabraEncontrada = palabrasProhibidas.find(palabra => 
    textoLower.includes(palabra.toLowerCase())
  );
  
  if (palabraEncontrada) {
    // Mostrar advertencia
    const modalAdvertencia = document.getElementById("modal-advertencia");
    if (modalAdvertencia) {
      modalAdvertencia.classList.remove("hidden");
      
      // Actualizar corazones
      const corazonesRef = ref(db, `usuarios/${usuarioActual}/corazones`);
      get(corazonesRef).then(snap => {
        let corazones = snap.val() || 3;
        corazones--;
        
        set(corazonesRef, corazones).then(() => {
          const estadoCorazones = document.getElementById("estado-corazones");
          if (estadoCorazones) {
            estadoCorazones.textContent = "❤️".repeat(corazones);
          }
          
          // Si llega a 0 corazones, bloquear usuario
          if (corazones <= 0) {
            bloquearUsuario(usuarioActual, "Uso repetido de lenguaje ofensivo");
          }
        });
      });
    }
    return;
  }
  
  // Enviar mensaje
  const mensajesRef = ref(db, `chats/${chatContenidoID}/mensajes`);
  const nuevoMensaje = push(mensajesRef);
  
  set(nuevoMensaje, {
    usuario: usuarioActual,
    texto: texto,
    timestamp: Date.now()
  });
  
  // Limpiar input
  chatTextoInput.value = "";
});

// ===== FUNCIONES DE SEGUIMIENTO DE CAPÍTULOS VISTOS =====

// Función para inicializar el seguimiento de capítulos
function inicializarSeguimientoCapitulos() {
  // Verificar si estamos en la página de detalle
  const detalleSection = document.getElementById('detalle');
  if (!detalleSection) return;
  
  // Obtener información del usuario actual
  const usuarioActual = localStorage.getItem('usuarioDOGTV');
  if (!usuarioActual) return;
  
  // Obtener ID del contenido actual
  const contenidoId = window.chatContenidoID || 
                     document.getElementById('detalle-titulo')?.textContent;
  if (!contenidoId) return;
  
  // Cargar y marcar capítulos vistos
  cargarCapitulosVistos(usuarioActual, contenidoId);
  
  // Agregar evento a los botones de capítulo
  agregarEventosCapitulos(usuarioActual, contenidoId);
  
  // Agregar botón de reinicio
  agregarBotonReiniciarProgreso();
}

// Función para cargar y marcar capítulos vistos
function cargarCapitulosVistos(usuario, contenidoId) {
  const progresoRef = ref(db, `progreso_usuarios/${usuario}/${contenidoId}`);
  
  onValue(progresoRef, (snapshot) => {
    const capitulosVistos = snapshot.val() || {};
    
    // Marcar cada capítulo visto
    Object.keys(capitulosVistos).forEach(capituloKey => {
      if (capitulosVistos[capituloKey]) {
        const botonCapitulo = document.querySelector(`[data-capitulo="${capituloKey}"]`);
        if (botonCapitulo) {
          botonCapitulo.classList.add('visto');
          if (!botonCapitulo.innerHTML.includes('✓')) {
            botonCapitulo.innerHTML += ' ✓';
          }
        }
      }
    });
  });
}

// Función para agregar eventos a los botones de capítulo
function agregarEventosCapitulos(usuario, contenidoId) {
  const botonesCapitulo = document.querySelectorAll('.capitulo-btn');
  
  botonesCapitulo.forEach(boton => {
    boton.addEventListener('click', function() {
      const capituloKey = this.getAttribute('data-capitulo');
      if (!capituloKey) return;
      
      // Guardar progreso en Firebase
      guardarProgresoCapitulo(usuario, contenidoId, capituloKey);
      
      // Marcar el capítulo como visto visualmente
      this.classList.add('visto');
      if (!this.innerHTML.includes('✓')) {
        this.innerHTML += ' ✓';
      }
    });
  });
}

// Función para guardar el progreso de un capítulo
function guardarProgresoCapitulo(usuario, contenidoId, capituloKey) {
  const progresoRef = ref(db, `progreso_usuarios/${usuario}/${contenidoId}/${capituloKey}`);
  
  // Guardar como true (visto)
  set(progresoRef, true)
    .then(() => {
      console.log(`Progreso guardado: ${usuario} - ${contenidoId} - ${capituloKey}`);
    })
    .catch(error => {
      console.error("Error al guardar progreso:", error);
    });
}

// Función para obtener el progreso general del usuario
function obtenerProgresoGeneral(usuario) {
  return new Promise((resolve, reject) => {
    const progresoRef = ref(db, `progreso_usuarios/${usuario}`);
    
    get(progresoRef).then((snapshot) => {
      resolve(snapshot.val() || {});
    }).catch(reject);
  });
}

// Función para mostrar estadísticas de visualización
function mostrarEstadisticasVisualizacion() {
  const usuarioActual = localStorage.getItem('usuarioDOGTV');
  if (!usuarioActual) return;
  
  obtenerProgresoGeneral(usuarioActual).then(progreso => {
    const contenidosVistos = Object.keys(progreso).length;
    let totalCapitulos = 0;
    
    Object.values(progreso).forEach(contenido => {
      totalCapitulos += Object.keys(contenido).length;
    });
    
    console.log(`Estadísticas de ${usuarioActual}:`);
    console.log(`Contenidos vistos: ${contenidosVistos}`);
    console.log(`Capítulos vistos: ${totalCapitulos}`);
  });
}

// Función para reiniciar el progreso de un contenido
function reiniciarProgresoContenido(contenidoId) {
  const usuarioActual = localStorage.getItem('usuarioDOGTV');
  if (!usuarioActual) return;
  
  // Confirmar antes de reiniciar
  if (confirm("¿Estás seguro de que quieres reiniciar el progreso de este contenido?")) {
    const progresoRef = ref(db, `progreso_usuarios/${usuarioActual}/${contenidoId}`);
    
    remove(progresoRef)
      .then(() => {
        console.log(`Progreso reiniciado para ${contenidoId}`);
        // Recargar la página para actualizar la UI
        location.reload();
      })
      .catch(error => {
        console.error("Error al reiniciar progreso:", error);
      });
  }
}

// Función para reiniciar todo el progreso del usuario
function reiniciarTodoProgreso() {
  const usuarioActual = localStorage.getItem('usuarioDOGTV');
  if (!usuarioActual) return;
  
  if (confirm("¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
    const progresoRef = ref(db, `progreso_usuarios/${usuarioActual}`);
    
    remove(progresoRef)
      .then(() => {
        console.log("Todo el progreso ha sido reiniciado");
        // Recargar la página
        location.reload();
      })
      .catch(error => {
        console.error("Error al reiniciar progreso:", error);
      });
  }
}

// Función para agregar botón de reinicio de progreso
function agregarBotonReiniciarProgreso() {
  const detalleSection = document.getElementById('detalle');
  if (!detalleSection) return;
  
  // Verificar si el botón ya existe para no duplicarlo
  if (document.getElementById('btn-reiniciar-progreso')) {
    return;
  }
  
  const botonReiniciar = document.createElement('button');
  botonReiniciar.id = 'btn-reiniciar-progreso';
  botonReiniciar.textContent = 'Reiniciar Progreso';
  botonReiniciar.className = 'detalle-button';
  botonReiniciar.style.backgroundColor = '#ff4444';
  
  botonReiniciar.addEventListener('click', function() {
    const contenidoId = window.chatContenidoID || 
                       document.getElementById('detalle-titulo')?.textContent;
    if (contenidoId) {
      reiniciarProgresoContenido(contenidoId);
    }
  });
  
  // Insertar después de los botones existentes
  const btnCompartir = document.getElementById('btn-compartir');
  if (btnCompartir) {
    btnCompartir.parentNode.insertBefore(botonReiniciar, btnCompartir.nextSibling);
  }
}

// CONTINÚA EN LA PARTE 3...
// ===== FUNCIONES DE MODAL DE REPORTE =====

function mostrarModalReporte(usuarioReportado, mensajeReportado, mensajeId) {
  const modalReporte = document.getElementById("modal-reporte");
  if (!modalReporte) return;
  
  const mensajeReportadoElement = document.getElementById("mensaje-reportado");
  if (mensajeReportadoElement) {
    mensajeReportadoElement.textContent = `${usuarioReportado}: ${mensajeReportado}`;
  }
  
  // Limpiar formulario anterior
  const radios = document.querySelectorAll('input[name="motivo-reporte"]');
  radios.forEach(radio => radio.checked = false);
  
  const comentario = document.getElementById("comentario-reporte");
  if (comentario) comentario.value = "";
  
  // Configurar botones
  const cancelarBtn = document.getElementById("cancelar-reporte");
  const enviarBtn = document.getElementById("enviar-reporte");
  
  if (cancelarBtn) {
    cancelarBtn.onclick = () => {
      modalReporte.classList.add("hidden");
    };
  }
  
  if (enviarBtn) {
    enviarBtn.onclick = () => {
      const motivoSeleccionado = document.querySelector('input[name="motivo-reporte"]:checked');
      if (!motivoSeleccionado) {
        alert("Por favor selecciona un motivo para el reporte.");
        return;
      }
      
      enviarReporte(usuarioReportado, mensajeReportado, motivoSeleccionado.value, comentario?.value || "", mensajeId);
      modalReporte.classList.add("hidden");
    };
  }
  
  modalReporte.classList.remove("hidden");
}

function enviarReporte(usuarioReportado, mensaje, motivo, comentario, mensajeId) {
  const reporteRef = ref(db, `reportes/${Date.now()}`);
  
  const reporte = {
    usuarioReportado: usuarioReportado,
    mensaje: mensaje,
    motivo: motivo,
    comentario: comentario,
    mensajeId: mensajeId,
    reportadoPor: usuarioActual,
    timestamp: Date.now(),
    contenidoId: chatContenidoID
  };
  
  set(reporteRef, reporte)
    .then(() => {
      console.log("Reporte enviado correctamente");
      
      // Mostrar modal de agradecimiento
      const modalGracias = document.getElementById("modal-gracias-reporte");
      if (modalGracias) {
        const usuarioGracias = document.getElementById("usuario-gracias");
        if (usuarioGracias) {
          usuarioGracias.textContent = usuarioActual;
        }
        modalGracias.classList.remove("hidden");
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
          modalGracias.classList.add("hidden");
        }, 3000);
      }
    })
    .catch(error => {
      console.error("Error al enviar reporte:", error);
      alert("Error al enviar el reporte. Por favor inténtalo de nuevo.");
    });
}

// ===== FUNCIONES DE BLOQUEO DE USUARIOS =====

function bloquearUsuario(usuario, motivo) {
  const bloqueoRef = ref(db, `bloqueados/${usuario}`);
  
  const datosBloqueo = {
    motivo: motivo,
    timestamp: Date.now(),
    bloqueadoPor: "sistema"
  };
  
  set(bloqueoRef, datosBloqueo)
    .then(() => {
      console.log(`Usuario ${usuario} bloqueado correctamente`);
      
      // Mostrar modal de bloqueo
      mostrarModalBloqueado(datosBloqueo);
      
      // Forzar cierre de sesión
      localStorage.removeItem("usuarioDOGTV");
      location.reload();
    })
    .catch(error => {
      console.error("Error al bloquear usuario:", error);
    });
}

function mostrarModalBloqueado(datos) {
  const modalBloqueo = document.getElementById("modal-bloqueo");
  if (!modalBloqueo) return;
  
  const historialBloqueo = document.getElementById("historial-bloqueo");
  if (historialBloqueo) {
    historialBloqueo.innerHTML = `
      <p><strong>Motivo:</strong> ${datos.motivo}</p>
      <p><strong>Fecha:</strong> ${new Date(datos.timestamp).toLocaleString()}</p>
      <p><strong>Bloqueado por:</strong> ${datos.bloqueadoPor || "Sistema"}</p>
    `;
  }
  
  const cerrarBtn = document.getElementById("cerrar-modal-bloqueo");
  if (cerrarBtn) {
    cerrarBtn.onclick = () => {
      modalBloqueo.classList.add("hidden");
    };
  }
  
  modalBloqueo.classList.remove("hidden");
}

// ===== FUNCIONES UTILITARIAS =====

async function obtenerIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error al obtener IP:", error);
    return "unknown";
  }
}

function mostrarSaludoPersonalizado() {
  const saludoDiv = document.getElementById("saludo-bienvenida");
  if (!saludoDiv) return;
  
  const hora = new Date().getHours();
  let saludo = "";
  
  if (hora >= 6 && hora < 12) {
    saludo = "¡Buenos días!";
  } else if (hora >= 12 && hora < 18) {
    saludo = "¡Buenas tardes!";
  } else {
    saludo = "¡Buenas noches!";
  }
  
  const usuario = localStorage.getItem("usuarioDOGTV");
  if (usuario) {
    saludo += ` Bienvenido/a, ${usuario}`;
  } else {
    saludo += " Bienvenido/a a DORAMAS TV";
  }
  
  saludoDiv.textContent = saludo;
  saludoDiv.classList.remove("hidden");
  
  // Ocultar después de 5 segundos
  setTimeout(() => {
    saludoDiv.classList.add("hidden");
  }, 5000);
}

function registrarUsuarioOnline() {
  const usuario = localStorage.getItem("usuarioDOGTV");
  if (!usuario) return;
  
  // Eliminar entrada anterior si existe
  const usuarioRef = ref(db, `usuarios_online/${usuario}`);
  remove(usuarioRef);
  
  // Crear nueva entrada
  set(usuarioRef, {
    timestamp: Date.now(),
    ultimaActividad: Date.now()
  });
  
  // Actualizar cada 30 segundos
  setInterval(() => {
    update(usuarioRef, {
      ultimaActividad: Date.now()
    });
  }, 30000);
  
  // Eliminar al cerrar la página
  window.addEventListener('beforeunload', () => {
    remove(usuarioRef);
  });
}

// ===== FUNCIONES DE POPULARES =====

function cargarPopulares() {
  const popularesRef = ref(db, 'populares');
  const listaPopulares = document.getElementById('lista-populares');
  
  if (!listaPopulares) return;
  
  listaPopulares.innerHTML = "";
  
  onValue(popularesRef, (snapshot) => {
    const populares = snapshot.val() || {};
    const popularesArray = Object.values(populares);
    
    // Ordenar por número de visitas
    popularesArray.sort((a, b) => (b.visitas || 0) - (a.visitas || 0));
    
    if (popularesArray.length === 0) {
      listaPopulares.innerHTML = `
        <div class="favoritos-vacio">
          <h3>No hay contenido popular aún</h3>
          <p>El contenido más visto aparecerá aquí</p>
        </div>`;
      return;
    }
    
    // Mostrar los 20 más populares
    popularesArray.slice(0, 20).forEach(item => {
      if (item.foto && item.Titulo) {
        listaPopulares.appendChild(crearCard(item));
      }
    });
  });
}

// ===== FUNCIONES DE PUBLICIDAD =====

// CORREGIDO: Función mostrarPublicidad implementada correctamente
function mostrarPublicidad() {
  const modalPublicidad = document.getElementById('modal-publicidad');
  const imgPublicidad = document.getElementById('img-publicidad');
  const cerrarPublicidad = document.getElementById('cerrar-publicidad');
  
  if (!modalPublicidad || !imgPublicidad) return;
  
  // Obtener la URL de la publicidad desde la base de datos de Firebase
  const publicidadRef = ref(db, 'publicidad/imagen');
  
  get(publicidadRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const url = snapshot.val();
        imgPublicidad.src = url;
        modalPublicidad.classList.remove('hidden');
        
        // Mostrar botón de cerrar después de 5 segundos
        setTimeout(() => {
          if (cerrarPublicidad) {
            cerrarPublicidad.classList.remove('hidden');
          }
        }, 5000);
      } else {
        console.log('No se encontró URL de publicidad en la base de datos');
        // No mostrar el modal si no hay URL de publicidad
      }
    })
    .catch((error) => {
      console.error('Error al obtener URL de publicidad:', error);
      // No mostrar el modal si hay error
    });
  
  // Cerrar publicidad
  if (cerrarPublicidad) {
    cerrarPublicidad.addEventListener('click', () => {
      modalPublicidad.classList.add('hidden');
    });
  }
}

// Cerrar modal de gracias
document.addEventListener('DOMContentLoaded', () => {
  const cerrarGracias = document.getElementById("cerrar-modal-gracias");
  if (cerrarGracias) {
    cerrarGracias.addEventListener("click", () => {
      const modalGracias = document.getElementById("modal-gracias-reporte");
      if (modalGracias) {
        modalGracias.classList.add("hidden");
      }
    });
  }
  
  // Cerrar modal de advertencia
  const cerrarAdvertencia = document.getElementById("cerrar-modal-advertencia");
  if (cerrarAdvertencia) {
    cerrarAdvertencia.addEventListener("click", () => {
      const modalAdvertencia = document.getElementById("modal-advertencia");
      if (modalAdvertencia) {
        modalAdvertencia.classList.add("hidden");
      }
    });
  }
});

// ===== MANEJO DE FORMULARIO DE PETICIONES =====

if (formPedir) {
  formPedir.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById("titulo-pedido").value.trim();
    const imagenInput = document.getElementById("imagen-pedido");
    
    if (!titulo || !imagenInput.files[0]) {
      alert("Por favor completa todos los campos");
      return;
    }
    
    // Convertir imagen a base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imagenBase64 = event.target.result;
      
      // Guardar en Firebase
      const peticionRef = ref(db, `peticiones/${Date.now()}`);
      
      const peticion = {
        titulo: titulo,
        imagen: imagenBase64,
        usuario: usuarioPeticiones,
        timestamp: Date.now()
      };
      
      set(peticionRef, peticion)
        .then(() => {
          console.log("Petición enviada correctamente");
          
          // Limpiar formulario
          formPedir.reset();
          const preview = document.getElementById("preview-pedido");
          if (preview) {
            preview.style.display = "none";
            preview.src = "";
          }
          
          alert("¡Tu petición ha sido enviada correctamente!");
        })
        .catch(error => {
          console.error("Error al enviar petición:", error);
          alert("Error al enviar la petición. Por favor inténtalo de nuevo.");
        });
    };
    
    reader.readAsDataURL(imagenInput.files[0]);
  });
}

// Preview de imagen en formulario de peticiones
const imagenPedidoInput = document.getElementById("imagen-pedido");
if (imagenPedidoInput) {
  imagenPedidoInput.addEventListener("change", (e) => {
    const preview = document.getElementById("preview-pedido");
    if (preview && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.src = event.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
}

// ===== LIMPIEZA DE USUARIOS INACTIVOS =====

function limpiarUsuariosInactivos() {
  const usuariosOnlineRef = ref(db, 'usuarios_online');
  
  get(usuariosOnlineRef).then((snapshot) => {
    const usuarios = snapshot.val() || {};
    const ahora = Date.now();
    const limiteInactividad = 5 * 60 * 1000; // 5 minutos
    
    Object.keys(usuarios).forEach(usuario => {
      const ultimaActividad = usuarios[usuario].ultimaActividad || 0;
      
      if (ahora - ultimaActividad > limiteInactividad) {
        // Eliminar usuario inactivo
        const usuarioRef = ref(db, `usuarios_online/${usuario}`);
        remove(usuarioRef);
      }
    });
  }).catch(error => {
    console.error("Error al limpiar usuarios inactivos:", error);
  });
}

// Ejecutar limpieza cada minuto
setInterval(limpiarUsuariosInactivos, 60000);

// ===== INICIALIZACIÓN FINAL =====

// Asegurar que todo esté inicializado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar acordeón
  inicializarAcordeon();
  
  // Mostrar saludo personalizado
  mostrarSaludoPersonalizado();
  
  // Mostrar botón de usuarios en línea
  const botonOnline = document.getElementById('btn-usuarios-online');
  if (botonOnline) {
    botonOnline.style.display = 'flex';
    botonOnline.style.visibility = 'visible';
    botonOnline.style.opacity = '1';
  }
  
  // Registrar usuario en línea si está logueado
  registrarUsuarioOnline();
  
  // Configurar eventos de modales
  configurarEventosModales();
});

function configurarEventosModales() {
  // Modal de mantenimiento
  const modalMantenimiento = document.getElementById("modal-mantenimiento");
  if (modalMantenimiento) {
    // Evitar que se cierre al hacer clic fuera
    modalMantenimiento.addEventListener("click", (e) => {
      if (e.target === modalMantenimiento) {
        e.stopPropagation();
      }
    });
  }
  
  // Modal de preview
  const modalPreview = document.getElementById("preview-modal");
  if (modalPreview) {
    modalPreview.addEventListener("click", (e) => {
      if (e.target === modalPreview) {
        modalPreview.classList.add("hidden");
        itemSeleccionadoPreview = null;
      }
    });
  }
}

// ===== FUNCIONES DE PANTALLA COMPLETA =====

// CORREGIDO: Función para pantalla completa añadida
function inicializarPantallaCompleta() {
  const btnFullscreen = document.getElementById("btn-fullscreen");
  
  if (btnFullscreen && videoElement) {
    btnFullscreen.addEventListener("click", () => {
      console.log("Intentando poner el video en pantalla completa");

      if (!videoElement.src) {
        alert("No hay video cargado para mostrar en pantalla completa.");
        return;
      }

      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen().catch((err) => {
          console.error("Error al solicitar fullscreen:", err);
          alert("No se pudo activar pantalla completa.");
        });
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      } else {
        alert("Tu navegador no soporta pantalla completa.");
      }
    });
  }
}

// Inicializar pantalla completa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarPantallaCompleta);

// ===== FUNCIONES DE COMPARTIR CONTENIDO =====

function inicializarCompartir() {
  const btnCompartir = document.getElementById("btn-compartir");
  
  if (btnCompartir) {
    btnCompartir.addEventListener("click", () => {
      const titulo = document.getElementById("detalle-titulo")?.textContent;
      if (!titulo) return;
      
      const baseUrl = window.location.href.split('?')[0];
      const tituloCodificado = encodeURIComponent(titulo);
      const linkCompartible = `${baseUrl}?content=${tituloCodificado}`;
      
      // Copia el enlace y cambia el texto del botón temporalmente
      navigator.clipboard.writeText(linkCompartible).then(() => {
        btnCompartir.textContent = "✓ ¡Copiado!";
        btnCompartir.style.background = "#4CAF50";
        
        // Vuelve al estado original después de 2 segundos
        setTimeout(() => {
          btnCompartir.textContent = "🔗 Copiar enlace";
          btnCompartir.style.background = "#06D9FF";
        }, 2000);
      }).catch(() => {
        // Fallback: Muestra el enlace en el botón si no se puede copiar
        btnCompartir.textContent = "📋 " + linkCompartible;
      });
    });
  }
}

// Inicializar funcionalidad de compartir
document.addEventListener('DOMContentLoaded', inicializarCompartir);