import { OpponentSuggestionDTO } from './OpponentDTO';

export function mapToOpponentSuggestionDTO(p: {
  id: bigint | null;
  alteredAlias?: string;
  name?: string;
}): OpponentSuggestionDTO {
  return {
    id: p.id ? p.id.toString() : null,
    name: p.alteredAlias || p.name || '',
  };
}
