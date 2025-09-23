import { Header } from "../components/layout/Header"
import { SearchBar } from "../components/exercises/SearchBar"
import { MuscularGroupButton } from "../components/exercises/MuscularGroupButton"
import { ExerciseCard } from "../components/exercises/ExerciseCard"
import imgProof from "/gym-proof.jpg"
import { Footer } from "../components/layout/Footer"

function Exercises() {
  return (
    <div>
      <Header />
      <main className="main__exercises">
        <h1 className="h1__title">Explorar Ejercicios</h1>
        <SearchBar />
        <div className="w-[90%] flex gap-4 overflow-x-auto pb-4">
          <MuscularGroupButton groupName="Todos" />
          <MuscularGroupButton groupName="Pecho" />
          <MuscularGroupButton groupName="Espalda" />
          <MuscularGroupButton groupName="Piernas" />
          <MuscularGroupButton groupName="Hombros" />
          <MuscularGroupButton groupName="Brazos" />
          <MuscularGroupButton groupName="Core" />
        </div>
        <div className="w-[90%] flex flex-wrap gap-6 lg:justify-start lg:gap-8">
          <ExerciseCard title={"Press Banca"} bodyPart={"Pecho"} img={imgProof} />
          <ExerciseCard title={"Press Declinado"} bodyPart={"Pecho"} img={imgProof} />
          <ExerciseCard title={"Jalón al pecho"} bodyPart={"Espalda"} img={imgProof} />
          <ExerciseCard title={"Jalón al pecho"} bodyPart={"Espalda"} img={imgProof} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export { Exercises }
