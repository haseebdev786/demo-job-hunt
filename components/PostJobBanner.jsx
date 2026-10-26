
import Link from "next/link";
import Image from "next/image";

export default function PostJobsBanner() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
      <div className="relative mx-auto h-auto max-w-7xl overflow-hidden lg:h-[320px]">

        {/* Purple diagonal background */}
        <div
          className="absolute inset-0 bg-indigo-600"
          style={{
            clipPath:
              "polygon(10% 0, 100% 0, 100% 74%, 91% 100%, 0 100%, 0 32%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:h-full lg:grid-cols-2">

          {/* Left content */}
          
        <div className="relative z-10 px-6 py-12 sm:px-10 ml-5 lg:px-16">
        <h2 className="font-poppins text-[36px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[44px] lg:text-[48px]">
            Start posting
            <br />
            jobs today
        </h2>

        <p className="mt-7 text-base font-normal text-white sm:text-lg">
            Start posting jobs for only $10.
        </p>

        <Link
            href="/signup"
            className="mt-8 inline-flex bg-white px-7 py-4 text-base font-bold text-indigo-600 hover:bg-gray-100"
        >
            Sign Up For Free
        </Link>
        </div>


          {/* Dashboard image */}
          <div className="relative flex min-h-[210px] items-end justify-center px-5 sm:min-h-[280px] lg:min-h-0 lg:justify-end lg:px-0">

            <div className="relative h-[210px] mr-10 w-full max-w-[460px] sm:h-[280px] lg:absolute lg:bottom-0 lg:right-10 lg:h-[255px] lg:w-[460px]">
              <Image
                src="/Dashimage.png"
                alt="JobHuntly dashboard"
                fill
                sizes="(max-width: 640px) 100vw, 460px"
                className="object-contain object-bottom"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
