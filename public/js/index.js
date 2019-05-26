"use strict";

$(document).ready(() => {

    /*-----------LISTENERS-----------*/

    $("#boton-modificar-ppp").on("click", mostrarModalModificarPPP);
    $("#boton-modificar-pr").on("click", mostrarModalModificarPR);
    $("#boton-modificar-r").on("click", mostrarModalModificarR);

});

function mostrarModalModificarPPP(){
    $("#modal-modificar-ppp").modal("show");
}

function mostrarModalModificarPR(){
    $("#modal-modificar-pr").modal("show");
}

function mostrarModalModificarR(){
    $("#modal-modificar-r").modal("show");
}