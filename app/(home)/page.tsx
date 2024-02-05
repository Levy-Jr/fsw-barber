import { format } from 'date-fns'
import Header from "../_components/Header";
import { ptBR } from "date-fns/locale";
import Search from "./_componentes/Search";
import { db } from '../_lib/prisma';
import BarbershopItem from './_componentes/Barbershop-Item';
import { getServerSession } from 'next-auth';
import BookingItem from '../_components/Booking-item';
import { authOptions } from '../_lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions)

  const [barbershops, recommendBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    db.barbershop.findMany({
      orderBy: {
        id: 'asc'
      }
    }),
    session?.user ? db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      }
    })
      : Promise.resolve([])
  ])

  return (
    <div className="">
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name?.split(' ')[0]}` : 'Olá, vamos agendar um corte hoje?'}</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">

        {confirmedBookings.length > 0 &&
          <>
            <h2 className="pl-5 text-xs mb-3 uppercase text-gray-400 font-bold">Agendamentos</h2>
            <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map(booking => (
                <div key={booking.id} className="min-w-[10.438rem] max-w-[10.438rem]">
                  <BookingItem booking={booking} />
                </div>
              ))}
            </div>
          </>
        }

      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Recomendados</h2>

        <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map(barbershop => (
            <div key={barbershop.id} className="min-w-[10.438rem] max-w-[10.438rem]">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Populares</h2>

        <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {recommendBarbershops.map(barbershop => (
            <div key={barbershop.id} className="min-w-[10.438rem] max-w-[10.438rem]">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
