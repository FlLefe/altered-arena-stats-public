export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-text">
      <section>
        <h1 className="text-2xl font-bold text-primary mb-4">Politique de confidentialité</h1>
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Ce site collecte des données personnelles uniquement dans le cadre de l’authentification
            des utilisateurs et de la gestion des parties enregistrées.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Responsable du traitement</h2>
          <p className="text-sm text-text-secondary">
            Florian Lefebvre — contact :{' '}
            <a href="mailto:alteredarenastats@gmail.com" className="text-primary underline">
              alteredarenastats@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Données collectées</h2>
          <ul className="list-disc list-inside text-sm text-text-secondary">
            <li>Adresse email (via Supabase Auth)</li>
            <li>Pseudo Altered, faction et héros favoris</li>
            <li>Parties enregistrées et résultats</li>
          </ul>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Utilisation et finalité</h2>
          <p className="text-sm text-text-secondary">
            Les données sont utilisées uniquement pour l’affichage des statistiques personnelles sur
            le site.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Durée de conservation</h2>
          <p className="text-sm text-text-secondary">
            Les données sont conservées tant que le compte utilisateur est actif. Vous pouvez
            demander la suppression de vos données à tout moment par email.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Hébergement</h2>
          <p className="text-sm text-text-secondary">Supabase — hébergement européen sécurisé.</p>
        </div>

        <div className="space-y-3 mt-6">
          <h2 className="font-semibold text-lg text-text">Droits d’accès et de rectification</h2>
          <p className="text-sm text-text-secondary">
            Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression
            de vos données en nous contactant à{' '}
            <a href="mailto:alteredarenastats@gmail.com" className="text-primary underline">
              alteredarenastats@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
