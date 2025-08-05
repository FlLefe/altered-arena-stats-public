export default function LegalMentionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-text">
      <section>
        <h1 className="text-2xl font-bold text-primary mb-4">Mentions légales</h1>
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-text">Éditeur du site</h2>
          <p className="text-sm text-text-secondary">
            Ce site est édité à titre personnel dans le cadre d’un projet d’étude.
            <br />
            Responsable de publication : Florian Lefebvre
            <br />
            Contact :{' '}
            <a href="mailto:alteredarenastats@gmail.com" className="text-primary underline">
              alteredarenastats@gmail.com
            </a>
          </p>
        </div>
        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Hébergement</h2>
          <p className="text-sm text-text-secondary">
            Ce site est hébergé par :<br />
            Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789
            <br />
            Site :{' '}
            <a href="https://vercel.com" className="text-primary underline">
              vercel.com
            </a>
          </p>
        </div>
        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Propriété intellectuelle</h2>
          <p className="text-sm text-text-secondary">
            Altered Arena Stats est un projet indépendant non affilié à l’éditeur officiel du jeu
            Altered.
            <br />
            Les marques, visuels ou éléments liés à Altered appartiennent à leurs ayants droit
            respectifs.
          </p>
        </div>
      </section>
    </div>
  );
}
