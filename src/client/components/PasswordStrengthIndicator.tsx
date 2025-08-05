'use client';

import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type PasswordStrengthIndicatorProps = {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    noCommon: boolean;
  };
  showDetails?: boolean;
};

export function PasswordStrengthIndicator({
  strength,
  checks,
  showDetails = true,
}: PasswordStrengthIndicatorProps) {
  const strengthConfig = {
    weak: { color: 'bg-red-500', text: 'Faible', label: 'Très faible' },
    medium: { color: 'bg-orange-500', text: 'Moyen', label: 'Faible' },
    strong: { color: 'bg-yellow-500', text: 'Fort', label: 'Moyen' },
    'very-strong': { color: 'bg-green-500', text: 'Très fort', label: 'Fort' },
  };

  const config = strengthConfig[strength];

  const checkItems = [
    { key: 'length', label: 'Au moins 8 caractères', value: checks.length },
    { key: 'uppercase', label: 'Au moins une majuscule', value: checks.uppercase },
    { key: 'lowercase', label: 'Au moins une minuscule', value: checks.lowercase },
    { key: 'number', label: 'Au moins un chiffre', value: checks.number },
    { key: 'special', label: 'Au moins un caractère spécial', value: checks.special },
    { key: 'noCommon', label: 'Pas un mot de passe courant', value: checks.noCommon },
  ];

  const allChecksPass = Object.values(checks).every((check) => check);

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Force du mot de passe :</span>
          <span
            className={cn(
              'font-medium',
              strength === 'weak' && 'text-red-500',
              strength === 'medium' && 'text-orange-500',
              strength === 'strong' && 'text-yellow-500',
              strength === 'very-strong' && 'text-green-500',
            )}
          >
            {config.text}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', config.color)}
            style={{
              width:
                strength === 'weak'
                  ? '25%'
                  : strength === 'medium'
                    ? '50%'
                    : strength === 'strong'
                      ? '75%'
                      : '100%',
            }}
          />
        </div>
      </div>

      {/* Checks details */}
      {showDetails && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {allChecksPass ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-muted-foreground">
              {allChecksPass ? 'Toutes les exigences sont respectées' : 'Exigences de sécurité'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1 text-xs">
            {checkItems.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                {item.value ? (
                  <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-3 w-3 text-red-500 flex-shrink-0" />
                )}
                <span className={cn(item.value ? 'text-green-700' : 'text-red-700')}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning message for weak passwords */}
      {strength === 'weak' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Mot de passe trop faible</p>
              <p className="text-xs mt-1">
                Votre mot de passe ne respecte pas les exigences de sécurité. Veuillez le renforcer
                en ajoutant des caractères spéciaux, des chiffres et des majuscules.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
