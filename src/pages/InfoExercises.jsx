import { Header } from "../components/layout/Header"
import imgProof from "/gym-proof.jpg"
import { MuscleGroupCard } from "../components/infoExercises/MuscleGroupCard"
import { Footer } from "../components/layout/Footer"


function InfoExercises() {
  return (
    <div className="bg-background-secondary">
        <Header />
        <main className="w-full h-full flex flex-col items-start gap-6 mb-10
        px-4 py-6 text-white lg:px-40">
        <h1 className="h1__title">Sentadilla Con barra</h1>
        <p className="font-light">La sentadilla con barra es un ejercicio fundamental para el desarrollo de la 
            fuerza en las piernas y el core. Se realiza colocando una barra sobre los hombros y 
            bajando el cuerpo en una posición de sentadilla.</p>
        <img className="rounded-xl" src={imgProof} alt="imagen del ejercicio" />
        <h2 className="h2__InfoExercises">Instrucciones</h2>
        <ul className="list-decimal list-inside flex flex-col gap-2 font-light">
            <li>Coloca la barra sobre tus hombros, asegurándote de que esté bien equilibrada.</li>
            <li>Separa los pies a la anchura de los hombros y apunta ligeramente hacia afuera.</li>
            <li>Mantén el pecho erguido y la espalda recta mientras bajas el cuerpo doblando las
                rodillas y caderas.</li>
            <li>Desciende hasta que tus muslos estén paralelos al suelo o un poco más bajos.</li>
        </ul>
        <h2 className="h2__InfoExercises">Grupos Musculares</h2>
        <div className="main__divMusclerGroupsBar">
            <MuscleGroupCard muscleGroup="Cuádriceps" />
            <MuscleGroupCard muscleGroup="Glúteos" />
            <MuscleGroupCard muscleGroup="Isquiotibiales" />
            <MuscleGroupCard muscleGroup="Core" />  
        </div>
        <h2 className="h2__InfoExercises">Objetivo</h2>
        <div className="main__divMusclerGroupsBar">
            <MuscleGroupCard muscleGroup="Hipertrofia" />
            <MuscleGroupCard muscleGroup="Fuerza" />
        </div>
        <h2 className="h2__InfoExercises">Equipación</h2>
        <div className="main__divMusclerGroupsBar">
            <MuscleGroupCard muscleGroup="Barra" />
            <MuscleGroupCard muscleGroup="Discos de peso" />
            <MuscleGroupCard muscleGroup="Rack" />
        </div>
        </main>
        <Footer />
    </div>
  )
}

export { InfoExercises }
