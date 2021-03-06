import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="bg-[#140E34]">
      <FooterTransition />
      <FooterWrapper>
        <PanelWrapper nextLink="/merch">
          <Image
            src="/merch.png"
            alt="merchandise icon"
            layout="fixed"
            width={100}
            height={100}
            className="rounded-full"
          />
          <p className="font-semibold text-2xl sm:text-3xl mb-1 sm:mb-3 tracking-tight text-white mt-4">
            → Merch
          </p>
          <p className="font-light text-lg sm:text-2xl text-white text-md tracking-tight leading-tight">
            You can support DAS by purchasing our cute stickers and totebags!
            Consider buying some for your friends and family too, with{" "}
            <span className="font-bold">all</span> proceeds going to DAS!
          </p>
        </PanelWrapper>

        <PanelWrapper link="https://www.giving.sg/campaigns/project-prima-signa">
          <Image
            src="/donate.png"
            alt="donate to a good cause"
            layout="fixed"
            width={100}
            height={100}
            className="rounded-full"
          />
          <p className="font-semibold text-2xl sm:text-3xl mb-1 sm:mb-3 tracking-tight text-white mt-4">
            → Donate
          </p>
          <p className="font-light  text-lg sm:text-2xl text-white text-md tracking-tight leading-tight">
            Donations received will go directly to DAS&apos; bursary fund, to
            sustain daily operations for low-income families.
          </p>
        </PanelWrapper>
        <PanelWrapper link="https://www.das.org.sg/">
          <Image
            src="/das square.png"
            alt="icon of the dyslexia association of singapore (DAS)"
            layout="fixed"
            width={100}
            height={100}
          />
          <p className="font-semibold text-2xl sm:text-3xl mb-1 sm:mb-3 tracking-tight text-white mt-4">
            → About DAS
          </p>
          <p className="font-light text-lg sm:text-2xl text-white text-md tracking-tight leading-tight">
            Learn more about our beneficiary, DAS by checking out their website
            and the services they provide.
          </p>
        </PanelWrapper>
      </FooterWrapper>
    </div>
  );
};

export const PanelWrapper = ({ children, link, nextLink }) => {
  return (
    <>
      {nextLink && (
        <Link href={nextLink}>
          <a
            href={link}
            className="bg-panelBG rounded-xl w-full relative hover:-translate-y-[6px] hover:-translate-x-[2px] transition-all duration-500 shadow-panel hover:shadow-panelActive"
          >
            <button className="w-full h-auto rounded-xl p-8 text-start">
              {children}
            </button>
          </a>
        </Link>
      )}
      {!nextLink && (
        <a
          href={link}
          className="bg-panelBG rounded-xl w-full relative hover:-translate-y-[6px] hover:-translate-x-[2px] transition-all duration-500 shadow-panel hover:shadow-panelActive"
        >
          <div className="w-full h-auto rounded-xl p-8 ">{children}</div>
        </a>
      )}
    </>
  );
};

export const FooterWrapper = ({ children, link }) => {
  return (
    <>
      <h1 className="text-center sm:text-5xl text-3xl font-semibold text-white mt-3">
        How to help?
      </h1>
      <div className="flex flex-col mx-auto w-[81vw] mr-[9.5vw]">
        <div className="flex flex-col lg:flex-row lg:space-y-0 space-y-6 lg:space-x-6 pt-10 pb-16">
          {children}
        </div>
      </div>
    </>
  );
};

export const FooterTransition = () => (
  <div className="w-full h-40 sm:h-96 bg-gradient-to-b from-slate-100 to-[#140E34]"></div>
);

export default Footer;
