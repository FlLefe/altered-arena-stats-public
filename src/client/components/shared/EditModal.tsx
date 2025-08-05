'use client';

import React, { useTransition } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

type EditModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isPendingExternally?: boolean;
  children: React.ReactNode;
};

export function EditModal({
  title,
  open,
  onClose,
  onSubmit,
  isPendingExternally,
  children,
}: EditModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await onSubmit();
      onClose();
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-overlay z-50" onClick={onClose} />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface border border-border p-6 shadow-lg space-y-4 text-foreground z-50">
          <Dialog.Title className="text-lg font-bold text-foreground">{title}</Dialog.Title>
          <div className="space-y-4">{children}</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || isPendingExternally}>
              {isPending || isPendingExternally ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
