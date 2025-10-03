type LoadingProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const Loading = ({ size = 'medium', className = '' }: LoadingProps) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Loading;