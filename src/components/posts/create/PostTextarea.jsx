function PostTextarea({ 
  value, 
  onChange, 
  onFocus, 
  isExpanded, 
  placeholder,
  maxLength 
}) {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full p-3 md:p-4 rounded-lg bg-background-secondary text-secondary 
                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50
                   resize-none transition-all duration-200 border border-transparent
                   ${isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'}
                   ${isOverLimit ? 'border-red-500 focus:ring-red-500/50' : ''}
                   hover:bg-background-secondary/80`}
        rows={isExpanded ? 5 : 2}
      />
      
      {isExpanded && (
        <div className={`absolute bottom-2 right-2 text-xs font-medium
                        ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'}`}>
          {characterCount}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default PostTextarea;