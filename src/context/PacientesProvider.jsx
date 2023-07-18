import { createContext, useState, useEffect } from 'react'
import clienteAxios from '../config/axios'
import useAuth from '../hooks/useAuth'

const PacientesContext = createContext()

const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})
    const {auth} = useAuth();

    useEffect( () => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer: ${token}`
                    }
                }

                const { data } = await clienteAxios('/pacientes', config)
                setPacientes( data )
            } catch (error) {
                console.log(error);
            }
        }

        obtenerPacientes()
    }, [auth])

    const guardarPacientes = async (paciente) => {

        const token = localStorage.getItem('token')
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer: ${token}`
            }
        }

        if(paciente.id) {
            try {
                const {data} = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config)

                const pacientesActualizado = pacientes.map( pacienteState => pacienteState._id === data._id ? data : pacienteState)

                setPacientes(pacientesActualizado)
                
                console.log(data);
            } catch (error) {
                console.log(error.response.data.msg);
            }
        } else {
            try {
            
                const {data} = await clienteAxios.post('/pacientes', paciente, config)
                
                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data
    
                setPacientes([pacienteAlmacenado, ...pacientes])
            } catch (error) {
                console.log(error.response.data.msg)
            }
        }     
    }

    const eliminarPacientes = async (id) => {
        
        const confirmar = confirm('¿Confirmas que deseas eliminar?')

        if(confirmar) {

            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer: ${token}`
                }
            }

            try {
                const {data} = await clienteAxios.delete(`/pacientes/${id}`, config)
     
                const pacientesActualizado = pacientes.filter(pacientesState => pacientesState._id !== id)

                setPacientes(pacientesActualizado)
             } catch (error) {
                 console.log(error)
             }
        }    
    }

    const setEdicion = (paciente) => {
        setPaciente(paciente);
    }

    return (
        <PacientesContext.Provider
            value={{
                pacientes,
                paciente,
                guardarPacientes,
                eliminarPacientes,
                setEdicion
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}


export {
    PacientesProvider
} 

export default PacientesContext;