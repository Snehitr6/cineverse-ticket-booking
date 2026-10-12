import { motion } from "framer-motion";
import { Users } from "lucide-react";
import castMembers from "../data/cast";

export default function CastSection() {
  return (
    <section className="mx-auto w-full px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
      <div className="mb-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
          <Users size={16} />
          Behind the story
        </p>

        <h2 className="text-3xl font-black sm:text-4xl">
          Cast & <span className="text-red-500">Crew</span>
        </h2>

        <p className="mt-3 text-sm text-gray-400 sm:text-base">
          Meet the talented people who bring the story to life.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {castMembers.map((person, index) => (
          <motion.article
            key={person.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121725] transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/30"
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#1b2232]">
              <img
                src={person.image}
                alt={person.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-bold text-white sm:text-base">
                {person.name}
              </h3>

              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                {person.character}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
