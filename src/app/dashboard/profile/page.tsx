import { Settings, User, LogOut, Trash2 } from 'lucide-react';
import { LogoutButton } from '@/client/components';
import { ThemeSwitcher } from '@/client/components/ThemeSwitcher';
import { DeleteAccountModal } from '@/client/features/profile/DeleteAccountModal';
import { GamePreferencesSection } from '@/client/features/profile/GamePreferencesSection';
import { getUserPreferencesAction } from '@/server/features/player/getUserPreferencesAction';

export default async function Profile() {
  const user = await getUserPreferencesAction();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto w-full p-6">
        <div className="text-destructive text-center">Erreur lors du chargement du profil</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-6 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div className="grid gap-6">
        {/* User informations */}
        <div className="relative overflow-hidden bg-stats-bg border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-400/30 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/30 to-transparent rounded-full blur-xl" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Informations du compte</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center py-3 px-4 rounded-xl bg-card/60 border border-border/50">
                <span className="text-muted-foreground font-medium">Pseudo Altered</span>
                <span className="font-semibold ml-auto">{user.alteredAlias || 'Non défini'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game preferences */}
        <GamePreferencesSection
          currentFaction={user.favoriteFaction}
          currentHero={user.favoriteHero}
        />

        {/* Preferences */}
        <div className="relative overflow-hidden bg-stats-bg border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-400/30 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-400/30 to-transparent rounded-full blur-lg" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Préférences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/50">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-foreground">Thème</label>
                  <p className="text-xs text-muted-foreground">
                    Choisissez l&apos;apparence de l&apos;interface
                  </p>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative overflow-hidden bg-stats-bg border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-400/30 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-400/30 to-transparent rounded-full blur-lg" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                <LogOut className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Actions</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Delete account */}
        <div className="relative overflow-hidden bg-destructive/5 border border-destructive/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-400/30 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-lg" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-destructive">Zone dangereuse</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-card/60 border border-destructive/20">
                <p className="text-sm text-muted-foreground">
                  Une fois votre compte supprimé, il ne pourra plus être récupéré.
                </p>
              </div>
              <div className="flex justify-center">
                <DeleteAccountModal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
