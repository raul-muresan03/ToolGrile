export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-white flex justify-center py-20 px-6 sm:px-12">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Transformă culegerile de grile <br /> în{" "}
            <span className="text-blue-600">simulări interactive</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Platformă de digitalizare și automatizare a procesului de pregătire
            pentru admiterea la Facultatea de Automatică și Calculatoare (UTCN).
          </p>
        </div>
      </section>
      <section className="w-full bg-slate-50 py-20 flex justify-center px-6 border-t border-slate-100">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pipeline</h2>
            <p className="text-lg text-slate-700">
              Pipeline complet de procesare automată a grilelor de examen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-400 text-blue-900 font-bold flex items-center justify-center text-xl shadow-inner border-[3px] border-blue-200">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Segmentare prin OpenCV
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Se utilizează OpenCV pentru detecția contururilor și izolarea
                automată a fiecărei întrebări dintr-o pagină scanată.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-300 text-orange-900 font-bold flex items-center justify-center text-xl shadow-inner border-[3px] border-orange-200">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Indexare OCR
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Recunoașterea automată a numerelor întrebărilor folosind
                Tesseract OCR, păstrând în același timp fidelitatea formulelor
                chimice.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-400 text-green-900 font-bold flex items-center justify-center text-xl shadow-inner border-[3px] border-green-200">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Selecție Ponderată
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Algoritm de asamblare aleatorie a testelor (35 grile de Biologie
                + 15 de Chimie) cu posibilitatea de a prioritiza capitolele
                dificile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
