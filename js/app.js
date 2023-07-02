const container = document.querySelector('.container') // clase
const resultado = document.querySelector('#resultado') // id
const formulario = document.querySelector('#formulario')


const buscarClima = (e) => {
    e.preventDefault()

    //? Validación del formulario
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if ( ciudad === '' || pais === '' ) {
        // El usuario no ha escrito nada 
        mostrarError('Ambos campos son obligatorios')
        return
    }

    //? Consultar API
    consultarAPI(ciudad, pais)
}


const mostrarError = ( mensaje ) => {
    
    const alerta = document.querySelector('.bg-red-100')

    // Evitando mostrar múltiples veces la alerta
    if ( !alerta ) {
        //? Crear alerta 
        const alerta = document.createElement('div')

        //? Agregando estilos
        alerta.classList.add('bg-red-100', 'border-red-100', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center')
        
        //? Creando el elemento HTML del mensaje 
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block">${ mensaje }</span>
            `
        //? Agregando al HTML
        container.appendChild(alerta)


        // Eliminando alerta después de 2 segundos
        setTimeout(() => {
            alerta.remove()
        }, 1500);
    }

}


const consultarAPI = ( ciudad, pais ) => {
    const appID = '91f304ef23b4ee3e9e45a2d362369e2b'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais},&appid=${appID}`

    //? Muestra spinner de carga
    spinner()

    //? Realizando petición
    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( datos => {
            // Limpiar HTML previo
            limpiarHTML()

            // Validando que el nombre de la ciudad sea válido 
            if (datos.cod === '404') {
                mostrarError('Ciudad no encontrada. Verifique el nombre')
                return
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos)
        })
}


const mostrarClima = datos => {
    // Destructuring de main 
    const { name, main: { temp, temp_max, temp_min } } = datos

    const centigrados = kelvinACentigrados(temp) 
    const max = kelvinACentigrados(temp_max) 
    const min = kelvinACentigrados(temp_min) 


    //? Creando elemento para el nombre de la ciudad 
    const nombreCiudad = document.createElement('p')
    nombreCiudad.textContent = `Clima en ${name}`
    nombreCiudad.classList.add('font-bold', 'text-2xl')
    
    //? Creando elemento para los grados actuales
    const actual = document.createElement('p')
    actual.innerHTML = `${centigrados} &#8451` // Se agrega entidad por eso se usa innnerHTML para mostrar el signo de centigrados
    actual.classList.add('font-bold', 'text-6xl')

    //? Creando elemento para la temperatura maxima 
    const tempMax = document.createElement('p')
    tempMax.innerHTML = `Max: ${max} &#8451` // Se agrega entidad para mostrar el signo de centigrados
    tempMax.classList.add('text-xl')
    
    //? Creando elemento para la temperatura mínima
    const tempMin = document.createElement('p')
    tempMin.innerHTML = `Min: ${min} &#8451` // Se agrega entidad para mostrar el signo de centigrados
    tempMin.classList.add('text-xl')



    //? Creando elemento div para agregar el elemento de los grados
    const resultadoDiv = document.createElement('div')
    resultadoDiv.classList.add('text-center', 'text-white')
    
    resultadoDiv.appendChild(nombreCiudad)
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(tempMax)
    resultadoDiv.appendChild(tempMin)

    //? Agregandolo al elemento de resultado
    resultado.appendChild(resultadoDiv)

}


const kelvinACentigrados = grados => parseInt( grados - 273.15 )


//* Limpiando el resultado previo a uno nuevo del HTML
const limpiarHTML = () => {
    while( resultado.firstChild ){
        resultado.removeChild(resultado.firstChild)
    }
}


const spinner = () => {

    limpiarHTML()

    //? Creando elemento del spinner
    const divSpinner = document.createElement('div')
    divSpinner.classList.add('sk-fading-circle')

    // Elementos del spinner
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(divSpinner)
}



/**
 * Se utiliza window cuando se utilice una API
 * - load es similar a DOMcontentloaded pero de window 
 * */ 
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})
