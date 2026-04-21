export default function Home() {
  const steps = [
    {
      num: "01",
      title: "PDF → Imagini HD",
      desc: "Culegerea PDF este convertită în imagini PNG la rezoluție ridicată pentru a păstra claritatea formulelor matematice.",
      color: "blue",
      placeholder: "/pipeline/step1_pdf_to_png.png",
    },
    {
      num: "02",
      title: "Segmentare cu OpenCV",
      desc: "Detecția contururilor extrage automat fiecare grilă individuală din pagină.",
      color: "violet",
      placeholder: "/pipeline/step2_segmentation.png",
    },
    {
      num: "03",
      title: "Indexare OCR",
      desc: "Tesseract OCR identifică și citește numărul fiecărei grile, redenumind automat fișierele cu prefixul corespunzător.",
      color: "amber",
      placeholder: "/pipeline/step3_ocr_index.png",
    },
    {
      num: "04",
      title: "Extragere Răspunsuri",
      desc: "Paginile cu baremul sunt procesate, iar răspunsurile sunt mapate într-un fișier JSON.",
      color: "emerald",
      placeholder: "/pipeline/step4_answers.png",
    },
    {
      num: "05",
      title: "Generator de Simulări",
      desc: "Utilizatorul configurează capitolele și ponderile, iar algoritmul asamblează un test unic, cu distribuție proporțională și verificare automată.",
      color: "rose",
      placeholder: "/pipeline/step5_generator.png",
    },
  ];

  const colorMap: Record<string, { numBg: string; numText: string; accent: string; accentDark: string }> = {
    blue: { numBg: "bg-blue-500", numText: "text-white", accent: "border-blue-200", accentDark: "dark:border-blue-800" },
    violet: { numBg: "bg-violet-500", numText: "text-white", accent: "border-violet-200", accentDark: "dark:border-violet-800" },
    amber: { numBg: "bg-amber-500", numText: "text-white", accent: "border-amber-200", accentDark: "dark:border-amber-800" },
    emerald: { numBg: "bg-emerald-500", numText: "text-white", accent: "border-emerald-200", accentDark: "dark:border-emerald-800" },
    rose: { numBg: "bg-rose-500", numText: "text-white", accent: "border-rose-200", accentDark: "dark:border-rose-800" },
  };

  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-white dark:bg-slate-900 flex justify-center py-20 px-6 sm:px-12 transition-colors duration-300">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Transformă culegerile de grile <br /> în{" "}
            <span className="text-blue-600 dark:text-blue-400">simulări interactive</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Platformă de digitalizare și automatizare a procesului de pregătire
            pentru admiterea la Facultatea de Automatică și Calculatoare (UTCN).
          </p>
        </div>
      </section>

      <section className="w-full bg-slate-50 dark:bg-slate-950 py-20 flex justify-center px-6 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-4 py-1.5 rounded-full mb-4">
              Computer Vision Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              De la PDF scanat la test interactiv
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Cinci etape automatizate transformă o culegere fizică într-o bancă de grile digitale, gata pentru generarea simulărilor.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-amber-200 to-rose-200 dark:from-blue-700 dark:via-amber-700 dark:to-rose-700"></div>

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, i) => {
                const c = colorMap[step.color];
                const isEven = i % 2 === 0;
                return (
                  <div key={step.num} className="relative group">
                    <div className={`flex flex-col lg:flex-row items-start gap-6 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                      <div className="flex items-start gap-4 lg:w-1/2 shrink-0">
                        <div className={`relative z-10 w-[80px] h-[80px] ${c.numBg} ${c.numText} rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                          {step.num}
                        </div>
                        <div className="pt-1">
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <div className={`lg:w-1/2 w-full ${!isEven ? "lg:pr-8" : "lg:pl-8"}`}>
                        <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed ${c.accent} ${c.accentDark} h-48 sm:h-56 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 group-hover:border-solid group-hover:shadow-md dark:group-hover:shadow-slate-900/50 transition-all duration-300`}>
                          {/* PLACEHOLDER: înlocuiește cu <img src={step.placeholder} /> */}
                          <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                          </svg>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-600 tracking-wide">
                            Screenshot
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                  Rezultat final
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  O bancă completă de grile indexate, cu răspunsuri verificate, gata să fie
                  folosită pentru generarea automată a simulărilor de examen personalizate.
                </p>
              </div>
              <div className="w-full sm:w-64 h-44 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                </svg>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-600 tracking-wide">Screenshot final</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
