import { Header } from '../components/layout/Header'
import { BoxInfo } from '../components/Profile/BoxInfo'
import { AccountInfo } from '../components/Profile/AccountInfo'
import { Notifications } from '../components/Profile/Notifications'
import { DeleteAccount } from '../components/Profile/DeleteAccount'

function Profile() {
  return (  
    <div className='text-secondary'>
        <Header />
        <main className='w-full flex flex-col gap-5 px-4 py-10 lg:px-80'>
            <h1 className='h1__title text-left'>Perfil de Usuario y Notificaciones</h1>
            <h3 className='text-sm text-gray-400'>Gestiona tu información personal y notificaciones. </h3>
            <BoxInfo title="Información de Cuenta"> 
              <AccountInfo title="Nombre de Usuario" info="Usuario123" />
              <AccountInfo title="Correo Electrónico" info="usuario123@example.com" />
              <AccountInfo title="Contraseña" info="xxxxxx" />
            </BoxInfo>
            <BoxInfo title="Notificaciones">
              <Notifications Notification="No tienes nuevas notificaciones." hour="Hace 5 minutos" />
            </BoxInfo>
            <BoxInfo >
              <DeleteAccount />
            </BoxInfo>
        </main>
    </div>
  )
}

export  {Profile}
