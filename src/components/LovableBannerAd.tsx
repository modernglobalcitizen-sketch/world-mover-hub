import lovableAd from "@/assets/Lovable_Ad.png.asset.json";

const LovableBannerAd = () => {
  return (
    <section className="py-8 md:py-12 bg-card border-y border-border">
      <div className="container max-w-5xl">
        <a
          href="https://lovable.dev/invite/870RXXC"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl overflow-hidden border border-border shadow-soft transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Lovable — Build fully working web apps and websites from simple prompts"
        >
          <img
            src={lovableAd.url}
            alt="Lovable — Build fully working web apps and websites from simple prompts"
            className="w-full h-auto object-cover"
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
          />
        </a>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Sponsored — opens in new tab
        </p>
      </div>
    </section>
  );
};

export default LovableBannerAd;
