import BannerHome from "@/views/pages/banner";
import UpcomingEvent from "@/views/pages/upcomingEvent";
import Footer from "@/views/component/footer";

export default function Home() {
  return (
    <>
    <BannerHome />
    <h1 className="text-2xl md:text-5xl font-bold text-center p-4 m-[2em]">
        Upcoming Music event<br />in Jakarta
    </h1>
    <div className="text-center">
         <button className="border-1 bg-[#24194d] font-bold text-white py-2 px-5 rounded-3xl mb-[4em] md:mb-[1em]">Lihat Event</button>  
         <UpcomingEvent />
    </div>

    </>
  )
}
// 57:47 bag 2