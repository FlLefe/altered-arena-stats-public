'use client';

import React, { useState, useTransition } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

type CreateModalProps = {
  title: string;
  triggerLabel?: string;
  triggerClassName?: string;
  onSubmit: () => Promise<void>;
  isPendingExternally?: boolean;
  children: React.ReactNode;
};

export function CreateModal({
  title,
  triggerLabel = 'Ajouter',
  triggerClassName,
  onSubmit,
  isPendingExternally,
  children,
}: CreateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await onSubmit();
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button className={triggerClassName}>{triggerLabel}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-overlay z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface border border-border p-6 shadow-lg space-y-4 text-foreground z-50">
          <Dialog.Title className="text-lg font-bold text-foreground">{title}</Dialog.Title>
          <div className="space-y-4">{children}</div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Annuler</Button>
            </Dialog.Close>
            <Button onClick={handleSubmit} disabled={isPending || isPendingExternally}>
              {isPending || isPendingExternally ? 'Création...' : 'Enregistrer'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
