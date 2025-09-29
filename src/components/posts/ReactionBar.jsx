import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { REACTIONS } from "../../constants/reactions.js";

function ReactionBar({ 
  reactionsByType = [],
  currentUserReaction = null,
  onToggleReaction,
  disabled = false,
  size = "medium" 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const sizeClasses = useMemo(() => ({
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg"
  }), []);

  const dropdownSizeClasses = useMemo(() => ({
    small: "p-1.5 gap-1",
    medium: "p-2 gap-2", 
    large: "p-3 gap-3"
  }), []);

  useEffect(() => {
    if (selectedReaction) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedReaction]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 300);
  }, [disabled]);

  const handleReactionClick = useCallback((type) => {
    if (disabled) return;
    setSelectedReaction(type);
    onToggleReaction(type);
    setTimeout(() => setIsExpanded(false), 150);
  }, [disabled, onToggleReaction]);

  const handleMainButtonClick = useCallback(() => {
    if (disabled) return;
    
    if (currentUserReaction) {
      onToggleReaction(currentUserReaction.type);
    } else {
      setIsExpanded(prev => !prev);
    }
  }, [disabled, currentUserReaction, onToggleReaction]);

  const getReactionData = useCallback((type) => 
    REACTIONS.find((r) => r.type === type)
  , []);

  const getReactionCount = useCallback((type) => {
    const reaction = reactionsByType.find(r => r.type === type);
    return reaction ? reaction.count : 0;
  }, [reactionsByType]);

  const totalReactions = useMemo(() => 
    reactionsByType.reduce((sum, reaction) => sum + reaction.count, 0)
  , [reactionsByType]);

  const currentReactionData = useMemo(() => 
    currentUserReaction ? getReactionData(currentUserReaction.type) : null
  , [currentUserReaction, getReactionData]);
  
  const mainButtonText = currentReactionData?.label || "Reaccionar";

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleMainButtonClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 rounded-lg font-medium
                    transition-all duration-300 ease-out group relative overflow-hidden
                    ${sizeClasses[size]}
                    bg-tertiary/50 text-secondary hover:bg-background hover:text-primary 
                    hover:border hover:border-primary/30 hover:shadow-lg
                    hover:transform hover:scale-[1.02]
                    ${currentUserReaction && isAnimating ? 'animate-pulse' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
                    focus:ring-offset-tertiary`}
        aria-label={currentUserReaction ? `Remove ${mainButtonText} reaction` : "Add reaction"}
        aria-expanded={isExpanded}
        aria-haspopup="true"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
                         transform translate-x-[-100%] group-hover:translate-x-[100%] 
                         transition-transform duration-1000"></span>
        
        <span className="relative flex items-center gap-2">
          <span className="font-semibold">{mainButtonText}</span>
          
          {!currentUserReaction && (
            <svg 
              className={`w-4 h-4 transition-transform duration-200 opacity-60
                         ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-[-1px]'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>

      {isExpanded && (
        <div
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                     bg-background-secondary/95 backdrop-blur-sm rounded-xl shadow-2xl
                     border border-gray-700/50 z-50 min-w-max
                     ${dropdownSizeClasses[size]}
                     animate-in slide-in-from-bottom-2 fade-in duration-200`}
          role="menu"
          aria-label="Reaction options"
        >
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-background-secondary border-r border-b 
                           border-gray-700/50 transform rotate-45 -mt-1.5"></div>
          </div>
          
          <div className="flex gap-1">
            {REACTIONS.map(({ type, label }) => {
              const isSelected = currentUserReaction?.type === type;
              const isHovered = selectedReaction === type;
              const count = getReactionCount(type);
              
              return (
                <button
                  key={type}
                  onClick={() => handleReactionClick(type)}
                  className={`group/reaction relative px-3 py-2 rounded-lg font-semibold text-sm
                             transition-all duration-200 flex flex-col items-center gap-1
                             hover:transform hover:scale-110 hover:-translate-y-1
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${isSelected 
                               ? `bg-tertiary/80 text-background shadow-md ring-2 ring-primary/50` 
                               : `hover:bg-tertiary hover:text-primary`}
                             ${isHovered ? 'animate-bounce' : ''}`}
                  role="menuitem"
                  aria-label={`${isSelected ? 'Remove' : 'Add'} ${label} reaction`}
                >
                  <span className={`text-lg transition-all duration-200
                                  ${isSelected ? 'animate-pulse' : 'group-hover/reaction:animate-bounce'}`}>
                    {label}
                  </span>
                  
                  {count > 0 && (
                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-700/30 text-center">
            <span className="text-xs text-gray-400">
              Haz clic para reaccionar
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReactionBar;