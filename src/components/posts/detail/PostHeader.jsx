import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../../../API/auth.js";

function PostHeader({ post }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setLoadingUser(true);
        const name = await getUserName(post.userId);
        setUserName(name);
      } catch (error) {
        console.error(`Error fetching username for ${post.userId}:`, error);
        setUserName(post.userId);
      } finally {
        setLoadingUser(false);
      }
    };

    if (post.userId) {
      fetchUserName();
    }
  }, [post.userId]);

  const handleUserClick = useCallback((userId) => {
    console.log('Navigate to user:', userId);
  }, [navigate]);

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 space-y-3">
      <button
        onClick={() => handleUserClick(post.userId)}
        className="text-secondary font-bold text-sm md:text-base bg-primary/10 
                   hover:bg-primary/20 px-4 py-2 rounded-full inline-block
                   transition-all duration-200 hover:scale-105 focus:outline-none 
                   focus:ring-2 focus:ring-primary/50"
        aria-label={`View ${userName || post.userId}'s profile`}
      >
        {loadingUser ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="opacity-50">@...</span>
          </span>
        ) : (
          `@${userName || post.userId}`
        )}
      </button>

      <div className="text-gray-400 text-sm space-y-1">
        <time dateTime={post.createdAt}>
          {formatRelativeTime(post.createdAt)}
        </time>
        {post.updatedAt && post.createdAt !== post.updatedAt && (
          <div className="text-xs opacity-75">
            Editado {formatRelativeTime(post.updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostHeader;