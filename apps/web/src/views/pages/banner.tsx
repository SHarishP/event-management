import Image from 'next/image';

export default function BannerHome() {
  return (
    <div className="relative w-full h-[70vh] md:h-screen">
      <div className="absolute inset-0">
      <Image 
         src="/images/minpro-images02.jpg" 
         fill 
         alt="Background Layout" 
        style={{ objectFit: 'cover' }} 
       />
        
      </div>

      <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-60">
        <div className="text-center text-black p-4 md:text-center">
         <p className="text-2xl md:text-5xl font-bold">
         Benner Upcoming Event
          </p>
        </div>
      </div>
    </div>
  );
}