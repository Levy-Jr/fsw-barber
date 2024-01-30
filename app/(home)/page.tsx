import Image from "next/image";
import { format } from 'date-fns'
import Header from "../_components/Header";
import { ptBR } from "date-fns/locale";

export default function Home() {
  return (
    <div className="">
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Miguel!</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR
          })}
        </p>
      </div>
    </div>
  );
}
