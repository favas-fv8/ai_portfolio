import type { Website } from "@/types";

interface HeroSectionProps {
  data: Website | null;
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      {data?.hero_image_url && (
        <img
          src={data.hero_image_url}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {data?.profile_image_url && (
          <img
            src={data.profile_image_url}
            alt={data.full_name}
            className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-white/20 object-cover"
          />
        )}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {data?.full_name || "Your Name"}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8">
          {data?.professional_title || "Professional Title"}
        </p>
        <div className="flex gap-4 justify-center">
          {data?.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              GitHub
            </a>
          )}
          {data?.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              LinkedIn
            </a>
          )}
          {data?.resume_url && (
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Download Resume
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
