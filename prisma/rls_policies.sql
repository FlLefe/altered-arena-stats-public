BEGIN;

-- ==================================================
-- 🔄 DROP EXISTANTS
-- ==================================================
DROP POLICY IF EXISTS "player: insert own" ON "Player";
DROP POLICY IF EXISTS "player: read own or admin" ON "Player";
DROP POLICY IF EXISTS "player: update own or admin" ON "Player";
DROP POLICY IF EXISTS "player: delete own or admin" ON "Player";

DROP POLICY IF EXISTS "match: read own or admin" ON "Match";
DROP POLICY IF EXISTS "match: write own or admin" ON "Match";
DROP POLICY IF EXISTS "match: insert own or admin" ON "Match";
DROP POLICY IF EXISTS "match: update own or admin" ON "Match";
DROP POLICY IF EXISTS "match: delete own or admin" ON "Match";

DROP POLICY IF EXISTS "game: read/write if owner of match or admin" ON "Game";

DROP POLICY IF EXISTS "read_public" ON "Event";
DROP POLICY IF EXISTS "read_public" ON "Season";
DROP POLICY IF EXISTS "read_public" ON "Hero";
DROP POLICY IF EXISTS "read_public" ON "Faction";

DROP POLICY IF EXISTS "admin can write" ON "Event";
DROP POLICY IF EXISTS "admin can write" ON "Season";
DROP POLICY IF EXISTS "admin can write" ON "Hero";
DROP POLICY IF EXISTS "admin can write" ON "Faction";

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_player_after_signup;

GRANT USAGE ON SCHEMA public TO authenticated;

-- ==================================================
-- 🔐 TABLE: Player
-- ==================================================

ALTER TABLE "Player" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Player" TO authenticated;

CREATE POLICY "player: insert own"
  ON "Player" FOR INSERT TO authenticated
  WITH CHECK ("authId" = auth.uid());

