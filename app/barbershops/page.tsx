import { redirect } from "next/navigation"
import BarbershopItem from "../(home)/_componentes/Barbershop-Item"
import Header from "../_components/Header"
import { db } from "../_lib/prisma"
import Search from "../(home)/_componentes/Search"

interface BarbershopsPageProps {
  searchParams: {
    search?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {

  if (!searchParams.search) {
    return redirect('/')
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive'
      }
    }
  })
  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search
          defaultValues={{
            search: searchParams.search,
          }}
        />

        <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>

        <div className="grid grid-cols-2 gap-4">
          {barbershops.map(barbershop =>
            <div key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BarbershopsPage