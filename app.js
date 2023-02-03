require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa, 
        leerInput, 
        listadoBorrarTareas, 
        confirmar, 
        mostrarListadoCheckList  } = require('./helpers/inquirer');

const Tareas = require('./models/tareas');


const main = async() => {

    let opt = '';
    const tareas = new Tareas();


    
    const tareasDB = leerDB();

    if ( tareasDB ) { 
        // cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }


    do {
        //Imprimir el menú
        opt = await inquirerMenu();
        
        switch(opt) {
            case '1':
                 //Crear opcion
                 const desc = await leerInput('Descripcion:');
                 tareas.crearTarea(desc)
                 break;
                 
                 case '2':
                     tareas.listadoCompleto()
                     break;
                
                 case '3': // listar completadas
                     tareas.listarPendientesCompletadas(true);
                     break;
     
                 case '4': // listar pendientes
                     tareas.listarPendientesCompletadas(false);
                     break;

                 case '5': // completado | pendiente
                     const ids = await mostrarListadoCheckList( tareas.listadoArr );
                     tareas.toggleCompletadas( ids );
                     break;    
                 
                 case '6': // Borrar
                     const id = await listadoBorrarTareas( tareas.listadoArr );
                           if ( id !== '0' ) {
                            const ok = await confirmar('¿Está seguro?');
                               if ( ok ) {
                               tareas.borrarTarea( id );
                               console.log('Tarea borrada');
                             }
                         }
                     break;    
                     
                };
                    

            guardarDB(tareas.listadoArr);
                    

        await pausa();

    } while (opt !== '0');
      

};


main();