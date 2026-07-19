import type { Website } from "@/types";

interface ContactSectionProps {
  data: Website | null;
}

export default function ContactSection({ data }: ContactSectionProps) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Get In Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Feel free to reach out for collaborations or just a friendly hello!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {data?.email && (
            <a
              href={`mailto:${data.email}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Email Me
            </a>
          )}
          {data?.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              LinkedIn
            </a>
          )}
          {data?.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
