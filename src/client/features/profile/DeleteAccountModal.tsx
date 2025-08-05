'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle } from 'lucide-react';
import { EditModal } from '@/client/components/shared';
import { useErrorHandler } from '@/client/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { deleteOwnAccountAction } from '@/server/features/player/deleteOwnAccountAction';
import { createClient } from '@/utils/supabase/browserClient';

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleDeleteAccount = async () => {
    if (confirmation !== 'SUPPRIMER') {
      handleError('Veuillez taper SUPPRIMER pour confirmer la suppression');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteOwnAccountAction();

      if (!result.success) {
        handleError(result.error || 'Erreur lors de la suppression du compte');
        return;
      }

      handleSuccess('Compte supprimé avec succès');
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch {
      handleError('Erreur inattendue lors de la suppression du compte');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setConfirmation('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setConfirmation('');
  };

  return (
    <>
      <Button variant="destructive" onClick={handleOpen}>
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer mon compte
      </Button>

      <EditModal
        title="Supprimer mon compte"
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleDeleteAccount}
        isPendingExternally={isDeleting}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Attention !</p>
              <p className="text-muted-foreground">Cette action est irréversible.</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">En supprimant votre compte :</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Votre compte sera définitivement supprimé</li>
              <li>• Vos matches seront conservés avec un pseudo anonyme</li>
              <li>• Vous ne pourrez plus vous connecter</li>
              <li>• Cette action ne peut pas être annulée</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmation" className="text-sm font-medium">
              Tapez <span className="font-mono bg-muted px-1 rounded">SUPPRIMER</span> pour
              confirmer :
            </label>
            <input
              id="confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </EditModal>
    </>
  );
}