CREATE POLICY "player: read own or admin"
  ON "Player" FOR SELECT
  USING (("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin');

CREATE POLICY "player: update own or admin"
  ON "Player" FOR UPDATE
  USING (("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin');

CREATE POLICY "player: delete own or admin"
  ON "Player" FOR DELETE
  USING (("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin');

-- ==================================================
-- 🔐 TABLE: Match
-- ==================================================
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Match" TO authenticated;

CREATE POLICY "match: read own or admin"
  ON "Match" FOR SELECT
  USING (
    "playerId" IN (
      SELECT id FROM "Player"
      WHERE ("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin'
    )
  );

CREATE POLICY "match: insert own or admin"
  ON "Match" FOR INSERT TO authenticated
  WITH CHECK (
    "playerId" IN (
      SELECT id FROM "Player"
      WHERE ("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin'
    )
  );

CREATE POLICY "match: update own or admin"
  ON "Match" FOR UPDATE TO authenticated
  USING (
    "playerId" IN (
      SELECT id FROM "Player"
      WHERE ("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin'
    )
  );

CREATE POLICY "match: delete own or admin"
  ON "Match" FOR DELETE TO authenticated
  USING (
    "playerId" IN (
      SELECT id FROM "Player"
      WHERE ("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin'
    )
  );

-- ==================================================
-- 🔐 TABLE: Game
-- ==================================================
ALTER TABLE "Game" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Game" TO authenticated;

CREATE POLICY "game: read/write if owner of match or admin"
  ON "Game" FOR ALL
  USING (
    "matchId" IN (
      SELECT id FROM "Match"
      WHERE "playerId" IN (
        SELECT id FROM "Player"
        WHERE ("authId" = auth.uid() AND "deletedAt" IS NULL) OR role = 'admin'
      )
    )
  );

-- ==================================================
-- 🔐 TABLES PUBLIQUES (Event, Season, Hero, Faction)
-- ==================================================
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Season" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Hero" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Faction" ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON "Event", "Season", "Hero", "Faction" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON "Event", "Season", "Hero", "Faction" TO authenticated;

CREATE POLICY "read_public"
  ON "Event" FOR SELECT USING (true);
CREATE POLICY "read_public"
  ON "Season" FOR SELECT USING (true);
CREATE POLICY "read_public"
  ON "Hero" FOR SELECT USING (true);
CREATE POLICY "read_public"
  ON "Faction" FOR SELECT USING (true);

CREATE POLICY "admin can write"
  ON "Event" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Player"
      WHERE "authId" = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "admin can write"
  ON "Season" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Player"
      WHERE "authId" = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "admin can write"
  ON "Hero" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Player"
      WHERE "authId" = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "admin can write"
  ON "Faction" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Player"
      WHERE "authId" = auth.uid() AND role = 'admin'
    )
  );

-- ==================================================
-- ⚙️ TRIGGER: Auto Player creation on signup
-- ==================================================
CREATE OR REPLACE FUNCTION create_player_after_signup()
RETURNS TRIGGER AS $$
DECLARE
  player_exists BOOLEAN;
BEGIN
  -- Vérifier si un player existe déjà pour cet authId
  SELECT EXISTS(
    SELECT 1 FROM public."Player" 
    WHERE "authId" = NEW.id
  ) INTO player_exists;
  
  -- Si le player n'existe pas, le créer
  IF NOT player_exists THEN
    INSERT INTO public."Player" (
      "authId", 
      "alteredAlias", 
      role,
      "favoriteFactionId", 
      "favoriteHeroId", 
      "profileComplete",
      "createdAt", 
      "updatedAt"
    )
    VALUES (
      NEW.id,
      'Player_' || substring(gen_random_uuid()::text, 1, 8),
      'user',
      NULL,
      NULL,
      false,
      now(),
      now()
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erreur lors de la création du player pour authId %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE ALL ON FUNCTION create_player_after_signup() FROM PUBLIC;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_player_after_signup();

-- ==================================================
-- INDEX 
-- ==================================================

-- Search on Player.alteredAlias
CREATE INDEX IF NOT EXISTS idx_player_altered_alias
  ON "Player"("alteredAlias");

-- Search on Match.opponentName (for free autocompletion)
CREATE INDEX IF NOT EXISTS idx_match_opponent_name
  ON "Match"("opponentName");

-- Quick access to matches by player
CREATE INDEX IF NOT EXISTS idx_match_player_id
  ON "Match"("playerId");

-- Quick access to matches by season or event (dashboard, admin, etc.)
CREATE INDEX IF NOT EXISTS idx_match_season_id
  ON "Match"("seasonId");

CREATE INDEX IF NOT EXISTS idx_match_event_id
  ON "Match"("eventId");

-- Quick access to games by match
CREATE INDEX IF NOT EXISTS idx_game_match_id
  ON "Game"("matchId");

-- Quick access to played heroes
CREATE INDEX IF NOT EXISTS idx_game_player_hero_id
  ON "Game"("playerHeroId");

CREATE INDEX IF NOT EXISTS idx_game_opponent_hero_id
  ON "Game"("opponentHeroId");

-- Quick access to players by authId (very frequent on RLS / session)
CREATE INDEX IF NOT EXISTS idx_player_auth_id
  ON "Player"("authId");

-- Conditional access for filters (soft-delete enabled)
CREATE INDEX IF NOT EXISTS idx_player_deleted_at
  ON "Player"("deletedAt");

-- Sorting or filtering on Event.date
CREATE INDEX IF NOT EXISTS idx_event_start_date
  ON "Event"("startDate");

-- Sorting or filtering on Season.date
CREATE INDEX IF NOT EXISTS idx_season_start_date
  ON "Season"("startDate");

-- ==================================================
-- 🎯 CRITICAL INDEXES FOR STATISTICS
-- ==================================================

-- Index composite for statistics queries
-- Used by 80% of statistics queries
CREATE INDEX IF NOT EXISTS idx_match_stats_composite
  ON "Match"("seasonId", "matchType", "matchStatus");

-- Index for games with statistics filters
-- Used by hero performance queries
CREATE INDEX IF NOT EXISTS idx_game_stats_composite
  ON "Game"("playerHeroId", "opponentHeroId", "gameStatus");

-- Index for hero matchups (complex query)
-- Used only for rivalries
CREATE INDEX IF NOT EXISTS idx_game_hero_matchup
  ON "Game"("playerHeroId", "opponentHeroId");

-- Index for heroes by faction (frequent queries)
-- Used by faction statistics
CREATE INDEX IF NOT EXISTS idx_hero_faction
  ON "Hero"("factionId");

-- ==================================================
-- ⚡ INDEX FOR RLS POLICIES (CRITICAL)
-- ==================================================

-- Index for optimizing RLS policies on Player
-- Direct impact on all authenticated queries
CREATE INDEX IF NOT EXISTS idx_player_rls_auth_role
  ON "Player"("authId", "role");

-- Index composite pour Player avec soft-delete
CREATE INDEX IF NOT EXISTS idx_player_rls_auth_deleted
  ON "Player"("authId", "deletedAt") 
  WHERE "deletedAt" IS NULL;

-- Index for optimizing RLS policies on Match
-- Direct impact on match queries
CREATE INDEX IF NOT EXISTS idx_match_rls_player
  ON "Match"("playerId", "id");

COMMIT;
