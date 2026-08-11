import { buildGameDetailsPath } from "@renderer/helpers";
import { Link } from "@renderer/components";
import { useCallback, useContext } from "react";
import { userProfileContext } from "@renderer/context";
import { useTranslation } from "react-i18next";
import { ClockIcon } from "@primer/octicons-react";
import { useFormat, useLibrary } from "@renderer/hooks";
import type { UserGame } from "@types";
import { MAX_MINUTES_TO_SHOW_IN_PLAYTIME } from "@renderer/constants";
import SteamLogo from "@renderer/assets/steam-logo.svg?react";
import PlayLogo from "@renderer/assets/play-logo.svg?react";
import "./recent-games-box.scss";

const RecentGameIcon = ({ game }: { game: UserGame }) => {
  const { library } = useLibrary();
  const localGame = library.find(
    (g) => g.shop === game.shop && g.objectId === game.objectId
  );

  const isCustomGame = game.shop === "custom";
  const iconUrl = isCustomGame
    ? localGame?.libraryImageUrl || localGame?.iconUrl || game.customLibraryImageUrl || game.coverImageUrl || ""
    : localGame?.customIconUrl || localGame?.iconUrl || game.customIconUrl || game.iconUrl || "";

  if (!iconUrl) {
    return isCustomGame ? (
      <PlayLogo className="recent-games__game-icon-fallback" />
    ) : (
      <SteamLogo className="recent-games__game-icon-fallback" />
    );
  }

  return (
    <img
      src={iconUrl}
      alt={game.title}
      className="recent-games__game-image"
      onError={(e) => {
        const target = e.currentTarget;
        const fallback = game.customLibraryImageUrl || game.coverImageUrl || "";
        if (target.src !== fallback && fallback) {
          target.src = fallback;
        } else {
          // If fallback also fails, we can't easily switch to a React node here,
          // but at least it tried the cover image.
        }
      }}
    />
  );
};

export function RecentGamesBox() {
  const { userProfile } = useContext(userProfileContext);

  const { t } = useTranslation("user_profile");

  const { numberFormatter } = useFormat();

  const formatPlayTime = useCallback(
    (game: UserGame) => {
      const seconds = game?.playTimeInSeconds || 0;
      const minutes = seconds / 60;

      if (minutes < MAX_MINUTES_TO_SHOW_IN_PLAYTIME) {
        return t("amount_minutes", {
          amount: minutes.toFixed(0),
        });
      }

      const hours = minutes / 60;
      return t("amount_hours", { amount: numberFormatter.format(hours) });
    },
    [numberFormatter, t]
  );

  const buildUserGameDetailsPath = (game: UserGame) =>
    buildGameDetailsPath({
      ...game,
      objectId: game.objectId,
    });

  if (!userProfile?.recentGames.length) return null;

  return (
    <div className="recent-games__box">
      <ul className="recent-games__list">
        {userProfile?.recentGames.map((game) => (
          <li key={`${game.shop}-${game.objectId}`}>
            <Link
              to={buildUserGameDetailsPath(game)}
              className="recent-games__list-item"
            >
              <RecentGameIcon game={game} />

              <div className="recent-games__game-details">
                <span className="recent-games__game-title">{game.title}</span>

                <div className="recent-games__game-description">
                  <ClockIcon />
                  <small>{formatPlayTime(game)}</small>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
