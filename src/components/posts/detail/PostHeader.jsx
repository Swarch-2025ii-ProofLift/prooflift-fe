function PostHeader({ post }) {
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
        className="text-secondary font-bold text-sm md:text-base bg-primary/10 
                   hover:bg-primary/20 px-4 py-2 rounded-full inline-block
                   transition-all duration-200 hover:scale-105 focus:outline-none 
                   focus:ring-2 focus:ring-primary/50"
        aria-label={`View ${post.userId}'s profile`}
      >
        @{post.userId}
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