import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_POST_DETAIL } from "../../API/posts.js";
import { getUserName } from "../../API/auth.js";
import { REACTIONS } from "../../constants/reactions.js";

function ReactionsDetail({ 
  postId, 
  reactionsByType, 
  totalReactions,
  onClose,
  detailedReactions = null
}) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userNames, setUserNames] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_POST_DETAIL, {
    variables: { postId, skip: 0, limit: 1 },
    skip: !postId || detailedReactions !== null,
    fetchPolicy: 'network-only',
  });

  const reactions = useMemo(() => {    
    if (detailedReactions) {
      return detailedReactions;
    }
    
    const queryReactions = data?.getReactionsForPost || [];
    return queryReactions;
  }, [detailedReactions, data]);

  useEffect(() => {
    const fetchUserName = async () => {      
      if (reactions.length === 0) {
        setLoadingUsers(false);
        return;
      }

      try {
        setLoadingUsers(true);
        const uniqueUserIds = [...new Set(reactions.map(r => r.userId))];
        const names = {};

        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const name = await getUserName(userId);
              names[userId] = name;
            } catch (error) {
              console.error(`Error fetching username for ${userId}:`, error);
              names[userId] = userId;
            }
          })
        );

        setUserNames(names);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUserName();
  }, [reactions]);

  const filteredReactions = useMemo(() => {
    if (selectedFilter === "all") return reactions;
    return reactions.filter(r => r.type === selectedFilter);
  }, [reactions, selectedFilter]);

  const reactionCounts = useMemo(() => {
    const counts = { all: reactions.length };
    reactions.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [reactions]);

  const handleUserClick = (userId) => {
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4
                 animate-in fade-in zoom-in-95 duration-200"
      onClick={handleBackdropClick}
      data-reactions-modal="true"
    >
      <div 
        className="bg-tertiary/90 rounded-xl shadow-2xl border border-gray-700/50 
                   max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-secondary">
            Reacciones ({totalReactions})
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-700/50 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 border-b border-gray-700/50 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                       whitespace-nowrap flex items-center gap-2
                       ${selectedFilter === "all"
                         ? 'bg-primary text-background'
                         : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-secondary'
                       }`}
          >
            <span>Todas</span>
            <span className="text-xs opacity-75">({reactionCounts.all})</span>
          </button>

          {reactionsByType.map(({ type, count }) => {
            const reaction = REACTIONS.find(r => r.type === type);
            return (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                           whitespace-nowrap flex items-center gap-2
                           ${selectedFilter === type
                             ? 'bg-primary text-background scale-105'
                             : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-secondary'
                           }`}
              >
                <span className="text-base">{reaction?.label || type}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Reactions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading || loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Cargando reacciones...</p>
              </div>
            </div>
          ) : filteredReactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay reacciones de este tipo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReactions.map((reaction) => {
                const reactionEmoji = REACTIONS.find(r => r.type === reaction.type);
                const userName = userNames[reaction.userId] || reaction.userId;

                return (
                  <div
                    key={reaction.id}
                    className="flex items-center justify-between p-3 rounded-lg 
                             bg-background-secondary/50 hover:bg-background-secondary/70
                             border border-gray-700/30 hover:border-gray-600/50
                             transition-all duration-200 group"
                  >
                    <button
                      onClick={() => handleUserClick(reaction.userId)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary text-sm truncate
                                    group-hover:text-primary transition-colors">
                          @{userName}
                        </p>
                      </div>
                    </button>

                    {/* Reaction emoji */}
                    <span className="text-2xl ml-2 group-hover:scale-125 transition-transform">
                      {reactionEmoji?.label || '👍'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ReactionsDetail;